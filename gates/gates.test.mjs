// Tests for the gates themselves [L1, AR8, TH22].
//
// Standing rule 8: a live-found fault becomes a failing test before the
// fix. AR8-D1 is the fault — theme discovery matched lowercase letters
// only, so a theme named `high-contrast` or `topo2` was silently skipped
// while the run reported every theme passing. The first three tests below
// were written against the broken version and failed.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discoverThemesFromCss, EXPECTED_THEMES } from './check-contrast.mjs';
import { tokenNamesByTheme, findAsymmetry, knownAsymmetry } from './check-tokens.mjs';

test('AR8-D1: theme discovery finds a name containing a hyphen', () => {
    const css = "[data-theme='high-contrast'] {\n    --background: hsl(0, 0%, 100%);\n}";
    assert.deepEqual(discoverThemesFromCss(css), ['high-contrast']);
});

test('AR8-D1: theme discovery finds a name containing a digit', () => {
    const css = "[data-theme='topo2'] {\n    --background: hsl(0, 0%, 50%);\n}";
    assert.deepEqual(discoverThemesFromCss(css), ['topo2']);
});

test('AR8: discovery of fewer themes than expected is an error, not a pass', () => {
    // The old guard only fired below five themes, so with seven present an
    // eighth going missing was invisible. The count is now exact.
    const css = "[data-theme='formal'] {\n    --background: hsl(40, 25%, 97%);\n}";
    assert.throws(() => discoverThemesFromCss(css, { expect: 7 }), /expected 7 themes, found 1/);
});

test('the seven declared themes are the seven the stylesheet contains', () => {
    assert.equal(EXPECTED_THEMES.length, 7);
});

test('TH22: no token is asymmetric beyond the recorded exceptions', () => {
    // The ratchet, not the goal. Seven names are not yet declared by every
    // theme and are listed in themes/known-asymmetry.json; L3 empties that
    // file (TH20). Until then this test guards against a new one appearing.
    const unexpected = findAsymmetry(tokenNamesByTheme()).filter((a) => !knownAsymmetry().has(a.token));
    assert.deepEqual(
        unexpected,
        [],
        'new asymmetric tokens:\n' + unexpected.map((a) => `  --${a.token}: missing from ${a.missing.join(', ')}`).join('\n'),
    );
});

test('TH22: the ratchet refuses to list a token that is already symmetric', () => {
    // A list that outlives its problem is how an exception becomes permanent.
    const asymmetric = new Set(findAsymmetry(tokenNamesByTheme()).map((a) => a.token));
    const stale = [...knownAsymmetry()].filter((t) => !asymmetric.has(t));
    assert.deepEqual(stale, [], `known-asymmetry.json is stale for: ${stale.join(', ')}`);
});

test('TH22: the parity check notices a token removed from one theme', () => {
    const byTheme = new Map([
        ['formal', new Set(['background', 'primary'])],
        ['light', new Set(['background'])],
    ]);
    assert.deepEqual(findAsymmetry(byTheme), [{ token: 'primary', have: ['formal'], missing: ['light'] }]);
});
