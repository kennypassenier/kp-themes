// What a block is made of, as digests [scope-114, scope-116].
//
// Kenny, 2026-09-17: "Enkel dingen die de component zelf raken mogen in de
// hash verwerkt worden." These hold the generator to that: a line lands with
// the family its selector names, a comment or a version moves nothing, and the
// loader is not an input.
//
// Red first: under version 5 one digest covered every file in css/ (minus the
// registers), js/ and components/, so the JavaScript split — a change to
// js/auto.js alone — moved all 3062 pairs (`node gates/verdicts.mjs snapshot`,
// 2026-09-17: "3062 of them no longer the block the verdict was given on").
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bucketsOf, codeVersion, familiesIn, NOT_A_BLOCK_INPUT, withoutTheVersion } from './generate-code-version.mjs';

test('a version is read as <version>, in every shape the artefacts carry it [scope-114]', () => {
    assert.equal(withoutTheVersion('/* @kp-soft/themes v6.0.0 — css/themes.css'), '/* @kp-soft/themes <version> — css/themes.css');
    assert.equal(withoutTheVersion("    --kp-themes-version: '6.0.0';"), "    --kp-themes-version: '<version>';");
    assert.equal(withoutTheVersion("export const VERSION = '6.1.0-rc.1';"), "export const VERSION = '<version>';");
    // Not a version: a token scale, a date, a selector.
    assert.equal(withoutTheVersion('--kp-space-2: 0.5rem;'), '--kp-space-2: 0.5rem;');
    assert.equal(withoutTheVersion('grid-template-columns: 1fr 2fr;'), 'grid-template-columns: 1fr 2fr;');
});

test('a family is what a class or attribute is before its element and modifier [scope-116]', () => {
    assert.deepEqual(familiesIn('<button class="kp-button kp-button--primary"><span class="kp-button__label">'), ['kp-button']);
    assert.deepEqual(familiesIn("[data-theme='dark'] [data-kp-reveal='headline'] .kp-card__title"), ['data-kp-reveal', 'kp-card']);
    // A custom property is not a family.
    assert.deepEqual(familiesIn('color: var(--kp-accent-ink);'), []);
});

test('a CSS line lands with the family its innermost rule names, and a comment lands nowhere [scope-116]', () => {
    const css = [
        ':root {',
        '    --background: white;',
        '}',
        '.kp-button {',
        '    color: red; /* the ink */',
        '}',
        '.kp-datatable .kp-table {',
        '    border: 0;',
        '}',
    ].join('\n');
    const { families, unnamed } = bucketsOf(css);
    assert.deepEqual([...families.keys()].sort(), ['kp-button', 'kp-datatable', 'kp-table']);
    assert.ok(families.get('kp-button')?.includes('color: red;'), 'the declaration belongs to its rule');
    assert.ok(!families.get('kp-datatable')?.includes('color: red;'));
    assert.ok(unnamed.includes('--background: white;'), 'a :root line belongs to everyone');
    // A theme's token block is that theme's; a keyframe is everyone's.
    const tokens = bucketsOf("[data-theme='dark'] {\n    --background: black;\n}\n@keyframes kp-spin {\n    to { rotate: 1turn; }\n}\n");
    assert.deepEqual(tokens.themed.get('dark'), ["[data-theme='dark'] {", '--background: black;', '}']);
    assert.equal(tokens.families.size, 0);
    assert.ok(tokens.unnamed.includes('to { rotate: 1turn; }'));
    // Only the comment changed: nothing moves.
    const again = bucketsOf(css.replace('/* the ink */', '/* the colour of the text */'));
    assert.deepEqual(again.families.get('kp-button'), families.get('kp-button'));
});

test('the digests are there: a base, one per theme, one per rule and per module, and no loader [scope-116, scope-137]', () => {
    const version = codeVersion();
    assert.match(version.base, /^[0-9a-f]{16}$/);
    assert.equal(Object.keys(version.themes).length, 22);
    assert.equal(new Set(Object.values(version.themes)).size, 22, 'two themes do not share a digest');
    // One bucket per rule, keyed theme || condition || the compound the
    // selector ends on [scope-137]. The button has one in the shared sheets
    // and one in every register.
    assert.match(version.rules['||||.kp-button'], /^[0-9a-f]{16}$/);
    assert.equal(
        Object.keys(version.rules).filter((key) => key.endsWith('||||.kp-button')).length,
        23,
        'the shared sheets and all 22 registers style the button',
    );
    assert.match(version.modules['js/datatable.js'].digest, /^[0-9a-f]{16}$/);
    assert.equal(version.modules['js/datatable.js'].when, '[data-kp-datatable]');
    assert.match(version.components.datatable.modules, /^[0-9a-f]{16}$/);
    assert.ok(NOT_A_BLOCK_INPUT.has('js/auto.js'));
    // effects.js draws the boot screen, so the family is listed with the
    // component — read by whoever asks what a module touches, and NOT by the
    // hash any more [fix-71].
    assert.ok(version.components['page-effects'].families.includes('kp-boot'));
});
