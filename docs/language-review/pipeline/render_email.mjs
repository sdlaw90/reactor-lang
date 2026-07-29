#!/usr/bin/env node
/**
 * render_email.mjs — render the covering email that goes out WITH a lane's review packets.
 *
 *     node docs/language-review/pipeline/render_email.mjs --lane es-latam
 *     node docs/language-review/pipeline/render_email.mjs --lane fr-fr --name Camille --out email.md
 *
 * WHY THIS IS NODE AND NOT PYTHON
 * This runs on the maintainer's machine at the moment a packet goes out, and that machine has
 * no Python. Same reasoning as check_freshness.mjs: a step that lands on the sender rather than
 * the build environment gets written against the toolchain the sender actually has. Anything
 * that reads or writes an .xlsx stays in Python, where openpyxl lives; this reads only JSON.
 *
 * WHY THE EMAIL COPY LIVES IN i18n/<lane>.json
 * It is reviewer-facing text, so it belongs beside every other reviewer-facing word rather than
 * in a separate document that drifts. It is also the one artifact that has to be in the
 * reviewer's language: mailing a native speaker instructions in a language you are hiring them
 * for fluency in is the same failure build_workbook.py hard-stops on.
 *
 * WHY ROW COUNTS COME FROM sources.json
 * The email states the size of the ask. If that number were typed by hand it would drift from
 * the workbook the moment a packet is regenerated, and the reviewer would plan against a number
 * that is not what they received. build_workbook.py records rowCounts/rowTotal per packet; this
 * reads them back. A scope with no built packet renders as the lane's "notBuilt" placeholder
 * and is reported on stderr, so an unbuilt scope is visible rather than silently absent.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REVIEW_ROOT = dirname(HERE);

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")
    ? process.argv[i + 1]
    : fallback;
}

const lane = arg("lane", "es-latam");
const outPath = arg("out");

// Spanish, Portuguese, German and Italian group thousands with a dot; French uses a narrow
// no-break space. Mirrors _thousands() in build_workbook.py — keep the two in step.
const groupThousands = (n) => {
  const sep = ["es", "pt", "de", "it"].includes(String(lane).split("-")[0]) ? "." : " ";
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
};

const i18nPath = join(HERE, "i18n", `${lane}.json`);
if (!existsSync(i18nPath)) {
  console.error(
    `no reviewer-facing copy at ${i18nPath}.\n` +
      `Write it before sending a ${lane} packet — see i18n/es-latam.json for the shape.\n` +
      `Rendering this email in another language would hand a native reviewer a covering\n` +
      `note they cannot read, so this is a hard stop.`
  );
  process.exit(1);
}

const T = JSON.parse(readFileSync(i18nPath, "utf8"));
const E = T.dispatchEmail;
if (!E) {
  console.error(`${i18nPath} has no "dispatchEmail" block — add one (see i18n/es-latam.json).`);
  process.exit(1);
}

// ---------------------------------------------------------------- built packets
// One sources.json per built scope. Filename is <lane>-<scope>-review-v<version>.sources.json,
// but the scope and version are read from inside the file rather than parsed off the name.
const templateDir = join(REVIEW_ROOT, lane, "template");
const built = {};
if (existsSync(templateDir)) {
  for (const f of readdirSync(templateDir).filter((f) => f.endsWith(".sources.json"))) {
    const s = JSON.parse(readFileSync(join(templateDir, f), "utf8"));
    built[s.scope] = { ...s, file: f.replace(/\.sources\.json$/, ".xlsx") };
  }
}

const versions = [...new Set(Object.values(built).map((b) => b.version))];
if (versions.length > 1) {
  console.error(
    `! ${lane} packets are built from different versions: ${versions.join(", ")}.\n` +
      `  Send a matched set, or regenerate the stragglers — a reviewer cannot tell which\n` +
      `  workbook is current from the inside.`
  );
}
const version = versions[0] || "?";

const name = arg("name", E.namePlaceholder || "[name]");
const sender = arg("sender", E.senderDefault || "");
const fill = (s) =>
  String(s).replace(/\{version\}/g, version).replace(/\{name\}/g, name).replace(/\{sender\}/g, sender);

// ---------------------------------------------------------------- render
const out = [];
out.push(`**Subject:** ${fill(E.subject)}`, "");
out.push(fill(E.greeting), "");
for (const p of E.opening || []) out.push(fill(p), "");

out.push(`| ${E.tableHeaders.join(" | ")} |`);
out.push(`|${E.tableHeaders.map(() => "---").join("|")}|`);

const missing = [];
(E.scopeOrder || []).forEach((scope, i) => {
  const copy = (E.scopeCopy || {})[scope] || {};
  const b = built[scope];
  if (!b) missing.push(scope);
  // "not built at all" and "built before rowCounts existed" are different problems and must
  // not read the same: telling the sender a packet sitting on disk is "to be built" sends
  // them chasing a file they already have.
  const rows =
    b == null ? E.notBuilt || "—" : b.rowTotal != null ? groupThousands(b.rowTotal) : E.notCounted || "—";
  const file = b ? `\`${b.file}\`` : E.notBuilt || "—";
  out.push(`| ${i + 1} | ${file} | ${copy.what || ""} | ${rows} | ${copy.hours || "—"} |`);
});
out.push("");

if (E.weightNote) out.push(fill(E.weightNote), "");
if (E.orderHeading) out.push(`**${fill(E.orderHeading)}**`, "");
if (E.orderIntro) out.push(fill(E.orderIntro), "");
(E.orderReasons || []).forEach((r, i) => out.push(`${i + 1}. ${fill(r)}`));
if ((E.orderReasons || []).length) out.push("");
for (const n of E.laneNotes || []) out.push(`- ${fill(n)}`);
if ((E.laneNotes || []).length) out.push("");
for (const p of E.closing || []) out.push(fill(p), "");
if (E.signoff) out.push(fill(E.signoff));

const text = out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";

if (outPath) {
  writeFileSync(outPath, text, "utf8");
  console.error(`wrote ${outPath}`);
} else {
  process.stdout.write(text);
}

// Warnings go to stderr so piping stdout to a file still gives a clean email.
if (missing.length) {
  console.error(
    `\n! ${lane}: no built packet for ${missing.join(", ")} — shown as "${E.notBuilt}".\n` +
      `  Build them (extract.mjs then build_workbook.py) before sending, or cut those rows.`
  );
}
for (const [scope, b] of Object.entries(built)) {
  if (b.rowTotal == null) {
    console.error(
      `! ${lane}/${scope}: packet predates rowCounts in sources.json, so the email cannot\n` +
        `  state its size. Regenerate that packet with build_workbook.py.`
    );
  }
}
console.error(
  `\nBefore sending, confirm the packets are still fresh:\n` +
    `  node docs/language-review/pipeline/check_freshness.mjs --lane ${lane}`
);
