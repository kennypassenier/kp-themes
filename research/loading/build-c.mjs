// Strategy (c): the JS split, measured for examples/login.html.
//
// Two routes are measured, because consumers take both:
//   loose   — the modules as files, the way examples/ and kyu load them:
//             the entry fetches each module it needs by URL, and each
//             module's own static imports come with it.
//   bundled — esbuild with code splitting: one entry chunk, shared chunks
//             for what several modules import, and one chunk per lazy
//             module. The set a page fetches is traced from the metafile.
//
// Which modules fire for a page is decided by its markup: the same
// selectors src/auto-lazy.js asks the DOM, applied to the HTML as text
// (an attribute name, a class, a tag). research/loading/demo.html then
// checks that answer in a browser, where the network log is the truth.
//
// Usage: node research/loading/build-c.mjs

import { readFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { gz, OUT, read, ROOT, sizes, sum, write } from './measure.mjs';
import { HOOK_NAMES, splitEffects } from './split-effects.mjs';
import { NEEDS } from './src/auto-lazy.js';

const ENTRY = fileURLToPath(new URL('src/auto-lazy.js', import.meta.url));
/** The element each effects hook fires on; the other four fire on a theme knob, which login under formal does not set. */
const HOOK_ELEMENTS = {
    headline: '[data-kp-reveal="headline"]',
    emphasis: 'mark',
    rule: '[data-kp-reveal="rule"]',
    count: '[data-kp-count]',
    marquee: '[data-kp-marquee]',
};

/**
 * Does this markup carry something the selector would match? A text
 * heuristic over the same selector list the entry asks the DOM.
 *
 * @param {string} html
 * @param {string} selectorList
 */
export function markupHas(html, selectorList) {
    return selectorList.split(',').some((raw) => {
        const selector = raw.trim();
        let m;
        if ((m = /^\[([a-z-]+)(?:="([^"]+)")?\]$/.exec(selector))) {
            const [, attr, value] = m;
            if (value !== undefined) return html.includes(`${attr}="${value}"`);
            // The effects root attribute is set by the head snippet rather
            // than written on <html>; the snippet's own text says so.
            if (attr === 'data-kp-effects') return html.includes('setAttribute("data-kp-effects"');
            return new RegExp(`\\s${attr}(?=[\\s=>/])`).test(html);
        }
        if ((m = /^\.([a-z0-9_-]+)$/.exec(selector))) return new RegExp(`class="[^"]*\\b${m[1]}\\b`).test(html);
        return new RegExp(`<${selector}[\\s>]`).test(html);
    });
}

/**
 * Every file a module reaches through STATIC imports, itself included.
 * esbuild's metafile also lists what a module `import()`s; those are the
 * lazy half, and a loose page only fetches them when they fire.
 *
 * @param {string} file absolute
 */
async function graph(file) {
    const r = await esbuild.build({
        entryPoints: [file],
        bundle: true,
        format: 'esm',
        write: false,
        metafile: true,
        target: 'es2022',
        logLevel: 'silent',
    });
    const inputs = r.metafile.inputs;
    const start = Object.keys(inputs).find((k) => fileURLToPath(new URL(k, ROOT)) === file);
    if (!start) throw new Error(`${file} is not in its own metafile`);
    /** @type {Set<string>} */
    const seen = new Set();
    const walk = (/** @type {string} */ k) => {
        if (seen.has(k)) return;
        seen.add(k);
        for (const imp of inputs[k].imports) if (imp.kind === 'import-statement' && imp.path in inputs) walk(imp.path);
    };
    walk(start);
    return [...seen];
}

/** The modules and hooks a page's markup fires. @param {string} html */
export function firesFor(html) {
    const modules = NEEDS.filter((n) => markupHas(html, n.when)).map((n) => n.name);
    const hooks = Object.entries(HOOK_ELEMENTS)
        .filter(([, sel]) => markupHas(html, sel))
        .map(([h]) => h);
    return { modules, hooks };
}

/**
 * Bundle the entry with splitting and trace what a page fetches.
 *
 * @param {boolean} minify
 * @param {{ modules: string[], hooks: string[] }} fires
 */
async function bundle(minify, fires) {
    const outdir = fileURLToPath(new URL(minify ? 'c/dist-min/' : 'c/dist/', OUT));
    // Chunk names carry a content hash, so a stale chunk from an earlier
    // build would otherwise sit beside the new one.
    rmSync(outdir, { recursive: true, force: true });
    const r = await esbuild.build({
        entryPoints: [ENTRY],
        bundle: true,
        splitting: true,
        format: 'esm',
        outdir,
        metafile: true,
        minify,
        target: 'es2022',
        logLevel: 'silent',
    });
    const outputs = r.metafile.outputs;
    // With splitting, every `import()` target is an entry point of its
    // own in the metafile, so the one that IS the page's entry is found
    // by path rather than by the field being set.
    const entryOut = Object.keys(outputs).find((k) => outputs[k].entryPoint && fileURLToPath(new URL(outputs[k].entryPoint, ROOT)) === ENTRY);
    if (!entryOut) throw new Error('no entry output');
    /** @param {string} from @param {Set<string>} into */
    const trace = (from, into) => {
        if (into.has(from)) return;
        into.add(from);
        for (const imp of outputs[from].imports) if (imp.kind === 'import-statement') trace(imp.path, into);
    };
    // A dynamic import's chunk is an entry point of its own; its
    // `entryPoint` names the source module, which is how the chunk is
    // matched to the NEEDS row (or the effects hook) that fires it.
    const sourceOf = (/** @type {string} */ chunk) => outputs[chunk].entryPoint?.split('/').pop() ?? '';
    const set = new Set();
    trace(entryOut, set);
    for (const imp of outputs[entryOut].imports) {
        if (imp.kind !== 'dynamic-import') continue;
        const need = NEEDS.find((n) => n.load.toString().includes(`/${sourceOf(imp.path)}'`));
        if (need && fires.modules.includes(need.name)) trace(imp.path, set);
    }
    for (const chunk of [...set]) {
        for (const imp of outputs[chunk].imports) {
            if (imp.kind !== 'dynamic-import') continue;
            if (fires.hooks.includes(sourceOf(imp.path).replace(/\.js$/, ''))) trace(imp.path, set);
        }
    }
    const files = [...set];
    const chunks = Object.keys(outputs).filter((k) => k.endsWith('.js'));
    return {
        outdir,
        chunks: chunks.length,
        allBytes: chunks.reduce((a, k) => a + outputs[k].bytes, 0),
        files,
        bytes: files.reduce((a, k) => a + outputs[k].bytes, 0),
        gz: files.reduce((a, k) => a + gz(readFileSync(new URL(k, ROOT), 'utf8')), 0),
    };
}

export default async function buildC() {
    const split = splitEffects();

    /** @type {Record<string, import('./measure.mjs').Sizes>} */
    const effects = {};
    effects['effects-core.js'] = await sizes(read('research/loading/out/c/js/effects-core.js'), 'js');
    for (const name of HOOK_NAMES)
        effects[`effects-hooks/${name}.js`] = await sizes(read(`research/loading/out/c/js/effects-hooks/${name}.js`), 'js');
    const effectsOriginal = await sizes(read('js/effects.js'), 'js');

    const login = read('examples/login.html');
    const fires = firesFor(login);

    // Loose: the entry's static graph plus each fired module's static graph.
    const loose = new Set(await graph(ENTRY));
    for (const n of NEEDS) {
        if (!fires.modules.includes(n.name)) continue;
        const src = /import\('([^']+)'\)/.exec(n.load.toString())?.[1];
        if (!src) throw new Error(`no import() in ${n.name}`);
        for (const f of await graph(fileURLToPath(new URL(src, new URL('src/', import.meta.url))))) loose.add(f);
    }
    /** @type {Record<string, import('./measure.mjs').Sizes>} */
    const looseFiles = {};
    for (const f of [...loose].sort()) looseFiles[f] = await sizes(read(f), 'js');

    // Today's js/auto.js, loose, for the same page: everything, whatever the markup.
    /** @type {Record<string, import('./measure.mjs').Sizes>} */
    const todayFiles = {};
    for (const f of (await graph(fileURLToPath(new URL('js/auto.js', ROOT)))).sort()) todayFiles[f] = await sizes(read(f), 'js');

    const bundled = await bundle(false, fires);
    const bundledMin = await bundle(true, fires);

    const result = {
        strategy: 'c',
        effectsSplit: { sections: split.sections, files: effects, original: effectsOriginal, sharedNames: split.shared.length },
        login: {
            fired: fires.modules,
            firedHooks: fires.hooks,
            loose: { files: looseFiles, total: sum(Object.values(looseFiles)) },
            today: { files: Object.keys(todayFiles), total: sum(Object.values(todayFiles)) },
            bundled,
            bundledMin,
        },
    };
    write(new URL('c/sizes.json', OUT), JSON.stringify(result, null, 4) + '\n');
    return result;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const r = await buildC();
    console.log(`(c) login fires: ${r.login.fired.join(', ')}; hooks: ${r.login.firedHooks.join(', ') || 'none'}`);
    console.log(
        `  loose today ${r.login.today.total.raw} raw ${r.login.today.total.rawGz} gz | min ${r.login.today.total.min} ${r.login.today.total.minGz} gz`,
    );
    console.log(
        `  loose split ${r.login.loose.total.raw} raw ${r.login.loose.total.rawGz} gz | min ${r.login.loose.total.min} ${r.login.loose.total.minGz} gz`,
    );
    console.log(
        `  bundled split ${r.login.bundled.bytes} raw ${r.login.bundled.gz} gz | min ${r.login.bundledMin.bytes} ${r.login.bundledMin.gz} gz (${r.login.bundledMin.chunks} chunks on disk)`,
    );
    for (const [f, s] of Object.entries(r.effectsSplit.files)) console.log(`  ${f} ${s.raw} raw ${s.rawGz} gz | min ${s.min} ${s.minGz} gz`);
}
