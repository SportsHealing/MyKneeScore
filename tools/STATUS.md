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
| Audit quick wins (footer links, SEO files, icons, share image, tap targets) | Approved. Going live via pull request. | Claude |
| Analytics brief (Plausible, no cookies) | PDF sent to owner for Dinis | Dinis |
| MyKneeScan referral tracking brief | PDF sent to owner for Jose | Jose |
| Copy and wording review | PDF sent to owner for Dr Gupte | Dr Gupte |

## Decisions log
- 2026-10-15: Use kneelens.com in the footer "Our sites" row in place of omkneehealth.com, for now.
- 2026-10-15: Analytics to be cookie free (Plausible proposed). No cookie banner.
- 2026-10-15: `tools/` hidden from the live site.

## Audit backlog (from 2026-10-14 audit)
| # | Item | Needs |
|---|---|---|
| 1 | MyKneeScan next step on Fair and Pay attention results | Dr Gupte wording |
| 2 | Fix copy left over from v1 (sleep, night pain, "by category") | Dr Gupte |
| 3 | Align Good band advice between bands section and result | Dr Gupte |
| 4 | One time frame: "past four weeks" vs "today" in Q10 | Dr Gupte |
| 5 | Track progress tip should point to the PDF and email link | Owner approval of copy |
| 6 | Cookie free analytics on both sites | Dinis, Jose |
| 7 | Shared design token file | Dinis |
| 8 | "1 questions" grammar on the SANE page (generator copy) | Small fix |
| 9 | Phone menu: consider a menu button so every page is in the header | Owner |

## Future ideas
- Create mailing list to email users about new features.
  - Note: the site stores nothing today. A mailing list needs a sign up form and a mailing service. That is a server and data decision for Dinis, with UK GDPR consent wording.

## Open questions
- Should this file move to a private repo so it is hidden on GitHub too?

## Progress log
- 2026-10-14: Audit delivered in chat.
- 2026-10-15: Quick wins built on `claude/peaceful-babbage-ccebiu`. All checks pass (house style 9/9, scoring, browser 97/97). Owner approved going live. Three briefs produced as PDFs. This master status doc created.
