// The day timeline's layout [dlfix-1102]. Red first: an item at 23:53 or 23:59 rounded up to row 96 of 96 and was dropped
// from the grid, and controller.setItems had already taken it out of the all-day strip, so it vanished from the screen.
// Also pins the swipe row's touch-action to `any-pointer: coarse` (a touch laptop's primary pointer is fine).

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { placeItems } from '../js/dayline/layout.js';

/** @param {number} startHour @param {number} step @param {number} hours */
const grid = (startHour, step, hours) => ({ startHour, step, rowsTotal: (hours * 60) / step });

test('an item in the last minutes of the day lands on the last row', () => {
    for (const start of ['23:53', '23:59', '23:52']) {
        const [one] = placeItems([{ id: 'a', label: 'A', start, minutes: 5 }], grid(0, 15, 24));
        assert.ok(one, `${start} is placed`);
        assert.equal(one.row, 95, `${start} stands on row 95`);
        assert.equal(one.rows, 1, `${start} is clamped to the rows left`);
    }
});

test('the same near the end of a day that starts at 06:00', () => {
    const [one] = placeItems([{ id: 'a', label: 'A', start: '05:53' }], grid(6, 15, 24));
    assert.equal(one?.row, 95);
});

test('an item outside a shorter day is still left out', () => {
    assert.equal(placeItems([{ id: 'a', label: 'A', start: '12:00' }], grid(6, 15, 4)).length, 0);
    assert.equal(placeItems([{ id: 'a', label: 'A', start: '09:55' }], grid(6, 15, 4)).length, 1);
});

test('swipe.css leaves the vertical pan to the page under any coarse pointer', () => {
    const css = readFileSync(new URL('../css/components/swipe.css', import.meta.url), 'utf8');
    assert.match(css, /@media \(any-pointer: coarse\)/);
    assert.doesNotMatch(css, /@media \(pointer: coarse\)/);
});
