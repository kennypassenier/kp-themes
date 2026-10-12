// Measures round 5 of research/forest-applied frame by frame, in Firefox and Chromium:
// BROWSER=firefox|chromium URL=http://127.0.0.1:8760/research/forest-applied/demo.html node research/forest-applied/measure.mjs
// (a static server on the repository root must be running). No gate runs it.
import { firefox, chromium } from 'playwright';
const URL = process.env.URL || 'http://127.0.0.1:8760/research/forest-applied/demo.html';
const which = process.env.BROWSER || 'firefox';
const b = await (which === 'firefox' ? firefox : chromium).launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(String(e)));
await p.goto(URL, { waitUntil: 'load' });
await p.waitForTimeout(2500);
// frame sampler: runs fn() every rAF for ms, returns array
await p.evaluate(() => {
  window.__rec = (fn, ms) => new Promise(res => { const out = []; const t0 = performance.now(); (function tick() { const t = performance.now() - t0; out.push([Math.round(t), fn()]); if (t < ms) requestAnimationFrame(tick); else res(out); })(); });
});
const summarize = (name, series, keys) => {
  // series: [[t, {k:v}]]; print t50/t90 per numeric key and max frame jump
  const res = {};
  for (const k of keys) {
    const v = series.map(([t, o]) => [t, o[k]]).filter(x => typeof x[1] === 'number');
    if (!v.length) continue;
    const a = v[0][1], z = v[v.length - 1][1];
    const range = Math.abs(z - a);
    let t50 = null, t90 = null, jump = 0, start = null, end = null;
    for (let i = 0; i < v.length; i++) {
      const prog = range ? Math.abs(v[i][1] - a) / range : 0;
      if (start === null && Math.abs(v[i][1] - a) > 0.5) start = v[i][0];
      if (t50 === null && prog >= 0.5) t50 = v[i][0];
      if (t90 === null && prog >= 0.9) t90 = v[i][0];
      if (i) jump = Math.max(jump, Math.abs(v[i][1] - v[i - 1][1]));
    }
    res[k] = { from: +a.toFixed(1), to: +z.toFixed(1), start, t50, t90, maxFrameJump: +jump.toFixed(1) };
  }
  console.log(name, JSON.stringify(res));
};
// ---------- 1 phone bar
const phoneSel = '.fa-phone .kp-nav';
const barProbe = `() => { const n = document.querySelector('${phoneSel}'); const l = n.querySelector('.kp-nav__links'); const r = l.getBoundingClientRect(); const body = document.querySelector('.fa-phone__body').getBoundingClientRect(); const cs = getComputedStyle(l); return { h: r.height, op: parseFloat(cs.opacity), bodyTop: body.top, navH: n.getBoundingClientRect().height }; }`;
await p.locator('.fa-phone').scrollIntoViewIfNeeded();
await p.waitForTimeout(600);
const tog = p.locator('.fa-phone [data-kp-nav-toggle]');
let rec = p.evaluate(`window.__rec(${barProbe}, 2600)`);
await tog.click(); const open = await rec; await p.waitForTimeout(500);
summarize(which + ' bar OPEN', open, ['h','op','bodyTop']); console.log('RAW bar open', JSON.stringify(open.filter((_, i) => i % 2 === 0).slice(0, 40).map(x => [x[0], Math.round(x[1].h), +x[1].op.toFixed(2)])));
rec = p.evaluate(`window.__rec(${barProbe}, 2600)`);
await tog.click(); const close = await rec;
summarize(which + ' bar CLOSE', close, ['h', 'op', 'bodyTop']);
await p.waitForTimeout(800);
// ---------- 2 sidenav over
await p.locator('#sidenav').scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
const sideProbe = `() => { const n = document.getElementById('fa-over'); const r = n.getBoundingClientRect(); const cs = getComputedStyle(n); const bd = document.querySelector('.kp-sidenav__backdrop'); const bcs = bd ? getComputedStyle(bd) : null; return { x: r.left, w: r.width, op: parseFloat(cs.opacity), bd: bcs ? parseFloat(bcs.opacity) : -1, clip: cs.clipPath.length }; }`;
const stog = p.locator('button[data-kp-sidenav-toggle][aria-controls="fa-over"]').first();
rec = p.evaluate(`window.__rec(${sideProbe}, 2800)`);
await stog.click(); const sopen = await rec; await p.waitForTimeout(600);
summarize(which + ' sidenav OPEN', sopen, ['x', 'w', 'op', 'bd']);
rec = p.evaluate(`window.__rec(${sideProbe}, 2800)`);
await p.locator('#fa-over [data-kp-sidenav-toggle]').click(); const sclose = await rec;
summarize(which + ' sidenav CLOSE', sclose, ['x', 'w', 'op', 'bd']);
await p.waitForTimeout(800);
// ---------- 3 datepicker
await p.locator('#datepicker').scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
await p.locator('[data-kp-date-open]').first().click();
await p.waitForTimeout(1800);
const dpInfo = () => p.evaluate(() => { const pn = document.querySelector('[data-kp-date-panel]'); const all = [pn, ...pn.querySelectorAll('*')]; const anims = all.flatMap(e => e.getAnimations()).filter(a => a.playState === 'running'); const r = pn.getBoundingClientRect(); return { running: anims.map(a => a.animationName || a.transitionProperty).join(','), w: Math.round(r.width), h: Math.round(r.height), op: getComputedStyle(pn).opacity, open: pn.dataset.kpDateOpen ?? 'none' }; });
console.log(which, 'datepicker settled', JSON.stringify(await dpInfo()));
const nextBtn = p.locator('[data-kp-date-panel] [data-kp-date-next], [data-kp-date-panel] button[aria-label*="Next" i]').first();
const dpRec = p.evaluate(`window.__rec(() => { const pn = document.querySelector('[data-kp-date-panel]'); const all = [pn, ...pn.querySelectorAll('*')]; const a = all.flatMap(e => e.getAnimations()).filter(x => x.playState === 'running' && (x.animationName||'').includes('forest')).length; const r = pn.getBoundingClientRect(); return { anims: a, w: r.width, h: r.height, op: parseFloat(getComputedStyle(pn).opacity) }; }, 1500)`);
if (await nextBtn.count()) await nextBtn.click(); else console.log('no next button found');
const dpser = await dpRec;
console.log(which, 'datepicker month change: max forest anims', Math.max(...dpser.map(x => x[1].anims)), 'op range', Math.min(...dpser.map(x => x[1].op)), Math.max(...dpser.map(x => x[1].op)), 'size w/h range', Math.min(...dpser.map(x => x[1].w)), Math.max(...dpser.map(x => x[1].w)), Math.min(...dpser.map(x => x[1].h)), Math.max(...dpser.map(x => x[1].h)));
await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
// ---------- 4 tour
await p.locator('#tour').scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
const targets = `[...document.querySelectorAll('[data-fa-tour]')].map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.left*10)/10, Math.round(r.top*10)/10, Math.round(r.width*10)/10, Math.round(r.height*10)/10]; })`;
const before = await p.evaluate(targets);
await p.locator('[data-fa-tour-start]').click();
await p.waitForTimeout(2500);
const during = await p.evaluate(targets);
console.log(which, 'tour: target rects before vs during step 1', JSON.stringify(before) === JSON.stringify(during) ? 'IDENTICAL (no layout shift)' : 'DIFFER ' + JSON.stringify(before) + ' vs ' + JSON.stringify(during));
const tourProbe = `() => { const c = document.querySelector('.kp-tour'); const r = c.getBoundingClientRect(); const cs = getComputedStyle(c); const a = c.getAnimations().filter(x => x.playState==='running').map(x => x.animationName || x.transitionProperty); return { x: r.left, y: r.top, w: r.width, h: r.height, op: parseFloat(cs.opacity), na: a.filter(n => n.includes('arrive') || n.includes('root')).length }; }`;
const nextT = p.locator('.kp-tour [data-kp-tour-next], .kp-tour button:has-text("Next")').first();
rec = p.evaluate(`window.__rec(${tourProbe}, 2200)`);
await nextT.click(); const tser = await rec;
summarize(which + ' tour STEP', tser, ['x','y','w','h','op']); console.log('RAW tour', JSON.stringify(tser.slice(0, 14).map(x => [x[0], Math.round(x[1].x), Math.round(x[1].y), Math.round(x[1].w), Math.round(x[1].h)])));
console.log(which, 'tour: arrive/root animations replayed during step:', Math.max(...tser.map(x => x[1].na)));
const after = await p.evaluate(targets);
console.log(which, 'tour: target rects after step 2', JSON.stringify(before) === JSON.stringify(after) ? 'IDENTICAL' : 'DIFFER ' + JSON.stringify(after));
console.log(which, 'page errors', JSON.stringify(errs));
await b.close();
