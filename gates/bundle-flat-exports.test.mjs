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
