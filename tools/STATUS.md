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
| 9 | Phone menu: consider a menu button so every page is in the header | Owner |
| 10 | Update any FK43 iFrame embeds or links on sister sites to the FK21 links in `tools/EMBED.md` (old links forward, so nothing is broken) | Dinis, Jose |

## Future ideas
- Rebuild "Email me a copy" in a better form (removed 21 Oct as clunky).
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
