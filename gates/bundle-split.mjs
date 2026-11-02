// The split bundle in dist/js/ [load-1102].
//
// dist/kp-themes.min.js is every module in one file: a page that boots it
// downloads the date picker, the chart and the palette whether or not it has
// one. Measured on slow 4G for habits (docs/ux/load.md, phase 3) that is the
// largest JavaScript cost of a first load. js/auto.js already asks the page
// before it fetches a module (scope-115), but a single file cannot be fetched
// in parts, so the bundle threw that away.
//
// This is the same module graph built by esbuild with `splitting: true`: one entry per `./js/<name>` export
// of package.json (gates/bundle-entries.mjs: dist/js/overlays.js, menu-button.js, shortcuts.js, core.js, ...) plus
// index.js, and a set of shared chunks, minified, as ES modules.
//
//   - dist/js/auto.js is js/auto.js: the core loads at once, and every
//     `import()` in js/auto/ becomes a chunk the page fetches only when its
//     selector matches.
//   - dist/js/index.js is the bundle's own entry (gates/generate-bundle.mjs
//     entrySource), so its names are exactly the bundle's: a namespace per
//     module plus the flat and the prefixed names. A browser does not
//     tree-shake: importing one name from it loads every chunk it names.
//   - dist/js/lazy-register.js and dist/js/core.js (js/theme-core.js) are two of those entries, for the two calls a page with lazy registers
//     makes beside the boot (attachLazyRegisters, applyTheme) without paying
//     for index.js. Measured: importing attachLazyRegisters from index.js
//     took a datatable page from 12 files to 160.
//
// Every entry imports the same chunks, so a page that boots auto.js and
// imports applyTheme from core.js holds one theme-core, one picker, one
// state, as the loose files do.
//
// Chunk names carry a hash of the chunk's own code (the version banner is on the entries only, so a release that
// changes no chunk keeps every chunk name) and a server can cache them forever. The
// list of files changes with every edit to js/; it is generated into
// gates/checksums-split.mjs for the manifest, and gates/check-manifest.mjs
// walks the entries' imports and refuses any difference.
//
// The old bundle stays exactly as it was for the consumers that load it.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as esbuild from 'esbuild';
import { entriesOf, readPackage } from './bundle-entries.mjs';
import { byCodeUnit } from './code-unit-order.mjs';

/** The folder the split bundle is written to, under dist/. */
export const SPLIT_DIR = 'js';

/** The name every shared chunk starts with; the rest is a hash of its content. */
const CHUNK_PREFIX = 'chunk-';

const ENTRY = 'kp-themes-index';


/**
 * esbuild resolves the index entry to the generated source instead of a file on disk.
 * @param {string} contents the entry's source
 * @param {string} root the folder its relative imports resolve from
 * @returns {esbuild.Plugin}
 */
function virtualEntry(contents, root) {
    return {
        name: 'kp-virtual-entry',
        setup(build) {
            build.onResolve({ filter: new RegExp(`^${ENTRY}$`) }, () => ({ path: ENTRY, namespace: 'kp-entry' }));
            build.onLoad({ filter: /.*/, namespace: 'kp-entry' }, () => ({ contents, resolveDir: root, loader: 'js' }));
        },
    };
}

/**
 * Build the split bundle in memory.
 * @param {{ root: string, version: string, entry: string }} options entry: the index entry's source
 * @returns {Promise<{ name: string, content: string }[]>} names relative to dist/, sorted
 */
export async function splitFiles({ root, version, entry }) {
    const entries = entriesOf(readPackage(root));
    const result = await esbuild.build({
        entryPoints: [...entries.map((e) => ({ in: `./${e.module}`, out: e.out })), { in: ENTRY, out: 'index' }],
        absWorkingDir: root,
        plugins: [virtualEntry(entry, root)],
        bundle: true,
        splitting: true,
        format: 'esm',
        target: 'es2022',
        minify: true,
        sourcemap: true,
        outdir: join(root, 'dist', SPLIT_DIR),
        entryNames: '[name]',
        chunkNames: `${CHUNK_PREFIX}[hash]`,
        write: false,
    });
    const prefix = join(root, 'dist') + '/';
    return result.outputFiles
        .map((file) => ({ name: file.path.slice(prefix.length), content: bannered(file.path.slice(prefix.length), file.text, version) }))
        .sort((a, b) => byCodeUnit(a.name, b.name));
}

/**
 * Put the version banner on an entry file only. A chunk's name is a hash of its content, so a banner with the version
 * in it renamed every chunk on every release and deleted the earlier release's chunks under a page that was open
 * [bunfix-1102]. The banner is one line, so an entry's source map gets one empty line of mappings in front.
 * @param {string} name file name relative to dist/
 * @param {string} text the file's text as esbuild wrote it
 * @param {string} version
 * @returns {string}
 */
function bannered(name, text, version) {
    if (name.startsWith(`${SPLIT_DIR}/${CHUNK_PREFIX}`)) return text;
    if (name.endsWith('.js')) return `${banner(version)}\n${text}`;
    if (!name.endsWith('.js.map')) return text;
    return text.replace(/("mappings":\s*")/, '$1;');
}

const banner = (/** @type {string} */ version) => `/* @kp-soft/themes v${version}, dist/js/ (gates/bundle-split.mjs). Generated; do not edit. */`;

/**
 * The types of every entry: each named one is its module's, index.js the bundle's names [homelab-1101 bundle-types].
 * @param {string} version
 * @param {string} entry the index entry's source, with `./js/` imports
 * @param {string} root
 * @returns {{ name: string, content: string }[]}
 */
export function splitTypes(version, entry, root) {
    const head = (/** @type {string} */ of) =>
        `/* @kp-soft/themes v${version} — the types of dist/js/${of}.\n   Generated by gates/generate-bundle.mjs — do not edit by hand. */\n`;
    return [
        ...entriesOf(readPackage(root)).map((e) => ({ name: `${SPLIT_DIR}/${e.out}.d.ts`, content: head(`${e.out}.js`) + `export * from '../../${e.module}';\n` })),
        { name: `${SPLIT_DIR}/index.d.ts`, content: head('index.js') + entry.replaceAll("from './js/", "from '../../js/") },
    ];
}

/**
 * The manifest list of the split bundle, as a module gates/checksums.mjs spreads into FILES.
 * @param {{ name: string }[]} files the split bundle's files, names relative to dist/
 * @returns {string}
 */
export function splitManifest(files) {
    const paths = files.filter((f) => !f.name.endsWith('.d.ts')).map((f) => `    'dist/${f.name}',`);
    return (
        '// The split bundle in dist/js/ (gates/bundle-split.mjs) for SHA256SUMS: its entries, its chunks and their maps.\n' +
        '// Generated by gates/generate-bundle.mjs — do not edit by hand; gates/check-manifest.mjs walks the imports and refuses a difference.\n' +
        `export const SPLIT_FILES = [\n${paths.join('\n')}\n];\n`
    );
}

/**
 * The files in dist/js/ that the build no longer writes: chunks of an earlier build.
 * @param {string} root
 * @param {{ name: string }[]} files the files the build writes, names relative to dist/
 * @returns {string[]} names relative to dist/
 */
export function staleSplitFiles(root, files) {
    const wanted = new Set(files.map((f) => f.name));
    let present = [];
    try {
        present = readdirSync(join(root, 'dist', SPLIT_DIR));
    } catch {
        return [];
    }
    return present.map((name) => `${SPLIT_DIR}/${name}`).filter((name) => !wanted.has(name));
}

/**
 * The split bundle as docs/MINIFIED.md describes it: the files an entry loads before it runs (its static imports,
 * followed), and the whole folder. Minified bytes only, which are the same on every machine.
 * @param {string} root
 * @returns {{ entry: string, files: number, bytes: number }[]} every entry and the whole folder (entry `*`)
 */
export function splitSummary(root) {
    const dir = join(root, 'dist', SPLIT_DIR);
    const size = (/** @type {string} */ name) => readFileSync(join(dir, name)).length;
    const closure = (/** @type {string} */ entry) => {
        const seen = new Set([entry]);
        for (const name of seen) {
            for (const m of readFileSync(join(dir, name), 'utf8').matchAll(/(?:\bfrom|\bimport)\s*"\.\/([^"]+)"/g)) seen.add(m[1]);
        }
        return { entry, files: seen.size, bytes: [...seen].reduce((sum, name) => sum + size(name), 0) };
    };
    const all = readdirSync(dir).filter((name) => name.endsWith('.js'));
    return [...entriesOf(readPackage(root)).map((e) => closure(`${e.out}.js`)), closure('index.js'), { entry: '*', files: all.length, bytes: all.reduce((sum, name) => sum + size(name), 0) }];
}
