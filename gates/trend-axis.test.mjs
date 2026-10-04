// The words under a key figure's 24-hour trend [scope-143]: where it starts
// and where it ends, on the Brussels wall clock (rule 52).
//
// trendAxis() is js/chart.js's spark variant with `data-kp-spark-axis=
// "relative"`. The cases are spec E7 items 1, 2 and 7
// (research/dashboard-ports-2/README.md, section 4) and the stale end the
// README adds; the reading, the keys and the heights are
// tests/kpi-trend.spec.mjs.
//
// Run: node --test gates/trend-axis.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trendAxis } from '../js/chart.js';
import { DEFAULT_STRINGS } from '../js/strings.js';

const MINUTE = 60_000;
const DAY = 1440 * MINUTE;
const STEP = 10 * MINUTE;
/** 04/10/2026 14:40 in Brussels, "now" in every sample. */
const NOW = Date.parse('2026-10-04T12:40:00Z');
const { chartNow: now, chartToday: today, chartYesterday: yesterday } = DEFAULT_STRINGS;

/** Points every 10 minutes from `from` to `to`, inclusive. @param {number} from @param {number} to @returns {[number, number][]} */
const span = (from, to) => {
    /** @type {[number, number][]} */
    const out = [];
    for (let t = from; t <= to; t += STEP) out.push([t, 3]);
    return out;
};

test('E7.1, E7.2, E7.7 and a stale end [scope-143]', () => {
    // E7.1: the last 24 hours.
    assert.deepEqual(trendAxis(span(NOW - DAY, NOW), { now: NOW, step: STEP }), [`14:40 ${yesterday}`, now]);
    // E7.2: a trend from 05:00Z, 07:00 in Brussels.
    assert.deepEqual(trendAxis(span(Date.parse('2026-10-04T05:00:00Z'), NOW), { now: NOW, step: STEP }), [`07:00 ${today}`, now]);
    // E7.7: one point, or none: a no-break space each, so the row keeps its height.
    assert.deepEqual(trendAxis([[NOW - STEP, 71]], { now: NOW, step: STEP }), [' ', ' ']);
    assert.deepEqual(trendAxis([], { now: NOW }), [' ', ' ']);
    // Stopped forty minutes ago: its clock, not now; two steps old is still now.
    assert.deepEqual(trendAxis(span(NOW - DAY, NOW - 40 * MINUTE), { now: NOW, step: STEP }), [`14:40 ${yesterday}`, '14:00']);
    assert.equal(trendAxis(span(NOW - DAY, NOW - 2 * STEP), { now: NOW, step: STEP })[1], now);
});

test('the day is the one in Brussels; older days are dates; the words can be the page’s [scope-143]', () => {
    // 22:30Z on 04/10 is 00:30 on the 5th in Brussels: today, seen from 05/10 08:00.
    const morning = Date.parse('2026-10-05T06:00:00Z');
    assert.deepEqual(trendAxis(span(Date.parse('2026-10-04T22:30:00Z'), morning), { now: morning, step: STEP }), [`00:30 ${today}`, now]);
    assert.deepEqual(trendAxis(span(NOW - DAY, NOW), { now: NOW, step: STEP, timeZone: 'America/New_York' }), [`08:40 ${yesterday}`, now]);
    // A last point on another day carries its day.
    assert.deepEqual(trendAxis(span(NOW - 2 * DAY, NOW - DAY), { now: NOW, step: STEP }), ['14:40 02/10/2026', `14:40 ${yesterday}`]);
    // Yesterday across the end of a month.
    const first = Date.parse('2026-11-01T10:00:00Z');
    assert.equal(trendAxis(span(first - DAY, first), { now: first, step: STEP })[0], `11:00 ${yesterday}`);
    const words = { now: 'nu', today: 'vandaag', yesterday: 'gisteren' };
    assert.deepEqual(trendAxis(span(NOW - DAY, NOW), { now: NOW, step: STEP, words }), ['14:40 gisteren', 'nu']);
});
