// Beside the evidence page (a measuring script, not a test): in Firefox, for each of the twelve themes, the numbers under every
// Now / Proposed pair of research/kpadopt56-shared/evidence.html. Writes measured.js (read by the page) and measured.json.
// Run (a static server on the repository root first):  node research/kpadopt56-shared/measure.mjs <port>
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const port = process.argv[2];
if (!port) {
    console.error('usage: node research/kpadopt56-shared/measure.mjs <port>');
    process.exit(2);
}
const THEMES = ['formal', 'dark', 'cyberpunk', 'synthwave', 'pastel', 'forest', 'blueprint', 'solstice', 'brutalism', 'deco', 'nostromo', 'titanium'];

/** In the page: every number for one side ("now" or "proposal"). */
function measureSide(side) {
    const $ = (sel) => document.querySelector(`#${sel.id} .${side} ${sel.q}`);
    const all = (id, q) => [...document.querySelectorAll(`#${id} .${side} ${q}`)];
    const frameRight = (el) => {
        const f = el.closest('.frame');
        const cs = getComputedStyle(f);
        return f.getBoundingClientRect().right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth);
    };
    const over = (id, q, root) => {
        const els = all(id, q);
        if (!els.length) return NaN;
        const edge = frameRight(els[0]);
        return Math.max(0, Math.round(Math.max(...els.map((e) => e.getBoundingClientRect().right)) - edge));
    };
    /** Words of the visible text that sit on two lines (broken inside the word); a word with - / _ . : may break there. */
    const broken = (roots) => {
        let n = 0;
        for (const root of roots) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            for (let t = walker.nextNode(); t; t = walker.nextNode()) {
                if (t.parentElement.closest('[hidden], .kp-sr-only, [aria-hidden="true"]')) continue;
                for (const m of t.data.matchAll(/\S+/g)) {
                    if (/[-/_.:]/.test(m[0]) || m[0].length < 3) continue;
                    const r = document.createRange();
                    r.setStart(t, m.index);
                    r.setEnd(t, m.index + m[0].length);
                    const tops = new Set([...r.getClientRects()].filter((q) => q.width > 0.5).map((q) => Math.round(q.top / 4)));
                    if (tops.size > 1) n++;
                }
            }
        }
        return n;
    };
    const out = {};
    out['s1-refresh'] = {
        over: over('s1', '.kp-refresh__bar', null) && Math.max(over('s1', '.kp-refresh__bar'), over('s1', '.kp-refresh__segments')),
        scrolls: Math.round(Math.max(0, ...all('s1', '.kp-refresh__segments').map((e) => e.scrollWidth - e.clientWidth))),
    };
    const insp = all('s1', '.kp-inspector').slice(0, 1);
    const inspCard = document.querySelector(`#s1 .${side} .kp-inspector`);
    const inspEdge = frameRight(inspCard);
    const inspOver = Math.max(0, Math.round(Math.max(...[...inspCard.querySelectorAll('.kp-inspector__bar, .kp-inspector__filter')].map((e) => e.getBoundingClientRect().right)) - inspEdge));
    out['s1-inspector'] = {
        over: inspOver,
        cardClip: Math.round(Math.max(0, ...[...inspCard.querySelectorAll('.kp-inspector__row')].map((e) => e.getBoundingClientRect().right - inspCard.getBoundingClientRect().right))),
        broken: broken([...inspCard.querySelectorAll('.kp-inspector__row > :not(.kp-inspector__path)')]),
    };
    out['s2-version'] = { over: Math.max(over('s2', '.kp-badge--version'), over('s2', '.kp-version__from'), over('s2', '.kp-version__to')) };
    const hotel = all('s3', '.kp-checklist__label').find((e) => e.textContent.includes('Hotel'));
    const sect = document.querySelector(`#s3 .${side} .kp-checklist__group`);
    out['s3-checklist'] = {
        label: Math.round(hotel.getBoundingClientRect().width),
        broken: broken(all('s3', '.kp-checklist__label')),
        over: Math.max(0, Math.round(sect.getBoundingClientRect().right - frameRight(sect))),
    };
    const btns = all('s4', '.kp-entity__actions .kp-button');
    const cardOver = Math.max(0, ...btns.map((b) => Math.round(b.getBoundingClientRect().right - b.closest('.kp-card--entity').getBoundingClientRect().right)));
    out['s4-entity'] = { broken: broken(btns), over: cardOver };
    const ticks = all('s5', 'text.kp-chart__tick');
    const last = ticks[ticks.length - 1];
    out['s5-chart'] = { over: Math.max(0, Math.round(last.getBoundingClientRect().right - frameRight(last))), label: Math.round(last.getBoundingClientRect().width) };
    const name = all('s6', '.kp-availability__column-name').find((e) => e.textContent.includes('(you)'));
    const row = name.closest('.kp-availability__column-row');
    const nr = name.getBoundingClientRect();
    const ar = row.querySelector('.kp-availability__column-answers').getBoundingClientRect();
    const ox = Math.min(nr.right, ar.right) - Math.max(nr.left, ar.left);
    const oy = Math.min(nr.bottom, ar.bottom) - Math.max(nr.top, ar.top);
    out['s6-availability'] = { name: Math.round(nr.width) };
    const dlg = document.querySelector(`#s7 .${side} dialog.kp-shortcuts`);
    const stage = dlg.closest('.stage');
    out['s7-shortcuts'] = { over: Math.round(Math.max(0, dlg.getBoundingClientRect().bottom - stage.getBoundingClientRect().bottom - (stage.scrollHeight > stage.clientHeight && getComputedStyle(stage).overflowY === 'auto' ? 1e6 : 0))) };
    const badge = document.querySelector(`#s8 .${side} .kp-badge`);
    out['s8-badge'] = { radius: Math.round(parseFloat(getComputedStyle(badge).borderTopLeftRadius)) };
    return out;
}

const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
const result = {};
for (const theme of THEMES) {
    const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
    await page.goto(`http://127.0.0.1:${port}/research/kpadopt56-shared/evidence.html?theme=${theme}`);
    await page.waitForSelector('html[data-shared-ready]', { state: 'attached', timeout: 20000 });
    await page.waitForTimeout(2200);
    const [now, prop] = [await page.evaluate(measureSide, 'now'), await page.evaluate(measureSide, 'proposal')];
    // The package's own dialog, opened as a modal on a 390 x 844 phone: does it fit the window?
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    const modal = await page.evaluate(async () => {
        const d = document.querySelector('#s7 .now dialog.kp-shortcuts');
        d.close();
        d.showModal();
        await new Promise((r) => setTimeout(r, 1500));
        const r = d.getBoundingClientRect();
        const out = { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight, width: Math.round(r.width), scrolls: d.scrollHeight > d.clientHeight };
        d.close();
        return out;
    });
    await page.close();
    result[theme] = { now, prop, modal };
    console.log(theme, JSON.stringify(result[theme]));
}
await browser.close();
writeFileSync(fileURLToPath(new URL('measured.json', import.meta.url)), JSON.stringify(result, null, 1) + '\n');
writeFileSync(fileURLToPath(new URL('measured.js', import.meta.url)), `// Written by measure.mjs: do not edit.\nwindow.KP_SHARED_MEASURED = ${JSON.stringify(result)};\n`);
