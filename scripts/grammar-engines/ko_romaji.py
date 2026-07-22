# -*- coding: utf-8 -*-
# Revised Romanization for SquirreLingo ko track. Base: korean-romanizer (liaison,
# coda neutralization, tensing) + a nasalization post-processor for the p/k/t + n/m
# assimilation the base lib omits (합니다 hapnida -> hamnida). Verified against a
# battery of known-correct track romanizations before use.
import re
from korean_romanizer.romanizer import Romanizer
def _nasalize(r):
    # apply within contiguous letter runs (not across spaces)
    def fix(run):
        run = re.sub(r'p(?=[nm])', 'm', run)   # ㅂ + ㄴ/ㅁ -> m
        run = re.sub(r'k(?=[nm])', 'ng', run)  # ㄱ + ㄴ/ㅁ -> ng
        run = re.sub(r't(?=[nm])', 'n', run)   # ㄷ/ㅅ/ㅈ + ㄴ/ㅁ -> n
        run = run.replace('lr','ll').replace('nr','ll').replace('rn','ll')  # ㄹㄹ/ㄴㄹ/ㄹㄴ -> ll
        return run
    return ' '.join(fix(w) for w in r.split(' '))
def rr(hangul):
    return _nasalize(Romanizer(hangul).romanize())
