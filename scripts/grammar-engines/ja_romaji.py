# -*- coding: utf-8 -*-
# Wapuro Hepburn (macron-free) kana -> romaji. Track standard: arigatou (not arigatō).
# Handles gojuon, dakuten/handakuten, small ゃゅょ/ぇ, っ gemination, ん, を->wo, ー.
KANA = {
 'あ':'a','い':'i','う':'u','え':'e','お':'o',
 'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
 'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
 'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
 'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
 'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
 'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
 'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
 'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
 'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
 'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
 'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
 'や':'ya','ゆ':'yu','よ':'yo',
 'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
 'わ':'wa','ゐ':'wi','ゑ':'we','を':'wo','ん':'n',
 'ゔ':'vu',
}
YOON = {
 'きゃ':'kya','きゅ':'kyu','きょ':'kyo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
 'しゃ':'sha','しゅ':'shu','しょ':'sho','じゃ':'ja','じゅ':'ju','じょ':'jo',
 'ちゃ':'cha','ちゅ':'chu','ちょ':'cho','ぢゃ':'ja','ぢゅ':'ju','ぢょ':'jo',
 'にゃ':'nya','にゅ':'nyu','にょ':'nyo','ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo',
 'びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
 'みゃ':'mya','みゅ':'myu','みょ':'myo','りゃ':'rya','りゅ':'ryu','りょ':'ryo',
}
SMALLV = {'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o'}
def is_kana(s):
    for ch in s:
        if ch in ('ー','っ','ゃ','ゅ','ょ','ぁ','ぃ','ぅ','ぇ','ぉ'): continue
        if ch in KANA: continue
        return False
    return True
def romaji(s):
    out=[]; i=0; n=len(s)
    while i<n:
        ch=s[i]
        two=s[i:i+2]
        if ch=='っ':  # gemination: double next consonant
            # find next romaji's first consonant
            j=i+1
            if j<n:
                nxt2=s[j:j+2]
                r = YOON.get(nxt2) or KANA.get(s[j])
                if r:
                    c=r[0]
                    out.append('t' if c=='c' else c)  # っち -> tchi
            i+=1; continue
        if two in YOON:
            out.append(YOON[two]); i+=2; continue
        if ch=='ー':
            if out:
                out[-1]=out[-1]+out[-1][-1]  # lengthen last vowel
            i+=1; continue
        if ch in KANA:
            out.append(KANA[ch]); i+=1; continue
        if ch in SMALLV:
            out.append(SMALLV[ch]); i+=1; continue
        out.append('?'+ch+'?'); i+=1
    # 'n' before b/p/m -> keep n (wapuro), before vowel keep n. wapuro uses 'n' uniformly. ok.
    return ''.join(out)
