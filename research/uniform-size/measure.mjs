// Measures every element of research/uniform-size/frame.html and the main
// column of examples/settings.html in all 22 themes, for each option's
// override stylesheet, in firefox at a 1400 px wide viewport.
//
//   node research/uniform-size/measure.mjs            all options, firefox
//   node research/uniform-size/measure.mjs --options a --engine chromium
//   node research/uniform-size/measure.mjs --options a --out measurements-implemented.json
//                                                     the package as built, no option sheet
//
// Writes research/uniform-size/measurements.json (or measurements-<engine>.json
// for another engine). Serves the worktree itself on a free port and closes
// that server when it is done: nothing is left running.

import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { firefox, chromium } from '/home/kenny/Projects/kp-themes/node_modules/playwright/index.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const HERE = fileURLToPath(new URL('./', import.meta.url));
const args = process.argv.slice(2);
const arg = (name, fallback) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : fallback;
};
const ENGINE = arg('engine', 'firefox');
const OPTIONS = arg('options', 'a,b,c,d,e').split(',');
const THEMES = JSON.parse(await readFile(join(ROOT, 'themes/order.json'), 'utf8'));
const OUT = join(HERE, arg('out', ENGINE === 'firefox' ? 'measurements.json' : `measurements-${ENGINE}.json`));

const TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.json': 'application/json',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.svg': 'image/svg+xml',
};
const server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    try {
        const body = await readFile(join(ROOT, path));
        res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
        res.end(body);
    } catch {
        res.writeHead(404);
        res.end();
    }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const BASE = `http://127.0.0.1:${server.address().port}`;

// Runs inside the column: every [data-us] element, its box and the
// properties that make the box.
function collect() {
    const px = (v) => (v === 'normal' ? v : Math.round(parseFloat(v) * 100) / 100);
    const out = {};
    for (const el of document.querySelectorAll('[data-us]')) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        // The text-bearing part: a button's label, an input itself, a row's first cell.
        const text = el.matches('tr') ? el.firstElementChild : (el.querySelector('.kp-button__label, .kp-sidenav__label, .kp-field__label') ?? el);
        const ts = getComputedStyle(text);
        out[el.dataset.us] = {
            width: Math.round(r.width * 10) / 10,
            height: Math.round(r.height * 10) / 10,
            padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(px),
            cellPadding: el.matches('tr') ? [ts.paddingTop, ts.paddingRight, ts.paddingBottom, ts.paddingLeft].map(px) : undefined,
            border: [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].map(px),
            margin: [cs.marginTop, cs.marginBottom].map(px),
            minHeight: cs.minHeight,
            gap: cs.rowGap === 'normal' && cs.columnGap === 'normal' ? 'normal' : [px(cs.rowGap), px(cs.columnGap)],
            fontSize: px(ts.fontSize),
            lineHeight: px(ts.lineHeight),
            letterSpacing: ts.letterSpacing,
            fontFamily: ts.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
            fontWeight: ts.fontWeight,
            textTransform: ts.textTransform,
        };
    }
    const composites = {};
    for (const el of document.querySelectorAll('[data-us-composite]'))
        composites[el.dataset.usComposite] = Math.round(el.getBoundingClientRect().height * 10) / 10;
    return { elements: out, composites, total: Math.round(document.querySelector('[data-us-frame]').getBoundingClientRect().height * 10) / 10 };
}

function collectPage() {
    const main = document.querySelector('main');
    const column = document.querySelector('.kp-sidebar__main') ?? main;
    return {
        main: Math.round(main.getBoundingClientRect().height * 10) / 10,
        column: Math.round(column.getBoundingClientRect().height * 10) / 10,
        columnWidth: Math.round(column.getBoundingClientRect().width),
    };
}

const browser = await (ENGINE === 'chromium' ? chromium : firefox).launch();
const context = await browser.newContext({ viewport: { width: 1400, height: 900 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const settle = async () => {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
};

const result = { engine: ENGINE, viewport: 1400, date: new Date().toISOString().slice(0, 10), frameWidth: 400, runs: {} };
const runs = [...OPTIONS.map((o) => [o, 'comfortable']), ...(OPTIONS.includes('a') ? [['a', 'compact']] : [])];
for (const [option, density] of runs) {
    const key = `${option}-${density}`;
    result.runs[key] = {};
    for (const theme of [...THEMES, 'bare']) {
        await page.goto(`${BASE}/research/uniform-size/frame.html?theme=${theme}&option=${option}&density=${density}`);
        await settle();
        const frame = await page.evaluate(collect);
        // The whole example page, with the same option stylesheet put on it.
        await page.goto(`${BASE}/examples/settings.html`);
        await page.evaluate(
            async ({ theme, option, density, sheets }) => {
                const root = document.documentElement;
                root.setAttribute('data-theme', theme);
                root.setAttribute('data-option', option);
                if (density === 'compact') root.setAttribute('data-density', 'compact');
                await Promise.all(
                    sheets.map(
                        (href) =>
                            new Promise((resolve) => {
                                const link = Object.assign(document.createElement('link'), {
                                    rel: 'stylesheet',
                                    href,
                                    onload: resolve,
                                    onerror: resolve,
                                });
                                document.head.append(link);
                            }),
                    ),
                );
            },
            { theme, option, density, sheets: ['b', 'c', 'd', 'e'].map((o) => `../research/uniform-size/option-${o}.css`) },
        );
        await settle();
        const settings = await page.evaluate(collectPage);
        result.runs[key][theme] = { ...frame, page: settings };
        process.stdout.write(`${key} ${theme} form=${frame.composites.form} total=${frame.total} page=${settings.column}\n`);
    }
}

await browser.close();
server.close();
await writeFile(OUT, JSON.stringify(result) + '\n');
console.log(`wrote ${OUT}`);
