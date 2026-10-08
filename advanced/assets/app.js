/*
 * My Knee Score: Advanced score pages (UI only).
 * All scoring goes through MKSEngine (engine.js). Do not compute scores here.
 */
(function () {
  "use strict";
  var E = window.MKSEngine;
  var slug = document.body.getAttribute("data-score");
  var S = window.MKS_SCORES && window.MKS_SCORES[slug];
  if (!E || !S) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function esc(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("Copied to clipboard"); }, function () { toast("Copy failed. Please try again"); });
    } else {
      toast("Copy is not supported in this browser");
    }
  }

  // ---------------------------------------------------------------
  // PDF report. Built on the page and saved with the browser's own
  // "Save as PDF". The name box is read once, at save time. Nothing is
  // stored or sent anywhere.
  // ---------------------------------------------------------------
  function longDate(d) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) +
      " at " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  // Colour level for a band label: green, gold or rust
  function levelOf(label) {
    if (/Excellent|Good/.test(label)) return "good";
    if (/Fair/.test(label)) return "fair";
    return "poor";
  }
  function levelOfPct(p) { return p >= 70 ? "good" : p >= 40 ? "fair" : "poor"; }

  /* Earlier results carried in the PDF link, e.g. #h=2026-10-08.48,2026-10-22.55
     The part after # is never sent to the server, and nothing is stored on the
     device. Each new PDF link carries the earlier scores plus the new one. */
  function readHistory() {
    var m = /(?:^#|[&;])h=([^&;]*)/.exec(window.location.hash);
    if (!m) { return []; }
    return m[1].split(",").filter(function (e) { return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\.\d{1,3}$/.test(e); })
      .slice(-12).map(function (e) { var p = e.split("."); return { date: p[0], score: Number(p[1]) }; });
  }
  var pastScores = readHistory();
  function isoDate(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function ukDate(iso) { var p = iso.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  /* The link to the next test. "?report=" counts the reports so the link never
     matches the page it came from; browsers drop such links from PDFs. */
  function retakeLink(score, when, hashPrefix) {
    var base = window.location.href.split("#")[0].split("?")[0];
    return base + "?report=" + (pastScores.length + 1) + "#" + hashPrefix + historyTag(score, when);
  }
  function historyTag(score, when) {
    return "h=" + pastScores.concat([{ date: isoDate(when), score: score }]).slice(-12)
      .map(function (e) { return e.date + "." + e.score; }).join(",");
  }
  function trackRows(score, when) {
    var rows = pastScores.map(function (e) {
      return '<tr><td>' + esc(ukDate(e.date)) + '</td><td>' + e.score + '</td><td>Earlier report</td></tr>';
    });
    var note = "This report";
    if (pastScores.length) {
      var diff = score - pastScores[pastScores.length - 1].score;
      note += diff > 0 ? " (up " + diff + " since last report)" : diff < 0 ? " (down " + (-diff) + " since last report)" : " (same as last report)";
    }
    rows.push('<tr><td>' + esc(when.toLocaleDateString("en-GB")) + '</td><td>' + score + '</td><td>' + note + '</td></tr>');
    for (var i = Math.max(1, 4 - rows.length); i > 0; i--) { rows.push('<tr><td></td><td></td><td></td></tr>'); }
    return rows.join("");
  }
  function historyNote() {
    return pastScores.length ? '<p class="pdf-note">' + pastScores.length + ' earlier score' + (pastScores.length === 1 ? '' : 's') +
      ' from your PDF link will be added to this report.</p>' : '';
  }

  function pdfBoxHtml() {
    var old = document.getElementById("pdfName");
    return '<div class="pdf-box">' +
      '<label for="pdfName">Patient name for the PDF <span class="pdf-opt">(optional)</span></label>' +
      '<input type="text" id="pdfName" autocomplete="off" spellcheck="false" maxlength="60" value="' + esc(old ? old.value : "") + '">' +
      '<p class="pdf-note">Only printed on the PDF. Not saved or sent anywhere.</p>' + historyNote() +
      '<button type="button" class="btn btn-gold" data-act="pdf">Download PDF report</button>' +
      '<p class="pdf-note">Then choose "Save as PDF". On iPhone, tap Share, then Save to Files.</p>' +
      '</div>';
  }

  function ringHtml(pct, level) {
    var c = 2 * Math.PI * 52;
    var on = Math.max(0, Math.min(100, pct)) / 100 * c;
    return '<svg class="rp-ring" viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle class="rp-ring-track" cx="60" cy="60" r="52"></circle>' +
      '<circle class="rp-ring-fill rp-' + level + '" cx="60" cy="60" r="52" stroke-dasharray="' + on.toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 60 60)"></circle></svg>';
  }

  function barRows(rows) {
    return rows.map(function (b) {
      var lv = levelOfPct(b.pct);
      return '<div class="rp-bar"><span class="rp-bar-name">' + esc(b.label) + '</span>' +
        '<span class="rp-bar-track"><span class="rp-bar-fill rp-' + lv + '" style="width:' + Math.max(0, Math.min(100, b.pct)) + '%"></span></span>' +
        '<span class="rp-bar-val">' + esc(b.value) + '</span></div>';
    }).join("");
  }

  // d: { score, max, pct, label, dir, key, meaning, answered, extras, barsTitle, bars, answers, context }
  function reportHtml(d, name, when) {
    var lv = levelOf(d.label);
    var h = '<div class="rp-head"><span class="rp-mark">My<b>Knee</b>Score</span><span class="rp-kind">Knee score report</span></div>' +
      '<h1 class="rp-title">' + esc(S.fullName) + (S.fullName.indexOf(S.acronym) > -1 ? '' : ' <em>(' + esc(S.acronym) + ')</em>') + '</h1>' +
      '<div class="rp-meta">' +
      '<div><span class="rp-k">Name</span><span class="rp-v">' + (name ? esc(name) : "Not given") + '</span></div>' +
      '<div><span class="rp-k">Completed</span><span class="rp-v">' + esc(longDate(when)) + '</span></div>' +
      '<div><span class="rp-k">Questions answered</span><span class="rp-v">' + esc(d.answered) + '</span></div></div>' +
      '<div class="rp-score">' + ringHtml(d.pct, lv) +
      '<div class="rp-score-text"><p class="rp-big">' + d.score + '<small> out of ' + d.max + '</small></p>' +
      '<p class="rp-chip rp-bg-' + lv + '">' + esc(d.label) + '</p>' +
      '<p class="rp-dir">' + esc(d.dir) + '</p></div>' +
      '<div class="rp-key"><p class="rp-k">Colour key</p>' + d.key.map(function (k) {
        return '<p><span class="rp-dot rp-bg-' + k[0] + '"></span>' + esc(k[1]) + '</p>';
      }).join("") + '</div></div>';
    (d.extras || []).forEach(function (x) {
      var xl = levelOf(x.label);
      h += '<div class="rp-extra"><span class="rp-k">' + esc(x.name) + '</span><span class="rp-extra-num">' + x.score + '<small> out of ' + x.max + '</small></span>' +
        '<span class="rp-chip rp-bg-' + xl + '">' + esc(x.label) + '</span></div>';
    });
    h += '<div class="rp-sec"><h2>What your score means</h2><p>' + esc(d.meaning) + '</p></div>';
    if (d.bars && d.bars.length) {
      h += '<div class="rp-sec"><h2>' + esc(d.barsTitle) + '</h2><div class="rp-bars">' + barRows(d.bars) + '</div></div>';
    }
    if (d.context && d.context.length) {
      h += '<div class="rp-sec"><h2>About you (not scored)</h2><ul class="rp-list">' +
        d.context.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join("") + '</ul></div>';
    }
    if (d.answers && d.answers.length) {
      h += '<div class="rp-sec"><h2>Your answers</h2><table class="rp-table"><thead><tr><th>#</th><th>Question</th><th>Your answer</th></tr></thead><tbody>' +
        d.answers.map(function (a, i) { return '<tr><td>' + (i + 1) + '</td><td>' + esc(a[0]) + '</td><td>' + esc(a[1]) + '</td></tr>'; }).join("") +
        '</tbody></table></div>';
    }
    var url = location.href.split("#")[0].split("?")[0];
    h += '<div class="rp-sec rp-track"><h2>Track your progress</h2><p>Use the link below to take the ' + esc(S.acronym) + ' again in 2 to 4 weeks. Your next report will list these scores too.</p>' +
      '<table class="rp-table"><thead><tr><th>Date</th><th>Score</th><th>Notes</th></tr></thead><tbody>' +
      trackRows(d.score, when) + '</tbody></table></div>' +
      '<p class="rp-foot">Retake this score at <a href="' + esc(retakeLink(d.score, when, "")) + '">' + esc(url.replace(/^https?:\/\//, "")) + '</a>. ' +
      'The link carries your dates and scores, so your next report lists them too. ' +
      'This report was made on your device. Nothing you entered was saved or sent to us. ' +
      'A score is not a diagnosis and does not replace advice from a doctor or physiotherapist.</p>';
    return h;
  }

  function savePdf(d) {
    var input = document.getElementById("pdfName");
    var name = input ? input.value.trim() : "";
    var when = new Date();
    var el = document.getElementById("pdfReport");
    if (!el) {
      el = document.createElement("div");
      el.id = "pdfReport";
      el.className = "pdf-report";
      el.setAttribute("aria-hidden", "true");
      document.body.appendChild(el);
    }
    el.innerHTML = reportHtml(d, name, when);
    var oldTitle = document.title;
    // The browser uses the title as the PDF file name
    document.title = "My Knee Score report - " + S.acronym + " - " + when.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    document.body.classList.add("print-report");
    function done() {
      document.body.classList.remove("print-report");
      document.title = oldTitle;
      el.innerHTML = "";
      window.removeEventListener("afterprint", done);
    }
    window.addEventListener("afterprint", done);
    window.print();
  }

  function bandKey(max, higher) {
    if (max === 100 && higher) return [["good", "Good: 70 to 100"], ["fair", "Fair: 40 to 69"], ["poor", "Poor: under 40"]];
    var g = higher ? Math.ceil(0.7 * max) : Math.floor(0.3 * max);
    var f = higher ? Math.ceil(0.4 * max) : Math.floor(0.6 * max);
    return higher
      ? [["good", "Good: " + g + " to " + max], ["fair", "Fair: " + f + " to " + (g - 1)], ["poor", "Poor: under " + f]]
      : [["good", "Good: 0 to " + g], ["fair", "Fair: " + (g + 1) + " to " + f], ["poor", "Poor: over " + f]];
  }
  var TOOL_KEY = [["good", "Excellent 85+, Good 70 to 84"], ["fair", "Fair: 60 to 69"], ["poor", "Poor 40 to 59, Very Poor under 40"]];

  if (S.mode === "quick") initQuiz();
  else if (S.mode === "sk11") initSK11();
  else if (S.mode === "pk7") initPK7();

  // ---------------------------------------------------------------
  // Library scores: one question at a time (QuickCalculator flow)
  // ---------------------------------------------------------------
  function initQuiz() {
    var questions = S.questionSet;
    var total = questions.length;
    // "Before you start" questions (LK32, FK43) come first and are not numbered
    var offset = 0;
    while (offset < total && questions[offset].intro) offset++;
    // The answer to a "remind" question (the period being answered about) is shown on every later question
    var reminder = questions.filter(function (q) { return q.remind; })[0];
    var app = document.getElementById("quizApp");
    var body = document.getElementById("quizBody");
    var nav = document.getElementById("quizNav");
    var backBtn = document.getElementById("backBtn");
    var nextBtn = document.getElementById("nextBtn");
    var fill = document.getElementById("progressFill");
    var meta = document.getElementById("progressMeta");
    var resultEl = document.getElementById("result");
    var answers = {};
    var details = {}; // free-text extras (detail boxes and date/number fields), never scored
    var current = 0;
    var timer = null;

    // Optional and tick-box questions are used by FK43 only. Every other score uses plain single choice.
    function isAnswered(q) {
      if (q.optional) return true;
      if (q.type === "multi") return !!answers[q.id] && answers[q.id].length > 0;
      return answers[q.id] !== undefined;
    }
    // Auto-advance only when one click completes the question, as before
    function autoAdvance(q) {
      return !q.type && !q.detail;
    }
    function allAnswered() {
      return questions.every(isAnswered);
    }
    function firstUnanswered() {
      for (var i = 0; i < total; i++) { if (!isAnswered(questions[i])) return i; }
      return -1;
    }

    function open() {
      app.hidden = false;
      app.classList.add("open");
      document.body.style.overflow = "hidden";
      document.body.classList.add("quiz-open");
      reset();
    }
    function close() {
      clearTimeout(timer);
      app.classList.remove("open");
      app.hidden = true;
      document.body.style.overflow = "";
      document.body.classList.remove("quiz-open");
    }
    function reset() {
      clearTimeout(timer);
      answers = {};
      details = {};
      resultEl.classList.remove("show");
      resultEl.innerHTML = "";
      nav.style.display = "";
      show(0);
    }

    function show(i) {
      current = i;
      var q = questions[i];
      var name = "q" + q.id;
      var html = '<h2 class="q-title" tabindex="-1">' + esc(q.text) + '</h2>' +
        '<div class="q-card"><p class="q-topic">' + esc(S.acronym) + (q.section ? ' &middot; ' + esc(q.section) : '') + (q.intro ? '' : ' &middot; Question ' + (i + 1 - offset)) + '</p>';
      // A question with its own fixed period (night and day counts: the last week) shows that instead
      if (reminder && !q.intro && (q.period || answers[reminder.id] !== undefined)) {
        html += '<p class="q-hint q-period">' + esc(reminder.remind) + ': ' + esc(q.period || answers[reminder.id].toLowerCase()) + '</p>';
      }
      if (q.type === "fields") {
        html += '<div class="q-fields">';
        q.fields.forEach(function (f) {
          var fid = name + "-" + f.key;
          var v = details[q.id] && details[q.id][f.key] ? details[q.id][f.key] : "";
          html += '<div class="q-field"><label for="' + fid + '">' + esc(f.label) + '</label>' +
            '<input type="' + (f.input === "number" ? 'number" min="1" max="99" inputmode="numeric' : esc(f.input)) + '" id="' + fid + '" data-field="' + esc(f.key) + '" value="' + esc(v) + '"></div>';
        });
        html += '<p class="q-hint">Optional. Leave blank if it does not apply.</p></div>';
      } else {
        var multi = q.type === "multi";
        html += '<div class="opts-stack" role="' + (multi ? 'group' : 'radiogroup') + '" aria-label="' + esc(q.text) + '">';
        q.options.forEach(function (o, k) {
          var id = name + "-" + k;
          var on = multi ? (answers[q.id] || []).indexOf(o.value) > -1 : answers[q.id] === o.value;
          html += '<input type="' + (multi ? 'checkbox' : 'radio') + '" name="' + name + '" id="' + id + '" value="' + esc(o.value) + '"' + (on ? " checked" : "") + '>' +
            '<label for="' + id + '">' + esc(o.label) + '</label>';
        });
        html += '</div>';
        if (q.detail) {
          var did = name + "-detail";
          html += '<div class="q-field"><label for="' + did + '">' + esc(q.detail) + ' <span class="q-hint">(optional)</span></label>' +
            '<input type="text" id="' + did + '" data-field="detail" maxlength="80" value="' + esc(details[q.id] && details[q.id].detail || "") + '"></div>';
        }
      }
      html += '</div>';
      body.innerHTML = html;

      fill.style.width = (((i + (isAnswered(q) ? 1 : 0)) / total) * 100) + "%";
      meta.textContent = q.intro ? q.section : "Question " + (i + 1 - offset) + " of " + (total - offset);
      backBtn.disabled = i === 0;
      var last = i === total - 1;
      nextBtn.textContent = last ? "See my score" : "Next";
      nextBtn.disabled = !isAnswered(q);
      var h = body.querySelector(".q-title");
      if (h) h.focus();
    }

    body.addEventListener("input", function (e) {
      var t = e.target;
      if (!t || !t.hasAttribute("data-field")) return;
      var q = questions[current];
      details[q.id] = details[q.id] || {};
      details[q.id][t.getAttribute("data-field")] = t.value.trim();
    });

    body.addEventListener("change", function (e) {
      var t = e.target;
      if (!t || (t.type !== "radio" && t.type !== "checkbox")) return;
      var q = questions[current];
      if (t.type === "checkbox") {
        // "None" cannot be ticked alongside anything else
        var boxes = [].slice.call(body.querySelectorAll('input[type="checkbox"]'));
        if (t.checked && q.exclusive) {
          boxes.forEach(function (b) {
            if (b !== t && (t.value === q.exclusive || b.value === q.exclusive)) b.checked = false;
          });
        }
        answers[q.id] = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
        nextBtn.disabled = !isAnswered(q);
        return;
      }
      answers[q.id] = t.value;
      nextBtn.disabled = false;
      fill.style.width = (((current + 1) / total) * 100) + "%";
      if (!autoAdvance(q)) return;
      clearTimeout(timer);
      if (current < total - 1) {
        timer = setTimeout(function () { show(current + 1); }, reduce ? 0 : 300);
      } else if (allAnswered()) {
        timer = setTimeout(finish, reduce ? 0 : 320);
      }
    });

    nextBtn.addEventListener("click", function () {
      if (!isAnswered(questions[current])) return;
      clearTimeout(timer);
      if (current < total - 1) show(current + 1); else finish();
    });
    backBtn.addEventListener("click", function () {
      clearTimeout(timer);
      if (current > 0) show(current - 1);
    });
    document.getElementById("quizExit").addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && app.classList.contains("open")) close();
    });
    [].forEach.call(document.querySelectorAll("[data-open-quiz]"), function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); open(); });
    });

    // Answers to unscored questions, as plain text lines for the result and the copied text
    function contextLines() {
      var out = [];
      questions.forEach(function (q) {
        if (q.scored !== false) return;
        var d = details[q.id] || {};
        var parts = [];
        if (q.type === "fields") {
          q.fields.forEach(function (f) { if (d[f.key]) parts.push(f.label + ": " + d[f.key]); });
        } else if (q.type === "multi") {
          if (answers[q.id] && answers[q.id].length) parts.push(answers[q.id].join(", "));
        } else if (answers[q.id] !== undefined) {
          parts.push(answers[q.id]);
        }
        if (d.detail) parts.push(d.detail);
        if (parts.length) out.push((q.intro ? "" : "Q" + q.id + ". ") + q.text + " " + parts.join("; "));
      });
      return out;
    }

    function answerText(q) {
      var v = answers[q.id];
      if (v === undefined) return "Not answered";
      for (var k = 0; k < q.options.length; k++) { if (q.options[k].value === v) return q.options[k].label; }
      return String(v);
    }

    // Report data for the PDF. Section bars (LK32, FK43) use the same engine as the score.
    function quickReport(r, parts, higher) {
      var z = E.ragZone(r.score, S.scoringRange.max, higher);
      var scoredIds = S.parts ? S.parts[0].ids : null;
      var scoredQs = questions.filter(function (q) { return q.scored !== false && !q.intro; });
      var bars = [];
      if (S.parts) {
        var order = [];
        questions.forEach(function (q) {
          if (q.section && scoredIds.indexOf(q.id) > -1 && order.indexOf(q.section) < 0) order.push(q.section);
        });
        order.forEach(function (sec) {
          var qs = questions.filter(function (q) { return q.section === sec && scoredIds.indexOf(q.id) > -1; });
          var a = {};
          qs.forEach(function (q) { a[q.id] = answers[q.id]; });
          var sr = E.quickScore(qs, a, { min: 0, max: 100 });
          if (sr) bars.push({ label: sec, pct: sr.score, value: sr.score + "/100" });
        });
      }
      return {
        score: r.score, max: S.scoringRange.max,
        pct: Math.max(0, Math.min(100, z.dialPosition)),
        label: z.zone,
        dir: higher ? "Higher score = better function" : "Lower score = better function",
        key: bandKey(S.scoringRange.max, higher),
        meaning: S.scoringInterpretation,
        answered: r.answeredCount + " of " + r.totalQuestions,
        extras: parts.slice(1).filter(function (p) { return p.r; }).map(function (p) {
          return { name: p.label, score: p.r.score, max: S.scoringRange.max, label: E.ragZone(p.r.score, S.scoringRange.max, higher).zone };
        }),
        barsTitle: "Your score by section (out of 100)",
        bars: bars,
        context: S.parts ? contextLines() : [],
        answers: scoredQs.map(function (q) { return [q.text, answerText(q)]; })
      };
    }

    function finish() {
      var u = firstUnanswered();
      if (u > -1) { show(u); return; }

      // Scores with parts (FK43) score each part separately; the first part is the headline score
      var parts = (S.parts || [{ ids: null }]).map(function (p) {
        if (!p.ids) return { label: p.label, r: E.quickScore(questions, answers, S.scoringRange) };
        var qs = questions.filter(function (q) { return p.ids.indexOf(q.id) > -1; });
        var a = {};
        qs.forEach(function (q) { if (answers[q.id] !== undefined) a[q.id] = answers[q.id]; });
        return { label: p.label, r: E.quickScore(qs, a, S.scoringRange) };
      });
      var r = parts[0].r;
      body.innerHTML = "";
      nav.style.display = "none";
      fill.style.width = "100%";
      meta.textContent = "Complete";

      var higher = S.scoringDirection === "higher_better";
      var html = '<h3 tabindex="-1">Your ' + esc(S.acronym) + ' ' + (S.parts ? esc(parts[0].label.toLowerCase()) : 'score') + '</h3>';
      var copy = "";
      if (r) {
        var z = E.ragZone(r.score, S.scoringRange.max, higher);
        var pos = Math.max(0, Math.min(100, z.dialPosition));
        html += '<div class="dial" style="--value:' + pos + ';"><div class="dial-num">' + r.score +
          '<small>out of ' + S.scoringRange.max + '</small></div></div>' +
          '<p class="result-band">' + esc(z.zone) + ' knee function</p>' +
          '<p class="result-dir">' + (higher ? "Higher score = better function" : "Lower score = better function") + '</p>';
        copy = S.name + ": " + r.score + "/" + S.scoringRange.max + " (" + r.answeredCount + "/" + r.totalQuestions +
          " questions answered)\nCalculated: " + new Date().toLocaleString();
        if (S.parts) {
          copy = S.name + "\nCalculated: " + new Date().toLocaleString();
          parts.forEach(function (p) {
            if (!p.r) return;
            var pz = E.ragZone(p.r.score, S.scoringRange.max, higher);
            copy += "\n" + p.label + ": " + p.r.score + "/" + S.scoringRange.max + " (" + pz.zone + ")";
          });
          parts.slice(1).forEach(function (p) {
            if (!p.r) return;
            var pz = E.ragZone(p.r.score, S.scoringRange.max, higher);
            html += '<div class="result-advice result-part"><b>' + esc(p.label) + '</b><span class="part-num">' + p.r.score +
              '<small> out of ' + S.scoringRange.max + '</small></span> ' + esc(pz.zone) + '</div>';
          });
          var ctx = contextLines();
          if (ctx.length) {
            html += '<div class="result-advice"><b>About you (not scored)</b><ul class="ctx-list">' +
              ctx.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join("") + '</ul></div>';
            copy += "\n\nAbout you\n" + ctx.join("\n");
          }
        }
      } else {
        html += '<p class="result-advice">No score could be calculated. None of your answers count towards this score (for example, every item was marked as an activity you do not do).</p>';
      }
      html += '<div class="result-advice"><b>Reading your score</b>' + esc(S.scoringInterpretation) + '</div>' +
        '<p class="small">Note today\'s date and score, then retest to track change. This tool does not replace a medical assessment.</p>' +
        (r ? pdfBoxHtml() : "") +
        '<div class="result-actions">' +
        '<button type="button" class="btn btn-gold" data-act="retake">Retake</button>' +
        (r ? '<button type="button" class="btn btn-ghost" data-act="copy">Copy result</button>' : "") +
        '<button type="button" class="btn btn-ghost" data-act="print">Print</button>' +
        '<a class="btn btn-ghost" href="index.html">All scores</a></div>';
      resultEl.innerHTML = html;
      resultEl.classList.add("show");
      resultEl.querySelector('[data-act="retake"]').addEventListener("click", reset);
      resultEl.querySelector('[data-act="print"]').addEventListener("click", function () { window.print(); });
      var c = resultEl.querySelector('[data-act="copy"]');
      if (c) c.addEventListener("click", function () { copyText(copy); });
      var pdf = resultEl.querySelector('[data-act="pdf"]');
      if (pdf) pdf.addEventListener("click", function () { savePdf(quickReport(r, parts, higher)); });
      app.scrollTop = 0;
      var h = resultEl.querySelector("h3");
      if (h) h.focus();
    }
  }

  // ---------------------------------------------------------------
  // Shared pieces for SK11 and PK7
  // ---------------------------------------------------------------
  function scaleHtml(name, max, value) {
    var h = '<div class="scale" role="radiogroup" style="--n:' + (max + 1) + '">';
    for (var v = 0; v <= max; v++) {
      var id = name + "-" + v;
      h += '<input type="radio" name="' + name + '" id="' + id + '" value="' + v + '"' + (value === v ? " checked" : "") + '>' +
        '<label for="' + id + '">' + v + '</label>';
    }
    return h + '</div><div class="scale-ends" style="--n:' + (max + 1) + '"><span>Worst</span><span>Best</span></div>';
  }

  function liveHtml() {
    return '<aside class="live" aria-live="polite">' +
      '<p class="eyebrow">Your score</p>' +
      '<div class="dial" id="liveDial" style="--value:0;"><div class="dial-num"><span id="liveNum">0</span><small>out of 100</small></div></div>' +
      '<span class="live-score" id="liveNumMobile">0</span>' +
      '<p class="live-band" id="liveBand">Not started</p>' +
      '<p class="live-status" id="liveStatus"></p>' +
      '<button type="button" class="btn btn-gold btn-sm" id="reportBtn" disabled>See report</button>' +
      '<button type="button" class="btn btn-ghost btn-sm" id="resetBtn">Reset</button>' +
      '</aside>';
  }

  function updateLive(result, answered, totalItems, threshold) {
    var num = result ? result.score : 0;
    document.getElementById("liveNum").textContent = result ? num : "0";
    document.getElementById("liveNumMobile").textContent = result ? num : "0";
    document.getElementById("liveDial").style.setProperty("--value", num);
    document.getElementById("liveBand").textContent = result ? E.scoreBand(num).label : "Not started";
    var status = answered + " of " + totalItems + " answered";
    if (result && result.isIncomplete) status += ". Preliminary: answer at least " + threshold + " for a valid score";
    document.getElementById("liveStatus").textContent = status;
    document.getElementById("reportBtn").disabled = answered === 0;
  }

  function pct(x) { return (x * 100).toFixed(1) + "%"; }

  // ---------------------------------------------------------------
  // SK11 (SK11Calculator flow)
  // ---------------------------------------------------------------
  function initSK11() {
    var root = document.getElementById("toolApp");
    var Q = E.SK11_QUESTIONS;
    var threshold = 8;
    var answers = {};
    Q.forEach(function (q) { answers[q.id] = null; });

    function render() {
      var h = '<div class="tool-items">';
      Q.forEach(function (q, i) {
        h += '<div class="item' + (answers[q.id] !== null ? " done" : "") + '" id="item' + q.id + '">' +
          '<div class="item-head"><span class="item-num">' + (i + 1) + '</span><div>' +
          '<p class="item-text">' + esc(q.text) + '</p><p class="item-sub">' + esc(q.domain) + ' &middot; 0 = worst, 10 = best</p></div></div>' +
          scaleHtml("sk" + q.id, 10, answers[q.id]) + '</div>';
      });
      h += '<div id="report"></div></div>' + liveHtml();
      root.innerHTML = h;
      bind();
      refresh();
    }

    function answeredCount() {
      return Q.filter(function (q) { return answers[q.id] !== null; }).length;
    }
    function refresh() {
      var r = E.sk11Score(answers, threshold);
      updateLive(r, answeredCount(), Q.length, threshold);
      return r;
    }
    root.addEventListener("change", function (e) {
      var t = e.target;
      if (!t || t.type !== "radio") return;
      var id = Number(t.name.slice(2));
      answers[id] = Number(t.value);
      document.getElementById("item" + id).classList.add("done");
      refresh();
      var rep = document.getElementById("report");
      if (rep.innerHTML) report();
    });
    function bind() {
      document.getElementById("reportBtn").addEventListener("click", function () { report(); document.getElementById("report").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
      document.getElementById("resetBtn").addEventListener("click", function () {
        Q.forEach(function (q) { answers[q.id] = null; });
        render();
      });
    }

    function report() {
      var r = refresh();
      if (!r) return;
      // Display breakdown mirrors SK11Calculator domainBreakdown
      var answered = Q.filter(function (q) { return answers[q.id] !== null; });
      var totalWeight = answered.reduce(function (s, q) { return s + q.weight; }, 0) || 1;
      var rows = "", lines = [];
      Q.forEach(function (q) {
        var raw = answers[q.id];
        var w = raw !== null ? q.weight / totalWeight : q.weight;
        var contrib = raw !== null ? ((raw / 10) * 100 * w) / 100 * 10 : null;
        rows += '<tr><td>' + esc(q.domain) + '</td><td class="num">' + (raw !== null ? raw + "/10" : "Not answered") +
          '</td><td class="num">' + pct(w) + '</td><td class="num">' + (contrib !== null ? "+" + contrib.toFixed(1) : "") + '</td></tr>';
        lines.push(q.domain + ": " + (raw !== null ? raw + "/10" : "not answered") + " (weight " + pct(w) + ")");
      });
      var band = E.scoreBand(r.score).label;
      var text = "SK11 Assessment Results\nDate: " + new Date().toLocaleString() + "\n\nOverall Score: " + r.score + "/100 (" + band + ")\n" +
        "Completion: " + r.answeredCount + "/" + r.totalQuestions + " items\nStatus: " + (r.isIncomplete ? "Incomplete" : "Complete") + "\n\n" + lines.join("\n") + "\n\nGenerated by mykneescore";
      document.getElementById("report").innerHTML = '<div class="report"><h3>SK11 report: ' + r.score + '/100 (' + esc(band) + ')</h3>' +
        '<table><thead><tr><th>Domain</th><th class="num">Answer</th><th class="num">Weight</th><th class="num">Points</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p class="note">SK11 = round(10 &times; sum of answer &times; weight). Fixed weights, renormalised over answered items. Bands: 85+ Excellent, 70 to 84 Good, 60 to 69 Fair, 40 to 59 Poor, under 40 Very Poor.</p>' +
        pdfBoxHtml() +
        '<div class="result-actions"><button type="button" class="btn btn-green btn-sm" id="copyRep">Copy result</button><button type="button" class="btn btn-ghost-green btn-sm" id="printRep">Print</button></div></div>';
      document.getElementById("copyRep").addEventListener("click", function () { copyText(text); });
      document.getElementById("printRep").addEventListener("click", function () { window.print(); });
      document.querySelector('#report [data-act="pdf"]').addEventListener("click", function () {
        var b = E.scoreBand(r.score);
        savePdf({
          score: r.score, max: 100, pct: r.score, label: b.label,
          dir: "Higher score = better function", key: TOOL_KEY,
          meaning: b.description + ". " + (r.isIncomplete ? "Preliminary: answer at least " + threshold + " items for a valid score. " : "") + "This score has not yet been validated, so treat it as a guide.",
          answered: r.answeredCount + " of " + r.totalQuestions,
          barsTitle: "Your answers by area (0 = worst, 10 = best)",
          bars: Q.filter(function (q) { return answers[q.id] !== null; }).map(function (q) {
            return { label: q.domain, pct: answers[q.id] * 10, value: answers[q.id] + "/10" };
          }),
          answers: Q.map(function (q) { return [q.text, answers[q.id] !== null ? answers[q.id] + " out of 10" : "Not answered"]; })
        });
      });
    }

    render();
  }

  // ---------------------------------------------------------------
  // PK7 (PK7Calculator flow, including custom weights)
  // ---------------------------------------------------------------
  function initPK7() {
    var root = document.getElementById("toolApp");
    var D = E.PK7_DOMAINS;
    var threshold = 5;
    var answers = {};
    var weights = E.pk7DefaultWeights();
    var weightInputs = {};
    D.forEach(function (d) { answers[d.id] = null; weightInputs[d.id] = String(d.defaultWeight); });

    function render() {
      var h = '<div class="tool-items">';
      h += '<details class="weights" id="weightsBox"><summary>Custom domain weights (for clinicians)</summary>' +
        '<div class="weights-grid">';
      D.forEach(function (d) {
        h += '<div><label for="w' + d.id + '">' + esc(d.name) + '</label>' +
          '<input type="number" min="0" step="0.1" id="w' + d.id + '" data-w="' + d.id + '" value="' + esc(weightInputs[d.id]) + '"></div>';
      });
      h += '</div><p>Weights are automatically normalised to sum to 1.0 over the answered domains. <button type="button" class="btn btn-ghost-green btn-sm" id="resetWeights">Reset to equal</button></p></details>';
      D.forEach(function (d, i) {
        h += '<div class="item' + (answers[d.id] !== null ? " done" : "") + '" id="item' + d.id + '">' +
          '<div class="item-head"><span class="item-num">' + (i + 1) + '</span><div>' +
          '<p class="item-text">' + esc(d.name) + '</p><p class="item-sub">' + esc(d.description) + ' &middot; 0 = worst, ' + d.maxValue + ' = best</p></div></div>' +
          scaleHtml("pk" + d.id, d.maxValue, answers[d.id]) + '</div>';
      });
      h += '<div id="report"></div></div>' + liveHtml();
      root.innerHTML = h;
      bind();
      refresh();
    }

    function answeredCount() {
      return D.filter(function (d) { return answers[d.id] !== null; }).length;
    }
    function refresh() {
      var r = E.pk7Score(answers, weights, threshold);
      updateLive(r, answeredCount(), D.length, threshold);
      var rep = document.getElementById("report");
      if (rep && rep.innerHTML) report(r);
      return r;
    }
    root.addEventListener("change", function (e) {
      var t = e.target;
      if (!t || t.type !== "radio") return;
      var id = Number(t.name.slice(2));
      answers[id] = Number(t.value);
      document.getElementById("item" + id).classList.add("done");
      refresh();
    });
    root.addEventListener("input", function (e) {
      var t = e.target;
      if (!t || !t.hasAttribute("data-w")) return;
      var id = Number(t.getAttribute("data-w"));
      weightInputs[id] = t.value;
      weights[id] = E.pk7ParseWeight(t.value);
      refresh();
    });
    function bind() {
      document.getElementById("resetWeights").addEventListener("click", function () {
        weights = E.pk7DefaultWeights();
        D.forEach(function (d) {
          weightInputs[d.id] = String(d.defaultWeight);
          document.getElementById("w" + d.id).value = weightInputs[d.id];
        });
        refresh();
      });
      document.getElementById("reportBtn").addEventListener("click", function () { report(refresh()); document.getElementById("report").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
      document.getElementById("resetBtn").addEventListener("click", function () {
        D.forEach(function (d) { answers[d.id] = null; weightInputs[d.id] = String(d.defaultWeight); });
        weights = E.pk7DefaultWeights();
        render();
      });
    }

    function report(r) {
      if (!r) { document.getElementById("report").innerHTML = ""; return; }
      // Display breakdown mirrors PK7Calculator domainBreakdown
      var nw = r.normalizedWeights;
      var custom = D.some(function (d) { return weights[d.id] !== d.defaultWeight; });
      var rows = "", lines = [];
      D.forEach(function (d) {
        var raw = answers[d.id];
        var norm = raw !== null ? (raw / d.maxValue) * 100 : null;
        var w = nw[d.id] || weights[d.id] / D.length;
        rows += '<tr><td>' + esc(d.name) + '</td><td class="num">' + (raw !== null ? raw + "/" + d.maxValue : "Not answered") +
          '</td><td class="num">' + (norm !== null ? norm.toFixed(0) + "%" : "") + '</td><td class="num">' + pct(w) + '</td></tr>';
        lines.push(d.name + ": " + (raw !== null ? raw + "/" + d.maxValue : "not answered") + " (weight " + pct(w) + ")");
      });
      var band = E.scoreBand(r.score).label;
      var text = "PK7 Assessment Results\nDate: " + new Date().toLocaleString() + "\n\nOverall Score: " + r.score + "/100 (" + band + ")\n" +
        "Completion: " + r.answeredCount + "/" + r.totalQuestions + " items\nStatus: " + (r.isIncomplete ? "Incomplete" : "Complete") +
        (custom ? "\nCustom weights: yes" : "") + "\n\n" + lines.join("\n") + "\n\nGenerated by mykneescore";
      document.getElementById("report").innerHTML = '<div class="report"><h3>PK7 report: ' + r.score + '/100 (' + esc(band) + ')</h3>' +
        '<table><thead><tr><th>Domain</th><th class="num">Answer</th><th class="num">Scaled</th><th class="num">Weight</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p class="note">PK7: mixed scales normalised to 0 to 100, then weighted.' + (custom ? " Custom weights in use." : " Equal weights.") +
        ' Bands: 85+ Excellent, 70 to 84 Good, 60 to 69 Fair, 40 to 59 Poor, under 40 Very Poor.</p>' +
        pdfBoxHtml() +
        '<div class="result-actions"><button type="button" class="btn btn-green btn-sm" id="copyRep">Copy result</button><button type="button" class="btn btn-ghost-green btn-sm" id="printRep">Print</button></div></div>';
      document.getElementById("copyRep").addEventListener("click", function () { copyText(text); });
      document.getElementById("printRep").addEventListener("click", function () { window.print(); });
      document.querySelector('#report [data-act="pdf"]').addEventListener("click", function () {
        var b = E.scoreBand(r.score);
        savePdf({
          score: r.score, max: 100, pct: r.score, label: b.label,
          dir: "Higher score = better function", key: TOOL_KEY,
          meaning: b.description + ". " + (r.isIncomplete ? "Preliminary: answer at least " + threshold + " domains for a valid score. " : "") +
            (custom ? "Custom clinician weights were used. " : "") + "This score has not yet been validated, so treat it as a guide.",
          answered: r.answeredCount + " of " + r.totalQuestions,
          barsTitle: "Your answers by domain (scaled to 100)",
          bars: D.filter(function (d) { return answers[d.id] !== null; }).map(function (d) {
            return { label: d.name, pct: answers[d.id] / d.maxValue * 100, value: answers[d.id] + "/" + d.maxValue };
          }),
          answers: D.map(function (d) { return [d.name + " (" + d.description.toLowerCase() + ")", answers[d.id] !== null ? answers[d.id] + " out of " + d.maxValue : "Not answered"]; })
        });
      });
    }

    render();
  }
})();
