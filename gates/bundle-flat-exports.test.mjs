// The bundle keeps a flat export for every name a split module declares in its own parts [ctrl-1030].
//
// dist/kp-themes.js exports a name flat when exactly one module declares it. Splitting a module into a facade over
// js/<name>/ moved its declarations into the parts, and the facade only re-exports them: read naively, those names were
// no longer anyone's, and 39 flat exports (applyTheme, TIMINGS, …) left the bundle. The facade's re-exports from its own
// folder count as its declarations; a name passed on from another module still does not.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { declaredNames } from './bundle-names.mjs';

const read = (/** @type {string} */ module) => readFileSync(new URL(`../${module.slice(2)}`, import.meta.url), 'utf8');

test('a facade declares what it re-exports from its own folder', () => {
    const names = declaredNames('./js/theme-core.js', read('./js/theme-core.js'));
    assert.ok(names.includes('applyTheme'), 'applyTheme lives in js/theme-core/ and is theme-core.js\'s own');
});

test('a facade whose parts live in another folder still declares them', () => {
    assert.ok(declaredNames('./js/effects.js', read('./js/effects.js')).includes('TIMINGS'));
});

test('a name passed on from another module is not declared', () => {
    const source = "export { THEMES } from './theme-registry.js';\nexport { a as b } from './x/one.js';\n";
    assert.deepEqual(declaredNames('./js/x.js', source), ['b']);
});

test('a name two modules declare gets a flat alias per module, and an alias collision is refused [bundle-alias-1031]', async () => {
    const { aliasFor, aliases } = await import('./bundle-names.mjs');
    assert.equal(aliasFor('./js/progressbar.js', 'setProgress'), 'progressbarSetProgress');
    assert.equal(aliasFor('./js/row-select.js', 'ROW_OPEN_EVENT'), 'ROW_SELECT_ROW_OPEN_EVENT');
    const declared = new Map([['setProgress', ['./js/progressbar.js', './js/upload.js']], ['only', ['./js/x.js']]]);
    assert.deepEqual(aliases(declared).map((a) => a.alias), ['progressbarSetProgress', 'uploadSetProgress']);
    declared.set('uploadSetProgress', ['./js/y.js']);
    assert.throws(() => aliases(declared), /collides/);
});

test('dist/kp-themes.js exports every declared name, flat or under its alias: no name is dropped silently [bundle-alias-1031]', async () => {
    const { aliases } = await import('./bundle-names.mjs');
    // The published modules, read from the export map as gates/generate-bundle.mjs does (it builds on import, so it is not imported here).
    const exportsMap = JSON.parse(read('./package.json')).exports;
    const MODULES = [...new Set(Object.values(exportsMap).map((v) => (typeof v === 'string' ? v : v?.default)))]
        .filter((v) => typeof v === 'string' && /^\.\/js\/[a-z-]+\.js$/.test(v))
        .sort();
    /** @type {Map<string, string[]>} */
    const declared = new Map();
    for (const module of MODULES) for (const name of declaredNames(module, read(module))) declared.set(name, [...(declared.get(name) ?? []), module]);
    // A URL rather than a literal path, so the type check does not follow it into the generated bundle.
    const bundle = await import(new URL('../dist/kp-themes.js', import.meta.url).href);
    const expected = [...declared].filter(([, m]) => m.length === 1).map(([n]) => n).concat(aliases(declared).map((a) => a.alias));
    const missing = expected.filter((name) => !(name in bundle));
    assert.deepEqual(missing, [], `${missing.length} name(s) the bundle dropped`);
    assert.ok(MODULES.length > 100);
});

test('a name imported from the facade\'s folder and exported bare is declared [qty-1103]', () => {
    const source = "import { getQuantity, inputOf } from './quantity/read.js';\nexport { getQuantity };\n";
    assert.deepEqual(declaredNames('./js/quantity.js', source), ['getQuantity']);
    assert.ok(declaredNames('./js/quantity.js', read('./js/quantity.js')).includes('getQuantity'));
});
