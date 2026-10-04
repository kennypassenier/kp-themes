// The time chart's values and its programmatic selection [scope-143]: the
// pure halves of the homelab port spec's acceptance checks A7.6 to A7.8 and
// A7.11 (docs/MINI_ROUNDS.md, port-spec-M1). The browser halves (the axis
// as drawn, groups across attach calls, a chip outside its group, the
// tooltip after a live update) are measured in Firefox on
// catalogue/chart.html.
//
// Red first: against 9.2.1's js/chart.js this file cannot even load, since
// formatChartValue, nextSelection and a niceMax that knows a unit kind did
// not exist. 9.2.1 printed every value as a number by size with `data.unit`
// after it, left the axis bare, put a 37% maximum under an axis top of 40,
// and had no way to press a legend source from the page.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatChartValue, nextSelection, niceMax } from '../js/chart.js';
import { DEFAULT_STRINGS } from '../js/strings.js';

const GiB = 2 ** 30;
const MiB = 2 ** 20;
/** The axis's three labels for a highest value, the way the chart draws them. @param {number} v @param {any} data */
const axis = (v, data) => {
    const top = niceMax(v, data.unitKind);
    return [0, top / 2, top].map((x) => formatChartValue(x, 'axis', data));
};

test('bytes: binary steps on the axis and in the tooltip (A7.6) [scope-143]', () => {
    const data = { unitKind: /** @type {const} */ ('bytes') };
    assert.deepEqual(axis(1.5 * GiB, data), ['0 B', '1.0 GiB', '2.0 GiB']);
    assert.equal(formatChartValue(1.5 * GiB, 'tip', data), '1.5 GiB');
    assert.equal(formatChartValue(512, 'tip', data), '512 B');
    assert.equal(formatChartValue(120 * MiB, 'tip', data), '120 MiB');
    // The change over the hour before is a size, in the same unit.
    assert.equal(formatChartValue(1.2 * GiB, 'delta', data), '1.2 GiB');
});

test('bytes/s, also as rate: per second (A7.6) [scope-143]', () => {
    assert.equal(formatChartValue(3.2 * MiB, 'tip', { unitKind: 'bytes/s' }), '3.2 MiB/s');
    assert.equal(formatChartValue(3.2 * MiB, 'tip', { unitKind: 'rate' }), '3.2 MiB/s');
    assert.equal(formatChartValue(0, 'axis', { unitKind: 'rate' }), '0 B/s');
});

test('percent: an axis of 10, 25, 50 or 100, and above 100 nothing is cut off (A7.7) [scope-143]', () => {
    const data = { unitKind: /** @type {const} */ ('percent') };
    assert.equal(niceMax(37, 'percent'), 50);
    assert.equal(niceMax(7.5, 'percent'), 10);
    assert.equal(niceMax(24, 'percent'), 25);
    assert.equal(niceMax(100, 'percent'), 100);
    assert.equal(niceMax(0, 'percent'), 10);
    // Above 100 the general round number: the line stays inside the plot.
    assert.ok(niceMax(130, 'percent') > 130);
    assert.deepEqual(axis(37, data), ['0%', '25%', '50%']);
    assert.equal(axis(130, data)[2], '150%');
    assert.equal(formatChartValue(7.5, 'tip', data), '7.5%');
    assert.equal(formatChartValue(42, 'tip', data), '42%');
    assert.equal(formatChartValue(0, 'tip', data), '0%');
});

test('count: exact in the tooltip, the legend and the readout, abbreviated on the axis only (A7.8) [scope-143]', () => {
    const data = { unitKind: /** @type {const} */ ('count') };
    assert.equal(formatChartValue(12345, 'tip', data), '12,345');
    assert.equal(formatChartValue(12345, 'legend', data), '12,345');
    assert.equal(formatChartValue(12345, 'readout', data), '12,345');
    assert.equal(formatChartValue(12345, 'axis', data), '12.3k');
    assert.equal(formatChartValue(340, 'axis', data), '340');
    assert.equal(formatChartValue(0.25, 'axis', data), '0.25');
    assert.equal(formatChartValue(0.25, 'tip', data), '0.25');
    // flag reads as a count.
    assert.equal(formatChartValue(1, 'tip', { unitKind: 'flag' }), '1');
    // The locale groups: a Belgian Dutch page reads 12.345.
    assert.equal(formatChartValue(12345, 'tip', data, 'nl-BE'), '12.345');
});

test('celsius: whole degrees [scope-143]', () => {
    assert.equal(formatChartValue(54.4, 'tip', { unitKind: 'celsius' }), '54 °C');
    assert.equal(formatChartValue(54.4, 'axis', { unitKind: 'celsius' }), '54 °C');
});

test('a plain unit prints as 9.2.1 did: digits by size, the unit after it, a bare axis [scope-143]', () => {
    assert.equal(formatChartValue(3.456, 'tip', { unit: 'bar' }), '3.46 bar');
    assert.equal(formatChartValue(3.4, 'tip', { unit: 'bar', digits: 2 }), '3.40 bar');
    assert.equal(formatChartValue(3.4, 'axis', { unit: 'bar', digits: 2 }), '3.40');
    assert.equal(formatChartValue(1234.5, 'tip', {}), '1,235');
    // niceMax without a kind is unchanged.
    assert.equal(niceMax(37), 40);
    assert.equal(niceMax(0), 1);
});

test('chartSelect: a toggle without `on`, on or off with it, null shows all (A7.11) [scope-143]', () => {
    const none = new Set();
    // chartSelect(el, 2): source 2 pressed, the others hidden.
    assert.deepEqual([...(nextSelection(none, 2, 4) ?? [])], [2]);
    // Again: off, everything shown.
    assert.deepEqual([...(nextSelection(new Set([2]), 2, 4) ?? [0])], []);
    // Several, no modifier key.
    assert.deepEqual([...(nextSelection(new Set([2]), 0, 4) ?? [])].sort(), [0, 2]);
    // With `on`: only a change is a change.
    assert.equal(nextSelection(new Set([2]), 2, 4, true), null);
    assert.equal(nextSelection(none, 2, 4, false), null);
    assert.deepEqual([...(nextSelection(none, 1, 4, true) ?? [])], [1]);
    // null: every source again; already so, nothing fires.
    assert.deepEqual([...(nextSelection(new Set([1, 2]), null, 4) ?? [0])], []);
    assert.equal(nextSelection(none, null, 4), null);
    // Every source on is the same as none.
    assert.deepEqual([...(nextSelection(new Set([0]), 1, 2) ?? [0])], []);
    // An index the chart does not have is ignored.
    assert.equal(nextSelection(none, 4, 4), null);
    assert.equal(nextSelection(none, -1, 4), null);
});

test('the new words are in the dictionary [scope-143]', () => {
    assert.equal(DEFAULT_STRINGS.chartEmpty, 'No readings in this window yet.');
    assert.equal(DEFAULT_STRINGS.chartOnePoint, 'Only one reading so far: the line grows as more readings arrive.');
    assert.equal(DEFAULT_STRINGS.chartPinnedOutside, '(pinned, outside the window)');
    assert.equal(typeof DEFAULT_STRINGS.chartLoading, 'string');
});
