// Reads research/uniform-size/measurements.json and prints the size index,
// the spread per element and per option, as Markdown. Also writes
// research/uniform-size/summary.json, which demo.html reads nothing from (the
// demo measures itself live) but the README's tables come from.
//
//   node research/uniform-size/analyze.mjs [--detail] [--in measurements-implemented.json]
//
// --in reads another measurement file and writes summary-<its suffix>.json
// beside it, so the research's own summary.json stays as it was measured.
//
// The size index of a theme is the geometric mean, over the 19 index elements, of
//   height(theme, element) / median over the 22 themes of height(·, element).
// 1.00 is a theme exactly as tall as the typical theme; 1.10 is 10% taller.
// (A median of the ratios was tried first: 14 themes tied at 1.00, because
// most elements sit exactly on the median, so it could not name a smallest.)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('./', import.meta.url));
const args = process.argv.slice(2);
const IN = args.includes('--in') ? args[args.indexOf('--in') + 1] : 'measurements.json';
const SUMMARY = IN === 'measurements.json' ? 'summary.json' : IN.replace(/^measurements/, 'summary');
const data = JSON.parse(readFileSync(`${HERE}${IN}`, 'utf8'));
const THEMES = JSON.parse(readFileSync(`${HERE}../../themes/order.json`, 'utf8'));
const detail = args.includes('--detail');

export const INDEX_ELEMENTS = [
    'button',
    'button-sm',
    'input',
    'select',
    'combobox',
    'checkbox',
    'switch',
    'tab',
    'badge',
    'alert',
    'table-head',
    'table-row',
    'nav',
    'nav-link',
    'sidenav-item',
    'page-link',
    'dialog-title',
    'card-title',
    'field-label',
];
const COMPOSITES = ['form', 'shell', 'tabs', 'table', 'dialog'];

const median = (xs) => {
    const s = [...xs].sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const r2 = (x) => Math.round(x * 100) / 100;
const r1 = (x) => Math.round(x * 10) / 10;

function spread(run, get, themes = THEMES) {
    const vals = themes.map((t) => [t, get(run[t])]);
    const min = vals.reduce((a, b) => (b[1] < a[1] ? b : a));
    const max = vals.reduce((a, b) => (b[1] > a[1] ? b : a));
    return { min: min[1], minTheme: min[0], max: max[1], maxTheme: max[0], ratio: r2(max[1] / min[1]), median: median(vals.map((v) => v[1])) };
}

function sizeIndex(run) {
    const med = Object.fromEntries(INDEX_ELEMENTS.map((e) => [e, median(THEMES.map((t) => run[t].elements[e].height))]));
    const geo = (xs) => Math.exp(xs.reduce((a, x) => a + Math.log(x), 0) / xs.length);
    const idx = THEMES.map((t) => [t, Math.round(geo(INDEX_ELEMENTS.map((e) => run[t].elements[e].height / med[e])) * 1000) / 1000]);
    return idx.sort((a, b) => b[1] - a[1]);
}

const summary = {};
for (const [key, run] of Object.entries(data.runs)) {
    const index = sizeIndex(run);
    const elements = Object.fromEntries(INDEX_ELEMENTS.map((e) => [e, spread(run, (m) => m.elements[e].height)]));
    const composites = Object.fromEntries(COMPOSITES.map((c) => [c, spread(run, (m) => m.composites[c])]));
    composites.total = spread(run, (m) => m.total);
    composites.page = spread(run, (m) => m.page.column);
    summary[key] = { index, elements, composites };
}

// The three columns of the demo are chosen once, on today's package.
const base = summary['a-comfortable'].index;
const largest = base[0][0];
const smallest = base[base.length - 1][0];
const medianTheme = base[(base.length - 1) >> 1][0];
summary.chosen = { largest, median: medianTheme, smallest };

const three = [largest, medianTheme, smallest];
for (const [key, run] of Object.entries(data.runs)) {
    summary[key].three = Object.fromEntries(
        [...COMPOSITES, 'total', 'page'].map((c) => {
            const get = c === 'total' ? (m) => m.total : c === 'page' ? (m) => m.page.column : (m) => m.composites[c];
            return [c, spread(run, get, three)];
        }),
    );
}

writeFileSync(`${HERE}${SUMMARY}`, JSON.stringify(summary, null, 1) + '\n');

// The size tokens themselves: how many distinct values each has across the 22.
const tokenValues = {};
for (const t of THEMES) {
    for (const e of JSON.parse(readFileSync(`${HERE}../../themes/${t}/tokens.json`, 'utf8')).entries) {
        if (e.token && /^kp-(space|text)-/.test(e.token)) (tokenValues[e.token] ??= new Set()).add(e.value);
    }
}
console.log(
    'distinct values per size token across the 22 tokens.json: ' +
        Object.entries(tokenValues)
            .map(([k, v]) => `${k} ${v.size}`)
            .join(', ') +
        '\n',
);

console.log(`chosen: largest ${largest}, median ${medianTheme}, smallest ${smallest}\n`);
console.log('| run | ' + [...COMPOSITES, 'total', 'page'].map((c) => `${c} (22)`).join(' | ') + ' | form (3) | total (3) | page (3) |');
console.log('|' + ' --- |'.repeat(COMPOSITES.length + 5));
for (const key of Object.keys(data.runs)) {
    const s = summary[key];
    console.log(
        `| ${key} | ` +
            [...COMPOSITES, 'total', 'page'].map((c) => `${s.composites[c].ratio}`).join(' | ') +
            ` | ${s.three.form.ratio} | ${s.three.total.ratio} | ${s.three.page.ratio} |`,
    );
}
for (const key of Object.keys(data.runs)) {
    if (!detail && key !== 'a-comfortable') continue;
    const s = summary[key];
    console.log(`\n## ${key}\n\nindex: ${s.index.map(([t, v]) => `${t} ${v.toFixed(2)}`).join(', ')}\n`);
    console.log('| element | min px (theme) | median px | max px (theme) | max/min |\n| --- | --- | --- | --- | --- |');
    for (const [e, v] of Object.entries({ ...s.elements, ...s.composites }))
        console.log(`| ${e} | ${r1(v.min)} (${v.minTheme}) | ${r1(v.median)} | ${r1(v.max)} (${v.maxTheme}) | ${v.ratio} |`);
}
