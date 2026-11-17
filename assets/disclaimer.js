/*
 * My Knee Score: the disclaimer shown before every test on the site.
 *
 * One copy, used by the home page and every Advanced and Paediatrics score,
 * so the wording can never drift between pages. The PDF report prints the
 * same text with the date and time it was accepted.
 *
 * This is legal wording. Change it only with sign off from the lawyer and
 * Dr Gupte, then raise VERSION so each PDF shows which wording was accepted.
 *
 * Nothing is stored. Acceptance lasts until the page is closed or reloaded.
 */
(function () {
  "use strict";

  var VERSION = "1.0, 17 November 2026";

  // Each item: a legal term where needed, then its plain meaning in brackets.
  var SECTIONS = [
    {
      title: "What this test is",
      items: [
        "It gives general health information (facts for everyone, not advice about you). It is not medical advice.",
        "It is not a diagnosis (a finding by a doctor about what is wrong with your knee).",
        "Your score is worked out only from your own answers. No doctor or other health professional checks them.",
        "Some scores on this site, including the Short Knee Score, have not been clinically validated (proven in formal research studies). Published scores are used in research and in clinics, but no score on its own is a diagnosis."
      ]
    },
    {
      title: "What your score cannot tell you",
      items: [
        "A good score does not mean your knee is healthy. You may still have a problem that needs treatment or an operation.",
        "A poor score does not mean you need treatment or an operation.",
        "Any next step we suggest is general guidance only. Only a qualified health professional who assesses you can advise you on your care."
      ]
    },
    {
      title: "What you should do",
      items: [
        "Speak to a doctor, physiotherapist or other qualified health professional about any knee problem or worry.",
        "Do not start, stop, change or delay any treatment because of your score.",
        "Get medical help the same day if your knee is hot, red and swollen, follows a significant injury, locks, gives way or will not take your weight. Call NHS 111, or 999 in an emergency. Do this whatever your score.",
        "If your score worries you, talk to your GP or another health professional."
      ]
    },
    {
      title: "Our responsibility (our liability)",
      items: [
        "We take reasonable care (we do our best) to keep this site accurate. We do not warrant (promise) that it is complete, correct or up to date, or that it will always be available.",
        "As far as the law allows, we are not liable (legally responsible) for any loss or harm that comes from relying on a score instead of advice from a qualified health professional.",
        "Nothing in this disclaimer excludes or limits (removes or reduces) our liability for death or personal injury caused by our negligence (carelessness), for fraud, or for anything else the law does not allow us to exclude or limit.",
        "This disclaimer does not affect your statutory rights (your legal rights as a consumer)."
      ]
    },
    {
      title: "Your information",
      items: [
        "Your answers and your score stay on your device. We do not collect, store or send them. Your tick on this disclaimer is not saved either."
      ]
    },
    {
      title: "Children and young people",
      items: [
        "If you are under 18, ask a parent or guardian (an adult responsible for you) to read this with you before you tick the box."
      ]
    },
    {
      title: "Which law applies",
      items: [
        "This disclaimer is governed by the law of England and Wales (English law applies). If you live in Scotland or Northern Ireland, you can also bring a claim in your local courts."
      ]
    }
  ];

  var TICK = "I have read and understood this disclaimer. I accept that my score is general health information, not medical advice or a diagnosis.";

  var acceptedAt = null;
  var uid = 0;

  function esc(v) {
    return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function when(d) {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) +
      " at " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }
  function sectionsHtml(tag) {
    return SECTIONS.map(function (s) {
      return "<" + tag + ">" + esc(s.title) + "</" + tag + "><ul>" +
        s.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
    }).join("");
  }

  // Styles use the colour names that every page on the site defines.
  var CSS =
    ".mks-disc { background: var(--ivory); color: var(--text); border: 1px solid var(--gold); border-radius: 14px; padding: clamp(1.2rem, 4vw, 2rem); max-width: 44em; margin: 0 auto; text-align: left; font-family: var(--body); }" +
    ".mks-disc h2 { font-family: var(--display); font-weight: 600; font-size: clamp(1.6rem, 4vw, 2rem); line-height: 1.15; color: var(--green-ink); margin: 0 0 0.4rem; }" +
    ".mks-disc h2:focus { outline: none; }" +
    // While the disclaimer shows, hide the question counter: no question has started
    ".mks-gated .progress-track, .mks-gated .progress-meta { visibility: hidden; }" +
    ".mks-disc .mks-lead { font-size: 1.02rem; font-weight: 600; color: var(--green-ink); margin: 0 0 1rem; }" +
    ".mks-disc h3 { font-family: var(--body); font-size: 1rem; font-weight: 700; color: var(--green-ink); margin: 1.1rem 0 0.35rem; }" +
    ".mks-disc ul { margin: 0; padding-left: 1.2rem; }" +
    ".mks-disc li { font-size: 1rem; line-height: 1.55; margin-bottom: 0.35rem; }" +
    ".mks-disc .mks-ver { font-size: 0.85rem; color: var(--green-ink); opacity: 0.75; margin: 1rem 0 0; }" +
    ".mks-tick { display: flex; gap: 0.9rem; align-items: flex-start; margin-top: 1.3rem; padding: 1rem 1.1rem; border: 2px solid var(--gold); border-radius: 12px; background: var(--paper); cursor: pointer; font-weight: 600; font-size: 1.02rem; line-height: 1.45; color: var(--green-ink); }" +
    ".mks-tick input { flex: none; width: 32px; height: 32px; margin: 0; accent-color: var(--green-ink); cursor: pointer; }" +
    ".mks-tick:focus-within { outline: 3px solid var(--gold); outline-offset: 3px; }" +
    ".mks-disc .mks-go { margin-top: 1.1rem; width: 100%; min-height: 52px; border: 0; border-radius: 999px; background: var(--gold); color: var(--green-deep); font: inherit; font-weight: 700; font-size: 1.05rem; cursor: pointer; }" +
    ".mks-disc .mks-go:focus-visible { outline: 3px solid var(--green-ink); outline-offset: 3px; }" +
    ".mks-disc .mks-err { margin: 0.7rem 0 0; font-weight: 700; color: var(--green-ink); }" +
    ".mks-disc .mks-err:empty { display: none; }" +
    ".rp-disc h3 { font-size: 10pt; margin: 8pt 0 3pt; }" +
    ".rp-disc ul { margin: 0; padding-left: 14pt; }" +
    ".rp-disc li { font-size: 8.8pt; line-height: 1.4; margin-bottom: 2pt; }" +
    ".rp-disc .rp-accepted { font-weight: 700; }";

  function addStyles() {
    if (document.getElementById("mksDiscCss")) return;
    var s = document.createElement("style");
    s.id = "mksDiscCss";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  window.MKSDisclaimer = {
    version: VERSION,

    accepted: function () { return acceptedAt; },

    // Hides `content` and shows the disclaimer in its place. When the box is
    // ticked and Start is pressed, the disclaimer goes and `content` returns.
    gate: function (content, onAccept) {
      if (acceptedAt) { if (onAccept) onAccept(); return; }
      addStyles();
      var old = content.parentNode.querySelector(".mks-disc");
      if (old) old.parentNode.removeChild(old);
      var id = "mksTick" + (++uid);
      var box = document.createElement("section");
      box.className = "mks-disc";
      box.setAttribute("aria-labelledby", id + "h");
      box.innerHTML =
        '<h2 id="' + id + 'h" tabindex="-1">Before you start: please read</h2>' +
        '<p class="mks-lead">You must read this and tick the box before you take any test on this site.</p>' +
        sectionsHtml("h3") +
        '<p class="mks-ver">Disclaimer version ' + esc(VERSION) + '.</p>' +
        '<label class="mks-tick" for="' + id + '"><input type="checkbox" id="' + id + '"><span>' + esc(TICK) + '</span></label>' +
        '<button type="button" class="mks-go">Start the test</button>' +
        '<p class="mks-err" role="alert"></p>';
      content.hidden = true;
      content.parentNode.insertBefore(box, content);
      document.documentElement.classList.add("mks-gated");
      var tick = box.querySelector("input");
      var err = box.querySelector(".mks-err");
      tick.addEventListener("change", function () { if (tick.checked) err.textContent = ""; });
      box.querySelector(".mks-go").addEventListener("click", function () {
        if (!tick.checked) {
          err.textContent = "Please tick the box to show you have read and accept the disclaimer.";
          tick.focus();
          return;
        }
        acceptedAt = new Date();
        box.parentNode.removeChild(box);
        document.documentElement.classList.remove("mks-gated");
        content.hidden = false;
        if (onAccept) onAccept();
      });
      var h = box.querySelector("h2");
      if (h && box.offsetParent !== null) h.focus({ preventScroll: true });
    },

    // The disclaimer for the PDF report: when it was accepted, then the full text.
    reportHtml: function () {
      addStyles();
      return '<div class="rp-sec rp-disc"><h2>Disclaimer accepted</h2>' +
        '<p class="rp-accepted">' + (acceptedAt
          ? "The person taking this test ticked the box to accept this disclaimer on " + esc(when(acceptedAt)) + ", before starting."
          : "This disclaimer applies to this test.") + '</p>' +
        '<p>Disclaimer version ' + esc(VERSION) + '. Accepted: ' + esc(TICK) + '</p>' +
        sectionsHtml("h3") + '</div>';
    }
  };
})();
