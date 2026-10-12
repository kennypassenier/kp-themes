// @ts-nocheck: scratch audit tooling, not shipped
// Text/ground contrast (Firefox) of every calendar day state and every alert tone, in one theme.
//   node research/cyberpunk-applied/_audit/contrast-states.mjs [theme=cyberpunk]
import process from 'node:process';
import { firefox } from '@playwright/test';
import { serve } from './lib.mjs';

const theme = process.argv[2] ?? 'cyberpunk';
const pages = ['data', 'datepicker', 'feedback', 'overlays', 'navigation', 'structure'];
const server = await serve();
const browser = await firefox.launch();
const seen = new Map();
for (const pg of pages.map((p) => `/catalogue/${p}.html`).concat(['/research/cyberpunk-applied/demo.html'])) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    await context.addInitScript((t) => localStorage.setItem('theme', t), theme);
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}${pg}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        for (const el of document.querySelectorAll('.cat-block[hidden], .cat-component[hidden], .cat-section[hidden], .cat-group[hidden]'))
            el.removeAttribute('hidden');
    }, theme);
    await page.waitForTimeout(300);
    const rows = await page.evaluate(() => {
        const cv = document.createElement('canvas').getContext('2d');
        const rgba = (c) => {
            cv.fillStyle = '#000';
            cv.fillStyle = c;
            const v = cv.fillStyle;
            if (v.startsWith('#')) return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16), 1];
            const m = v.match(/[\d.]+/g).map(Number);
            return [m[0], m[1], m[2], m[3] ?? 1];
        };
        const over = (f, b) => [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3]));
        const ground = (el) => {
            const layers = [];
            for (let e = el; e; e = e.parentElement) {
                const c = rgba(getComputedStyle(e).backgroundColor);
                if (c[3] > 0) layers.push(c);
                if (c[3] >= 1) break;
            }
            let g = [0, 0, 0];
            for (const l of layers.reverse()) g = over(l, g);
            return g;
        };
        const lum = (c) => {
            const f = c.map((v) => {
                v /= 255;
                return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
            });
            return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
        };
        const ratio = (a, b) => {
            const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
            return (x + 0.05) / (y + 0.05);
        };
        const out = [];
        // a synthetic grid with every tone x today x selected, next to the first real calendar (same cascade)
        const first = [...document.querySelectorAll('.kp-calendar__day')].find((d) => d.checkVisibility());
        if (first) {
            const host = first.closest('.kp-calendar') ?? first.closest('table').parentElement;
            const wrap = host.cloneNode(false);
            wrap.removeAttribute('id');
            const tbl = document.createElement('table');
            tbl.className = 'kp-calendar__grid';
            const tb = tbl.createTBody();
            for (const tone of ['ok', 'warn', 'bad', 'muted', 'future', 'before', 'none', 'loading'])
                for (const mark of ['', 'today', 'selected']) {
                    const tr = tb.insertRow();
                    const td = tr.insertCell();
                    td.style.cssText = 'inline-size:3.5rem';
                    const b = first.cloneNode(true);
                    b.dataset.kpTone = tone;
                    b.removeAttribute('data-kp-today');
                    b.removeAttribute('aria-current');
                    if (mark === 'today') b.setAttribute('data-kp-today', '');
                    if (mark === 'selected') td.setAttribute('aria-selected', 'true');
                    td.append(b);
                }
            wrap.append(tbl);
            host.after(wrap);
        }
        const add = (kind, key, el, textEl = el) => {
            const cs = getComputedStyle(textEl);
            const fg = rgba(cs.color);
            const g = ground(el);
            let op = 1;
            for (let e = textEl; e && e !== document.body; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
            const eff = over([fg[0], fg[1], fg[2], fg[3] * op], g);
            out.push({
                kind,
                key,
                ratio: +ratio(eff, g).toFixed(2),
                fg: cs.color,
                ground: `rgb(${g.map(Math.round)})`,
                size: parseFloat(cs.fontSize),
            });
        };
        for (const d of document.querySelectorAll('.kp-calendar__day')) {
            if (!d.checkVisibility()) continue;
            const td = d.closest('td');
            const key = [
                d.dataset.kpTone ?? 'plain',
                d.hasAttribute('data-kp-today') ? 'today' : '',
                td?.getAttribute('aria-selected') === 'true' ? 'selected' : '',
                d.matches(':disabled') ? 'disabled' : '',
            ]
                .filter(Boolean)
                .join('+');
            add('day', key, d, d.querySelector('.kp-calendar__num') ?? d);
            const cnt = d.querySelector('.kp-calendar__count');
            if (cnt) add('day-count', key, d, cnt);
        }
        for (const d of document.querySelectorAll('.kp-calendar__grid td[data-kp-pad] > .kp-calendar__pad')) {
            if (d.checkVisibility()) add('day', 'other-month(pad,opacity .75)', d);
        }
        for (const a of document.querySelectorAll('.kp-alert')) {
            if (!a.checkVisibility()) continue;
            const key = [...a.classList].filter((c) => c.startsWith('kp-alert--')).join('+') || 'neutral';
            add('alert', key + ':body', a, a.querySelector('.kp-alert__body') ?? a);
            const lb = a.querySelector('.kp-alert__label');
            if (lb) add('alert', key + ':label', a, lb);
        }
        return out;
    });
    for (const r of rows) {
        const k = `${r.kind}|${r.key}`;
        if (!seen.has(k) || seen.get(k).ratio > r.ratio) seen.set(k, r);
    }
    await context.close();
}
console.log(`theme ${theme}`);
for (const r of [...seen.values()].sort((a, b) => (a.kind + a.key).localeCompare(b.kind + b.key)))
    console.log(
        `${r.kind.padEnd(10)} ${r.key.padEnd(34)} ${String(r.ratio).padStart(5)}:1  ${r.ratio >= 4.5 ? 'AA' : r.ratio >= 3 ? 'large only' : 'FAIL'}  fg ${r.fg} on ${r.ground} ${r.size}px`,
    );
await browser.close();
server.close();
