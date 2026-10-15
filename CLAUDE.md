# mykneescore.com

Read `tools/STATUS.md` first. It is the master status doc for this site and
links to the detailed ones. Update its Progress log when you finish work.

- The live site deploys from `main`. Work on a `claude/<name>` branch.
- Run `python3 tools/checks/house-style.py` and
  `node tools/short-knee-score/verify-scoring.js` before every push.
- No em dashes. UK spelling. Short sentences. Questions go at the end.
- Do not change scoring, `advanced/assets/engine.js` or clinical wording
  without sign off from Dr Gupte.
- This repo is public. Never commit keys, passwords or patient data.
