#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_freshness.py — is a built packet still true to the repo?

    python docs/language-review/pipeline/check_freshness.py [--lane es-latam]

A packet is a snapshot of a moving `dev`. The version in its filename is not enough: a whole
release beat can land inside one version, and a packet built before it will quietly omit
every string that beat added. A reviewer who works through a stale packet has spent their
pass on the wrong file — the most expensive failure in this whole lane, because reviewer
attention is the scarce resource, not build time.

So every packet ships a `<stem>.sources.json` fingerprinting the repo files it was built
from. This compares that against the repo now.

Run it before sending anything. Exit code 1 means regenerate first.
"""
import argparse, json, sys
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
        packets = sorted((lane / "template").glob("*.xlsx")) if (lane / "template").exists() else []
        if not packets:
            print(f"{lane.name}: no packets built")
            continue
        for xlsx in packets:
            fp_path = xlsx.with_suffix("").with_suffix(".sources.json")
            if not fp_path.exists():
                fp_path = xlsx.parent / (xlsx.stem + ".sources.json")
            if not fp_path.exists():
                print(f"?  {xlsx.name}\n     no fingerprint beside it — built before this check "
                      f"existed. Regenerate before sending; there is no way to verify it otherwise.")
                unknown += 1
                continue
            fp = json.loads(fp_path.read_text(encoding="utf-8"))
            drift = []
            for rel, rec in sorted(fp.get("builtFrom", {}).items()):
                f = REPO / rel
                if not f.exists():
                    drift.append(f"{rel}: GONE from the repo")
                    continue
                st = f.stat()
                if st.st_size != rec["bytes"]:
                    drift.append(f"{rel}: {rec['bytes']:,} → {st.st_size:,} bytes")
                elif round(st.st_mtime * 1000) != rec["mtimeMs"]:
                    drift.append(f"{rel}: same size, newer mtime — content may have changed")
            if drift:
                print(f"STALE  {xlsx.name}")
                for d in drift:
                    print(f"     {d}")
                stale += 1
            else:
                print(f"ok     {xlsx.name}  ({len(fp.get('builtFrom', {}))} sources unchanged)")
                fresh += 1

    print(f"\n{fresh} fresh · {stale} stale · {unknown} unverifiable")
    if stale or unknown:
        print("\nRegenerate a stale packet before sending it:")
        print("  node docs/language-review/pipeline/extract.mjs --lane <lane> --scope <scope>")
        print("  python docs/language-review/pipeline/build_workbook.py --lane <lane> --scope <scope>")
    sys.exit(1 if (stale or unknown) else 0)


if __name__ == "__main__":
    main()
