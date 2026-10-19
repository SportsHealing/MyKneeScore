# Test links and iFrame embeds

Last updated: 2026-10-19

Every questionnaire on mykneescore.com has its own link. Use these to share a test, or to show it inside a sister site.

## Three kinds of link

| Link | What it does |
|---|---|
| **Page** | The score's page on mykneescore.com, with menu and footer. |
| **Test** | Opens the questionnaire straight away. Use this to share. The address bar shows this link while someone takes the test. |
| **Embed** | The questionnaire only. No menu, footer or Exit button. Use this inside an iFrame. |

SK11 and PK7 are calculators shown on the page itself, so their Page and Test links are the same.

## How to embed a test on a sister site

1. Copy the Embed link for the test from the table below.
2. Paste this into the sister site's page, with the link in `src`:

```html
<iframe src="https://mykneescore.com/?embed=1"
        title="My Knee Score questionnaire"
        style="width:100%; height:800px; border:0;"
        loading="lazy"></iframe>
```

3. Change `title` to name the test, for screen readers.
4. 800px suits phones and desktops. The test scrolls inside the frame if it needs more room.

Nothing is stored or sent, inside a frame or not. The PDF report and Email me a copy work as on the site.

## Every test

| Test | Page | Test link (share) | Embed link (iFrame) |
|---|---|---|---|
| Short Knee Score (home page) | https://mykneescore.com/ | https://mykneescore.com/#quiz | https://mykneescore.com/?embed=1 |
| ACL-QOL: ACL Quality of Life Questionnaire | https://mykneescore.com/advanced/acl-qol.html | https://mykneescore.com/advanced/acl-qol.html#quiz | https://mykneescore.com/advanced/acl-qol.html?embed=1 |
| ACL-RSI: ACL Return to Sport after Injury Scale | https://mykneescore.com/advanced/acl-rsi.html | https://mykneescore.com/advanced/acl-rsi.html#quiz | https://mykneescore.com/advanced/acl-rsi.html?embed=1 |
| BPII: Banff Patella Instability Instrument | https://mykneescore.com/advanced/bpii.html | https://mykneescore.com/advanced/bpii.html#quiz | https://mykneescore.com/advanced/bpii.html?embed=1 |
| CKRS: Cincinnati Knee Rating System | https://mykneescore.com/advanced/cincinnati.html | https://mykneescore.com/advanced/cincinnati.html#quiz | https://mykneescore.com/advanced/cincinnati.html?embed=1 |
| FJS-12: Forgotten Joint Score | https://mykneescore.com/advanced/fjs-12.html | https://mykneescore.com/advanced/fjs-12.html#quiz | https://mykneescore.com/advanced/fjs-12.html?embed=1 |
| FK43: mykneescore Female Knee Score - FK43 | https://mykneescore.com/advanced/fk43.html | https://mykneescore.com/advanced/fk43.html#quiz | https://mykneescore.com/advanced/fk43.html?embed=1 |
| IKDC: International Knee Documentation Committee Subjective Knee Evaluation Form | https://mykneescore.com/advanced/ikdc.html | https://mykneescore.com/advanced/ikdc.html#quiz | https://mykneescore.com/advanced/ikdc.html?embed=1 |
| KOOS: Knee Injury and Osteoarthritis Outcome Score | https://mykneescore.com/advanced/koos.html | https://mykneescore.com/advanced/koos.html#quiz | https://mykneescore.com/advanced/koos.html?embed=1 |
| KOOS-JR: KOOS for Joint Replacement | https://mykneescore.com/advanced/koos-jr.html | https://mykneescore.com/advanced/koos-jr.html#quiz | https://mykneescore.com/advanced/koos-jr.html?embed=1 |
| KS5: mykneescore Knee Sleep Score - KS5 | https://mykneescore.com/advanced/ks5.html | https://mykneescore.com/advanced/ks5.html#quiz | https://mykneescore.com/advanced/ks5.html?embed=1 |
| KSS-2011: New Knee Society Knee Scoring System (2011) | https://mykneescore.com/advanced/kss-2011.html | https://mykneescore.com/advanced/kss-2011.html#quiz | https://mykneescore.com/advanced/kss-2011.html?embed=1 |
| Kujala/AKPS: Kujala Anterior Knee Pain Scale | https://mykneescore.com/advanced/kujala.html | https://mykneescore.com/advanced/kujala.html#quiz | https://mykneescore.com/advanced/kujala.html?embed=1 |
| LK32: mykneescore Long Knee Score - LK32 | https://mykneescore.com/advanced/lk32.html | https://mykneescore.com/advanced/lk32.html#quiz | https://mykneescore.com/advanced/lk32.html?embed=1 |
| Lysholm: Lysholm Knee Scoring Scale | https://mykneescore.com/advanced/lysholm.html | https://mykneescore.com/advanced/lysholm.html#quiz | https://mykneescore.com/advanced/lysholm.html?embed=1 |
| Marx: Marx Activity Rating Scale | https://mykneescore.com/advanced/marx.html | https://mykneescore.com/advanced/marx.html#quiz | https://mykneescore.com/advanced/marx.html?embed=1 |
| NPI: Norwich Patellar Instability Score | https://mykneescore.com/advanced/norwich-pis.html | https://mykneescore.com/advanced/norwich-pis.html#quiz | https://mykneescore.com/advanced/norwich-pis.html?embed=1 |
| Pedi-IKDC: Pediatric IKDC Subjective Knee Evaluation Form | https://mykneescore.com/advanced/pedi-ikdc.html | https://mykneescore.com/advanced/pedi-ikdc.html#quiz | https://mykneescore.com/advanced/pedi-ikdc.html?embed=1 |
| PK7: mykneescore Pro Knee - PK7 | https://mykneescore.com/advanced/pk7.html | https://mykneescore.com/advanced/pk7.html | https://mykneescore.com/advanced/pk7.html?embed=1 |
| SANE: Single Assessment Numeric Evaluation | https://mykneescore.com/advanced/sane.html | https://mykneescore.com/advanced/sane.html#quiz | https://mykneescore.com/advanced/sane.html?embed=1 |
| SK11: mykneescore Short Knee - SK11 | https://mykneescore.com/advanced/sk11.html | https://mykneescore.com/advanced/sk11.html | https://mykneescore.com/advanced/sk11.html?embed=1 |
| Tegner: Tegner Activity Scale | https://mykneescore.com/advanced/tegner.html | https://mykneescore.com/advanced/tegner.html#quiz | https://mykneescore.com/advanced/tegner.html?embed=1 |
| WOMET: Western Ontario Meniscal Evaluation Tool | https://mykneescore.com/advanced/womet.html | https://mykneescore.com/advanced/womet.html#quiz | https://mykneescore.com/advanced/womet.html?embed=1 |

## How it works (for maintainers)

- `#quiz` at the end of a link opens the questionnaire on page load. Opening the test writes `#quiz` into the address bar; Exit removes it. Score history (`h=...`) in the address is kept.
- `?embed=1` adds the class `embed` to the page before it draws (a short script in each page head). CSS then hides the header, footer and page sections, and the questionnaire opens at once. Exit and Escape do nothing in embed mode.
- Home page: code in `index.html`. Advanced: `advanced/assets/app.js`, `advanced/assets/advanced.css` and the page head in `tools/advanced/build.mjs`.
- GitHub Pages sends no header that blocks framing, so any site can embed these pages.
