// @ts-nocheck: scratch audit tooling for the cyberpunk review, not shipped
// (b) The notch size and corner of every kp part that wears a clip-path polygon, and every part that wears a box and no cut.
//   node research/cyberpunk-applied/_audit/notches.mjs [--engine firefox|chromium]
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { chromium, firefox } from '@playwright/test';
import { serve, openTheme, ROOT } from './lib.mjs';

const args = process.argv.slice(2);
const engine = args.includes('--engine') ? args[args.indexOf('--engine') + 1] : 'firefox';
const pages = readdirSync(`${ROOT}/catalogue`)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.replace('.html', ''))
    .filter((p) => !['compare', 'index', 'round', 'changed', 'intros'].includes(p));

function inPage() {
    const px = (v) => parseFloat(v) || 0;
    const out = {};
    for (const el of document.querySelectorAll('[class*="kp-"]')) {
        if (el.closest('.cat-bar, [data-cat-judge], [data-cat-chrome], [hidden]')) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 6 || r.height < 6) continue;
        const cs = getComputedStyle(el);
        const part = [...el.classList].find((c) => c.startsWith('kp-'));
        const box =
            cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
            cs.backgroundImage !== 'none' ||
            ['Top', 'Right', 'Bottom', 'Left'].some((s) => px(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none');
        if (!box) continue;
        const clip = cs.clipPath;
        const nums = [...clip.matchAll(/calc\(100% - ([\d.]+)px\)|(?:^|[ (,])([\d.]+)px (?:[\d.]+px|100%)/g)]
            .map((m) => parseFloat(m[1] ?? m[2]))
            .filter((n) => n > 0 && n < 40);
        const radius = px(cs.borderTopLeftRadius);
        const key = `${part}|${clip === 'none' ? 'RECT' : clip.startsWith('polygon') ? 'notch ' + [...new Set(nums)].sort((a, b) => a - b).join('/') : clip.slice(0, 20)}|r${radius}`;
        const g = (out[key] ??= { part, shape: key.split('|')[1], radius, size: `${Math.round(r.width)}x${Math.round(r.height)}`, n: 0 });
        g.n++;
    }
    return Object.values(out);
}

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await (engine === 'chromium' ? chromium : firefox).launch();
const all = {};
for (const pg of pages) {
    const { context, page } = await openTheme(browser, `${base}/catalogue/${pg}.html`);
    try {
        for (const g of await page.evaluate(inPage)) {
            const k = `${g.part}|${g.shape}|${g.radius}`;
            (all[k] ??= { ...g, pages: new Set(), n: 0 }).pages.add(pg);
            all[k].n += g.n;
        }
    } catch (e) {
        console.log(pg, 'ERR', String(e.message).split('\n')[0]);
    }
    await context.close();
}
await browser.close();
server.close();
mkdirSync(`${ROOT}/research/cyberpunk-applied/_audit/out`, { recursive: true });
const rows = Object.values(all)
    .map((g) => ({ ...g, pages: [...g.pages].slice(0, 3) }))
    .sort((a, b) => a.part.localeCompare(b.part));
writeFileSync(`${ROOT}/research/cyberpunk-applied/_audit/out/notches-${engine}.json`, JSON.stringify(rows, null, 1));
for (const g of rows) console.log(`${g.part} | ${g.shape} | radius ${g.radius} | ${g.size} x${g.n} | ${g.pages.join(',')}`);
