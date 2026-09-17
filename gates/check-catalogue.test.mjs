// The catalogue gate's bare-control rule [scope-58].
//
// Drilled red on 2026-09-13 before catalogue/field.html was fixed: the gate
// reported `catalogue/field.html:353 — a bare <input type="datetime-local">
// outside a .kp-datepicker`, the native date input in the narrow-pane form
// Kenny found. These pin the three shapes and the one place each is allowed.
//
// Run: node --test gates/

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bareControls, decidedOutsideArchive, blocksOutsideTheReview, scriptsOutsideTheReview } from './check-catalogue.mjs';

/** @param {string} html */
const faults = (html) => bareControls(html).map((f) => f.fault);

test('a date input outside a date picker is bare; the picker’s own input is not [scope-58]', () => {
    assert.deepEqual(faults('<form><input class="kp-field__input" type="date" /></form>'), ['a bare <input type="date"> outside a .kp-datepicker']);
    assert.deepEqual(faults('<input\n  class="kp-field__input"\n  type="datetime-local" />'), [
        'a bare <input type="datetime-local"> outside a .kp-datepicker',
    ]);
    assert.deepEqual(faults('<div class="kp-datepicker" data-kp-datepicker><input class="kp-field__input" type="date" /></div>'), []);
    // Outside again once the picker has closed.
    assert.equal(faults('<div class="kp-datepicker"><span></span></div><input type="date">').length, 1);
});

test('a select without .kp-field__input is bare [scope-58]', () => {
    assert.deepEqual(faults('<select><option>One</option></select>'), ['a <select> without .kp-field__input']);
    assert.deepEqual(faults('<select class="kp-field__input" data-kp-select><option>One</option></select>'), []);
});

test('a checkbox or radio without the package’s class is bare [scope-58]', () => {
    assert.deepEqual(faults('<input type="checkbox"><input type="radio" name="a">'), [
        'a checkbox without .kp-field__check or .kp-switch__input',
        'a radio without .kp-field__check or .kp-switch__input',
    ]);
    assert.deepEqual(faults('<input class="kp-field__check" type="checkbox"><input class="kp-switch__input" type="checkbox" role="switch">'), []);
    // Text and markup inside comments and scripts is not a control.
    assert.deepEqual(faults('<!-- <input type="checkbox"> --><script>const s = "<select>";</script>'), []);
});

test('a decided research topic listed outside "Archived research" is refused [fix-37]', () => {
    const shell = `[{ group: 'Research to look at', pages: [{ href: 'research/laurels/demo.html' }] },
        { group: 'Archived research', pages: [{ href: 'research/alarm/demo.html' }] }]`;
    const decided = '# Laurels\n\n**Decided (scope-93): wreaths.**\n';
    assert.deepEqual(decidedOutsideArchive(shell, { laurels: decided }), ['research/laurels (listed under "Research to look at")']);
    assert.deepEqual(decidedOutsideArchive(shell, { alarm: decided }), []);
    assert.deepEqual(decidedOutsideArchive(shell, { laurels: '# Laurels\n\nFour directions.\n' }), []);
    // A topic of several pages is outside as soon as ONE of them is [fix-53]:
    // the fix-37 measurement put one theme portrait back under "Research to
    // look at" and the gate passed, because the portraits after it in the
    // archive overwrote the group it was read under.
    const split =
        "group: 'Research to look at',\n pages: [ { href: 'research/theme-portraits/formal.html' } ],\n" +
        "group: 'Archived research',\n pages: [ { href: 'research/theme-portraits/pastel.html' } ],\n";
    assert.deepEqual(decidedOutsideArchive(split, { 'theme-portraits': decided }), ['research/theme-portraits (listed under "Research to look at")']);
});

test('a catalogue page with blocks that the review does not gather is refused [scope-111]', () => {
    const shell = `[{ pages: [
        { href: 'catalogue/button.html', label: 'Buttons', component: true },
        { href: 'catalogue/intros.html', label: 'Theme intros' },
    ] }]`;
    assert.deepEqual(blocksOutsideTheReview(shell, { 'catalogue/button.html': 7, 'catalogue/intros.html': 4 }), [
        'catalogue/intros.html (4 block(s), listed without component: true)',
    ]);
    assert.deepEqual(blocksOutsideTheReview(shell, { 'catalogue/button.html': 7, 'catalogue/intros.html': 0 }), []);
});

test('a gathered page that runs a script the review page does not is refused [fix-43]', () => {
    const gathered = new Set(['catalogue/intros.html', 'catalogue/button.html']);
    const review = '<script type="module" src="../js/auto.js"></script><script src="./boot-check.js"></script><script src="./review.js"></script>';
    const sources = {
        'catalogue/index.html': review,
        'catalogue/intros.html': '<script src="./boot-check.js"></script><script type="module" src="./intros.js"></script>',
        'catalogue/button.html': '<script src="./boot-check.js"></script>',
    };
    assert.deepEqual(scriptsOutsideTheReview(sources, gathered), ['catalogue/intros.html runs intros.js, which catalogue/index.html does not load']);
    // The review page loading it too is the fix, and a page nobody gathers is nobody's problem.
    assert.deepEqual(scriptsOutsideTheReview({ ...sources, 'catalogue/index.html': `${review}<script src="./intros.js"></script>` }, gathered), []);
    assert.deepEqual(scriptsOutsideTheReview(sources, new Set(['catalogue/button.html'])), []);
});
