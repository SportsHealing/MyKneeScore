# CLAUDE.md

Rules for any AI assistant working on mykneescore.com. Read before changing code.

## What this site is
- Static HTML on GitHub Pages. No backend, no accounts, no database.
- Users answer questions about their knee. That is health data under UK GDPR.
- The site promises that answers never leave the browser. Keep that promise.

## Security rules
1. Never send answers, scores or any user input off the device. No fetch, no
   beacons, no analytics, no form submission. CSP has `connect-src 'none'` and
   `form-action 'none'`; do not loosen them.
2. Never load anything from a third party: no CDN scripts, Google Fonts,
   analytics, embeds or tracking pixels. Self host it under `fonts/` or
   `advanced/assets/`. `tools/checks/house-style.py` check 10 enforces this.
3. Never store answers or scores in localStorage, sessionStorage, IndexedDB,
   cookies or the URL. Add score history only after a privacy review.
4. Every page carries the CSP meta tag. If you edit an inline `<script>`,
   update its `sha256-` hash in that page's CSP. Run the house style check; it
   prints the new hash. Never add `'unsafe-inline'` or `'unsafe-eval'` to
   `script-src`.
5. Build HTML with `textContent` or `createElement`. If `innerHTML` is
   unavoidable, pass every non-constant value through `esc()`.
6. No secrets in this repo. It is public. No API keys, tokens or private URLs,
   and no patient or personal data, in code, notes or commit messages.
7. Internal files (notes, tools, tests) go under `tools/` or in a file listed
   in `_config.yml` `exclude`. Anything else is published to the live site.
8. External links use `rel="noopener"` with `target="_blank"`. Pages keep
   `<meta name="referrer" content="no-referrer">` so the condition a page is
   about is not leaked to the site a user clicks through to.
9. In CI, pin actions to a commit SHA and npm packages to an exact version.
   Never `@latest`. Keep `permissions: contents: read`.
10. Before pushing, run `python3 tools/checks/house-style.py`. Record security
    changes in `tools/security/STATUS.md`.
