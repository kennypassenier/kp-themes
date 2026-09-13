// Build and measure all three loading strategies, and print the table
// research/loading/README.md carries.
//
// Usage: node research/loading/run.mjs

import { fileURLToPath } from 'node:url';
import buildA from './build-a.mjs';
import buildB from './build-b.mjs';
import buildC from './build-c.mjs';
import { cell, kb, OUT, read, sizes, sum, write } from './measure.mjs';

const ORDER = /** @type {string[]} */ (JSON.parse(read('themes/order.json')));

// Today: what examples/index.html links, and what js/auto.js pulls in.
const TODAY_CSS = [
    'css/fonts.css',
    'css/themes.css',
    'css/components.css',
    'css/layout.css',
    'css/utilities.css',
    ...ORDER.map((t) => `css/${t}-register.css`),
];
/** @type {Record<string, import('./measure.mjs').Sizes>} */
const todayCss = {};
for (const f of TODAY_CSS) todayCss[f] = await sizes(read(f), 'css');
const todayCssTotal = sum(Object.values(todayCss));
const bundleMin = await sizes(read('dist/kp-themes.css'), 'css');

const a = await buildA();
const b = await buildB();
const c = await buildC();

// The demo's twin on today's route — every register linked, js/auto.js —
// so the two can be opened side by side in one browser and the readout
// compared on identical markup.
const demo = read('research/loading/demo.html');
const today = demo
    .replaceAll('href="../../css/', 'href="../../../css/')
    .replace(/\s*document\.write\([^\n]*\);\n/, '\n')
    .replace(
        '        <link rel="stylesheet" href="../../../css/utilities.css" />\n',
        '        <link rel="stylesheet" href="../../../css/utilities.css" />\n' +
            ORDER.map((t) => `        <link rel="stylesheet" href="../../../css/${t}-register.css" />\n`).join(''),
    )
    .replace(/        <script type="module">\n[\s\S]*?<\/script>\n/, '')
    .replace('<script type="module" src="./src/auto-lazy.js"></script>', '<script type="module" src="../../../js/auto.js"></script>')
    .replace('<title>kp-themes — loading research demo</title>', '<title>kp-themes — loading research demo, today’s route</title>');
if (!today.includes('titanium-register.css') || today.includes('auto-lazy') || today.includes('document.write'))
    throw new Error('the twin did not take the replacements');
write(new URL('demo-today.html', OUT), today);

const summary = {
    today: { css: todayCssTotal, cssFiles: TODAY_CSS.length, bundleCss: bundleMin, js: c.login.today.total, jsFiles: c.login.today.files.length },
    a: { cyberpunk: a.perTheme.cyberpunk, formal: a.perTheme.formal, heaviest: a.heaviest, lightest: a.lightest, allOnDisk: a.allOnDisk },
    b: { firstPaint: b.firstPaint, afterSwitch: b.afterSwitch, runtime: b.runtime, snippet: b.snippetBytes },
    c: c.login,
};
write(new URL('summary.json', OUT), JSON.stringify(summary, null, 4) + '\n');

const line = (/** @type {string[]} */ cols) => `| ${cols.join(' | ')} |`;
console.log(line(['Strategy', 'First load CSS (raw / gz; min)', 'First load JS (raw / gz; min)', 'After one theme switch']));
console.log(line(['---', '---', '---', '---']));
console.log(
    line([
        `today (examples/index.html, ${TODAY_CSS.length} sheets; js/auto.js, ${c.login.today.files.length} modules)`,
        cell(todayCssTotal),
        cell(c.login.today.total),
        '0 bytes',
    ]),
);
console.log(line(['today, dist bundle', cell(bundleMin), '(dist/kp-themes.js, see MINIFIED.md)', '0 bytes']));
console.log(
    line([
        `(a) one sheet per theme — cyberpunk`,
        cell(a.perTheme.cyberpunk),
        'as today',
        `another whole sheet, e.g. formal ${cell(a.perTheme.formal)}`,
    ]),
);
console.log(
    line([
        `(b) shared + lazy register — formal first`,
        cell(b.firstPaint.formal),
        `as today + runtime ${kb(b.runtime.raw)} raw`,
        `one register, e.g. cyberpunk ${cell(b.afterSwitch['formal → cyberpunk'])}`,
    ]),
);
console.log(line([`(c) JS split — login.html, loose`, 'as today', cell(c.login.loose.total), 'n/a (CSS unchanged)']));
console.log(
    line([
        `(c) JS split — login.html, bundled with splitting`,
        'as today',
        `${kb(c.login.bundled.bytes)} / ${kb(c.login.bundled.gz)} gz (min ${kb(c.login.bundledMin.bytes)} / ${kb(c.login.bundledMin.gz)} gz)`,
        'n/a',
    ]),
);
console.log(`\nwritten: ${fileURLToPath(OUT)}`);
