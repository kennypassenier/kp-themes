// A version bump is not a change to a block [scope-114].
//
// The block hash reads a digest of the code. `css/themes.css` and
// `js/theme-registry.js` carry the package version, and both are generated,
// so a release that only raises the number would otherwise send all 3062
// block/theme pairs back to Kenny — measured on 2026-09-17, when 6.0.0 → 6.1.0
// moved the shared digest from 12cbc666 to 73ee754d.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withoutTheVersion, codeVersion } from './generate-code-version.mjs';

test('a version is read as <version>, in every shape the artefacts carry it [scope-114]', () => {
    assert.equal(withoutTheVersion('/* @kp-soft/themes v6.0.0 — css/themes.css'), '/* @kp-soft/themes <version> — css/themes.css');
    assert.equal(withoutTheVersion("    --kp-themes-version: '6.0.0';"), "    --kp-themes-version: '<version>';");
    assert.equal(withoutTheVersion("export const VERSION = '6.1.0-rc.1';"), "export const VERSION = '<version>';");
    // Not a version: a token scale, a date, a selector.
    assert.equal(withoutTheVersion('--kp-space-2: 0.5rem;'), '--kp-space-2: 0.5rem;');
    assert.equal(withoutTheVersion('grid-template-columns: 1fr 2fr;'), 'grid-template-columns: 1fr 2fr;');
});

test('the digests are there, one per theme, and the shared one is a digest', () => {
    const { shared, themes } = codeVersion();
    assert.match(shared, /^[0-9a-f]{32}$/);
    assert.equal(Object.keys(themes).length, 22);
    for (const [name, digest] of Object.entries(themes)) assert.match(digest, /^[0-9a-f]{32}$/, name);
    // Two themes do not share a digest: a change to one asks about one.
    assert.equal(new Set(Object.values(themes)).size, 22);
});
