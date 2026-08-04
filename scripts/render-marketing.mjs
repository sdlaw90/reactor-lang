#!/usr/bin/env node
// Render the marketing art from its committed HTML sources.
//
//   npm run art:render              — the forest cover only
//   npm run art:render 3.5.0        — the cover + that release's square
//
// The DESIGN is still manual — copy, flags, which acorn turns gold. The RENDER is not, and
// it used to be: every release re-derived an ad-hoc Playwright invocation, which is how
// v3.4's cover ended up regenerated in a sandbox rather than by anything repeatable.
//
// Fonts are vendored under sources/fonts/, so this needs no network.
//
// ⚠️ Rendering is not checking. `release:preflight` can tell you the files EXIST and that the
// right acorn is gold; neither it nor this script can tell you the art is correct. v3.4's
// course-count badge landed on top of a decorative ✨ and "13" rendered as "1✦3" while the
// element measured exactly 1080×1080. LOOK AT THE PNG.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const version = process.argv.slice(2).find((a) => /^\d+\.\d+\.\d+$/.test(a));

const JOBS = [
  {
    what: "forest cover",
    src: "docs/marketing/sources/forest-cover.html",
    sel: "#banner", w: 1640, h: 856,
    out: "docs/marketing/covers/forest-cover-1640x856.png",
  },
];
if (version) {
  JOBS.push({
    what: `v${version} release square`,
    src: `docs/marketing/sources/v${version}-release-square.html`,
    sel: ".card", w: 1080, h: 1080,
    out: `docs/marketing/social/v${version}-release-square.png`,
  });
}

let chromium;
try { ({ chromium } = require("playwright")); }
catch { console.error("✖ playwright not installed — run `npm ci` first."); process.exit(2); }

/**
 * Launch, tolerating the browser-build mismatch a cloud sandbox has.
 * The repo pins a Playwright whose expected Chromium build may not be present; falling back
 * to whatever build IS on disk beats `playwright install` (which the sandbox can't do).
 */
async function launch() {
  try { return await chromium.launch(); } catch (e) {
    const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
    let found = null;
    try {
      for (const d of fs.readdirSync(base)) {
        const p = path.join(base, d, "chrome-linux", "chrome");
        if (fs.existsSync(p)) { found = p; break; }
      }
    } catch { /* fall through */ }
    if (!found) {
      console.error("✖ could not launch Chromium: " + e.message.split("\n")[0]);
      process.exit(2);
    }
    console.log(`  (using ${found})`);
    return await chromium.launch({ executablePath: found });
  }
}

const browser = await launch();
let bad = 0;
for (const j of JOBS) {
  if (!fs.existsSync(path.join(ROOT, j.src))) {
    console.error(`✖ ${j.what}: missing source ${j.src}`);
    bad++;
    continue;
  }
  const page = await browser.newPage({ viewport: { width: j.w + 120, height: j.h + 120 }, deviceScaleFactor: 1 });
  await page.goto("file://" + path.join(ROOT, j.src), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const el = await page.$(j.sel);
  if (!el) { console.error(`✖ ${j.what}: selector ${j.sel} not found in ${j.src}`); bad++; await page.close(); continue; }
  const box = await el.boundingBox();
  const sized = Math.round(box.width) === j.w && Math.round(box.height) === j.h;
  await el.screenshot({ path: path.join(ROOT, j.out) });
  await page.close();
  console.log(`${sized ? "✓" : "⚠"} ${j.what} → ${j.out}  (${Math.round(box.width)}×${Math.round(box.height)}${sized ? "" : `, expected ${j.w}×${j.h}`})`);
  if (!sized) bad++;
}
await browser.close();

console.log(
  bad
    ? `\n${bad} problem(s) — art NOT ready.`
    : "\n✓ rendered. Now OPEN THE PNGs and look at them — size is not correctness.",
);
process.exit(bad ? 1 : 0);
