// research/formgrid-notes-1019/proof.mjs: shows that the alignment check, changed in this round, still catches a real
// misalignment. It builds small fixtures in the page's own stylesheets and measures each with the check as it was on
// origin/main (a copy in ~/.cache/formgrid-notes-1019/measure-align-old.mjs, from `git show origin/main:...`) and as it is now,
// and writes proof.json, which build.mjs puts on the page. A measuring script, not a test.
//
// Run (a static server on the repository root first): node research/formgrid-notes-1019/proof.mjs <port>
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { measureAlign as now } from '../_review/measure-align.mjs';

const { measureAlign: old } = await import(`${homedir()}/.cache/formgrid-notes-1019/measure-align-old.mjs`);
const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const port = process.argv[2];
if (!port) {
    console.error('usage: node research/formgrid-notes-1019/proof.mjs <port>');
    process.exit(2);
}

const seg = (/** @type {string} */ style = '') =>
    `<div style="margin-block-start: 0.75rem; ${style}"><div class="kp-segmented" role="group" aria-label="Show">
    <button type="button" class="kp-segmented__item" role="radio" aria-checked="true"><span class="kp-segmented__label">All</span></button>
    <button type="button" class="kp-segmented__item" role="radio" aria-checked="false"><span class="kp-segmented__label">Failed</span></button>
    <button type="button" class="kp-segmented__item" role="radio" aria-checked="false"><span class="kp-segmented__label">Running</span></button></div></div>`;
const rows = `<div class="kp-formgrid">
    <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="p-a">Name</label><div class="kp-formgrid__control"><input class="kp-field__input" id="p-a" value="Nightly" /></div><p class="kp-formgrid__value">listed</p><div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Rename</button></div></div>
    <div class="kp-formgrid__row"><label class="kp-formgrid__label" for="p-b">Retention</label><div class="kp-formgrid__control"><input class="kp-field__input" id="p-b" value="30 days" /></div><p class="kp-formgrid__value">kept</p><div class="kp-formgrid__actions"><button class="kp-button kp-button--sm" type="button">Save</button></div></div>
</div>`;
const sm = (/** @type {string} */ t) => `<button class="kp-button kp-button--sm" type="button">${t}</button>`;
const buttonsRow = (/** @type {string} */ sendStyle) => `<div class="kp-formgrid"><div class="kp-formgrid__row kp-formgrid__row--buttons">
    <div class="kp-formgrid__control"><div class="kp-formgrid__buttons"><button class="kp-button" type="button">Format</button><button class="kp-button" type="button">Minify</button></div></div>
    <div class="kp-formgrid__actions"><button class="kp-button kp-button--primary" type="button" style="${sendStyle}">Send test</button></div>
</div></div>`;

/** @type {{ id: string, section: string, what: string, expect: string, html: string }[]} */
const fixtures = [
    { id: 'seg-flush', section: 'check-segmented', what: 'A segmented filter flush with the list above it', expect: 'not reported', html: rows + seg() },
    { id: 'seg-off', section: 'check-segmented', what: 'The same filter 24 px right of the list’s columns', expect: 'reported', html: rows + seg('margin-inline-start: 24px') },
    { id: 'btn-line', section: 'check-buttons', what: 'Format, Minify and Send test on one line', expect: 'not reported', html: buttonsRow('') },
    { id: 'btn-off', section: 'check-buttons', what: 'Send test 9 px below Format and Minify', expect: 'reported', html: buttonsRow('transform: translateY(9px)') },
    {
        id: 'btn-chance',
        section: 'check-buttons',
        what: 'Buttons of two columns that overlap by 5 px (one button at the foot of a column, one at the head of the next)',
        expect: 'not reported',
        html: `<div style="display:flex; gap:2rem"><div>${sm('Open')}</div><div style="padding-top:23px">${sm('Details')}</div></div>`,
    },
    {
        id: 'btn-hidden',
        section: 'check-buttons',
        what: 'A button scrolled out of its box, 4 px below a visible button of the next column',
        expect: 'not reported',
        html: `<div style="display:flex; gap:2rem"><div style="block-size:28px; overflow:hidden"><p style="margin:0; block-size:36px">A list that scrolls</p>${sm('Out of sight')}</div><div><p style="margin:0; block-size:40px">The next column</p>${sm('Visible')}</div></div>`,
    },
];

const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(`http://127.0.0.1:${port}/research/formgrid-notes-1019/demo.html?theme=formal`);
await page.waitForTimeout(1500);
await page.evaluate((list) => {
    const main = /** @type {HTMLElement} */ (document.querySelector('main'));
    main.innerHTML = list
        .map((f) => `<section data-review-item="${f.id}" style="inline-size: 56rem; margin: 1rem 3rem">${f.html}</section>`)
        .join('');
}, fixtures);
await page.waitForTimeout(500);
/** @type {unknown[]} */
const out = [];
for (const f of fixtures) {
    await page.evaluate((i) => document.querySelector(`[data-review-item="${i}"]`)?.scrollIntoView({ block: 'start', behavior: 'instant' }), f.id);
    await page.waitForTimeout(100);
    const was = await page.evaluate(old, [1, f.id]);
    const is = await page.evaluate(now, [1, f.id]);
    const bad = f.expect === 'reported';
    const verdict = bad ? (is.length ? 'caught' : 'MISSED') : is.length ? 'FALSE ALARM' : 'clear';
    console.log(`${f.id}: was ${was.length}, now ${is.length} -> ${verdict}`);
    for (const l of is) console.log(`    now: ${l}`);
    out.push({ id: f.id, section: f.section, what: f.what, expect: bad ? 'reported' : 'not reported (it is aligned)', old: was, now: is });
}
await browser.close();
writeFileSync(fileURLToPath(new URL('proof.json', import.meta.url)), `${JSON.stringify({ fixtures: out }, null, 4)}\n`);
