#!/usr/bin/env python3
"""House style checks for mykneescore.com.

Every check below encodes a rule that was broken at least once in this repo.
That is deliberate: a guard grown from an incident is worth more than a guard
grown from a checklist. The incident is named in each check.

No dependencies. Run from the repo root:  python3 tools/checks/house-style.py
Exit code 0 if everything passes, 1 otherwise.
"""
import os, re, sys

PAGES = ["index.html", "anatomy.html"]
TEXT_EXT = (".html", ".txt", ".md", ".css", ".js", ".mjs", ".cjs", ".yml", ".sh")
SKIP_DIRS = {".git", "node_modules", ".github"}

failures = []
checks_run = 0

def check(name, incident):
    global checks_run
    checks_run += 1
    print("  %-46s %s" % (name, incident))

def fail(name, detail):
    failures.append("%s: %s" % (name, detail))

def text_files():
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for f in files:
            if f.endswith(TEXT_EXT):
                yield os.path.join(root, f)

def read(p):
    with open(p, encoding="utf-8", errors="replace") as fh:
        return fh.read()

def outside_root(src):
    """Everything except the :root token block."""
    m = re.search(r':root\s*\{.*?\n\s*\}', src, re.S)
    return (src[:m.start()] + src[m.end():]) if m else src

print("House style checks\n")

# 1. The client's firmest copy rule. An em dash is treated as a defect.
check("no em dashes", "incident: house rule, 'no signs of AI generation'")
for p in text_files():
    n = read(p).count("—")
    if n:
        fail("no em dashes", "%s has %d" % (p, n))

# 2. coding.sgit.ai calls this its highest value CSS rule.
check("no colour literals outside :root", "incident: 69 literals found 2026-10-03")
for p in PAGES:
    hits = re.findall(r'#[0-9a-fA-F]{3,8}\b|rgba?\([0-9][^)]*\)', outside_root(read(p)))
    if hits:
        fail("no colour literals outside :root", "%s has %d: %s" % (p, len(hits), sorted(set(hits))[:5]))

# 3. The tokens are copied by hand into every page. Nothing stops them drifting.
check(":root identical across pages", "incident: handover flags hand-copied tokens")
blocks = {}
for p in PAGES:
    m = re.search(r':root\s*\{.*?\n\s*\}', read(p), re.S)
    if not m:
        fail(":root identical across pages", "%s has no :root block" % p)
    else:
        blocks.setdefault(m.group(0), []).append(p)
if len(blocks) > 1:
    fail(":root identical across pages", "%d different blocks: %s" % (len(blocks), list(blocks.values())))

# 4. Browsers do not substitute var() in SVG presentation attributes. Silent breakage.
check("no var() in SVG presentation attrs", "incident: stroke=var(--green-ink), 2026-10-03")
for p in PAGES:
    hits = re.findall(r'(?:fill|stroke|stop-color)="var\([^"]*\)"', read(p))
    if hits:
        fail("no var() in SVG presentation attrs", "%s: %s" % (p, hits))

# 5. coding.sgit.ai: semantic elements, never <div onclick>.
check("no inline event handlers", "incident: coding.sgit.ai rule")
for p in PAGES:
    hits = re.findall(r'\son[a-z]+\s*=\s*"', read(p))
    if hits:
        fail("no inline event handlers", "%s has %d" % (p, len(hits)))

# 6. coding.sgit.ai's second highest value rule.
check("interactive elements are named", "incident: coding.sgit.ai rule")
for p in PAGES:
    s = read(p)
    attrs = re.findall(r'<button\b([^>]*)>', s)
    bodies = re.findall(r'<button\b[^>]*>(.*?)</button>', s, re.S)
    for a, b in zip(attrs, bodies):
        if not re.sub(r'<[^>]+>', '', b).strip() and "aria-label" not in a:
            fail("interactive elements are named", "%s: unnamed <button%s>" % (p, a[:40]))

# 7. The old 12 question score and the new 10 question score are not comparable.
check("question count matches the copy", "incident: 12 -> 10 rework, 2026-09-22")
s = read("index.html")
slides = len(re.findall(r'class="q-slide["\s]', s))
if slides != 10:
    fail("question count matches the copy", "found %d q-slide elements, expected 10" % slides)
meta = re.search(r'Question 1 of (\d+)', s)
if meta and int(meta.group(1)) != slides:
    fail("question count matches the copy", "progress meta says %s, markup has %d" % (meta.group(1), slides))
for word in ("Twelve questions", "twelve questions"):
    if word in s:
        fail("question count matches the copy", "stale copy: '%s'" % word)

# 8. Nav drift between pages was a named hazard in the handover.
check("nav matches across pages", "incident: handover, 'check every page's nav'")
navs = {}
for p in PAGES:
    links = re.findall(r'<li><a[^>]*href="([^"]+)"[^>]*>([^<]*)</a></li>', read(p))
    navs[p] = [t.strip() for _, t in links]
if len(set(tuple(v) for v in navs.values())) > 1:
    fail("nav matches across pages", str(navs))

print()
if failures:
    print("FAILED (%d of %d checks):" % (len(failures), checks_run))
    for f in failures:
        print("  x " + f)
    sys.exit(1)
print("All %d checks passed." % checks_run)
