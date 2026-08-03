// v3.4 #60 backfill — INJECT. Merges translated explain / wrongNote / distractorNotes
// into the existing per-source side tables, preserving each file's header comment,
// key order and indent. Refuses to write if a filled string still holds an
// unresolved {n} slot.
import fs from "fs";
import path from "path";

const WK = "/root/wk/bf";
const REPO = process.argv[2] || "/root/rl";
const LANGS = process.argv[3] ? [process.argv[3]] : ["pt", "fr"];
const PH = /\{(\d+)\}/g;

const TRACK_FILE = {}; // trackId -> camel base name, derived from the l10n index
{
  const src = fs.readFileSync(path.join(REPO, "data/tracks/l10n/index.js"), "utf8");
  const re = /"([a-z0-9-]+)":\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const im = /import\("\.\/([A-Za-z0-9]+)\.[a-z]{2}"\)/.exec(m[2]);
    if (im) TRACK_FILE[m[1]] = im[1];
  }
}

const fill = (frame, slots) =>
  frame.replace(PH, (s, n) => (slots[+n - 1] !== undefined ? slots[+n - 1] : s));

let blockers = 0;
const report = [];
for (const lang of LANGS) {
  const rows = JSON.parse(fs.readFileSync(`${WK}/rows.${lang}.json`, "utf8"));
  const frames = JSON.parse(fs.readFileSync(`${WK}/frames.${lang}.json`, "utf8"));
  const need = JSON.parse(fs.readFileSync(`${WK}/need.${lang}.json`, "utf8"));
  const trans = fs.existsSync(`${WK}/trans.${lang}.json`)
    ? JSON.parse(fs.readFileSync(`${WK}/trans.${lang}.json`, "utf8"))
    : {};

  const add = {}; // "trackId itemId" -> { explain, wrongNote, distractorNotes }
  let done = 0;
  let miss = 0;
  for (const r of rows) {
    const t = trans[r.fid];
    if (t == null) {
      miss++;
      continue;
    }
    const text = fill(t, r.s);
    if (/\{\d+\}/.test(text)) {
      blockers++;
      if (blockers < 10) console.log(`BLOCKER unresolved slot ${lang} ${r.t} ${r.i} ${r.f}: ${text}`);
      continue;
    }
    const k = `${r.t} ${r.i}`;
    add[k] ||= {};
    if (r.f === "distractorNotes") {
      const key = r.lo != null ? r.lo : r.k;
      (add[k].distractorNotes ||= {})[key] = text;
    } else add[k][r.f] = text;
    done++;
  }
  report.push(
    `${lang}: ${done} rows filled, ${miss} rows still untranslated ` +
      `(${frames.length} frames, ${Object.keys(trans).length} translated)`,
  );

  for (const [tid, items] of Object.entries(need)) {
    if (!items.length) continue;
    const base = TRACK_FILE[tid];
    if (!base) {
      console.log(`BLOCKER no side-table file registered for ${tid}`);
      blockers++;
      continue;
    }
    const file = path.join(REPO, `data/tracks/l10n/${base}.${lang}.js`);
    if (!fs.existsSync(file)) {
      console.log(`BLOCKER missing ${file}`);
      blockers++;
      continue;
    }
    const raw = fs.readFileSync(file, "utf8");
    const crlf = raw.includes("\r\n");
    const src = raw.replace(/\r\n/g, "\n");
    const marker = src.indexOf("export default");
    const header = src.slice(0, marker);
    const body = src.slice(marker + "export default".length).replace(/;\s*$/, "");
    const obj = (0, eval)("(" + body + ")");
    const indentM = /\n(\s+)"/.exec(src.slice(marker));
    const ind = indentM ? indentM[1] : "  ";

    let touched = 0;
    for (const it of items) {
      const a = add[`${tid} ${it.id}`];
      if (!a) continue;
      const cur = obj[it.id] ? { ...obj[it.id] } : {};
      if (a.explain) cur.explain = a.explain;
      if (a.wrongNote) cur.wrongNote = a.wrongNote;
      if (a.distractorNotes) {
        // The engine REPLACES the base distractorNotes map when the side table
        // supplies one, so emit the complete localized key set: a translated note
        // where we have one, the base English note where we do not.
        const full = { ...(cur.distractorNotes || {}) };
        const dn = it.need.distractorNotes || {};
        for (const [baseOpt, v] of Object.entries(dn)) {
          const key = v.locOpt != null ? v.locOpt : baseOpt;
          if (a.distractorNotes[key] != null) full[key] = a.distractorNotes[key];
          else if (full[key] == null && v.en) full[key] = { en: v.en };
        }
        cur.distractorNotes = full;
      }
      obj[it.id] = cur;
      touched++;
    }
    if (!touched) continue;
    const lines = Object.entries(obj).map(
      ([k, v]) => `${ind}${JSON.stringify(k)}: ${JSON.stringify(v)},`,
    );
    const note = header.includes("v3.4 (#60) BACKFILL")
      ? ""
      : "// v3.4 (#60) BACKFILL 2026-08-03 — `explain`, `wrongNote` and `distractorNotes`\n" +
        "// added for this source. Until v3.4 the side tables had no channel for them, so all\n" +
        "// three surfaces fell back to English on every item reused from another source.\n" +
        "// Machine-assembled: the target-language spans inside each note are carried through\n" +
        "// VERBATIM from the Spanish surface and only the framing text is translated, so a\n" +
        "// verb form or quoted term can never be paraphrased. AI-authored framing —\n" +
        "// FLAG FOR #41 native review.\n";
    let out = header + note + "export default {\n" + lines.join("\n") + "\n};\n";
    if (crlf) out = out.replace(/\n/g, "\r\n");
    fs.writeFileSync(file, out);
    report.push(`  ${lang} ${tid} -> ${base}.${lang}.js  (${touched} items)`);
  }
}
console.log(report.join("\n"));
console.log(blockers ? `\n${blockers} BLOCKER(S)` : "\n0 blockers");
process.exit(blockers ? 1 : 0);
