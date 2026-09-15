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
import { bareControls, decidedOutsideArchive } from './check-catalogue.mjs';

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
});
