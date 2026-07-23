"use client";

// Tiny animated demo for a tour step — CSS + shapes only, no images or GIFs.
// One per step id; each loops on its own via the .gd-* keyframes in
// styles/globals.css (that's where the animation/layout lives — this file is
// just structure). Renders nothing for an unknown id so the tour degrades to
// its emoji badge.
//
// Icons/controls below mirror the real app: track icons from lib/trackIcons.js,
// the Quick Quiz/Lessons fill-toggle from lib/ModeToggle.js, the Zap combo and
// Round/Theme "catChip" pickers from app/play/[trackId]/page.js.

import Logo from "./Logo";

// --- track icons (same shapes as lib/trackIcons.js) ---
const IconLatam = (
  <svg viewBox="0 0 60 60" width="46" height="46" aria-hidden="true">
    <circle cx="30" cy="30" r="16" fill="#FFB84D" />
    <g stroke="#FFB84D" strokeWidth="4">
      <line x1="30" y1="2" x2="30" y2="10" /><line x1="30" y1="50" x2="30" y2="58" />
      <line x1="2" y1="30" x2="10" y2="30" /><line x1="50" y1="30" x2="58" y2="30" />
      <line x1="10" y1="10" x2="15" y2="15" /><line x1="45" y1="45" x2="50" y2="50" />
      <line x1="10" y1="50" x2="15" y2="45" /><line x1="45" y1="15" x2="50" y2="10" />
    </g>
  </svg>
);
const IconFrance = (
  <svg viewBox="0 0 60 40" width="44" height="29" aria-hidden="true">
    <rect x="0" y="0" width="20" height="40" fill="#0055A4" /><rect x="20" y="0" width="20" height="40" fill="#F1F2F1" /><rect x="40" y="0" width="20" height="40" fill="#EF4135" />
  </svg>
);
const IconJapan = (
  <svg viewBox="0 0 60 40" width="44" height="29" aria-hidden="true">
    <rect x="0" y="0" width="60" height="40" fill="#FFFFFF" /><circle cx="30" cy="20" r="10" fill="#BC002D" />
  </svg>
);
const IconItaly = (
  <svg viewBox="0 0 60 40" width="44" height="29" aria-hidden="true">
    <rect x="0" y="0" width="20" height="40" fill="#009246" /><rect x="20" y="0" width="20" height="40" fill="#F1F2F1" /><rect x="40" y="0" width="20" height="40" fill="#CE2B37" />
  </svg>
);
// lucide "zap" — same icon the round header uses for the combo counter
const Zap = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFB84D" stroke="#FFB84D" strokeWidth="1" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export default function GuideDemo({ id }) {
  const inner = DEMOS[id];
  if (!inner) return null;
  return <div className={`gd-stage gd-${id}`}>{inner}</div>;
}

const DEMOS = {
  // 1 — welcome: bobbing mascot + sparkles
  welcome: (
    <>
      <span className="gd-spark s1">✨</span>
      <span className="gd-spark s2">✨</span>
      <span className="gd-spark s3">⚡</span>
      <span className="gd-mascot" aria-hidden="true"><Logo size={50} /></span>
    </>
  ),

  // 2 — pick a language: real home bubbles (icon watermark), tap glow on one
  pick: (
    <>
      <p className="gd-miniPrompt">Pick your next quick win ⚡</p>
      <div className="gd-grid">
        <div className="gd-bub gd-target">
          <span className="gd-ripple" />
          <div className="gd-bubTxt"><span className="lab">Spanish</span><span className="lvl">Level 2 · Beginner</span></div>
          <span className="gd-wm">{IconLatam}</span>
        </div>
        <div className="gd-bub"><div className="gd-bubTxt"><span className="lab">French</span><span className="lvl">Not started</span></div><span className="gd-wm">{IconFrance}</span></div>
        <div className="gd-bub"><div className="gd-bubTxt"><span className="lab">Japanese</span><span className="lvl">Level 4 · Intermediate</span></div><span className="gd-wm">{IconJapan}</span></div>
        <div className="gd-bub"><div className="gd-bubTxt"><span className="lab">Italian</span><span className="lvl">Not started</span></div><span className="gd-wm">{IconItaly}</span></div>
      </div>
    </>
  ),

  // 3 — find your level: marker slides along the ladder + suggestion pops
  level: (
    <>
      <div className="gd-ladder">
        <span className="gd-node" /><span className="gd-node" /><span className="gd-node" /><span className="gd-node" /><span className="gd-node" />
        <span className="gd-marker" />
      </div>
      <div className="gd-lvlLabels">
        <span>No exp</span><span>Beginner</span><span>Inter.</span><span>Adv.</span><span>Native</span>
      </div>
      <div className="gd-suggest">We suggest: Beginner ✓</div>
    </>
  ),

  // 4 — two ways to practice: real fill-toggle, active segment alternates
  modes: (
    <>
      <div className="gd-toggle">
        <span className="gd-seg gd-seg1">Quick Quiz</span>
        <span className="gd-seg gd-seg2">Lessons</span>
      </div>
      <div className="gd-modeCap">
        <span className="c1">⚡ Timer, combos &amp; streaks</span>
        <span className="c2">🧘 Calm — one topic at a time</span>
      </div>
    </>
  ),

  // 5 — play a round: catTag + Zap combo (x2 -> x3), correct answer pulses
  play: (
    <>
      <div className="gd-tagrow">
        <span className="gd-tag">VOCABULARIO</span>
        <span className="gd-combo">{Zap}<span className="gd-comboNum"><i className="n2">x2</i><i className="n3">x3</i></span></span>
      </div>
      <p className="gd-qtext">“gato” means…</p>
      <div className="gd-opts">
        <div className="gd-opt">dog</div>
        <div className="gd-opt gd-correct">cat</div>
      </div>
    </>
  ),

  // 6 — wrong answers teach you: wrong tap shakes red, Heads up reveals
  heads: (
    <>
      <p className="gd-q">Ayer yo ___ pan. <span style={{ color: "#9B93B8", fontWeight: 400 }}>(comer)</span></p>
      <div className="gd-opts">
        <div className="gd-opt gd-wrong">como</div>
        <div className="gd-opt gd-right">comí</div>
      </div>
      <span className="gd-ptr" aria-hidden="true">👆</span>
      <div className="gd-headsnote">💡 <b>Heads up:</b> “como” is present tense. “Ayer” = yesterday, so you want the preterite: <b>comí</b>.</div>
    </>
  ),

  // 7 — focus by theme: the real Round focus + Theme focus catChip cards
  theme: (
    <>
      <div className="gd-focusCard">
        <div className="gd-focusLabel">Round focus</div>
        <div className="gd-chiprow">
          <span className="gd-catchip mixed">Mixed</span>
          <span className="gd-catchip">Vocab</span>
          <span className="gd-catchip">Verbs</span>
        </div>
      </div>
      <div className="gd-focusCard">
        <div className="gd-focusLabel">Theme focus</div>
        <div className="gd-chiprow">
          <span className="gd-catchip">All</span>
          <span className="gd-catchip">Travel</span>
          <span className="gd-catchip gd-themeSel">Food</span>
          <span className="gd-catchip">Work</span>
        </div>
      </div>
    </>
  ),

  // 8 — learn a new script: characters turn green as you nail them
  script: (
    <div className="gd-chargrid">
      <span className="gd-char d1">あ</span>
      <span className="gd-char d2">ア</span>
      <span className="gd-char d3">한</span>
      <span className="gd-char d4">Я</span>
      <span className="gd-char d5">中</span>
    </div>
  ),

  // 9 — track your progress: XP fills, level ticks 3 -> 4, +1 badge top-right
  progress: (
    <>
      <div className="gd-prow">
        <div className="gd-bubTxt gd-ptxt">
          <span className="gd-plab">Spanish</span>
          <span className="gd-lvlwrap">
            <span className="gd-lvl3">Level 3 · Intermediate</span>
            <span className="gd-lvl4">Level 4 · Intermediate</span>
          </span>
          <span className="gd-xpout"><span className="gd-xpin" /></span>
        </div>
        <span className="gd-wm gd-pwm">{IconLatam}</span>
        <span className="gd-pop">+1 LEVEL ✨</span>
      </div>
      <div className="gd-streak"><span className="gd-flame">🔥</span> 5-day streak</div>
    </>
  ),
};
