import { writeFileSync, mkdirSync } from "node:fs";

// One-star alien tourist review of Earth for make.fun's
// "One Star, Five Stars for the Food": rain, paid water and an hour-long
// noodle queue as the grievance, then the turn — the noodles were worth
// an invasion. One sentence, no dash, every word earning its place.
const REVIEW =
  "One star: this planet rained on me, charged me for water, then made me queue an hour for noodles, and I would endure all of it again tomorrow because those noodles were worth the invasion.";

// The gate only accepts UTF-8 text of 1 to 200 characters that is not
// whitespace-only, so verify the review meets the gate before writing it.
const GATE_MIN = 1;
const GATE_MAX = 200;
const chars = [...REVIEW].length;
if (chars < GATE_MIN || chars > GATE_MAX || REVIEW.trim().length === 0) {
  throw new Error(`review is ${chars} characters, outside the 1-200 gate`);
}
if (/\s{2,}/.test(REVIEW) || REVIEW !== REVIEW.trim()) {
  throw new Error("review must not contain doubled or stray whitespace");
}

// The brief demands exactly one sentence: a second sentence, a fragment
// or a slogan loses to any true one-sentence review, so count the
// sentence-ending marks and refuse anything but one. An em dash would
// also break the clean read-aloud rhythm the judge weighs, so refuse
// that too, and check the one-star complaint and the food compliment
// are both in the line.
const terminators = (REVIEW.match(/[.!?]/g) ?? []).length;
if (terminators !== 1 || !REVIEW.endsWith(".")) {
  throw new Error(`review has ${terminators} sentence terminators, must be exactly one sentence`);
}
if (REVIEW.includes("\u2014") || REVIEW.includes("\u2013")) {
  throw new Error("review must not contain a dash");
}
if (!/one star/i.test(REVIEW) || !/noodles/i.test(REVIEW)) {
  throw new Error("review must carry both the one-star complaint and the food compliment");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, REVIEW, "utf8");
