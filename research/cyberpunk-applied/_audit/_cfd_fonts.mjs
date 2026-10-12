// scratch: prose in mono across the catalogue. node _cfd_fonts.mjs [firefox|chromium]
import { readdirSync } from 'node:fs';
import { chromium, firefox } from '@playwright/test';
import { serve, openTheme, ROOT } from './lib.mjs';
const engine = process.argv[2] ?? 'firefox';
const pages = readdirSync(`${ROOT}/catalogue`)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.replace('.html', ''))
    .filter((p) => !['compare', 'index', 'round', 'changed', 'intros'].includes(p));
function inPage() {
    const mono = (f) => /mono|courier|consolas|menlo|monaco|ui-monospace/i.test(f.split(',')[0]);
    const out = {};
    for (const el of document.querySelectorAll('body *')) {
        if (el.closest('.cat-bar, .cat-judge, [data-cat-judge], [data-cat-chrome]')) continue;
        const own = [...el.childNodes]
            .filter((n) => n.nodeType === 3 && n.textContent.trim())
            .map((n) => n.textContent.trim())
            .join(' ');
        if (!own) continue;
        const r = el.getBoundingClientRect();
        if (!r.width) continue;
        const cs = getComputedStyle(el);
        if (!mono(cs.fontFamily)) continue;
        const words = own.split(/\s+/).filter(Boolean).length;
        if (!(words >= 3 && own.length >= 18 && /[a-z]{3}/.test(own))) continue;
        const part = [...el.classList].find((c) => c.startsWith('kp-')) ?? el.tagName.toLowerCase();
        const k = part + '|' + el.tagName.toLowerCase();
        (out[k] ??= {
            part,
            tag: el.tagName.toLowerCase(),
            n: 0,
            sample: own.slice(0, 50),
            ancestors: el.parentElement?.className?.toString().slice(0, 40),
        }).n++;
    }
    return Object.values(out);
}
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await (engine === 'chromium' ? chromium : firefox).launch();
const all = {};
for (const pg of pages) {
    const { context, page } = await openTheme(browser, `${base}/catalogue/${pg}.html`);
    for (const g of await page.evaluate(inPage)) {
        const k = g.part + '|' + g.tag;
        (all[k] ??= { ...g, n: 0, pages: new Set() }).n += g.n;
        all[k].pages.add(pg);
    }
    await context.close();
}
await browser.close();
server.close();
for (const g of Object.values(all)) console.log(`${g.part} <${g.tag}> x${g.n} | ${g.sample} | in ${g.ancestors} | ${[...g.pages].slice(0, 3)}`);
