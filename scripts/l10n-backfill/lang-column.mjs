// One-off (v3.4): EXTRACT / INJECT a language column into every `{ en, es, ... }`
// object literal in a source file.
//
// Insertion follows the pattern proven four times in v3.1-v3.3: parse to an AST, find
// each object's LAST existing property, and splice the new property in at that exact
// byte offset — deriving the separator from the gap between the last two properties and
// copying the last property's key quoting and colon spacing. Slots outside the inserted
// text are never re-serialized, so formatting and comments survive untouched.
//
//   node scripts/_lang-column.mjs extract <file> <lang> <out.json>
//   node scripts/_lang-column.mjs inject  <file> <lang> <in.json>
//
// Refuses to inject if the object count in the payload disagrees with what a fresh
// extract finds, or if any target object already carries the language.
import fs from "fs";
import { parse } from "acorn";

const [, , mode, file, lang, jsonPath] = process.argv;
// Optional: restrict to object literals that start AFTER a marker string. A track file
// holds thousands of {en, es, ...} objects in its main BANK, but a new source reads those
// from its side table, not the base bank — only the fono explanations in `extraBank` are
// written into the file itself. Without this the tool would add a redundant (and quickly
// stale) column to every item in the track.
const AFTER = (process.argv.find((a) => a.startsWith("--after=")) || "").split("=")[1] || null;
if (!mode || !file || !lang || !jsonPath) {
  console.error("usage: _lang-column.mjs <extract|inject> <file> <lang> <json>");
  process.exit(2);
}

const raw = fs.readFileSync(file, "utf8");
const crlf = raw.includes("\r\n");
const src = raw.replace(/\r\n/g, "\n");
const ast = parse(src, { ecmaVersion: "latest", sourceType: "module", locations: true });

const keyName = (p) => (p.key.type === "Identifier" ? p.key.name : p.key.value);
let cutoff = null;
if (AFTER) {
  cutoff = src.indexOf(AFTER);
  if (cutoff < 0) { console.error(`BLOCKER: marker ${JSON.stringify(AFTER)} not found in ${file}`); process.exit(1); }
}
const targets = [];
(function visit(n) {
  if (!n || typeof n !== "object") return;
  if (Array.isArray(n)) { for (const c of n) visit(c); return; }
  if (n.type === "ObjectExpression") {
    const props = n.properties.filter((p) => p.type === "Property" && !p.computed);
    const keys = props.map(keyName);
    // An en-bearing translation object: `en` plus at least one other 2-letter language
    // key, and nothing that looks structural.
    const langs = keys.filter((k) => /^[a-z]{2}$/.test(k));
    if (keys.includes("en") && langs.length >= 2 && langs.length === keys.length
        && (cutoff === null || n.start >= cutoff)) {
      targets.push({ node: n, props, keys });
    }
  }
  for (const k of Object.keys(n)) { if (k !== "loc" && k !== "start" && k !== "end") visit(n[k]); }
})(ast);

const pending = targets.filter((t) => !t.keys.includes(lang));

if (mode === "extract") {
  const out = pending.map((t, i) => {
    const o = { i, line: t.node.loc.start.line };
    for (const p of t.props) {
      if (p.value.type === "Literal" && typeof p.value.value === "string") o[keyName(p)] = p.value.value;
      else o[keyName(p)] = `«NON-LITERAL: ${src.slice(p.value.start, p.value.end).slice(0, 160)}»`;
    }
    return o;
  });
  fs.writeFileSync(jsonPath, JSON.stringify(out, null, 1));
  console.log(`${file}: ${targets.length} translation objects, ${pending.length} missing "${lang}" -> ${jsonPath}`);
  process.exit(0);
}

// ---- inject ----
const payload = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
if (payload.length !== pending.length) {
  console.error(`BLOCKER ${file}: payload has ${payload.length} entries, a fresh extract finds ${pending.length} objects missing "${lang}". Refusing.`);
  process.exit(1);
}
const edits = [];
for (let i = 0; i < pending.length; i++) {
  const t = pending[i];
  const val = payload[i][lang];
  if (val == null || typeof val !== "string" || !val.length) {
    console.error(`BLOCKER ${file}: entry ${i} (line ${t.node.loc.start.line}) has no "${lang}" value. Refusing.`);
    process.exit(1);
  }
  const last = t.props[t.props.length - 1];
  const prev = t.props.length > 1 ? t.props[t.props.length - 2] : null;
  // separator = whatever sits between the previous property and the last one
  let sep = ", ";
  if (prev) {
    const gap = src.slice(prev.end, last.start);
    const m = /,(\s*)$/.exec(gap);
    if (m) sep = "," + m[1];
  }
  const lastKeySrc = src.slice(last.key.start, last.key.end);
  const quoted = /^["']/.test(lastKeySrc);
  const q = quoted ? lastKeySrc[0] : "";
  const colon = /:(\s*)/.exec(src.slice(last.key.end, last.value.start));
  const colonSp = colon ? colon[1] : " ";
  // A value that starts with a backtick is injected RAW, as source. Some translation
  // objects live inside an arrow function and hold template literals interpolating the
  // item (`respondPromptNative`); JSON.stringify would turn "${i.text}" into dead text.
  const literal = val.startsWith("`") ? val : JSON.stringify(val);
  const text = `${sep}${q}${lang}${q}:${colonSp}${literal}`;
  edits.push({ at: last.end, text });
}
edits.sort((a, b) => b.at - a.at); // last-to-first so offsets stay valid
let out = src;
for (const e of edits) out = out.slice(0, e.at) + e.text + out.slice(e.at);
if (crlf) out = out.replace(/\n/g, "\r\n");
fs.writeFileSync(file, out);
console.log(`${file}: injected "${lang}" into ${edits.length} objects`);
