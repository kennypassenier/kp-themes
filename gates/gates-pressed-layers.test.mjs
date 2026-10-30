// Tests for the pressed-state, token-layer and document-rule gates [KT2, KT3, DI9].

import { test } from 'node:test';
import { themes, checkStateVisibility, checkSecondHalves } from './check-invariants.mjs';
import assert from 'node:assert/strict';
import { leakedColours, documentRules } from './check-layers.mjs';

/** @typedef {import('./check-invariants.mjs').Theme} Theme */

// KT2, after the fix. These two tests were written to assert the fault
// while it stood, exactly so that repairing it would break them and force
// this rewrite. That is what happened; what follows asserts the repair.

test('KT2: every theme has a pressed state you can see', () => {
    const failures = themes().flatMap(/** @param {Theme} t */ (t) => checkStateVisibility(t).map((p) => `${t.name}: ${p}`));
    assert.deepEqual(failures, []);
});

test('KT2: the theme that could not reach it on lightness now does', () => {
    // The whole point of letting the pressed state give up chroma. Before
    // the fix this one and terminal (removed 2026-10-16) produced nine
    // violations between them.
    const opted = themes().filter(/** @param {Theme} t */ (t) => ['cyberpunk'].includes(t.name));
    assert.equal(opted.length, 1);
    for (const theme of opted) assert.deepEqual(checkStateVisibility(theme), []);
});

test('KT2-3: a badge plate stays distinguishable from the surface under it', () => {
    const failures = themes().flatMap(/** @param {Theme} t */ (t) => checkSecondHalves(t).map((p) => `${t.name}: ${p}`));
    assert.deepEqual(failures, []);
});

test('DI9: a colour written outside the token layer is caught', () => {
    // The gate has to fail on the shape it exists for, not only pass on a
    // tidy file. This is cyberpunk's --primary, spelled out the way the
    // scrollbar used to spell it.
    assert.equal(leakedColours('.a { border-color: hsl(315, 95%, 64%); }').length, 1);
    assert.deepEqual(leakedColours('.a { border-color: hsl(from var(--primary) h s l / 0.5); }'), []);
    // A data URI carries its own little document; its fills are shapes.
    assert.deepEqual(leakedColours(`.a { background: url("data:image/svg+xml,%3Csvg fill='%23335544'%3E%3C/svg%3E"); }`), []);
});

// KT3: the fault was a browser test that measured the showcase's own
// stylesheet instead of the package, because that stylesheet styled a
// bare `body`. These are the drills for the rule that now forbids it.
test('KT3: scaffolding that styles a bare element is caught', () => {
    // The exact rule that was in showcase.css when the TH12 test could
    // not fail.
    const before = 'body {\n    margin: 0;\n    font-family: var(--theme-font-body, system-ui, sans-serif);\n    line-height: 1.5;\n}';
    assert.equal(documentRules(before).length, 1);
    assert.equal(documentRules(before)[0].selector, 'body');

    // Furniture the package leaves alone stays allowed.
    assert.deepEqual(documentRules('body {\n    margin: 0;\n    line-height: 1.5;\n}'), []);
});

test('KT3: a rule anchored on a class is not a document rule', () => {
    assert.deepEqual(documentRules('.sc-theme {\n    font-family: var(--theme-font-body);\n}'), []);
    assert.deepEqual(documentRules('.sc-theme a:hover {\n    color: var(--link);\n}'), []);
    // …but the same declaration on a bare element is.
    assert.equal(documentRules('a:hover {\n    color: var(--link);\n}').length, 1);
});

test('KT3: prose in a comment is not read as a selector', () => {
    // The first version of this parser reported five violations in one
    // comment, because the sentence mentioned `body` and had commas.
    const source =
        '/* Without this line the font came from `body`, which\n * resolves against the document theme. */\n.sc-theme {\n    font-family: var(--theme-font-body);\n}';
    assert.deepEqual(documentRules(source), []);
});

test('KT3: the reported line is the selector, not the comment above it', () => {
    const source = '/* three\n * line\n * comment */\nbody {\n    color: red;\n}';
    assert.equal(documentRules(source)[0].line, 4);
});
