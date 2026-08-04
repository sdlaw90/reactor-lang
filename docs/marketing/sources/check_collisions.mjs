#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// forest-cover geometry gate.
//
// Replaces the `check_collisions.js` the cover guide referenced, which is not in
// this repo and whose source could not be recovered. Rebuilt from scratch
// 2026-08-04 — see claude/squirrelingo_forest_cover_collision_model.md.
//
//   node docs/marketing/sources/check_collisions.mjs
//   npm run art:check
//
// Exit 0 when the cover is geometrically sound, 1 otherwise. Writes nothing.
//
// WHY IT MODELS MORE THAN CANOPIES. The old model checked canopy-vs-canopy only,
// which let four classes of defect through, all of which shipped at least once:
// a canopy sitting on another tree's TRUNK; a nameplate landing on someone
// else's foliage; a tree planted in the PATH; and a canopy tolerance loose
// enough that three trees could overlap and still pass.
//
// THE RULE THAT MATTERS MOST: saplings are modelled FULL-GROWN. A sapling
// graduates in place, so a layout that only works while a family is small is a
// layout that breaks on the release that grows it.
// ─────────────────────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "forest-cover.html");
const src = fs.readFileSync(SRC, "utf8").replace(/\r\n/g, "\n");

// ---- pull the authored data back out of the page ---------------------------
// Every caller treats a parse failure as a FAILURE, never as "nothing to check".
function grab(re, what) {
  const m = src.match(re);
  if (!m) fail(`could not parse ${what} out of forest-cover.html`);
  return m[1];
}
function fail(msg) { console.error(`\n✗ ${msg}\n`); process.exit(1); }
const evalArray = (literal, what) => {
  try { return Function(`"use strict";return (${literal});`)(); }
  catch (e) { fail(`${what} did not evaluate: ${e.message}`); }
};

const FAMS = evalArray("[" + grab(/const\s+FAMS\s*=\s*\[([\s\S]*?)\n\];/, "FAMS") + "]", "FAMS");
const ROUTES = evalArray(grab(/const\s+ROUTES\s*=\s*(\[[\s\S]*?\]);/, "ROUTES"), "ROUTES");
const CLEARING = evalArray(grab(/const\s+CLEARING\s*=\s*(\{[^}]*\});/, "CLEARING"), "CLEARING");
const HILL_D = grab(/const\s+HILL\s*=\s*"([^"]+)"/, "the HILL path");
const MASTER = (() => {
  const m = src.match(/items\.push\(\{kind:"master",x:(\d+),y:(\d+)\}\)/);
  if (!m) fail("could not find the Master Tree placement");
  const g = src.match(/const trunkH=(\d+),topW=(\d+),botW=(\d+),cy=gy-trunkH,W=(\d+),H=(\d+)/);
  if (!g) fail("could not read the Master Tree geometry");
  return { x: +m[1], y: +m[2], trunkH: +g[1], botW: +g[3], W: +g[4], H: +g[5] };
})();
const FAUNA = [...src.matchAll(/items\.push\((\{"kind"[^)]*\})\);/g)]
  .map((m) => evalArray(m[1], "a fauna item"));
if (!FAMS.length) fail("FAMS parsed but is empty");
if (!FAUNA.length) fail("no fauna items found — the checked FAUNA block is missing");

// ---- geometry, mirroring the drawing code ----------------------------------
const LOBES = [[-0.78,-0.08,0.5],[-0.4,-0.34,0.6],[0.08,-0.32,0.64],[0.52,-0.2,0.56],[0.82,0.06,0.46],
  [-0.9,0.2,0.42],[-0.5,0.36,0.56],[0.02,0.44,0.54],[0.5,0.36,0.54],[0.85,0.34,0.42],
  [-0.22,0.64,0.5],[0.32,0.62,0.48],[0.05,0.12,0.72]];
function crownBox(cx, cyc, w, h) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const L of LOBES) {
    const px = cx + L[0]*w*0.5, py = cyc - L[1]*h*0.5, r = L[2]*w*0.44, ry = r*0.94;
    x0 = Math.min(x0, px-r); x1 = Math.max(x1, px+r+5);       // +5/+7 = the drop shadow
    y0 = Math.min(y0, py-ry); y1 = Math.max(y1, py+ry+7);
  }
  return { x0, x1, y0, y1 };
}
const armCx = (f, a) => (a.role === "top" ? f.x + 26*f.s : f.x + a.dx*f.s);

function canopies(f) {
  if (f.arms) return f.arms.map((a) => crownBox(armCx(f,a), f.y - a.dy*f.s, a.cw*f.s, a.ch*f.s));
  const s = f.s, hm = f.hm || 1, cy = f.y - 120*s*hm, w = 166*s*hm, h = 146*s*hm;
  return [crownBox(f.x, cy - h*0.28, w, h)];
}
// A trunk is a SOLID. One canopy sitting over another tree's trunk is a
// collision even though neither canopy touches the other.
function trunk(f) {
  if (f.arms) {
    const top = f.arms.find((a) => a.role === "top") || f.arms[0];
    const trunkH = top.dy*f.s, cy = f.y - trunkH;
    const botW = 30*f.s, topW = 11*f.s, bendL = -34*f.s, bendT = 26*f.s;
    let x0 = Infinity, x1 = -Infinity;
    for (let i = 0; i <= 20; i++) {
      const t = i/20, u = 1-t;
      const cxx = u*u*f.x + 2*u*t*(f.x+bendL) + t*t*(f.x+bendT);
      const w = botW + (topW-botW)*Math.pow(t, 0.8);
      x0 = Math.min(x0, cxx-w); x1 = Math.max(x1, cxx+w);
    }
    return { x0: x0-6, x1: x1+6, y0: cy, y1: f.y + 8*f.s };
  }
  const botW = 21*f.s, cy = f.y - 120*f.s*(f.hm || 1);
  return { x0: f.x-botW-6, x1: f.x+botW+6, y0: cy, y1: f.y + 8*f.s };
}
// Root flare — two interlocking flares read as one confused stump.
function roots(f) {
  const botW = (f.arms ? 30 : 21)*f.s, reach = botW + 34*f.s;
  return { x0: f.x-reach, x1: f.x+reach, y0: f.y - 10*f.s, y1: f.y + 14*f.s };
}
function plates(f) {
  const out = [];
  const bs = Math.max(f.s, 0.66), bfs = Math.max(13.5*bs, 12);
  const bw = f.fam.length*(bfs*0.6) + 20, bh = bfs*1.75, by = f.y + 18*f.s;
  out.push({ name: f.fam, x0: f.x-bw/2, x1: f.x+bw/2, y0: by-bh/2, y1: by+bh/2 });
  for (const a of f.arms || []) {
    const ps = f.s*0.66, fs = Math.max(13.5*ps, 11.5);
    const pw = a.name.length*(fs*0.6) + 15, ph = fs*1.7;
    const cw = a.cw*f.s, ch = a.ch*f.s;
    const cx = armCx(f,a), y = f.y - a.dy*f.s + 0.17*ch + 0.248*cw - 4*f.s;
    out.push({ name: a.name, x0: cx-pw/2, x1: cx+pw/2, y0: y-ph/2, y1: y+ph/2 });
  }
  return out;
}
const solids = (f) => ({ f, canopies: canopies(f), trunk: trunk(f), roots: roots(f), plates: plates(f) });

// ---- fixed furniture -------------------------------------------------------
const TEXT = { x0: 40, x1: 480, y0: 95, y1: 335 };      // brand + headline + sub + pill
const LEGEND = { x0: 1120, x1: 1616, y0: 0, y1: 46 };
const CROP = { top: 97, bottom: 759 };                   // FB desktop shows only this band
const CANVAS = { x0: 6, x1: 1634 };
const MASTER_CANOPY = crownBox(MASTER.x, MASTER.y - MASTER.trunkH - MASTER.H*0.2, MASTER.W, MASTER.H);
const MASTER_TRUNK = { x0: MASTER.x-MASTER.botW-30, x1: MASTER.x+MASTER.botW+30,
  y0: MASTER.y-MASTER.trunkH, y1: MASTER.y+12 };
const MASTER_PLATE = (() => {
  const fs = Math.max(13.5*1.08, 12), w = "Mastery".length*(fs*0.6) + 20;
  return { x0: MASTER.x-w/2, x1: MASTER.x+w/2, y0: MASTER.y+24-fs*1.75/2, y1: MASTER.y+24+fs*1.75/2 };
})();

// ---- the hill silhouette (two cubics out of the HILL path) -----------------
const HILL = (() => {
  const n = HILL_D.match(/-?\d+(?:\.\d+)?/g).map(Number);
  const B = (a,b,c,d,t) => { const u = 1-t; return u*u*u*a + 3*u*u*t*b + 3*u*t*t*c + t*t*t*d; };
  const pts = [];
  for (let i = 0; i <= 200; i++) { const t = i/200; pts.push([B(n[0],n[2],n[4],n[6],t), B(n[1],n[3],n[5],n[7],t)]); }
  for (let i = 0; i <= 200; i++) { const t = i/200; pts.push([B(n[6],n[8],n[10],n[12],t), B(n[7],n[9],n[11],n[13],t)]); }
  return pts;
})();
function hillTop(x) {
  let best = 400, bd = Infinity;
  for (const [hx, hy] of HILL) { const d = Math.abs(hx-x); if (d < bd) { bd = d; best = hy; } }
  return best;
}

// ---- the routes + the summit clearing --------------------------------------
function catmull(pts, seg) {
  const out = [];
  for (let i = 0; i < pts.length-1; i++) {
    const p0 = pts[i-1] || pts[i], p1 = pts[i], p2 = pts[i+1], p3 = pts[i+2] || pts[i+1];
    for (let j = 0; j < seg; j++) {
      const t = j/seg, t2 = t*t, t3 = t2*t;
      out.push([
        0.5*((2*p1[0]) + (-p0[0]+p2[0])*t + (2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2 + (-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),
        0.5*((2*p1[1]) + (-p0[1]+p2[1])*t + (2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2 + (-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3),
      ]);
    }
  }
  out.push(pts[pts.length-1]);
  return out;
}
const PATH = (() => {
  const all = [];
  for (const r of ROUTES) {
    const sp = catmull(r.cp, 20), seg = [];
    let total = 0;
    for (let i = 0; i < sp.length-1; i++) {
      const L = Math.hypot(sp[i+1][0]-sp[i][0], sp[i+1][1]-sp[i][1]);
      seg.push({ x: sp[i][0], y: sp[i][1], L }); total += L;
    }
    let acc = 0;
    for (const q of seg) {
      const t = acc/total; acc += q.L;
      all.push({ x: q.x, y: q.y, w: (r.w0*(1-t) + r.w1*t) * (1 + 0.10*Math.sin(t*8.2+0.6) + 0.05*Math.sin(t*17.4)) });
    }
  }
  return all;
})();
function onPath(x, y, margin = 14) {
  const dx = (x-CLEARING.cx)/(CLEARING.rx+margin), dy = (y-CLEARING.cy)/(CLEARING.ry+margin);
  let worst = 0;
  const e = Math.hypot(dx, dy);
  if (e < 1) worst = (1-e)*(CLEARING.rx+margin);
  for (const q of PATH) {
    const d = Math.hypot(x-q.x, y-q.y), lim = q.w/2 + margin;
    if (d < lim) worst = Math.max(worst, lim-d);
  }
  return worst;
}

// ---- overlap helpers -------------------------------------------------------
const ov = (a,b) => {
  const w = Math.min(a.x1,b.x1) - Math.max(a.x0,b.x0);
  const h = Math.min(a.y1,b.y1) - Math.max(a.y0,b.y0);
  return (w > 0 && h > 0) ? w*h : 0;
};
const boxArea = (b) => (b.x1-b.x0)*(b.y1-b.y0);
const sep = (a,b) => Math.max(Math.max(a.x0-b.x1, b.x0-a.x1), Math.max(a.y0-b.y1, b.y0-a.y1));

// Leaves interleave in a real forest; trunks and labels do not. This is the
// ONLY overlap the gate tolerates.
const CANOPY_TOLERANCE = 0.07;
const CLEAR_CANOPY = 30, CLEAR_PLATE = 20;      // breathing room, beyond mere non-overlap
const GRID = { x0: 40, x1: 1608, y0: 120, y1: 802, cols: 8, rows: 5 };
const MIN_FAUNA_GAP = 30, MIN_FAUNA_CLEAR = 7, MAX_PER_CELL = 9;
// plants do not grow in a trodden path; animals and pebbles ON it read as life
const ROOTED = ["flowerBush","berryBush","fern","fallenLog","stump","mushroomRing","cattail","wildflowers","clover","acornDrop"];

const hard = [], soft = [];
const H = (m) => hard.push(m);
const S = (m) => soft.push(m);

// ---- trees -----------------------------------------------------------------
const T = FAMS.map(solids);
for (let i = 0; i < T.length; i++) {
  const a = T[i], aAll = [...a.canopies, a.trunk];
  for (const c of aAll) {
    if (ov(c, TEXT)) H(`${a.f.fam} overlaps the TEXT BLOCK (${Math.round(ov(c,TEXT))}px2)`);
    if (ov(c, LEGEND)) H(`${a.f.fam} overlaps the LEGEND`);
    if (ov(c, MASTER_CANOPY) > 250) H(`${a.f.fam} overlaps the MASTER canopy (${Math.round(ov(c,MASTER_CANOPY))}px2)`);
    if (ov(c, MASTER_TRUNK) > 120) H(`${a.f.fam} overlaps the MASTER trunk (${Math.round(ov(c,MASTER_TRUNK))}px2)`);
  }
  for (const p of a.plates) {
    if (ov(p, TEXT)) H(`plate "${p.name}" overlaps the TEXT BLOCK`);
    if (ov(p, MASTER_PLATE)) H(`plate "${p.name}" overlaps the Mastery plate`);
    if (ov(p, MASTER_CANOPY) > 60) H(`plate "${p.name}" sits on the MASTER canopy`);
    if (p.y1 > CROP.bottom) H(`plate "${p.name}" is cropped on FB desktop (bottom ${Math.round(p.y1)} > ${CROP.bottom})`);
    if (p.x0 < CANVAS.x0 || p.x1 > CANVAS.x1) H(`plate "${p.name}" runs off canvas`);
  }
  for (const c of a.canopies) if (c.y0 < CROP.top) S(`${a.f.fam} canopy top ${Math.round(c.y0)} is cropped on FB desktop`);
  const d = onPath(a.f.x, a.f.y);
  if (d > 0) H(`${a.f.fam} is planted ON A PATH (${Math.round(d)}px inside the corridor)`);
  for (let m = 0; m < a.plates.length; m++) for (let n = m+1; n < a.plates.length; n++)
    if (ov(a.plates[m], a.plates[n])) H(`${a.f.fam}: its own plates "${a.plates[m].name}" and "${a.plates[n].name}" overlap`);

  for (let j = i+1; j < T.length; j++) {
    const b = T[j], bAll = [...b.canopies, b.trunk];
    if (ov(a.trunk, b.trunk)) H(`${a.f.fam} and ${b.f.fam} TRUNKS overlap`);
    for (const c of b.canopies) if (ov(a.trunk, c) > 400) H(`${b.f.fam}'s canopy covers ${a.f.fam}'s TRUNK (${Math.round(ov(a.trunk,c))}px2)`);
    for (const c of a.canopies) if (ov(b.trunk, c) > 400) H(`${a.f.fam}'s canopy covers ${b.f.fam}'s TRUNK (${Math.round(ov(b.trunk,c))}px2)`);
    if (ov(a.roots, b.roots)) H(`${a.f.fam} and ${b.f.fam} ROOT FLARES interlock`);
    for (const p of a.plates) {
      for (const q of b.plates) if (ov(p,q)) H(`plates "${p.name}" and "${q.name}" overlap`);
      for (const c of bAll) if (ov(p,c) > 60) H(`plate "${p.name}" sits on ${b.f.fam} (${Math.round(ov(p,c))}px2)`);
    }
    for (const q of b.plates) for (const c of aAll) if (ov(q,c) > 60) H(`plate "${q.name}" sits on ${a.f.fam} (${Math.round(ov(q,c))}px2)`);
    let tightest = Infinity;
    for (const ca of a.canopies) for (const cb of b.canopies) {
      const o = ov(ca, cb);
      if (o > CANOPY_TOLERANCE*Math.min(boxArea(ca), boxArea(cb)))
        H(`${a.f.fam} and ${b.f.fam} canopies overlap too much (${Math.round(o)}px2)`);
      tightest = Math.min(tightest, sep(ca, cb));
    }
    if (tightest > 0 && tightest < CLEAR_CANOPY) S(`${a.f.fam} and ${b.f.fam} are crowded (${Math.round(tightest)}px of clear air)`);
  }
}

// ---- fauna and scenery -----------------------------------------------------
// Two failure modes beyond collision: a critter can sit on a nameplate, or it can
// be BURIED — items paint in ascending y, so anything overlapping a tree with a
// larger y is drawn behind it and simply disappears.
const scaleSq = (y) => 0.15 + Math.max(0, Math.min(1, (y-260)/570))*0.34;
const depth = (y) => 0.40 + 0.60*Math.max(0, Math.min(1, (y-160)/640));
const SIZES = {
  rabbit:[30,30,60,12], hedgehog:[32,32,34,10], frog:[18,18,24,14], bird:[26,36,20,18],
  snail:[24,22,22,6], ladybug:[10,10,12,8], dragonfly:[22,22,16,16], butterfly:[16,16,18,14],
  flyingBird:[28,28,12,6], fallenLog:[58,58,22,14], stump:[28,28,32,10], berryBush:[34,34,44,10],
  fern:[34,34,36,6], acornDrop:[18,18,12,8], bee:[12,14,12,8], mouse:[34,30,24,8],
  owl:[22,22,28,26], duck:[24,30,28,8], turtle:[24,24,18,10], mushroomRing:[24,24,16,8],
  pebbles:[20,18,10,8], cattail:[14,14,52,4], wildflowers:[24,24,26,6], clover:[20,20,14,4],
  flowerBush:[80,80,64,10],
};
function faunaBox(it) {
  const s = it.s != null ? it.s : (it.size || 1)*depth(it.y);
  if (it.kind === "duo") { const q = scaleSq(it.y)*0.72;
    return { x0: it.x-232*q, x1: it.x+74*q, y0: it.y-306*q, y1: it.y+22*q }; }
  if (it.kind === "brown" || it.kind === "mauve") { const q = scaleSq(it.y);
    return { x0: it.x-104*q, x1: it.x+104*q, y0: it.y-232*q, y1: it.y+30*q }; }
  const z = SIZES[it.kind] || [20,20,20,10];
  return { x0: it.x-z[0]*s, x1: it.x+z[1]*s, y0: it.y-z[2]*s, y1: it.y+z[3]*s };
}
for (const it of FAUNA) {
  const b = faunaBox(it), area = boxArea(b);
  for (const t of T) {
    for (const p of t.plates) if (ov(b,p) > 40) H(`${it.kind} @${it.x},${it.y} sits on plate "${p.name}"`);
    if (t.f.y > it.y) {
      let hidden = 0;
      for (const c of [...t.canopies, t.trunk]) hidden += ov(b,c);
      if (hidden > 0.30*area) H(`${it.kind} @${it.x},${it.y} is ${Math.round(100*hidden/area)}% BURIED behind ${t.f.fam}`);
    }
  }
  if (ov(b, TEXT) > 40) H(`${it.kind} @${it.x},${it.y} sits on the text block`);
  if (ov(b, MASTER_PLATE) > 40) H(`${it.kind} @${it.x},${it.y} sits on the Mastery plate`);
  if (it.y > MASTER.y && ov(b, MASTER_CANOPY) + ov(b, MASTER_TRUNK) > 0.30*area)
    H(`${it.kind} @${it.x},${it.y} is buried behind the Master Tree`);
  if (ROOTED.includes(it.kind)) {
    const d = onPath(it.x, it.y, 10);
    if (d > 0) H(`${it.kind} @${it.x},${it.y} is growing ON A PATH (${Math.round(d)}px inside)`);
  }
  // Ground items must stand on the ground. The scatter loop once spread decoration
  // over the whole canvas with no idea where the hill was, and a share of every
  // batch ended up hanging in the sky above the ridge.
  if (it.kind !== "flyingBird" && it.y < hillTop(it.x) + 10)
    H(`${it.kind} @${it.x},${it.y} is FLOATING above the ridge (hill is at y=${Math.round(hillTop(it.x))})`);
}

// ---- spread ----------------------------------------------------------------
// Scenery strung along the bottom edge passes every collision check above and
// still looks like a strip of clutter under an empty hillside. Coverage is a
// separate property, so it gets a separate test.
const cw = (GRID.x1-GRID.x0)/GRID.cols, chh = (GRID.y1-GRID.y0)/GRID.rows;
const cellOf = (x,y) => {
  const c = Math.max(0, Math.min(GRID.cols-1, Math.floor((x-GRID.x0)/cw)));
  const r = Math.max(0, Math.min(GRID.rows-1, Math.floor((y-GRID.y0)/chh)));
  return r*GRID.cols + c;
};
const dead = new Set();
for (let r = 0; r < GRID.rows; r++) for (let c = 0; c < GRID.cols; c++) {
  const id = r*GRID.cols + c;
  const x0 = GRID.x0 + c*cw, x1 = x0+cw, y0 = GRID.y0 + r*chh, y1 = y0+chh;
  if (ov({x0,x1,y0,y1}, TEXT) > 0.55*cw*chh) { dead.add(id); continue; }
  let ground = 0, open = 0;
  for (let a = 0; a <= 8; a++) for (let b = 0; b <= 8; b++) {
    const xx = x0 + (x1-x0)*a/8, yy = y0 + (y1-y0)*b/8;
    if (yy < hillTop(xx) + 20) continue;                       // sky
    ground++;
    let covered = false;
    for (const t of T) { if (t.f.y <= yy) continue;             // draws earlier — harmless
      for (const cb of [...t.canopies, t.trunk]) if (xx>cb.x0&&xx<cb.x1&&yy>cb.y0&&yy<cb.y1) { covered = true; break; }
      if (covered) break; }
    if (!covered) open++;
  }
  // three ways a cell is unusable: mostly sky, mostly text, or its ground is
  // almost entirely under a canopy that draws later
  if (ground < 18 || open < 8) dead.add(id);
}
const counts = new Map();
for (const it of FAUNA) { if (it.kind === "flyingBird") continue;
  const c = cellOf(it.x, it.y); counts.set(c, (counts.get(c) || 0) + 1); }
for (let c = 0; c < GRID.cols*GRID.rows; c++) {
  if (dead.has(c)) continue;
  const n = counts.get(c) || 0;
  const label = `region ${c % GRID.cols},${Math.floor(c/GRID.cols)}`;
  if (n === 0) H(`${label} is empty — no life there`);
  if (n > MAX_PER_CELL) H(`${label} is clumped (${n} items, max ${MAX_PER_CELL})`);
}
const G = FAUNA.filter((f) => f.kind !== "flyingBird");
for (let i = 0; i < G.length; i++) for (let j = i+1; j < G.length; j++) {
  const d = Math.hypot(G[i].x-G[j].x, G[i].y-G[j].y);
  if (d < MIN_FAUNA_GAP) { H(`${G[i].kind} and ${G[j].kind} centres are only ${Math.round(d)}px apart`); continue; }
  const gap = sep(faunaBox(G[i]), faunaBox(G[j]));
  if (gap < MIN_FAUNA_CLEAR) H(`${G[i].kind} and ${G[j].kind} footprints are ${Math.round(gap)}px apart (min ${MIN_FAUNA_CLEAR})`);
}

// ---- report ----------------------------------------------------------------
const usable = GRID.cols*GRID.rows - dead.size;
console.log(`\nforest cover — ${FAMS.length} families (all modelled full-grown) · ${FAUNA.length} fauna/scenery · ${ROUTES.length} routes · ${usable} usable regions`);
if (!hard.length) console.log("  ✓ no collisions");
for (const m of hard) console.log("  ✗ " + m);
for (const m of soft) console.log("  · " + m);
console.log("");
process.exit(hard.length ? 1 : 0);
