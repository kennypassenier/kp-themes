// @ts-nocheck: scratch: computed text against computed plate for alerts and calendar tone days, per theme
import { firefox } from '@playwright/test';
import { serve, openTheme, THEME } from './lib.mjs';
const s = await serve(); const b = await firefox.launch();
const { page } = await openTheme(b, `http://127.0.0.1:${s.address().port}/research/cyberpunk-applied/demo.html`);
await page.waitForTimeout(1500);
const rows = await page.evaluate(() => {
  const rgb = (v) => { const c = document.createElement('canvas'); c.width = c.height = 1; const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillStyle = v; x.fillRect(0,0,1,1); return [...x.getImageData(0,0,1,1).data]; };
  const lum = ([r,g,b]) => { const f = (v) => (v/=255) <= 0.03928 ? v/12.92 : ((v+0.055)/1.055)**2.4; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const ground = (el) => { let e = el; while (e) { const bg = getComputedStyle(e).backgroundColor; const a = rgb(bg); if (!/rgba\(0, 0, 0, 0\)|transparent/.test(bg) && a[3] > 200) return a; e = e.parentElement; } return [255,255,255,255]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p,q)=>q-p); return +((x+0.05)/(y+0.05)).toFixed(2); };
  const out = [];
  for (const a of document.querySelectorAll('.kp-alert')) for (const part of a.querySelectorAll('.kp-alert__label, .kp-alert__body')) {
    out.push({ what: `${[...a.classList].join('.')} ${part.className}`, r: ratio(rgb(getComputedStyle(part).color), ground(part)) }); }
  const seen = new Set();
  for (const d of document.querySelectorAll('.kp-calendar__day[data-kp-tone]')) { const t = d.dataset.kpTone; if (seen.has(t)) continue; seen.add(t);
    out.push({ what: `day ${t}`, r: ratio(rgb(getComputedStyle(d).color), ground(d)) }); }
  return out;
});
console.log(THEME + ': ' + rows.filter((r) => r.r < 4.5).map((r) => `${r.what} ${r.r}`).join(' | '));
await b.close(); s.close();
