// Prune LOCAL tts-output orphans.
//
// The local mirror of sweep-tts.mjs (which cleans the Supabase bucket). After a
// track goes "voice-keyed", the old plain-schema clips ({hash}.mp3) linger in
// tts-output/<track.id>/ and get re-uploaded on every generate-tts --upload
// (the uploader pushes every .mp3 in the folder). This removes those stale
// local files so uploads stay lean.
//
// SAFE BY DESIGN: it uses each folder's OWN manifest.json as the source of
// truth and deletes only .mp3 files the manifest doesn't claim. That makes it
// schema-agnostic — a plain-keyed track's legit {hash}.mp3 clips ARE in its
// manifest, so they're kept; only genuine orphans go. manifest.json and any
// non-.mp3 file are never touched. Folders without a manifest are skipped
// (we can't know what's authoritative there).
//
// Dry-run by default (reports only). Pass --delete to actually remove. Pass
// --track <name|id> to scope to one track; omit to scan every folder.
//
//   node scripts/prune-local-tts.mjs                  # report, all tracks
//   node scripts/prune-local-tts.mjs --delete         # delete, all tracks
//   node scripts/prune-local-tts.mjs --track esForEn  # report, one track

import { existsSync, readFileSync, readdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "tts-output");

const args = process.argv.slice(2);
const DELETE = args.includes("--delete");
const ti = args.indexOf("--track");
const TRACK = ti !== -1 ? args[ti + 1] : null;

// esForEn's folder id (es-latam-for-en) isn't the kebab of its name — mirror
// sweep-tts.mjs's alias map. esSpainForEn is kebab-clean (es-spain-for-en), so
// it needs no alias and can't collide here.
const TRACK_ID_ALIASES = { esForEn: "es-latam-for-en" };
function resolveFolder(name) {
  const tryDir = (n) => (n && existsSync(path.join(OUT, n, "manifest.json")) ? n : null);
  return (
    tryDir(name) ||
    tryDir(TRACK_ID_ALIASES[name]) ||
    tryDir(name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()) ||
    null
  );
}

if (!existsSync(OUT)) {
  console.log(`No tts-output/ folder — nothing to prune.`);
  process.exit(0);
}

let folders;
if (TRACK) {
  const f = resolveFolder(TRACK);
  if (!f) {
    console.error(`No tts-output folder with a manifest.json for "${TRACK}".`);
    process.exit(1);
  }
  folders = [f];
} else {
  folders = readdirSync(OUT).filter((n) => {
    const p = path.join(OUT, n);
    return statSync(p).isDirectory() && existsSync(path.join(p, "manifest.json"));
  });
}

if (!folders.length) {
  console.log("No track folders with a manifest.json under tts-output/.");
  process.exit(0);
}

console.log(`${DELETE ? "DELETING" : "DRY RUN"} — ${folders.length} folder(s): ${folders.join(", ")}`);

let totalOrphans = 0;
let totalDeleted = 0;
for (const folder of folders) {
  const dir = path.join(OUT, folder);
  const manifest = JSON.parse(readFileSync(path.join(dir, "manifest.json"), "utf8"));
  const expected = new Set(
    Object.entries(manifest.clips || {}).map(([k, c]) => (c && c.f) || `${k}.mp3`)
  );
  const mp3s = readdirSync(dir).filter((f) => f.endsWith(".mp3"));
  const orphans = mp3s.filter((f) => !expected.has(f));
  console.log(`\n${folder}: ${mp3s.length} local .mp3, ${expected.size} in manifest → ${orphans.length} orphan(s)`);
  orphans.slice(0, 10).forEach((f) => console.log(`  ${f}`));
  if (orphans.length > 10) console.log(`  ... and ${orphans.length - 10} more`);
  totalOrphans += orphans.length;
  if (DELETE) {
    for (const f of orphans) {
      unlinkSync(path.join(dir, f));
      totalDeleted++;
    }
    if (orphans.length) console.log(`  ✓ deleted ${orphans.length}`);
  }
}

console.log(`\n${DELETE ? `Deleted ${totalDeleted}` : `Found ${totalOrphans}`} orphan(s) across ${folders.length} folder(s).`);
if (!DELETE && totalOrphans) console.log("Dry run — re-run with --delete to remove them. Afterwards, generate-tts --upload will only push current clips.");
