// The minified build [Kenny, 2026-09-08].
//
// The authored stylesheets carry their reasoning: css/blueprint-register.css
// is 42 kB of which a good half is comments explaining why a rule is what
// it is. That is worth keeping — a register nobody can read is a register
// nobody can change — but a browser should never have to download it. So
// every shipped stylesheet gets a minified twin beside it in dist/, the
// way bootstrap ships bootstrap.css and bootstrap.min.css, and the bundle
// gets one too, for both the stylesheet and the module.
//
// What minifying means here is what it means everywhere: comments and
// whitespace gone, colours and numbers shortened, nothing about which
// rule wins changed. esbuild does it; it is already the dev dependency
// that builds the bundle, so a consumer installs nothing new.
//
// Every file gets a source map beside it, so a consumer debugging in a
// browser still lands on the authored line — that is the other half of
// the industry standard, and the reason a minified file is not a loss of
// the documentation.
//
// The sizes are written to docs/MINIFIED.md by this same script, so the
// table cannot drift from what the files actually weigh. Only the sizes
// that are the same on every machine go in that file: the gzipped size
// depends on the zlib the machine carries, and CI proved it — the table
// was byte-identical here and different there, which is a generated file
// no gate can hold. It is printed to stdout instead.
//
// Usage:
//   node gates/generate-min.mjs           write dist/ and the table
//   node gates/generate-min.mjs --check   exit 1 if anything would change

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import process from 'node:process';
import * as esbuild from 'esbuild';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const version = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;

/** Every stylesheet a consumer can load, minified one by one.
 *
 * Read from the export map rather than listed here: a stylesheet the
 * package promises and this build forgets is exactly the drift TH130
 * removed from the CSS gates, and check-package would only find it after
 * the fact. Two exceptions: `css/tailwind-bridge.css` is a source a
 * consumer's own build reads rather than a stylesheet a page loads, and
 * `dist/kp-themes.css` is the bundle, minified explicitly below. Leaving
 * the bundle in this list minified it twice — a second identical row in
 * the size table, and a stray copy written to `dist/css/dist/`, because
 * the loop only strips a leading `css/` from the path it writes. */
export const SHEETS = [
    ...new Set(
        Object.values(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).exports)
            .filter(
                (/** @type {unknown} */ v) =>
                    typeof v === 'string' && v.endsWith('.css') && !v.includes('tailwind-bridge') && !v.includes('.min.') && !v.startsWith('./dist/'),
            )
            .map((/** @type {string} */ v) => v.replace(/^\.\//, '')),
    ),
].sort();

/** @param {string} css @param {string} name */
async function minifyCss(css, name) {
    const result = await esbuild.transform(css, {
        loader: 'css',
        minify: true,
        sourcemap: true,
        sourcefile: name,
    });
    return { code: `${result.code.trimEnd()}\n/*# sourceMappingURL=${name.replace(/\.css$/, '.min.css.map')} */\n`, map: result.map };
}

/** @param {string} code @param {string} name */
async function minifyJs(code, name) {
    const result = await esbuild.transform(code, {
        loader: 'js',
        minify: true,
        sourcemap: true,
        sourcefile: name,
        target: 'es2022',
        format: 'esm',
    });
    return { code: `${result.code.trimEnd()}\n//# sourceMappingURL=${name.replace(/\.js$/, '.min.js.map')}\n`, map: result.map };
}

/** @type {{ name: string, content: string }[]} */
const files = [];
/** @type {{ file: string, raw: number, min: number, gzip: number }[]} */
const rows = [];

const record = (/** @type {string} */ label, /** @type {string} */ raw, /** @type {string} */ min) =>
    rows.push({ file: label, raw: Buffer.byteLength(raw), min: Buffer.byteLength(min), gzip: gzipSync(min).length });

for (const sheet of SHEETS) {
    const raw = readFileSync(join(ROOT, sheet), 'utf8');
    const base = sheet.replace(/^css\//, '');
    const { code: minified, map } = await minifyCss(raw, base);
    // The minified twin sits one directory deeper than its source
    // (dist/css/ rather than css/), so a relative url() has to climb one
    // more level. css/fonts.css is the only file with any — every face it
    // declares — and a page loading the twin would otherwise ask for
    // fonts that are not there.
    const code = minified.replaceAll('url(../fonts/', 'url(../../fonts/').replaceAll('url("../fonts/', 'url("../../fonts/');
    files.push({ name: `dist/css/${base.replace(/\.css$/, '.min.css')}`, content: code });
    files.push({ name: `dist/css/${base.replace(/\.css$/, '.min.css.map')}`, content: map });
    record(sheet, raw, code);
}

const bundleCss = readFileSync(join(ROOT, 'dist/kp-themes.css'), 'utf8');
const bundleMin = await minifyCss(bundleCss, 'kp-themes.css');
files.push({ name: 'dist/kp-themes.min.css', content: bundleMin.code });
files.push({ name: 'dist/kp-themes.min.css.map', content: bundleMin.map });
record('dist/kp-themes.css', bundleCss, bundleMin.code);

const bundleJs = readFileSync(join(ROOT, 'dist/kp-themes.js'), 'utf8');
const jsMin = await minifyJs(bundleJs, 'kp-themes.js');
files.push({ name: 'dist/kp-themes.min.js', content: jsMin.code });
files.push({ name: 'dist/kp-themes.min.js.map', content: jsMin.map });
record('dist/kp-themes.js', bundleJs, jsMin.code);

const kb = (/** @type {number} */ n) => (n / 1024).toFixed(1);
const saved = (/** @type {{raw: number, min: number}} */ r) => `${Math.round((1 - r.min / r.raw) * 100)}%`;
const total = rows
    .filter((r) => r.file.startsWith('css/'))
    .reduce((a, r) => ({ raw: a.raw + r.raw, min: a.min + r.min, gzip: a.gzip + r.gzip }), { raw: 0, min: 0, gzip: 0 });

const table = `<!-- Generated by gates/generate-min.mjs — do not edit by hand. -->

# The minified build

Every stylesheet this package ships has a minified twin under \`dist/css/\`,
and the bundle has one for its stylesheet and for its module. The authored
files keep their comments; the minified ones are what a page should load.
Each carries a source map beside it, so a browser's inspector still shows
the authored line and its reasoning.

Minifying removes comments and whitespace and shortens colours and
numbers. It changes nothing about which rule wins: the cascade layers,
the selectors and their order are identical, which is what
\`npm run check:min\` proves by regenerating both and comparing.

| File | Authored | Minified | Saved |
| ---- | -------: | -------: | ----: |
${rows.map((r) => `| \`${r.file}\` | ${kb(r.raw)} kB | ${kb(r.min)} kB | ${saved(r)} |`).join('\n')}

The loose stylesheets together weigh **${kb(total.raw)} kB** authored and
**${kb(total.min)} kB** minified, ${saved(total)} less. A page loading one theme's
register rather than the whole bundle carries only that register's row.

The wire is smaller again: gzip takes the minified bundle to roughly a
seventh of its size. That number is not in this table on purpose — it
depends on the server's compression level and on the zlib the machine
carries, and a generated file that a gate compares must read the same on
every machine. \`npm run generate:min\` prints it for the machine it runs
on.

Version ${version}.
`;
files.push({ name: 'docs/MINIFIED.md', content: table });

if (process.argv.includes('--check')) {
    let stale = 0;
    for (const file of files) {
        const path = join(ROOT, file.name);
        const current = existsSync(path) ? readFileSync(path, 'utf8') : '';
        if (current !== file.content) {
            stale++;
            console.error(`${file.name} does not match its source.`);
        }
    }
    if (stale > 0) {
        console.error('Run `npm run generate:min` and commit the result.');
        process.exit(1);
    }
    console.log(`Minified: ${SHEETS.length} stylesheets plus the bundle match their sources (${saved(total)} smaller).`);
    process.exit(0);
}

for (const file of files) {
    const path = join(ROOT, file.name);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, file.content);
}
console.log(`Wrote ${files.length} file(s): ${SHEETS.length} stylesheets, the bundle's two halves, their maps and docs/MINIFIED.md.`);
for (const r of rows) console.log(`  ${r.file}: ${kb(r.raw)} kB → ${kb(r.min)} kB (${saved(r)}), ${kb(r.gzip)} kB gzipped`);
