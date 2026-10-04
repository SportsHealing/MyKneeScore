# MyKneeScore "Advanced" section: project status

Last updated: 2026-10-04 (chat "Kneescore - advanced scores")

## Current state
- Built on branch `claude/awesome-dijkstra-ykvxd2` of `SportsHealing/MyKneeScore`.
- Preview approved by the user. Pull request: https://github.com/SportsHealing/MyKneeScore/pull/2
- 2026-10-04: user asked for the section on the live site, "tucked away for now". PR merged into `main`, so the section is live at https://mykneescore.com/advanced/
- "Tucked away" means: the only ways in are the "Advanced scores" tab in the top menu and a small footer link. Nothing on the home page promotes it.
- **2026-10-04 user decisions: keep the footer link; show the tab on phones too.**
- Phone menu change (approved and put live 2026-10-04): on screens up to 700px the menu shows "Advanced" (short label) plus "Start the test". Between 701 and 860px "Track progress" is hidden on the home and anatomy pages so the menu fits on one line. Fonts and spacing tighten below 1100px. Checked one line at 13 widths from 320px to 1280px, no sideways scrolling.
- The live site deploys from the `main` branch. A pushed branch is not live until it is merged.
- Every parity and browser test passes (details below).

## Goal
- Add an "Advanced" section to mykneescore.com with the knee scores from `SportsHealing/kneescore-research`.
- Layout: one hub page linking to one page per score.

## User decisions (binding)
- Include every score from kneescore-research.
- Leave out the Oxford Knee Score until licence permission is obtained.
- **Leave out WOMAC until licence permission is obtained** (user decision, 2026-10-03).
- To add either later, remove `oks` or `womac` from `EXCLUDED` in `tools/advanced/build.mjs`, rebuild, and rerun the tests.
- **SK11 and PK7 use the dedicated weighted calculators (the research site's Tools page versions), NOT the generic Score Library engine. Confirmed by the user on 2026-10-03. Do not switch them to the generic engine.**
- CCI and Elixhauser (comorbidity indices) follow Claude's recommendation, so they stay on the research site only.
- Use a hub page.
- Nothing is pushed without a preview first. (Preview v1 approved 2026-10-03.)
- **Hard rule:** scoring logic must not change. The same answers must give the same score as the research site. Only presentation code may change.

## What was built
| Path | Purpose |
|---|---|
| `advanced/index.html` | Hub page. 17 published scores with category filter chips, plus a "My Knee Score tools" group (SK11, PK7, KS5) and a note that Oxford and WOMAC are coming soon. |
| `advanced/<slug>.html` | 20 score pages: intro, facts, about, strengths and limitations, citation, licence. |
| `advanced/assets/engine.js` | Scoring engine. Line-for-line port of the research code. **Do not edit the arithmetic.** |
| `advanced/assets/scores-data.js` | Generated. Score metadata and exact question sets. Do not edit by hand. |
| `advanced/assets/app.js` | Page UI only: quiz flow, SK11/PK7 tools, result screens. All scoring calls go through `engine.js`. |
| `advanced/assets/advanced.css`, `hub.js` | Styling (same tokens as the main site) and hub filters. |
| `tools/advanced/build.sh`, `build.mjs`, `export-data.ts` | Regenerate the data and pages from a research checkout. The build also deletes pages for scores that are no longer published. |
| `tools/advanced/parity.test.tsx`, `run-parity.sh` | Parity test against the original React components. |
| `tools/advanced/e2e.cjs` | Browser test across every page. |
| `index.html`, `anatomy.html` | Added an "Advanced scores" link to the nav and footer, plus menu sizing rules so the tab fits on phones and tablets. No other changes. |

### Score pages and engines
- **Generic engine (QuickCalculator port):** IKDC, KOOS, Lysholm, Tegner, KOOS-JR, WOMET, Kujala, ACL-QOL, Norwich PIS, FJS-12, ACL-RSI, Marx, New KSS, Banff PII, Cincinnati, Pedi-IKDC, SANE, KS5.
  - Rule: sum of chosen values / sum of each answered question's max option × `scoringRange.max`, rounded, clamped. Negative values ("Do not do") are excluded.
  - Result shows score, Good/Fair/Poor zone (RAG dial thresholds 70/40), direction, and the score's interpretation text.
- **SK11:** **dedicated weighted engine (user-confirmed choice)** (SK11Calculator port). 0 to 10 per item, fixed weights renormalised over answered items. 8 items needed for a valid score.
- **PK7:** **dedicated engine (user-confirmed choice)** (PK7Calculator port), including the clinician custom weights. 5 domains needed for a valid score.
- Bands for SK11 and PK7: 85+ Excellent, 70 to 84 Good, 60 to 69 Fair, 40 to 59 Poor, under 40 Very Poor.

## Source of truth in kneescore-research (commit 553ba40)
- Metadata: `src/lib/kneeScores.ts`
- Questions and option values: `src/lib/scoreQuestions.ts` via `getQuestionsForScore()`
- Generic engine: `src/components/QuickCalculator.tsx`
- SK11/PK7: `src/components/SK11Calculator.tsx`, `src/components/PK7Calculator.tsx`, `src/lib/scoreCalculations.ts`
- Bands: `src/lib/scoreUtils.ts`
- `src/lib/scoringCalculators.ts` is not used by the public calculators. It was not ported.

## Verification
- `run-parity.sh`: 28 tests pass.
  - Renders the original QuickCalculator for all 22 scores (Oxford included as a control) with all-min, all-max and 12 random answer sets each, then compares the displayed score and zone to `engine.js`.
  - Renders the original SK11Calculator and PK7Calculator (36 random runs each, partial answers, custom PK7 weights including 0 and blank).
  - 5,000 random cases each against `calculateSK11` / `calculatePK7` in `scoreCalculations.ts`.
  - Band labels checked for every score from 0 to 100.
  - Mutation check: a deliberately broken engine made 13 tests fail, so the test does catch changes.
- `e2e.cjs` in Chromium: 69 checks, 0 mismatches, across every page, including Back navigation and the hub filter.

## How to rebuild after research changes
1. In kneescore-research: `npm ci --legacy-peer-deps`, then `npm i --no-save --legacy-peer-deps jsdom @testing-library/react @testing-library/dom`.
2. `tools/advanced/build.sh /path/to/kneescore-research`
3. `tools/advanced/run-parity.sh /path/to/kneescore-research`
4. Serve the site root (`python3 -m http.server 8765`), then run `node tools/advanced/e2e.cjs`.

## Licences
- Oxford Knee Score: licence required. Excluded.
- WOMAC: licence required. **Excluded by user decision until licence permission is obtained.** The parity test still covers it, so it can be switched on safely later.

## Pre-existing quirks carried over unchanged (not fixed, by design)
- Some metadata question counts differ from the actual question sets: New KSS 34 vs 9, Banff PII 32 vs 23, Cincinnati 10 vs 11, Pedi-IKDC 17 vs 18. Pages show the actual number of questions asked.
- The research site scores SK11 and PK7 in two ways. The Score Library uses the generic engine. The Tools page uses the dedicated weighted engines. These can give different numbers. **The Advanced pages use the dedicated engines, as confirmed by the user.**
- The PK7 "Pain" and "Disturbed sleep" items are labelled "0 = worst, 10 = best", as in the original.

## Open questions for the user
- None at present.

## Resolved decisions
- WOMAC: hold back until licensed (2026-10-03).
- **SK11/PK7: keep the dedicated weighted engines (2026-10-03).**
- Preview approved. Push and open a PR (2026-10-03).
- Put the section live, tucked away behind the "Advanced scores" tab (2026-10-04).
- Keep the footer link (2026-10-04).
- Show the tab on phones (2026-10-04).
- Hiding "Track progress" on tablets (701 to 860px) is fine (2026-10-04).

## Progress log
- 2026-10-03: Chat renamed. Both repos surveyed. Decisions recorded.
- 2026-10-03: Engine ported. Parity test written and passing (28/28). Mutation check done.
- 2026-10-03: Generator, hub page, 21 score pages, styling and UI built. Nav and footer links added to `index.html` and `anatomy.html`.
- 2026-10-03: Mobile fixes (header, 0 to 10 scale on one row, compact sticky live score). Browser test 69/69.
- 2026-10-03: Committed locally on branch (commit c8dce89). Private preview published: https://claude.ai/artifact/LVbUH6nyz8XrjYhZY51FwJ (links back to the main site do not work inside the preview). Waiting for approval to push.
- 2026-10-03: User decisions: WOMAC held back, SK11/PK7 dedicated engines confirmed, preview approved. WOMAC removed (now 20 pages, 17 on the hub). Parity 28/28, browser 69/69 rerun. Pushed and pull request opened: https://github.com/SportsHealing/MyKneeScore/pull/2
- 2026-10-04: User could not see the section on mykneescore.com because the PR was not merged yet. Merged latest `main` (a `/preview/` refresh, no overlap) into the branch, then merged PR #2 into `main` to put it live. Live check: all 28 site files on mykneescore.com are byte-identical to the tested files.
- 2026-10-04: Branch restarted from `main`. Tab made visible on phones ("Advanced" short label), menu tightened for phones and tablets, pages rebuilt. Scoring files unchanged; browser test 69/69. Committed on branch, not pushed. Preview images sent for approval.
- 2026-10-04: User saw a different font in the preview images. Cause: this sandbox cannot load Google Fonts, so screenshots used a fallback font. No font settings were changed. Previews re-taken with Cormorant Garamond and Hanken Grotesk fed in separately. Tip for future sessions: intercept fonts.googleapis.com and fonts.gstatic.com in Playwright and fetch them with curl, or screenshots will show the wrong font.
- 2026-10-04: User approved the menu change. `main` had moved on (weighted Short Knee Score v2.0, sgit house rules, `llms.txt`, `tools/short-knee-score/STATUS.md`). Merged it into the branch. Conflicts in `index.html` and `anatomy.html` were next-door lines only; kept their `var(--white)` change and added the menu rules after it. The only remaining difference from their `main` is the menu change. Follows the house rules (no colour literals outside `:root`, no em dashes, UK spelling).
- 2026-10-04: Found and fixed a 9px sideways scroll at 701 to 710px; added a 760px rule. Checked 13 widths x 3 pages with real fonts: one line, tab visible, no sideways scroll. Browser test 69/69. Merged to `main` via pull request.
