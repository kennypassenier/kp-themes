// A ticking freshness line's words and its absolute moment [scope-143].
//
// The homelab port spec's acceptance checks I.4.7 1 and 2, with `now`
// given rather than read from the clock: the words are the dashboard's own
// (its format.js humanDuration and agoText, moved here), with exact numbers
// and the two largest units, and the title writes the moment as rule 52
// does, dd/mm/yyyy HH:mm on a 24-hour clock in Europe/Brussels whatever the
// reader's zone.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FRESHNESS_TIME_ZONE, agoMoment, agoText, humanDuration } from '../js/freshness.js';
import { DEFAULT_STRINGS } from '../js/strings.js';

const NOW = Date.parse('2026-10-04T12:00:00Z');
/** @param {number} seconds */
const ago = (seconds) => agoText('updated', NOW - seconds * 1000, NOW);

test('the words tick in exact numbers, two units at most (I.4.7 1) [scope-143]', () => {
    assert.equal(ago(12), 'updated 12 s ago');
    assert.equal(ago(125), 'updated 2 min 5 s ago');
    assert.equal(ago(7200), 'updated 2 h ago');
    assert.equal(ago(90000), 'updated 1 day 1 h ago');
});

test('a zero part is left out, and a whole unit reads alone [scope-143]', () => {
    assert.equal(humanDuration(0), '0 s');
    assert.equal(humanDuration(59), '59 s');
    assert.equal(humanDuration(60), '1 min');
    assert.equal(humanDuration(3599), '59 min 59 s');
    assert.equal(humanDuration(3600), '1 h');
    assert.equal(humanDuration(3600 + 12 * 60), '1 h 12 min');
    assert.equal(humanDuration(86400), '1 day');
    assert.equal(humanDuration(2 * 86400 + 4 * 3600), '2 days 4 h');
});

test('a moment in the future reads 0 s, and no moment reads "not … yet" [scope-143]', () => {
    assert.equal(agoText('updated', NOW + 5000, NOW), 'updated 0 s ago');
    assert.equal(agoText('updated', null, NOW), 'not updated yet');
    assert.equal(agoText('measured', undefined, NOW), 'not measured yet');
});

test('the words come from the dictionary [scope-143]', () => {
    const dutch = {
        ...DEFAULT_STRINGS,
        agoText: (/** @type {string} */ verb, /** @type {string} */ duration) => `${verb} ${duration} geleden`,
        agoDays: (/** @type {number} */ n) => (n === 1 ? '1 dag' : `${n} dagen`),
    };
    assert.equal(agoText('bijgewerkt', NOW - 2 * 86400 * 1000, NOW, dutch), 'bijgewerkt 2 dagen geleden');
});

test('the title is dd/mm/yyyy HH:mm in Brussels, 24-hour (I.4.7 2) [scope-143]', () => {
    assert.equal(FRESHNESS_TIME_ZONE, 'Europe/Brussels');
    assert.equal(agoMoment(Date.parse('2026-10-04T12:00:00Z')), '04/10/2026 14:00');
    // Winter time is an hour behind; midnight is 00:00, never 24:00.
    assert.equal(agoMoment(Date.parse('2026-12-31T23:00:00Z')), '01/01/2027 00:00');
    assert.equal(agoMoment(Date.parse('2026-10-04T12:00:00Z'), 'UTC'), '04/10/2026 12:00');
});
