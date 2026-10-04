// Exhaustive check of the Short Knee Score against the scoring sheet's arithmetic.
//
// Incident this encodes: the first implementation of the score used decimal
// arithmetic and disagreed with the sheet's rounding on 171,497 answer sets,
// 1.8% of the total. The page now holds weights and answers as whole numbers.
// This check enumerates every possible answer set and proves the agreement.
//
// Source of truth: "New proprietary SH short knee score", tab Entry.
//   weighted sum = SUMPRODUCT(B4:B13, C4:C13), each answer 0 to 10
//   score        = ROUND(weighted sum * 10, 0)
//
// Usage: node tools/short-knee-score/verify-scoring.js
// Exit 0 on agreement, 1 otherwise.

const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "../../index.html"), "utf8");

// Read the live weights out of the page, so this cannot drift from what ships.
const block = html.match(/var weights = \{([\s\S]*?)\};/);
if (!block) { console.error("could not find the weights block in index.html"); process.exit(1); }
const W = {};
block[1].replace(/(q\d+):\s*(\d+)/g, (_, k, v) => { W[k] = +v; });
const keys = Object.keys(W);
const sum = keys.reduce((a, k) => a + W[k], 0);

// Read q1's option values, which every question shares.
const vals = [...html.matchAll(/name="q1"[^>]*value="([\d.]+)"/g)].map(m => +m[1]);

console.log("weights read from index.html:", JSON.stringify(W));
console.log("weights sum to             :", sum, sum === 100 ? "(ok, x100)" : "(EXPECTED 100)");
console.log("option values              :", vals.join(", "));

let bad = 0;
if (keys.length !== 10) { console.error("expected 10 questions, found", keys.length); bad++; }
if (sum !== 100)        { console.error("weights must sum to 100 (x100 of 1.00)"); bad++; }
if (vals.length !== 5)  { console.error("expected 5 options, found", vals.length); bad++; }
if (bad) process.exit(1);

const W100 = keys.map(k => W[k]);
const V2 = vals.map(v => Math.round(v * 2));   // halves: 20, 15, 10, 5, 0

// What the page computes.
const page = o => {
  let t = 0;
  for (let k = 0; k < 10; k++) t += Math.round(vals[o[k]] * 2) * W100[k];
  return Math.floor(t / 20) + ((t % 20) >= 10 ? 1 : 0);
};
// What the sheet computes, in exact integers. ROUND is half away from zero;
// every value here is positive, so that is half up.
const sheet = o => {
  let e = 0;
  for (let k = 0; k < 10; k++) e += V2[o[k]] * W100[k];
  return Math.floor(e / 20) + ((e % 20) >= 10 ? 1 : 0);
};

const total = Math.pow(5, 10);
let mismatches = 0, min = Infinity, max = -Infinity, firstBad = null;
const bands = {};
const bandOf = s => s >= 85 ? "Optimal" : s >= 70 ? "Good" : s >= 60 ? "Fair" : "Pay attention";
const o = new Array(10);

for (let n = 0; n < total; n++) {
  let m = n;
  for (let k = 0; k < 10; k++) { o[k] = m % 5; m = (m - o[k]) / 5; }
  const a = page(o), b = sheet(o);
  if (a !== b && !firstBad) firstBad = { answers: [...o], page: a, sheet: b };
  if (a !== b) mismatches++;
  if (a < min) min = a;
  if (a > max) max = a;
  bands[bandOf(a)] = (bands[bandOf(a)] || 0) + 1;
}

console.log("answer sets tested         :", total.toLocaleString("en-GB"));
console.log("mismatches against sheet   :", mismatches);
console.log("score range                :", min, "to", max);
console.log("band spread                :", JSON.stringify(bands));

if (mismatches) { console.error("FAILED. First mismatch:", JSON.stringify(firstBad)); process.exit(1); }
if (min !== 0 || max !== 100) { console.error("FAILED. Score must span 0 to 100."); process.exit(1); }
console.log("\nPASS: the page agrees with the scoring sheet on every possible answer set.");
