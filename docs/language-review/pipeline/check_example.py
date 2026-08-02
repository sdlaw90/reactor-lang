#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_example.py — regression check for ingest.py against the committed fixture.

    python docs/language-review/pipeline/check_example.py

Runs ingest.py over example/<fixture>.xlsx and diffs the result against the committed
example/<fixture>.changeset.md. Exits non-zero on any difference.

The generated-on date line is normalised out, since it changes every run by design.

WHEN THIS FAILS you have changed how a reviewer's answers are read or rendered. That is
sometimes correct — a better grouping, a clearer label. Regenerate the fixture, read the
diff, and commit it deliberately:

    python docs/language-review/pipeline/ingest.py \\
        docs/language-review/pipeline/example/<fixture>.xlsx \\
        --lane es-latam --scope interface \\
        --out docs/language-review/pipeline/example/<fixture>.changeset.md

What it must never fail on is an accident — a column that moved, a verdict word that stopped
matching, a section that silently stopped being written. Those are exactly the failures that
would otherwise surface as a reviewer's corrections quietly going missing.
"""
import re, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
EX = HERE / "example"
DATE = re.compile(r"^_Generated \d{4}-\d{2}-\d{2} by", re.M)


def main():
    fixtures = sorted(EX.glob("*.xlsx"))
    if not fixtures:
        sys.exit(f"no fixture workbook in {EX}")
    failures = 0
    for xlsx in fixtures:
        expected = xlsx.with_suffix("").with_suffix(".changeset.md")
        if not expected.exists():
            expected = EX / (xlsx.stem + ".changeset.md")
        if not expected.exists():
            print(f"FAIL  {xlsx.name}: no committed changeset beside it")
            failures += 1
            continue
        lane, scope = "es-latam", "interface"
        for s in ("interface", "taught", "explanation"):
            if f"-{s}-" in xlsx.name:
                scope = s
        with tempfile.TemporaryDirectory() as td:
            out = Path(td) / "actual.md"
            r = subprocess.run(
                [sys.executable, str(HERE / "ingest.py"), str(xlsx),
                 "--lane", lane, "--scope", scope, "--out", str(out)],
                capture_output=True, text=True)
            if r.returncode != 0:
                print(f"FAIL  {xlsx.name}: ingest.py exited {r.returncode}\n{r.stderr}")
                failures += 1
                continue
            norm = lambda t: DATE.sub("_Generated <date> by", t.replace("\r\n", "\n"))
            a, b = norm(out.read_text(encoding="utf-8")), norm(expected.read_text(encoding="utf-8"))
            if a == b:
                print(f"ok    {xlsx.name} → {expected.name}")
            else:
                import difflib
                print(f"FAIL  {xlsx.name}: changeset differs from the committed fixture")
                for line in list(difflib.unified_diff(
                        b.splitlines(), a.splitlines(),
                        fromfile="committed", tofile="regenerated", lineterm=""))[:60]:
                    print("   " + line)
                failures += 1
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
