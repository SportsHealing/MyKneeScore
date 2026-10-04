# MyKneeScore "Short Knee Score": project status

Last updated: 2026-10-04 (chat "MyKneeScore handover documentation")

Sibling status doc: `tools/advanced/STATUS.md` covers the Advanced scores
section, which is a separate workstream.

## Current state
- Built on branch `claude/dreamy-ritchie-1zg79x`.
- Preview approved by the user and live at https://mykneescore.com/preview/
- The home page questionnaire has been replaced with the ten question weighted
  Short Knee Score.
- The live site deploys from `main`. A pushed branch is not live until merged.

## Goal
Replace the previous twelve question score with the weighted Short Knee Score
defined in the spreadsheet "New proprietary SH short knee score", supplied by
the user on 2026-09-22.

## Source of truth
The spreadsheet, tab `Entry`:
- Question texts: `A4:A13`
- Weights: `C4:C13`, which sum to exactly 1.00
- Weighted sum: `=SUMPRODUCT(B4:B13,C4:C13)`, each answer 0 to 10
- Score: `=ROUND(B15*10,0)`, giving 0 to 100
- Activity level answer options: cell `D12`
- Bands, tab `Scoring`: 85+ Excellent/Optimal, 70+ Good, 60+ Fair, else Pay attention

## The weights, as shipped
| # | Question | Weight |
|---|---|---|
| 1 | Comfort during usual activities | 0.15 |
| 2 | Freedom from stiffness after rest | 0.07 |
| 3 | Freedom from swelling after activity | 0.07 |
| 4 | Stability, no giving way | 0.10 |
| 5 | Walking long distances | 0.10 |
| 6 | One flight of stairs | 0.08 |
| 7 | Kneeling or squatting | 0.08 |
| 8 | Freedom from catching, locking or freezing | 0.10 |
| 9 | Activity level | 0.12 |
| 10 | Overall function today | 0.13 |

## User decisions (binding)
- Use the spreadsheet weightings exactly. Do not substitute judgement for them.
- Use the five activity level options from `D12` verbatim, in the given order.
- Nothing goes live without a preview first. (Preview approved 2026-09-28.)
- Four sgit house rule changes approved and applied 2026-10-03.
- The reworded disclaimer is approved by the user, pending Dr Gupte.

## Decisions taken by Claude, not in the spreadsheet
These were needed to turn a clinician's scoring sheet into a public web form.
Each is a candidate for Dr Gupte to confirm or overturn.
- **Five answer options per question**, scored 10, 7.5, 5, 2.5 and 0. The
  spreadsheet expects a clinician to type a number 0 to 10. Five options
  matches the five given for activity level in `D12`.
- **Answer wording for nine of the ten questions.** The spreadsheet gives
  options for activity level only. The other nine sets were drafted from the
  wording already on the site. Not clinically authored.
- **Question 8 phrasing.** The sheet reads "How free is your knee from
  mechanical symptoms (sharp catching pain or locking/unable to extend/Knee
  freezes up)?". The page reads "How free is your knee from sharp catching
  pain, locking or freezing up?" with "Mechanical symptoms" as the topic
  label. Same meaning, patient readable.
- **Band advice copy.** The sheet gives band names only.
- **Result breakdown.** Ten bars, one per question. The previous seven
  category grouping no longer maps.

## Verification
- Scoring checked against the spreadsheet arithmetic across **all 9,765,625
  possible answer sets. Zero mismatches.**
- A defect was found and fixed during that check: the first implementation
  used decimal arithmetic and disagreed with the sheet's rounding on 171,497
  answer sets, 1.8% of the total. Answers and weights are now held as whole
  numbers, so the result cannot drift from the sheet.
- Browser test at 1280x900 and 390x844: all ten questions, auto advance, Back,
  Forward, answer retention, Escape, Exit, result screen, ten breakdown rows,
  no horizontal overflow. All pass.
- Worked examples: all best 100, all second 75, all middle 50, all worst 0.
- The colour token refactor was proved **pixel identical** across eight full
  page screenshots before being accepted.

## Questions for Dr Gupte
Open. None of these block the deploy, but all affect what users are told.

1. **Activity level scores zero at the bottom.** With five options mapped 10 to
   0, "I can walk but not run" scores 0 and wipes all 12 weighting points for
   activity. There is no option below it. Is that intended, or should the
   floor be above zero?
2. **"Pay attention" spans 0 to 59.** Across all possible answer sets, 78.8%
   land in that band. A person answering the middle option to every question
   scores 50 and lands there. A mild knee and a near surgical knee therefore
   receive identical advice. The previous site split this into Moderate, see a
   physiotherapist, and Severe, see a specialist. Should the band be split?
3. **Answer wording for nine of the ten questions needs clinical sign off.**
   See "Decisions taken by Claude" above.
4. **Sleep and painkiller use have been dropped.** Both were questions on the
   previous version. Neither appears in the spreadsheet. Intended?
5. **Red flags are copy, not logic.** The site states that sudden injury,
   locking, giving way or a hot swollen knee warrant prompt review whatever
   the score. Nothing in the questionnaire enforces that. A user with red flag
   symptoms and a high score is told their knee is coping well. Should the
   result screen override on a red flag answer?
6. **Disclaimer wording.** Now reads "It uses the Short Knee Score, a weighted
   scoring developed in house. It has not been clinically validated." The
   previous wording claimed the score was based on validated knee outcome
   measures, which the spreadsheet title does not support. Approve?
7. **Relationship to the Advanced section.** The site now also publishes
   validated instruments at /advanced/. Should a Short Knee Score result point
   the user at a relevant validated score?

## Open questions for the user
- Should `/preview/` be removed once the home page carries the same content?
- Should the scoring weights be considered confidential? They run in the
  browser, so they are readable in page source by anyone. There is no way to
  hide them on a static site.

## Known gaps
- **No score history.** Nothing is saved between visits. Users are told to
  note their score. Browser storage is the planned next step.
- **Scores are not comparable across versions.** A 72 from the previous twelve
  question test is not the same measurement as a 72 from this one. The footer
  version stamp is the only signal, and users are not told directly.
- **No backup doctrine.** The previous live site is preserved on the branch
  `backup-live-pre-score-rework`. Pushing git tags is refused by this
  session's credentials, so there is no tag. No written recovery procedure
  exists.
- **The design tokens now exist in four copies** across `index.html`,
  `anatomy.html`, `preview/index.html` and `advanced/assets/advanced.css`, and
  the fourth has already diverged in naming. An architecture brief proposing a
  single shared file was written for Dinis on 2026-10-03.
- **This file is public**, at github.com and at
  https://mykneescore.com/tools/short-knee-score/STATUS.md, as is the Advanced
  section's status doc. Excluding `tools/` from the published site would need
  a `_config.yml`.

## Progress log
- 2026-09-22: Repo verified against the handover document. Spreadsheet read.
  Score rebuilt with the ten weighted questions. Exhaustive check against the
  sheet, rounding defect found and fixed. Private preview published.
- 2026-09-28: Backup branch `backup-live-pre-score-rework` created at the
  previous live commit, because tag pushes are refused. New version published
  to `/preview/` on the live domain with `noindex`, home page untouched. The
  merge to `main` was blocked by a deploy permission.
- 2026-10-03: nfrs.sgit.ai and coding.sgit.ai read. Four house rule changes
  applied: 69 colour literals moved into tokens and proved pixel identical,
  dated version stamp added to both footers, `llms.txt` added, and the
  "validated knee outcome measures" claim corrected. Architecture brief on
  shared tokens written for Dinis.
- 2026-10-04: `/preview/` refreshed. `main` found to have moved: the Advanced
  scores section had shipped from another chat. Merged `main` into this
  branch, keeping both the Advanced nav and footer links and this branch's
  version stamp. `llms.txt` updated to describe the Advanced section. No
  Advanced file was touched; all verified byte identical to `main`.
