// @ts-nocheck
import { readFileSync } from 'node:fs';
const eng = process.argv[2] ?? 'firefox';
const what = process.argv[3] ?? 'timing';
const d = JSON.parse(readFileSync(new URL(`./out/${eng}.json`, import.meta.url)));
const merged = {};
const leaf = Object.values(d.pages)[0].leaf;
if (what === 'timing') {
  for (const [pg, p] of Object.entries(d.pages)) for (const t of p.timing) {
    const bad = !t.onGrid || (!['grow','wither','linear','steps'].includes(t.curve));
    if (!bad) continue;
    const k = `${t.part}|${t.kind}|${t.prop}|${t.ms}|${t.curve.slice(0,30)}`;
    (merged[k] ??= { pages: new Set(), n: 0 }).pages.add(pg); merged[k].n += t.n;
  }
  for (const [k, v] of Object.entries(merged).sort()) console.log(k, [...v.pages].join(','), v.n);
} else if (what === 'running') {
  const m = {}; for (const [pg, r] of Object.entries(d.running)) for (const x of r) (m[x.k] ??= new Set()).add(pg);
  for (const [k, v] of Object.entries(m).sort()) console.log(k, [...v].join(','));
} else if (what === 'corners') {
  console.log('leaf', leaf);
  for (const [pg, p] of Object.entries(d.pages)) for (const c of p.corners) {
    const k = `${c.part}|${c.kind}|${c.radii.join('/')}`;
    (merged[k] ??= { pages: new Set(), size: c.size, n: 0 }).pages.add(pg); merged[k].n += c.n;
  }
  for (const [k, v] of Object.entries(merged).sort()) console.log(k, v.size, v.n, [...v.pages].slice(0,3).join(','));
} else if (what === 'fonts') {
  console.log(JSON.stringify(Object.values(d.pages)[0].tokens));
  for (const [pg, p] of Object.entries(d.pages)) for (const f of p.fonts) {
    if (!f.mono) continue;
    const k = `${f.family}|${f.part}|${f.tag}`;
    (merged[k] ??= { pages: new Set(), s: f.sample, n: 0 }).pages.add(pg); merged[k].n += f.n;
  }
  for (const [k, v] of Object.entries(merged).sort()) console.log(k, JSON.stringify(v.s), v.n, [...v.pages].slice(0,3).join(','));
  const fams = new Set(); for (const p of Object.values(d.pages)) p.fams.forEach(f => fams.add(f)); console.log([...fams]);
} else if (what === 'pointing') {
  for (const [sig, r] of Object.entries(d.pointing)) {
    if (r.error) { console.log('ERR', sig, r.error); continue; }
    console.log(sig, '|', r.page, r.covered ? 'COVERED' : `hover:${r.hoverBlaze ? 'BLAZE' : r.hoverDiff.length ? 'other(' + r.hoverDiff.slice(0,4).join(',') + ')' : 'NONE'} active:${r.activeDiff.length ? (r.activeSolid ? 'solid' : 'chg') : 'same'}${r.activeBgChanged ? ' BGCHG' : ''}${r.activeContrast !== null && r.activeContrast < 4.5 ? ' lowC' + r.activeContrast : ''} focus:${r.focusVisible ? '' : 'NOFV '}${r.focusChannels}ch`);
  }
}
