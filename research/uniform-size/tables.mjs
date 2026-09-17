// Writes the measured tables into demo.html between its <!-- tables:… -->
// markers, and today's index order into its script, from summary.json.
//
//   node research/uniform-size/measure.mjs && node research/uniform-size/analyze.mjs && node research/uniform-size/tables.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('./', import.meta.url));
const s = JSON.parse(readFileSync(`${HERE}summary.json`, 'utf8'));
const THEMES = JSON.parse(readFileSync(`${HERE}../../themes/order.json`, 'utf8'));
const OPTIONS = ['a', 'b', 'c', 'd', 'e'];
const chosen = new Set(Object.values(s.chosen));
const f2 = (v) => v.toFixed(2);
const f3 = (v) => v.toFixed(3);

const order = s['a-comfortable'].index.map(([t]) => t);
const idx = Object.fromEntries(OPTIONS.map((o) => [o, Object.fromEntries(s[`${o}-comfortable`].index)]));
const compact = Object.fromEntries(s['a-compact'].index);

let index = `<table class="kp-table" aria-label="Size index per theme and option">
                        <caption>Size index, comfortable density (A compact in the last column)</caption>
                        <thead><tr><th scope="col">Theme</th>${OPTIONS.map((o) => `<th scope="col" class="kp-text-end">${o.toUpperCase()}</th>`).join('')}<th scope="col" class="kp-text-end">A compact</th></tr></thead>
                        <tbody>\n`;
for (const t of order) {
    const role = t === s.chosen.largest ? ' (largest)' : t === s.chosen.median ? ' (median)' : t === s.chosen.smallest ? ' (smallest)' : '';
    index += `                            <tr${chosen.has(t) ? ' class="demo-chosen"' : ''}><td>${t}${role}</td>${OPTIONS.map((o) => `<td class="kp-text-end">${f3(idx[o][t])}</td>`).join('')}<td class="kp-text-end">${f3(compact[t])}</td></tr>\n`;
}
index += '                        </tbody>\n                    </table>';

const COLS = ['form', 'shell', 'tabs', 'table', 'dialog', 'total', 'page'];
const LABEL = { total: 'column', page: 'settings page' };
let spread = `<table class="kp-table" aria-label="Spread per composite and option">
                        <caption>Tallest ÷ shortest, across all 22 themes; last two columns across the three</caption>
                        <thead><tr><th scope="col">Option</th>${COLS.map((c) => `<th scope="col" class="kp-text-end">${LABEL[c] ?? c}</th>`).join('')}<th scope="col" class="kp-text-end">form (3)</th><th scope="col" class="kp-text-end">column (3)</th></tr></thead>
                        <tbody>\n`;
for (const key of [...OPTIONS.map((o) => `${o}-comfortable`), 'a-compact']) {
    const r = s[key];
    spread += `                            <tr><td>${key.replace('-comfortable', '').replace('-compact', ' compact').toUpperCase()}</td>${COLS.map((c) => `<td class="kp-text-end">${f2(r.composites[c].ratio)}</td>`).join('')}<td class="kp-text-end">${f2(r.three.form.ratio)}</td><td class="kp-text-end">${f2(r.three.total.ratio)}</td></tr>\n`;
}
spread += '                        </tbody>\n                    </table>';

let html = readFileSync(`${HERE}demo.html`, 'utf8');
const put = (name, body) => {
    html = html.replace(
        new RegExp(`(<!-- tables:${name} -->)[\\s\\S]*?(<!-- /tables:${name} -->)`),
        `$1\n                    ${body}\n                    $2`,
    );
};
put('index', index);
put('spread', spread);
html = html.replace(/\/\* order:start \*\/[\s\S]*?\/\* order:end \*\//, `/* order:start */ ${JSON.stringify(order)} /* order:end */`);
writeFileSync(`${HERE}demo.html`, html);
if (THEMES.length !== order.length) throw new Error('index is missing a theme');
console.log('demo.html tables written');
