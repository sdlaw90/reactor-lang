// Runs automatically before every build (see package.json). Keeps
// public/version.json in sync with CURRENT_VERSION in lib/version.js — this
// is what the client polls to detect a newer deployment while the tab is
// still open (see lib/VersionWatcher.js).

const fs = require("fs");
const path = require("path");

const versionFilePath = path.join(__dirname, "..", "lib", "version.js");
const content = fs.readFileSync(versionFilePath, "utf8");
const match = content.match(/CURRENT_VERSION\s*=\s*"([^"]+)"/);

if (!match) {
  console.error("generate-version-json: could not find CURRENT_VERSION in lib/version.js");
  process.exit(1);
}

const version = match[1];
const outPath = path.join(__dirname, "..", "public", "version.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ version }, null, 2) + "\n");

console.log(`generate-version-json: wrote public/version.json (v${version})`);
