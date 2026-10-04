// The time chart's dates and times follow rule 52 [scope-143]: dd/mm/yyyy
// HH:mm on a 24-hour clock in Europe/Brussels, whatever the reader's zone
// and language, and a time axis on round Brussels wall-clock times.
//
// Red first: 9.2.1 printed through `Intl.DateTimeFormat(locale)` in the
// browser's zone ("Sun 4", "Sun 4 Oct, 14:05", "02:05 PM" under en-US) and
// aligned its ticks with one `getTimezoneOffset()` taken at the window's
// start, so a six-hour tick fell on 05:00 after the clock went back and a
// reader in New York saw New York's midnight. The cases below are the
// homelab port spec's acceptance checks A7.1 to A7.5 (docs/MINI_ROUNDS.md,
// chart-time-M1), plus the clock's two changes in a year.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHART_TIME_ZONE, numericTime, tickStride, timeTicks, wallTime, zonedTime } from '../js/chart.js';
import { DEFAULT_STRINGS } from '../js/strings.js';

/** @param {string} iso */
const at = (iso) => Date.parse(iso);
const time = numericTime();
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
/**
 * The ticks of a window as their labels, the way the chart prints them.
 * @param {string} from @param {string} to @param {number} most @param {string} [zone]
 */
const labels = (from, to, most, zone) => {
    const { stride, ticks } = timeTicks(at(from), at(to), most, zone);
    return ticks.map((t) => (zone ? numericTime(zone) : time)(t, 'tick', { stride }));
};

test('the default zone is Europe/Brussels [scope-143]', () => {
    assert.equal(CHART_TIME_ZONE, 'Europe/Brussels');
});

test('a moment prints as dd/mm/yyyy HH:mm in Brussels, 24-hour (A7.1) [scope-143]', () => {
    // 11:00 UTC is 13:00 in Brussels summer time.
    assert.equal(time(at('2026-10-04T11:00:00Z'), 'full', {}), '04/10/2026 13:00');
    // An afternoon stays 14:05, never "02:05 PM", in whatever language the page is.
    assert.equal(time(at('2026-10-04T12:05:00Z'), 'full', {}), '04/10/2026 14:05');
    assert.equal(time(at('2026-10-04T12:05:00Z'), 'clock', {}), '14:05');
    // Midnight is 00:00, never 24:00; winter time is an hour behind.
    assert.equal(time(at('2026-12-31T23:00:00Z'), 'full', {}), '01/01/2027 00:00');
    // Another zone when asked.
    assert.equal(numericTime('America/New_York')(at('2026-10-04T11:00:00Z'), 'full', {}), '04/10/2026 07:00');
});

test('an event marker and an event line read as the dashboard prints them [scope-143]', () => {
    const ev = at('2026-10-04T12:05:00Z');
    assert.equal(
        DEFAULT_STRINGS.chartMark('Deploy gateway (admin)', time(ev, 'full', {})),
        'Deploy gateway (admin) · 04/10/2026 14:05; click to pin',
    );
    assert.equal(`${time(ev, 'clock', {})} Deploy gateway (admin)`, '14:05 Deploy gateway (admin)');
});

test('a zoom within one day is a clock range, across days a date range (A7.5) [scope-143]', () => {
    /** @param {string} from @param {string} to */
    const span = (from, to) => DEFAULT_STRINGS.chartZoomedSpan(time(at(from), 'range', { from: at(from), to: at(to) }));
    assert.equal(span('2026-10-04T12:00:00Z', '2026-10-04T14:30:00Z'), 'Zoomed: 14:00–16:30 · ');
    // 22:00 on 3 October to 02:00 on 4 October, Brussels: the defect was "Zoomed: 22:00–02:00".
    assert.equal(span('2026-10-03T20:00:00Z', '2026-10-04T00:00:00Z'), 'Zoomed: 03/10/2026 22:00 – 04/10/2026 02:00 · ');
    // Two days apart at the same clock time is not "the same day".
    assert.equal(span('2026-09-27T07:12:00Z', '2026-10-04T07:40:00Z'), 'Zoomed: 27/09/2026 09:12 – 04/10/2026 09:40 · ');
});

test('an hour reads 13:15, 13:30 … as a 24-hour clock (A7.2) [scope-143]', () => {
    assert.deepEqual(labels('2026-10-04T11:00:00Z', '2026-10-04T12:00:00Z', 8), ['13:00', '13:15', '13:30', '13:45', '14:00']);
    // An evening hour: no AM/PM.
    assert.deepEqual(labels('2026-10-04T19:00:00Z', '2026-10-04T20:00:00Z', 8), ['21:00', '21:15', '21:30', '21:45', '22:00']);
});

test('a week has a tick at each Brussels midnight, labelled with that date (A7.3) [scope-143]', () => {
    const { stride, ticks } = timeTicks(at('2026-09-27T07:00:00Z'), at('2026-10-04T07:00:00Z'), 8);
    assert.equal(stride, DAY);
    assert.equal(ticks.length, 7);
    // 04/10/2026 starts at 22:00 UTC the evening before (summer time).
    assert.ok(ticks.includes(at('2026-10-03T22:00:00Z')));
    for (const t of ticks) assert.deepEqual([wallTime(t).hour, wallTime(t).minute], [0, 0]);
    assert.deepEqual(
        ticks.map((t) => time(t, 'tick', { stride })),
        ['28/09/2026', '29/09/2026', '30/09/2026', '01/10/2026', '02/10/2026', '03/10/2026', '04/10/2026'],
    );
});

test('six-hour ticks stay on 00, 06, 12, 18 across the clock going back (A7.4) [scope-143]', () => {
    // Sunday 25 October 2026 is 25 hours long in Brussels.
    const out = labels('2026-10-24T22:00:00Z', '2026-10-25T23:00:00Z', 7);
    assert.deepEqual(out, ['00:00', '06:00', '12:00', '18:00', '00:00']);
    const { ticks } = timeTicks(at('2026-10-24T22:00:00Z'), at('2026-10-25T23:00:00Z'), 7);
    // 06:00 after the change is 05:00 UTC, not 04:00 (which reads 05:00).
    assert.ok(ticks.includes(at('2026-10-25T05:00:00Z')));
});

test('hourly ticks print no hour twice and none the clock skips [scope-143]', () => {
    // The clock goes back at 03:00 on 25 October: 02:00 happens twice, printed once.
    const back = labels('2026-10-24T22:00:00Z', '2026-10-25T05:00:00Z', 10);
    assert.equal(new Set(back).size, back.length);
    assert.deepEqual(back, ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00']);
    // The clock jumps from 02:00 to 03:00 on 29 March: no 02:00 tick.
    const forward = labels('2026-03-28T22:00:00Z', '2026-03-29T06:00:00Z', 10);
    assert.deepEqual(forward, ['23:00', '00:00', '01:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00']);
});

test('a wall-clock time the clock skips has no moment; one it runs twice, the earlier [scope-143]', () => {
    assert.equal(zonedTime(2026, 3, 29, 2, 30), null);
    assert.equal(zonedTime(2026, 10, 25, 2, 30), at('2026-10-25T00:30:00Z'));
    assert.equal(zonedTime(2026, 10, 4, 0, 0), at('2026-10-03T22:00:00Z'));
    assert.equal(zonedTime(2026, 10, 4, 0, 0, 'America/New_York'), at('2026-10-04T04:00:00Z'));
});

test('day ticks follow the zone they are asked for [scope-143]', () => {
    const { ticks } = timeTicks(at('2026-10-01T00:00:00Z'), at('2026-10-04T12:00:00Z'), 8, 'America/New_York');
    for (const t of ticks) assert.equal(new Date(t).getUTCHours(), 4);
});

test('no more ticks than fit, however narrow the plot [scope-143]', () => {
    for (const span of [HOUR, 6 * HOUR, DAY, 7 * DAY, 30 * DAY, 365 * DAY])
        for (const most of [2, 3, 5, 8, 14]) {
            const stride = tickStride(span, most);
            assert.ok(span / stride <= most, `${span / HOUR} h over ${most}: ${stride / HOUR} h`);
        }
    // A 30-day window on a phone: four-weekly ticks, every one a Brussels midnight.
    const { stride, ticks } = timeTicks(at('2026-09-04T07:00:00Z'), at('2026-10-04T07:00:00Z'), 2);
    assert.ok(stride >= 14 * DAY);
    for (const t of ticks) assert.equal(wallTime(t).hour, 0);
});
