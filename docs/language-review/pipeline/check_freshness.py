#!/usr/bin/env python3
"""Moved to check_freshness.mjs.

This check has to be runnable at the moment a packet is sent to a reviewer, and whoever is
sending it may not have a Python toolchain — this repo requires Node and nothing else. The
check needs no dependencies and reads no .xlsx, so there was no reason for it to be Python.

    node docs/language-review/pipeline/check_freshness.mjs [--lane es-latam]

Kept as a stub rather than two implementations to drift apart. Safe to `git rm`.
"""
import sys

sys.exit("check_freshness.py has moved.\n"
         "  node docs/language-review/pipeline/check_freshness.mjs [--lane es-latam]\n"
         "See this file's docstring for why. It is safe to `git rm`.")
