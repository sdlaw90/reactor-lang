#!/usr/bin/env node
/**
 * check_freshness.mjs — would regenerating a packet change it?
 *
 *   node docs/language-review/pipeline/check_freshness.mjs [--lane es-latam]
 *
 * Run this before sending a packet to a reviewer. Exit 1 means regenerate first.
 *
 * NODE, NOT PYTHON, ON PURPOSE
 * This is the one check that has to be runnable at the moment a packet goes out, and whoever
 * is sending it may not have a Python toolchain — this repo requires Node and nothing else.
 * It needs no dependencies and touches no .xlsx: everything it compares lives in the
 * committed `<stem>.sources.json` and in what `extract.mjs` produces now.
 *
 * (`check_example.py` stays Python because it has to read a workbook, which means openpyxl.
 * That one only matters when someone edits `ingest.py` — pipeline work, not send-day work.)
 *
 * WHAT IT COMPARES, AND WHY NOT THE OBVIOUS THING
 * Each packet ships a `contentHash` over the rows it contains. This re-runs the extractor and
 * compares. It deliberately does NOT judge staleness from the source files' size, mtime or
 * hash, because those move for reasons that cannot affect a given packet: the v3.3 beat added
 * a French column to `playStrings.js` and `helpAboutContent.js`, growing them ~47 KB and
 * changing not one Spanish string. A source-keyed check calls that stale. It isn't — and a
 * check that fires on non-events gets ignored, which is worse than no check at all.
 *
 * Source hashes stay in `builtFrom` as provenance, and are printed as context when the
 * content really did change.
 */
import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const REPO = path.resolve(ROOT, "..", "..");

const argv = process.argv.slice(2);
const laneArg = argv.includes("--lane") ? argv[argv.indexOf("--lane") + 1] : null;

const lanes = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, d.name, "STATUS.md")))
  .map((d) => d.name)
  .filter((n) => !laneArg || n === laneArg)
  .sort();

if (!lanes.length) {
  console.error(`no lane found${laneArg ? ` named ${laneArg}` : ""} under ${ROOT}`);
  process.exit(1);
}

let fresh = 0, stale = 0, unknown = 0;

for (const lane of lanes) {
  const tdir = path.join(ROOT, lane, "template");
  const packets = fs.existsSync(tdir)
    ? fs.readdirSync(tdir).filter((f) => f.endsWith(".xlsx")).sort() : [];
  if (!packets.length) { console.log(`${lane}: no packets built`); continue; }

  for (const xlsx of packets) {
    const stem = xlsx.replace(/\.xlsx$/, "");
    const fpPath = path.join(tdir, `${stem}.sources.json`);
    if (!fs.existsSync(fpPath)) {
      console.log(`?      ${xlsx}\n         no fingerprint beside it — built before this check ` +
                  `existed. Regenerate; there is no way to verify it otherwise.`);
      unknown++; continue;
    }
    const fp = JSON.parse(fs.readFileSync(fpPath, "utf8"));
    if (!fp.contentHash) {
      console.log(`?      ${xlsx}\n         fingerprint has no contentHash — predates the ` +
                  `content-based check. Regenerate.`);
      unknown++; continue;
    }

    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "slr-"));
    const out = path.join(tmp, "now.json");
    let now;
    try {
      execFileSync(process.execPath,
        [path.join(HERE, "extract.mjs"), "--lane", lane, "--scope", fp.scope || "interface",
         "--out", out],
        { cwd: REPO, stdio: "pipe" });
      now = JSON.parse(fs.readFileSync(out, "utf8"));
    } catch (e) {
      console.log(`ERROR  ${xlsx}: extract.mjs failed\n${String(e.stderr || e.message).slice(-800)}`);
      unknown++; continue;
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }

    if (now.contentHash === fp.contentHash) {
      console.log(`ok     ${xlsx}  (regenerating would change nothing)`);
      fresh++; continue;
    }

    console.log(`STALE  ${xlsx}  — the content this packet covers has changed`);
    const built = fp.builtFrom || {}, nowFp = now.sourceFingerprint || {};
    for (const rel of Object.keys(built).sort()) {
      const cur = nowFp[rel];
      if (!cur) console.log(`         ${rel}: no longer read by the extractor`);
      else if (cur.sha256 !== built[rel].sha256) {
        const d = cur.bytes - built[rel].bytes;
        console.log(`         ${rel}: changed (${d ? `${d > 0 ? "+" : ""}${d.toLocaleString()} bytes` : "same size"})`);
      }
    }
    for (const rel of Object.keys(nowFp).sort())
      if (!(rel in built)) console.log(`         ${rel}: NEW source, not in the built packet`);
    stale++;
  }
}

console.log(`\n${fresh} fresh · ${stale} stale · ${unknown} unverifiable`);
if (stale || unknown) {
  console.log("\nRegenerate before sending:");
  console.log("  node docs/language-review/pipeline/extract.mjs --lane <lane> --scope <scope>");
  console.log("  python docs/language-review/pipeline/build_workbook.py --lane <lane> --scope <scope>");
}
process.exit(stale || unknown ? 1 : 0);
