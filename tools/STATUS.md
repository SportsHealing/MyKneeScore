# MyKneeScore: site status (master)

Last updated: 2026-10-15

This is the first file to read in any chat about mykneescore.com.
Update it at the end of every piece of work.

## Who can see this file
- **Website visitors: no.** `_config.yml` leaves `tools/` out of the live site.
- **GitHub: yes.** The `SportsHealing/MyKneeScore` repo is public. Anyone who opens the repo on GitHub can read this file.
- So never write keys, passwords, patient data or private business figures here.
- If the team wants it fully private, move it to a private repo (see Open questions).

## Related status docs
| File | Covers |
|---|---|
| `tools/STATUS.md` (this file) | The whole site: goals, open work, decisions, ideas |
| `tools/short-knee-score/STATUS.md` | Home page Short Knee Score in detail |
| `tools/advanced/STATUS.md` | Advanced scores section in detail |
| `tools/EMBED.md` | Every test's share link and iFrame embed link |

## How to continue in a new chat
1. Run `git status && git branch -a && git log --oneline -5`.
2. Read this file, then the two detailed status docs.
3. Branch from `main` as `claude/<name>`. Never edit `main` directly.
4. Run the checks before pushing:
   - `python3 tools/checks/house-style.py`
   - `node tools/short-knee-score/verify-scoring.js`
   - `python3 -m http.server 8765` then `node tools/advanced/e2e.cjs`
5. Show the owner a preview. Merge only after approval.
6. Add a line to the Progress log below.

## Goals (set by the owner, 2026-10-15)
| Measure | Target per month |
|---|---|
| Visits to mykneescore.com | 10,000 |
| Completion rate | 98% of visitors complete the test and get a result or PDF |
| MyKneeScan bookings from this site | 50 |

- None of these can be measured yet. There is no analytics on either site.
- MyKneeScan has no CRM. Patients and bookings live in Semble. Payments in Square.

## Working rules
- Owner and approver for site changes: the requester in chat (sportshealing).
- Clinical wording and scoring: Dr Gupte signs off.
- New scripts, architecture, analytics: Dinis signs off.
- MyKneeScan code: Jose.
- No em dashes. UK spelling. Short sentences.
- Static site. Nothing about patients is stored or sent.

## In progress
| Item | State | Owner |
|---|---|---|
| Audit quick wins (footer links, SEO files, icons, share image, tap targets) | Live since 15 Oct (PR #10) | Done |
| Analytics brief (Plausible, no cookies), plus mailing list as a later decision | Owner forwarding PDF to Dinis | Dinis |
| MyKneeScan referral tracking brief | Owner forwarding PDF to Jose | Jose |
| Copy and wording review | Owner forwarding PDF to Dr Gupte | Dr Gupte |
| Move status docs to a private repo | Owner will create the repo in due course | Owner, then Claude |
| Score dial redesign and anatomy footer link colour | Live since 17 Oct (PR #11) | Done |
| Own link and iFrame embed for every test (`tools/EMBED.md`) | Live since 19 Oct (PR #12) | Done |
| Female Knee Score: FK43 replaced by the 21 question FK21, old link forwards | Live 20 Oct. Owner approved; owner confirmed Dr Gupte signed off | Done |
| Remove "Email me a copy"; compact the Short Knee Score breakdown | Live since 21 Oct (PR #15) | Done |
| Eyebrow label font: owner to choose Jost, Marcellus or Cormorant SC (previews sent 26 Oct). To do. | Paused 31 Oct at owner's request | Owner, then Claude |
| Knee scan note: even border on both sides (screen and PDF, home and Advanced) | Approved 31 Oct. Going live. | Claude |

## Decisions log
- 2026-11-10: Text width rule (owner): running text and bullet lists stay at a readable width (about 46em, roughly 85 characters a line); boxes, figures and one or two line notes (e.g. source lines) use the full content width.
- 2026-10-15: Use kneelens.com in the footer "Our sites" row in place of omkneehealth.com, for now.
- 2026-10-15: Analytics to be cookie free (Plausible proposed). No cookie banner.
- 2026-10-15: `tools/` hidden from the live site.

## Audit backlog (from 2026-10-14 audit)
| # | Item | Needs |
|---|---|---|
| 1 | MyKneeScan next step on results under 60: live 23 Oct with the owner's wording; Dr Gupte signed off | Done |
| 2 | Fix copy left over from v1 (sleep, night pain, "by category") | Dr Gupte |
| 3 | Align Good band advice between bands section and result | Dr Gupte |
| 4 | One time frame: "past four weeks" vs "today" in Q10 | Dr Gupte |
| 5 | Track progress tip should point to the PDF and email link | Owner approval of copy |
| 6 | Cookie free analytics on both sites | Dinis, Jose |
| 7 | Shared design token file | Dinis |
| 8 | "1 questions" grammar on the SANE page (generator copy) | Small fix |
| 9 | Phone menu: menu button with every page, live 7 Nov | Done |
| 10 | Update any FK43 iFrame embeds or links on sister sites to the FK21 links in `tools/EMBED.md` (old links forward, so nothing is broken) | Dinis, Jose |

## Future ideas
- Rebuild "Email me a copy" in a better form (removed 21 Oct as clunky). Rebuilt 7 Nov as a compact "Keep your results" panel; live.
- Create mailing list to email users about new features.
  - Note: the site stores nothing today. A mailing list needs a sign up form and a mailing service. That is a server and data decision for Dinis, with UK GDPR consent wording.
  - 2026-10-15: added to Dinis's brief as a decision for later.

## Open questions
Questions waiting on the owner. Resume any of these when the owner asks. Remove a line once it is answered.
- Owner chose (15 Oct) to move this file to a private repo. Waiting for the repo to be created.
- Phone test (asked 21 Oct): someone to try "Download PDF report" on an iPhone with a test inside a sister site's iFrame. Browsers can limit printing inside frames. Claude cannot test a real phone.
- First sister site (asked 21 Oct): which site embeds a test first? Attach its repo to the chat and Claude can add the iFrame (links in `tools/EMBED.md`).
- Eyebrow label font (asked 26 Oct): owner trying designs. Three options proposed: Jost, Marcellus, Cormorant SC. Waiting for a choice before any change.

## Progress log
- 2026-10-14: Audit delivered in chat.
- 2026-10-15: Quick wins built on `claude/peaceful-babbage-ccebiu`. All checks pass (house style 9/9, scoring, browser 97/97). Owner approved going live. Three briefs produced as PDFs. This master status doc created.
- 2026-10-15: PR #10 merged and live. Checked: robots.txt, sitemap.xml, favicon and share image load; tools/ and CLAUDE.md return 404 on the live site, as intended.
- 2026-10-15: Owner decisions: status doc to go private; mailing list added to Dinis's list; owner forwards the three PDFs.
- 2026-10-15: Score dial (home hero, home result, every Advanced dial) redrawn as an SVG arc: even thickness, rounded ends, solid gold, smooth fill unless reduced motion is set. Old ring was an ellipse, so it was thicker at the top. Unused `--mask-opaque` token removed from both `:root` blocks. Anatomy footer links were dark green on dark green.
- 2026-10-17: Owner approved the dial and chose pale gold for the anatomy footer links, matching every other page. Going live.
- 2026-10-17: PR #11 merged and live.
- 2026-10-19: Every test now has its own link. `#quiz` opens the questionnaire and shows in the address bar while it is open. `?embed=1` shows only the test, for iFrames on sister sites. List of all 23 links in `tools/EMBED.md`. Awaiting approval.
- 2026-10-19: PR #12 merged and live. Checked the live home page, KOOS page and app.js carry the new code.
- 2026-10-20: FK43 replaced by FK21 from the owner's new Word document. `fk43.html` forwards to `fk21.html`. Sitemap, EMBED.md and llms.txt updated. Awaiting approval.
- 2026-10-20: Owner approved FK21 and the name, and confirmed Dr Gupte signed off. Asked for sister-site embeds to be updated (backlog item 10). Going live.
- 2026-10-20: LK32 and FK21 answers now shown worst (0) to best (4), as in the owner's updated documents. Scores unchanged. Owner approved going live and chose to keep LK32 Q6 as "1 day a week".
- 2026-10-21: Owner asked to remove "Email me a copy" from every result (to be rebuilt better later) and to compact the Short Knee Score breakdown for iFrames. Breakdown now two columns with thin bars. Result on a phone 1647px to 1172px tall. "Return to the site" hidden in embed mode. e2e mail check replaced by a check that the email box stays gone. Awaiting approval.
- 2026-10-21: Owner approved going live, including removal on the Advanced scores.
- 2026-10-21: PR #15 merged and live. Checked the live home page and app.js: no email box, new two column breakdown.
- 2026-10-23: Scores under 60 now show "Consider a clinical review that may result in a knee scan." with a mykneescan.com link (utm_campaign=result), on screen and in the PDF. Home Short Knee Score and every Advanced score out of 100 where higher is better. Not Norwich, Tegner or Marx. Awaiting approval and Dr Gupte sign-off.
- 2026-10-23: Owner approved the prompt and confirmed Dr Gupte signed off. Norwich (lower is better) now shows it over 40. Tegner and Marx stay without it. Going live.
- 2026-10-23: "Pay attention" (0 to 59) advice changed to the owner's wording on the result screen, PDF and band guide. Owner approved, including the band guide card, and confirmed Dr Gupte signed off. Going live.
- 2026-10-26: Owner asked for open questions to live in this file so they can be resumed later. Added to Open questions. Three eyebrow label fonts proposed with previews; nothing changed on the site.
- 2026-10-31: Owner paused the font choice (now a to do in In progress). Knee scan note had a 4px gold left edge and a 1px right edge. Now 1px gold all round, on screen and in the PDF, home and Advanced. No other result box had a one sided border. Awaiting approval.
- 2026-10-31: Owner approved the even scan note border going live.
- 2026-11-07: Owner asked for email and PDF on every score. Rebuilt as one compact "Keep your results" panel on every result: name, Download PDF, then email and Send on one line, one short note. Email still opens the patient's own email app (owner's Option A; nothing stored or sent to us). e2e now checks every score offers both (179/179). Awaiting approval.
- 2026-11-07: Owner approved the panel going live and is happy for email to keep opening the patient's own email app (no sending service).
- 2026-11-07: Owner asked for age and sex questions at the end of all six of our own scores (home Short Knee Score, SK11, PK7, KS5, LK32, FK21, FK21 included). "What is your age?" (typed, optional, 1 to 120) and "Are you male or female?" (Male, Female, Prefer not to say). Not scored or numbered; shown on the result, PDF and email. Home: a separate About you step after Q10, so the 10 scored slides and scoring check are unchanged. KS5 gets them via build.mjs. e2e 188/188. Awaiting approval.
- 2026-11-07: Owner made the sex question skippable too (both About you questions now optional, with "Optional. You can skip this question."), confirmed Dr Gupte signed off, and approved going live.
- 2026-11-07: Owner asked for "Your score" and "Track progress" to become separate pages, with "Female Knee Score" in the menu. New self-contained pages `track-progress.html` (four steps of the personal link, reading the trend, the score bands) and `female-knee-score.html` (why it matters, what FK21 asks, who should complete it). Menu on every page now: How it works, Female Knee Score, Track progress, Knee anatomy, Advanced, Start the test. "How it works" hidden at 920px and below so the menu fits; checked 300 to 1400px. Home page sections unchanged. House style checks now cover the two new pages; sitemap and llms.txt updated. e2e 188/188. Female page has clinical claims: awaiting approval and Dr Gupte sign-off.
- 2026-11-07: Owner confirmed Dr Gupte signed off the Female Knee Score page. Added a research section from the owner's systematic review "Sex disparities in return to sport after ACL reconstruction" (25 studies, 7,183 athletes; about 28% lower odds of return to sport within two years; six factors: anatomy, movement control, confidence, hormones, pitches and boots, surgery choices). Phone menu button with every page on all pages. Home "What the number means" and "Track progress" sections removed (owner); they live on track-progress.html. Footer "Score guide" links now point there. Width check 300 to 1400px: no wraps or sideways scroll. e2e 188/188. Owner approved going live.
- 2026-11-08: Female Knee Score page source line now cites the published paper: Elliott DA, Gill SS, Gupte CM, American Journal of Sports Medicine, 2026, doi:10.1177/03635465261448489 (PubMed 42252835). Volume and pages not yet known.
- 2026-11-08: Owner gave the volume and pages; citation now reads 2026;54(12):3070-3080.
- 2026-11-08: Owner reported the top menu wrapping onto two lines on wide screens. Cause: since "Female Knee Score" was added (PR #21), the six links no longer fitted above 1100px and each link wrapped; the earlier width check only tested that links sat in one row. Fix: menu links never wrap; above 1100px link text 16px and gaps 1.4rem. Checked every width 320 to 1920px on six page types: no link wraps. e2e now checks the menu at 1000, 1280, 1440 and 1920px (196/196). Going live.
- 2026-11-09: Owner design changes: home green hero fills the first screen (How it works below the fold; header height measured by script); header spans the full screen on every page (logo and Start the test in the corners); home hero content spans the same edges; logo 1.55rem on every page (anatomy and the two new pages were 1.35rem); Female Knee Score headline without the italic accent; anatomy: clicking the diagram or key only scrolls (no highlight box, no focus box), and the section cards have no hover or highlight effect. Menu checked 320 to 1920px, e2e 196/196. Awaiting approval.
- 2026-11-09: Owner approved going live, chose to keep the diagram hover shading, and asked for the home and Track progress headlines in one font (no italic accent) too.
- 2026-11-09: Anatomy and Advanced hub headlines also in one font (owner). Advanced score page titles keep the italic acronym, e.g. "(KOOS-JR)" (owner).
- 2026-11-10: Owner saw a thin white line under the green home hero. Cause: the header is 70.69px but offsetHeight rounded it to 71, so the hero stopped 0.31px short. Now the exact height is rounded down and re-measured when the header resizes (fonts loading). Checked 9 screen sizes x 4 display scalings: no gap.
- 2026-11-10: Female Knee Score page: the source line and "How FK21 helps" now span the full content width, like the boxes above them (owner).
- 2026-11-13: Owner asked for a Paediatrics tab. New page paediatrics.html (how young knees differ, draft for Dr Gupte; the scores; tracking). Pedi-IKDC moved off the Advanced hub to this page; its address stays advanced/pedi-ikdc.html and now points back to Paediatrics. New Pedi-SKV score (one 0 to 100 question, new percent answer type) built but NOT live: exact question wording from Marot et al. 2021 not yet confirmed (the article sites are blocked from this session). Placeholder text guarded by a new house style check (no TO_CONFIRM on served files), so CI fails until the wording is in. KOOS-Child: coming soon, once licensed (owner); owner sent photos of part of the English form (LK2.1), kept for later. HSS Pedi-FABS: coming soon, once permission is in place. Menu now 7 items; hidden at narrower widths to fit: How it works at 1180px and below, Track progress at 960px, Knee anatomy at 780px; all in the phone menu. Awaiting Pedi-SKV wording, Dr Gupte sign-off and approval.
- 2026-11-13: Owner sent the Pedi-SKV wording from the paper ("How would you rate your knee today as a percentage of normal (0% to 100% scale with 100% being normal)?"), confirmed Dr Gupte signed off the Paediatrics page, agreed the Pedi-SKV licence label "Free", and approved going live.
- 2026-11-13: Paediatrics live (PR #30). Owner asked for a more realistic anatomy diagram, like the ACL knee passport drawings. Redrawn by hand in SVG: femoral condyles and notch, tibial plateau and spines, fibular head behind the tibia, wedge menisci, crossing cruciate bands with fibres, flat MCL and cord-like LCL, soft bone shading and sketch lines. Same eight clickable parts, labels, hover shading and links to each section. Awaiting approval.
- 2026-11-13: Owner asked for the patella over the cruciates, see-through. Clickable patella drawn under the ligaments, a see-through copy on top (clicks pass through), both highlight on hover. Owner approved going live.
- 2026-11-14: Owner wants the Pedi-IKDC and Pedi-SKV to match the originals exactly. Owner sent the Pedi-IKDC paper's online appendices (Kocher et al. 2011, Appendix 1 = the form, Appendix 2 = the 18 scored items). Pedi-IKDC rebuilt word for word from Appendix 1 (13 numbered questions, 11a to 11i, plus who completed it; study-only fields left out). Scored as Appendix 2: 18 items, total out of 88, shown 0 to 100. Questions 4 (moving or bending), 12 (before the injury) and 14 are recorded, not scored. Pedi-SKV: question text already matched the paper; our extra slider labels trimmed to 0% and 100%. Anatomy diagram redesign drafts shown; owner kept the live diagram. NOT live: awaiting Dr Gupte sign-off and owner approval.
- 2026-11-14: Owner asked if question 4 is scored. Owner sent the full Kocher et al. 2011 paper. Its Methods name the 18 domains (activity with pain, pain in the past 4 weeks, severity of pain, swelling, activity with swelling, catching, activity with giving way, highest activity, upstairs, downstairs, kneeling, squatting, sitting, rising, running, jumping, stopping, overall knee function). Stiffness (question 4) is not one, so it stays unscored. The paper gives no separate formula; total = sum / maximum x 100, as in the adult IKDC. Citation updated to the paper's exact title and authors.
- 2026-11-14: Dr Gupte signed off the new Pedi-IKDC and the Pedi-SKV change (owner). Owner approved going live.
- 2026-11-14: Owner asked again to make the anatomy diagram more realistic, faithful to the ACL knee passport drawings, keeping every label and hover. Redrawn in the passport style: white bones, pencil outlines and hatched shading, pale blue menisci, PCL gold and ACL brown as in the passport's cruciate drawing. Ligament positions checked against it: ACL from the inner wall of the lateral condyle down, forwards and inwards to the front of the tibia; PCL behind it from the medial condyle to the back of the tibia. See-through kneecap over the cruciates kept. New shared tokens (white-rgb, pencil, meniscus) added to every page's :root. Key text: bones white, ligaments gold and brown, cartilage blue. NOT live: awaiting owner approval.
- 2026-11-14: Owner: make the MCL anatomically correct and keep the ligaments off the bone. MCL now runs along the outside of the joint from the medial epicondyle, past the joint line, to the inner side of the tibia below it. LCL is a cord from the lateral epicondyle to the fibular head, standing off the joint line. Labels moved outwards to clear them; the meniscus pointer is drawn on top with a dot. NOT live: awaiting owner approval.
