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
import { readFileSync } from 'node:fs';
import { discoverThemesFromCss, EXPECTED_THEMES } from './check-contrast.mjs';
import { tokenNamesByTheme, findAsymmetry, knownAsymmetry } from './check-tokens.mjs';
import { flashesPerSecond, parseOpacityKeyframes, unguardedMotion } from './check-motion.mjs';
import { checkSecondHalves, checkStateVisibility, themes } from './check-invariants.mjs';

/** @typedef {import('./check-invariants.mjs').Theme} Theme */

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

// DI5 is the one invariant here whose violation harms a person, so its
// arithmetic is pinned rather than trusted. The numbers below are the
// shipped fx-flicker before and after L3 retimed it.

test('DI5: a run that opposes direction faster than three times a second fails', () => {
    // The old fx-flicker: six opposing swings over 1100ms = 5.5/s.
    const stops = [
        { stop: 0, opacity: 1 },
        { stop: 3, opacity: 0.4 },
        { stop: 6, opacity: 1 },
        { stop: 20, opacity: 0.3 },
        { stop: 24, opacity: 1 },
        { stop: 70, opacity: 0.5 },
        { stop: 74, opacity: 1 },
    ];
    assert.ok(flashesPerSecond(stops, 1100) > 3, 'the pre-L3 flicker must not pass');
});

test('DI5: a swing under ten percent is not a flash', () => {
    const stops = [
        { stop: 0, opacity: 1 },
        { stop: 50, opacity: 0.94 },
        { stop: 100, opacity: 1 },
    ];
    assert.equal(flashesPerSecond(stops, 100), 0);
});

test('DI5: the shipped flicker stays under the threshold', () => {
    const css = readFileSync(new URL('../css/cyberpunk-register.css', import.meta.url), 'utf8');
    const stops = parseOpacityKeyframes(css).get('fx-flicker');
    assert.ok(stops, 'fx-flicker keyframes must be readable');
    assert.ok(flashesPerSecond(stops, 2200) <= 3);
});

test('DI7: a transition inside a no-preference guard is not reported', () => {
    const css = '@media (prefers-reduced-motion: no-preference) {\n  .a { transition: opacity 1s; }\n}\n';
    assert.deepEqual(unguardedMotion(css), []);
});

test('DI7: a transition after a guard block has closed is reported', () => {
    const css = '@media (prefers-reduced-motion: no-preference) {\n  .a { transition: opacity 1s; }\n}\n.b {\n  transition: color 1s;\n}\n';
    assert.equal(unguardedMotion(css).length, 1);
});

// KT2, after the fix. These two tests were written to assert the fault
// while it stood, exactly so that repairing it would break them and force
// this rewrite. That is what happened; what follows asserts the repair.

test('KT2: every theme has a pressed state you can see', () => {
    const failures = themes().flatMap(/** @param {Theme} t */ (t) => checkStateVisibility(t).map((p) => `${t.name}: ${p}`));
    assert.deepEqual(failures, []);
});

test('KT2: the two themes that could not reach it on lightness now do', () => {
    // The whole point of letting the pressed state give up chroma. Before
    // the fix these two produced nine violations between them.
    const opted = themes().filter(/** @param {Theme} t */ (t) => ['cyberpunk', 'terminal'].includes(t.name));
    assert.equal(opted.length, 2);
    for (const theme of opted) assert.deepEqual(checkStateVisibility(theme), []);
});

test('KT2-3: a badge plate stays distinguishable from the surface under it', () => {
    const failures = themes().flatMap(/** @param {Theme} t */ (t) => checkSecondHalves(t).map((p) => `${t.name}: ${p}`));
    assert.deepEqual(failures, []);
});
