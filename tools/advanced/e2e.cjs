// Browser check: answers every Advanced page in Chromium and compares the shown score to engine.js.
// Usage: python3 -m http.server 8765 (from the site root), then node tools/advanced/e2e.cjs
const { chromium } = require(require("child_process").execSync("npm root -g").toString().trim() + "/playwright");
const engine = require(require("path").resolve(__dirname, "../../advanced/assets/engine.js"));
const vm = require("vm");
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(require("fs").readFileSync(require("path").resolve(__dirname, "../../advanced/assets/scores-data.js"), "utf8"), ctx);
const DATA = ctx.window.MKS_SCORES;
const BASE = (process.env.MKS_BASE || "http://localhost:8765/") + "advanced/";
let seed = 7; const rand = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = []; page.on("pageerror", e => errors.push(e.message)); page.on("console", m => m.type() === "error" && errors.push(m.text()));
  let checks = 0, fails = 0;
  for (const [slug, s] of Object.entries(DATA)) {
    if (s.mode === "quick") {
      for (let run = 0; run < 3; run++) {
        await page.goto(BASE + slug + ".html");
        await page.click("[data-open-quiz]");
        const answers = {};
        for (let i = 0; i < s.questionSet.length; i++) {
          const q = s.questionSet[i];
          // FK21 context questions: date/number fields, tick boxes, choice plus detail box. Not scored.
          if (q.type === "percent") { const v = String(Math.floor(rand() * 101)); answers[q.id] = v; await page.fill(`#q${q.id}-pct`, v); await page.click("#nextBtn"); continue; }
          if (q.type === "fields") { await page.fill(`#q${q.id}-${q.fields[0].key}`, q.fields[0].input === "number" ? "45" : "2026-09-20"); await page.click("#nextBtn"); continue; }
          if (q.type === "multi") { await page.click(`label[for="q${q.id}-0"]`); await page.click(`label[for="q${q.id}-1"]`); await page.click("#nextBtn"); continue; }
          if (q.detail) { await page.click(`label[for="q${q.id}-0"]`); await page.fill(`#q${q.id}-detail`, "test"); await page.click("#nextBtn"); continue; }
          const k = Math.floor(rand() * q.options.length);
          answers[q.id] = q.options[k].value;
          await page.click(`label[for="q${q.id}-${k}"]`);
          await page.waitForTimeout(340);
          // run 1: go back once and change the previous answer, to exercise Back
          if (run === 1 && i === 1 && s.questionSet.length > 2) {
            await page.click("#backBtn");
            const k2 = (k + 1) % q.options.length;
            answers[q.id] = q.options[k2].value;
            await page.click(`label[for="q${q.id}-${k2}"]`);
            await page.waitForTimeout(340);
          }
        }
        await page.waitForSelector("#result.show", { timeout: 4000 });
        // Scores with parts (FK21): the dial shows the first part only
        const ids = s.parts ? s.parts[0].ids : null;
        const qs = ids ? s.questionSet.filter(q => ids.includes(q.id)) : s.questionSet;
        const exp = engine.quickScore(qs, Object.fromEntries(Object.entries(answers).filter(([id]) => !ids || ids.includes(Number(id)))), s.scoringRange);
        const shown = await page.$eval("#result", el => { const d = el.querySelector(".dial-num"); return d ? parseInt(d.textContent, 10) : null; });
        checks++;
        if ((exp ? exp.score : null) !== shown) { fails++; console.log("MISMATCH", slug, run, exp && exp.score, shown, JSON.stringify(answers)); }
        // Clinical review prompt: scores out of 100, under 60 (higher better) or over 40 (lower better)
        const wantScan = !!exp && s.scoringRange.max === 100 && (s.scoringDirection === "higher_better" ? exp.score < 60 : exp.score > 40);
        const hasScan = !!(await page.$("#result .scan-note"));
        checks++;
        if (wantScan !== hasScan) { fails++; console.log("SCAN PROMPT MISMATCH", slug, exp && exp.score, hasScan); }
        // Our own scores end with About you (age, sex): both must reach the result
        if (s.questionSet.some(q => q.outro)) {
          const about = await page.$eval("#result", el => el.textContent);
          checks++;
          if (!/Age in years: 45/.test(about) || !/Are you male or female\? (Male|Female|Prefer not to say)/.test(about)) { fails++; console.log("ABOUT YOU MISSING", slug); }
        }
        // Every result offers both PDF and email
        if (run === 0 && exp) {
          checks++;
          if (!(await page.$('#result [data-act="pdf"]')) || !(await page.$('#result [data-act="mail"]')) || !(await page.$("#result #mailTo"))) { fails++; console.log("PDF OR EMAIL MISSING", slug); }
        }
        // PDF report: printing is stubbed, the report must show the same score
        if (run === 0 && exp) {
          await page.evaluate(() => { window.print = () => {}; });
          await page.click('[data-act="pdf"]');
          const rep = await page.$eval("#pdfReport .rp-big", el => parseInt(el.textContent, 10));
          checks++;
          if (rep !== exp.score) { fails++; console.log("PDF MISMATCH", slug, exp.score, rep); }
        }
      }
    } else {
      await page.goto(BASE + slug + ".html");
      const items = s.mode === "sk11" ? engine.SK11_QUESTIONS.map(q => ({ id: q.id, max: 10 })) : engine.PK7_DOMAINS.map(d => ({ id: d.id, max: d.maxValue }));
      const prefix = s.mode === "sk11" ? "sk" : "pk";
      const answers = {}; items.forEach(it => answers[it.id] = null);
      let weights = engine.pk7DefaultWeights();
      if (s.mode === "pk7") {
        await page.click("#weightsBox summary");
        for (const [id, val] of [[1, "2"], [3, "0"], [5, "0.5"]]) { await page.fill(`#w${id}`, val); weights[id] = engine.pk7ParseWeight(val); }
      }
      for (const it of items) {
        if (rand() < 0.2) continue;
        const v = Math.floor(rand() * (it.max + 1));
        answers[it.id] = v;
        await page.click(`label[for="${prefix}${it.id}-${v}"]`);
        const exp = s.mode === "sk11" ? engine.sk11Score(answers) : engine.pk7Score(answers, weights);
        const shown = parseInt(await page.textContent("#liveNum"), 10);
        checks++;
        if (exp.score !== shown) { fails++; console.log("MISMATCH", slug, exp.score, shown, JSON.stringify(answers)); }
      }
      await page.click("#reportBtn");
      await page.waitForSelector(".report");
      checks++;
      if (!(await page.$('#report [data-act="pdf"]')) || !(await page.$('#report [data-act="mail"]'))) { fails++; console.log("PDF OR EMAIL MISSING", slug); }
    }
  }
  // Earlier scores in the PDF link are listed in the next report, and passed on
  await page.goto(BASE + "koos-jr.html?report=2#h=2026-09-01.40,bad,2026-09-15.45");
  await page.evaluate(() => { window.print = () => {}; });
  await page.click("[data-open-quiz]");
  for (let i = 0; i < DATA["koos-jr"].questionSet.length; i++) { await page.click(`label[for="q${DATA["koos-jr"].questionSet[i].id}-0"]`); await page.waitForTimeout(340); }
  await page.waitForSelector("#result.show");
  await page.click('[data-act="pdf"]');
  const hist = await page.evaluate(() => ({
    rows: [...document.querySelectorAll("#pdfReport .rp-track tbody tr")].filter(tr => tr.textContent.trim()).length,
    link: document.querySelector("#pdfReport .rp-foot a").getAttribute("href")
  }));
  checks++;
  if (hist.rows !== 3 || !/\?report=3#h=2026-09-01\.40,2026-09-15\.45,\d{4}-\d{2}-\d{2}\.\d+$/.test(hist.link)) { fails++; console.log("HISTORY MISMATCH", JSON.stringify(hist)); }

  // Email to myself opens a mailto with the score and the personal link, then clears the address
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Page.enable");
  let mailto = null;
  cdp.on("Page.frameRequestedNavigation", e => { if (e.url.startsWith("mailto:")) mailto = e.url; });
  await page.fill("#mailTo", "patient@example.com");
  await page.click('[data-act="mail"]');
  await page.waitForTimeout(300);
  const body = mailto ? new URL(mailto).searchParams.get("body") : "";
  checks++;
  if (!mailto || !mailto.startsWith("mailto:patient@example.com?") || !/report=3#h=2026-09-01\.40,2026-09-15\.45,/.test(body) || await page.inputValue("#mailTo") !== "") {
    fails++; console.log("MAIL MISMATCH", mailto);
  }

  // Top menu: every link stays on one line, on the home page and an Advanced page, at common widths
  for (const pg of ["../index.html", "lk32.html"]) {
    for (const w of [1000, 1280, 1440, 1920]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(BASE + pg);
      await page.evaluate(() => document.fonts.ready);
      const wrapped = await page.evaluate(() => [...document.querySelectorAll(".nav ul li")]
        .filter(li => getComputedStyle(li).display !== "none")
        .filter(li => { const r = document.createRange(); r.selectNodeContents(li.querySelector("a")); return new Set([...r.getClientRects()].filter(x => x.width > 0).map(x => Math.round(x.top))).size > 1; })
        .map(li => li.textContent.trim()));
      checks++;
      if (wrapped.length) { fails++; console.log("MENU WRAPS", pg, w, wrapped.join(", ")); }
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  // hub filter
  await page.goto(BASE + "index.html");
  const total = await page.$$eval("#scoreGrid .score-card", c => c.length);
  await page.click('.chip[data-filter="Patellofemoral"]');
  const visible = await page.$$eval("#scoreGrid .score-card:not([hidden])", c => c.map(x => x.querySelector(".sc-acronym").textContent));
  console.log("hub cards", total, "patellofemoral filter ->", visible.join(", "));
  console.log(`checks=${checks} fails=${fails} pageErrors=${errors.length}`); errors.slice(0, 5).forEach(e => console.log("ERR", e));
  await browser.close();
  // Fail the CI step on any mismatch or page error
  if (fails || errors.length) process.exitCode = 1;
})();
