// Tests for the gates themselves [L1, AR8, TH22]: theme discovery, token parity, badge rules.
//
// Standing rule 8: a live-found fault becomes a failing test before the
// fix. AR8-D1 is the fault: theme discovery matched lowercase letters
// only, so a theme named `high-contrast` or `topo2` was silently skipped
// while the run reported every theme passing. The first three tests below
// were written against the broken version and failed.
//
// Run: node --test gates/ (the other gates-*.test.mjs files hold the other topics).

import { test } from 'node:test';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { unsubscribedPreferenceReads } from './check-motion.mjs';
import assert from 'node:assert/strict';
import { discoverThemesFromCss, EXPECTED_THEMES, STATUS_NAMES } from './check-contrast.mjs';
import { findAsymmetry, tokenNamesByTheme, knownAsymmetry } from './check-tokens.mjs';

test('DI7: the preference scan reads plain modules, not only React ones', () => {
    // The audit of 2026-09-08 found this function filtering on `.jsx` and
    // pointed at `js/`, which holds none — so it read zero files and
    // passed forever while its own comment promised the opposite. This
    // test fails the moment the filter narrows again.
    const dir = mkdtempSync(join(tmpdir(), 'kp-di7-'));
    writeFileSync(
        join(dir, 'reads-and-listens.js'),
        "const q = matchMedia('(prefers-reduced-motion: reduce)');\nq.addEventListener('change', () => {});\n",
    );
    writeFileSync(join(dir, 'reads-and-forgets.js'), "const q = matchMedia('(prefers-reduced-motion: reduce)');\nif (q.matches) stop();\n");
    const found = unsubscribedPreferenceReads(dir);
    assert.deepEqual(
        found.map((p) => p.file),
        ['reads-and-forgets.js'],
        'a module that reads the preference and never listens is named; one that subscribes is not',
    );
    rmSync(dir, { recursive: true, force: true });
});

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

test('the declared themes are exactly the themes the stylesheet contains', () => {
    // This used to assert the number seven, which made adding an eighth
    // theme look like a regression. The name always promised the
    // property; now it checks it. A theme in order.json but not in the
    // stylesheet, or the reverse, is what this is for.
    const css = readFileSync(new URL('../css/themes.css', import.meta.url), 'utf8');
    assert.deepEqual([...discoverThemesFromCss(css)].sort(), [...EXPECTED_THEMES].sort());
});

test('TH22: no token is asymmetric beyond the recorded exceptions', () => {
    // The ratchet, not the goal. Seven names are not yet declared by every
    // theme and are listed in themes/known-asymmetry.json; L3 empties that
    // file (TH20). Until then this test guards against a new one appearing.
    const unexpected = findAsymmetry(tokenNamesByTheme()).filter((a) => !knownAsymmetry().has(a.token));
    assert.deepEqual(
        unexpected,
        [],
        // scope-76: this test is the commit's token-parity gate now, so it
        // refuses in the words gates/check-tokens.mjs always used.
        `${unexpected.length} token name(s) are not declared by every theme (TH22):\n` +
            unexpected.map((a) => `  --${a.token}\n      declared by: ${a.have.join(', ')}\n      missing from: ${a.missing.join(', ')}`).join('\n'),
    );
});

test('TH22: the ratchet refuses to list a token that is already symmetric', () => {
    // A list that outlives its problem is how an exception becomes permanent.
    const asymmetric = new Set(findAsymmetry(tokenNamesByTheme()).map((a) => a.token));
    const stale = [...knownAsymmetry()].filter((t) => !asymmetric.has(t));
    assert.deepEqual(stale, [], `themes/known-asymmetry.json lists ${stale.length} token(s) that are now declared everywhere: ${stale.join(', ')}`);
});

test('TH22: the parity check notices a token removed from one theme', () => {
    const byTheme = new Map([
        ['formal', new Set(['background', 'primary'])],
        ['light', new Set(['background'])],
    ]);
    assert.deepEqual(findAsymmetry(byTheme), [{ token: 'primary', have: ['formal'], missing: ['light'] }]);
});

test('R5-BADGE: every status has a badge rule, and every badge rule has a status', () => {
    // The plate used to be an inline style, so a server-rendered page
    // could not have a coloured badge without breaking TH109's bar. The
    // rules in css/components.css carry it now, and this test is what
    // keeps them tied to the one list that already exists -- the same
    // STATUS_NAMES the contrast gate holds all 24 themes to. Drill:
    // delete one rule and it names the status; add a rule for a name that
    // is not a status and it names that.
    const css = readFileSync(new URL('../css/components.css', import.meta.url), 'utf8');
    const declared = [...css.matchAll(/\.kp-badge\[data-status='([a-z-]+)'\]/g)].map((m) => m[1]);
    for (const name of STATUS_NAMES) {
        assert.ok(declared.includes(name), `no .kp-badge[data-status='${name}'] rule in css/components.css`);
        const rule = new RegExp(
            `\\.kp-badge\\[data-status='${name}'\\]\\s*\\{[^}]*background:\\s*var\\(--status-${name}\\)[^}]*color:\\s*var\\(--status-${name}-foreground\\)`,
            's',
        );
        assert.match(css, rule, `the ${name} rule does not paint both halves of its own token pair`);
    }
    for (const name of declared) {
        assert.ok(STATUS_NAMES.includes(name), `.kp-badge[data-status='${name}'] is a rule for something that is not a status`);
    }
    assert.equal(declared.length, STATUS_NAMES.length);
});
