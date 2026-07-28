#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_freshness.py — would regenerating this packet change it?

    python docs/language-review/pipeline/check_freshness.py [--lane es-latam]

Run before sending a packet to a reviewer. Exit 1 means regenerate first.

A packet is a snapshot of a moving `dev`, and the version in its filename is not enough — a
whole release beat can land inside one version. A reviewer who works through a stale packet
has spent their entire pass on the wrong file, which is the most expensive failure this lane
has: reviewer attention is the scarce resource, not build time.

WHAT IT COMPARES, AND WHY NOT THE OBVIOUS THING
Each packet ships a `contentHash` over the rows it contains. This re-runs the extractor and
compares. It deliberately does NOT decide staleness from the source files' size, mtime, or
hash, because those move for reasons that cannot affect a given packet: the v3.3 beat added a
French column to `playStrings.js` and `helpAboutContent.js`, growing them ~47 KB and changing
not one Spanish string. A source-based check calls that stale. It isn't — and a check that
fires on non-events gets ignored, which is worse than no check at all.

Source hashes are still recorded in `builtFrom` as provenance, and reported here as context
when the content really did change.
"""
import argparse, hashlib, json, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
REPO = ROOT.parent.parent


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lane", default=None, help="check one lane (default: all)")
    args = ap.parse_args()

    lanes = [d for d in sorted(ROOT.iterdir())
             if d.is_dir() and (d / "STATUS.md").exists()
             and (args.lane is None or d.name == args.lane)]
    if not lanes:
        sys.exit(f"no lane found{' named ' + args.lane if args.lane else ''} under {ROOT}")

    stale = fresh = unknown = 0
    for lane in lanes:
        tdir = lane / "template"
        packets = sorted(tdir.glob("*.xlsx")) if tdir.exists() else []
        if not packets:
            print(f"{lane.name}: no packets built")
            continue
        for xlsx in packets:
            fp_path = tdir / (xlsx.stem + ".sources.json")
            if not fp_path.exists():
                print(f"?      {xlsx.name}\n         no fingerprint beside it — built before this "
                      f"check existed. Regenerate; there is no way to verify it otherwise.")
                unknown += 1
                continue
            fp = json.loads(fp_path.read_text(encoding="utf-8"))
            scope = fp.get("scope", "interface")
            if not fp.get("contentHash"):
                print(f"?      {xlsx.name}\n         fingerprint has no contentHash — predates the "
                      f"content-based check. Regenerate.")
                unknown += 1
                continue
            with tempfile.TemporaryDirectory() as td:
                out = Path(td) / "now.json"
                r = subprocess.run(
                    ["node", str(HERE / "extract.mjs"),
                     "--lane", lane.name, "--scope", scope, "--out", str(out)],
                    capture_output=True, text=True, cwd=str(REPO))
                if r.returncode != 0:
                    print(f"ERROR  {xlsx.name}: extract.mjs exited {r.returncode}\n{r.stderr[-800:]}")
                    unknown += 1
                    continue
                now = json.loads(out.read_text(encoding="utf-8"))
            if now.get("contentHash") == fp["contentHash"]:
                print(f"ok     {xlsx.name}  (regenerating would change nothing)")
                fresh += 1
                continue

            print(f"STALE  {xlsx.name}  — the content this packet covers has changed")
            for rel, rec in sorted(fp.get("builtFrom", {}).items()):
                cur = now.get("sourceFingerprint", {}).get(rel)
                if cur is None:
                    print(f"         {rel}: no longer read by the extractor")
                elif cur.get("sha256") != rec.get("sha256"):
                    d = cur["bytes"] - rec["bytes"]
                    print(f"         {rel}: changed ({d:+,} bytes)" if d
                          else f"         {rel}: changed (same size)")
            for rel in sorted(set(now.get("sourceFingerprint", {})) - set(fp.get("builtFrom", {}))):
                print(f"         {rel}: NEW source, not in the built packet")
            stale += 1

    print(f"\n{fresh} fresh · {stale} stale · {unknown} unverifiable")
    if stale or unknown:
        print("\nRegenerate before sending:")
        print("  node docs/language-review/pipeline/extract.mjs --lane <lane> --scope <scope>")
        print("  python docs/language-review/pipeline/build_workbook.py --lane <lane> --scope <scope>")
    sys.exit(1 if (stale or unknown) else 0)


if __name__ == "__main__":
    main()
