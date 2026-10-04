// The month heatmap's calendar arithmetic [scope-143].
//
// The port spec's I.1.7 checks 1 and 3, as pure logic: every month is six
// weeks of 42 days (October 2026 back to February 2026, the month that
// starts on a Sunday and fills only four weeks of its own), a day and a
// month move across the ends of a month and a year, and "today" is the day
// on the Brussels wall clock (rule 52), across both changes of the clock.
//
// Run: node --test gates/calendar.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayKey, formatDayKey, monthCells, shiftDay, shiftMonth } from '../js/calendar.js';

/** @param {string} iso */
const at = (iso) => Date.parse(iso);

test('every month is 42 cells in six weeks of seven, from the week start the locale gives, October 2026 back to February 2026 (I.1.7 1) [scope-143]', () => {
    {
        for (let month = 10; month >= 2; month -= 1) {
            const cells = monthCells(2026, month);
            assert.equal(cells.length, 42, `${month}/2026`);
            // Six rows of seven, each a run of consecutive days, the first a Monday.
            for (let row = 0; row < 6; row += 1) {
                const week = cells.slice(row * 7, row * 7 + 7);
                assert.equal(new Date(`${week[0]}T00:00:00Z`).getUTCDay(), 1, `${month}/2026 row ${row} starts on a Monday`);
                week.forEach((iso, i) => assert.equal(iso, shiftDay(/** @type {string} */ (week[0]), i)));
            }
            // The month's own days are all there, in order, once.
            const own = cells.filter((iso) => iso.startsWith(`2026-${String(month).padStart(2, '0')}`));
            assert.equal(own[0]?.slice(8), '01');
            assert.equal(new Set(own).size, own.length);
            assert.equal(own.length, new Date(Date.UTC(2026, month, 0)).getUTCDate());
        }
    }
    {
        const cells = monthCells(2026, 10);
        assert.equal(cells[0], '2026-09-28');
        assert.equal(cells[3], '2026-10-01');
        assert.equal(cells[41], '2026-11-08');
    }
    {
        const cells = monthCells(2026, 2);
        assert.equal(cells[6], '2026-02-01');
        assert.equal(cells[0], '2026-01-26');
        assert.equal(cells[41], '2026-03-08');
    }
    {
        const cells = monthCells(2026, 10, 0);
        assert.equal(cells.length, 42);
        assert.equal(cells[0], '2026-09-27');
        assert.equal(cells.indexOf('2026-10-01'), 4);
    }
});

test('shiftDay and shiftMonth cross month and year ends, leap days, and clamp to a shorter month (I.1.7 4) [scope-143]', () => {
    {
        assert.equal(shiftDay('2026-10-31', 1), '2026-11-01');
        assert.equal(shiftDay('2026-11-01', -1), '2026-10-31');
        assert.equal(shiftDay('2026-12-31', 1), '2027-01-01');
        assert.equal(shiftDay('2027-01-01', -1), '2026-12-31');
        assert.equal(shiftDay('2026-12-28', 7), '2027-01-04');
        assert.equal(shiftDay('2028-02-28', 1), '2028-02-29');
        assert.equal(shiftDay('2026-02-28', 1), '2026-03-01');
        // The clock's change is no day longer or shorter on the calendar.
        assert.equal(shiftDay('2026-03-28', 1), '2026-03-29');
        assert.equal(shiftDay('2026-03-29', 1), '2026-03-30');
        assert.equal(shiftDay('2026-10-25', 1), '2026-10-26');
    }
    {
        assert.equal(shiftMonth('2026-10-04', 1), '2026-11-04');
        assert.equal(shiftMonth('2026-11-04', -12), '2025-11-04');
        assert.equal(shiftMonth('2026-12-15', 1), '2027-01-15');
        assert.equal(shiftMonth('2027-01-15', -1), '2026-12-15');
        assert.equal(shiftMonth('2026-01-31', 1), '2026-02-28');
        assert.equal(shiftMonth('2028-01-31', 1), '2028-02-29');
        assert.equal(shiftMonth('2026-03-31', -1), '2026-02-28');
        assert.equal(shiftMonth('2026-10-31', 1), '2026-11-30');
        assert.equal(shiftMonth('2028-02-29', 12), '2029-02-28');
    }
});

test('the day is the Brussels wall-clock day, on clock-change days too, and reads dd/mm/yyyy in every language (I.1.7 3, rule 52) [scope-143]', () => {
    {
        assert.equal(dayKey(at('2026-10-04T22:30:00Z')), '2026-10-05');
        assert.equal(dayKey(at('2026-10-04T21:59:00Z')), '2026-10-04');
        assert.equal(dayKey(at('2026-10-04T22:00:00Z')), '2026-10-05');
        // Another zone when asked.
        assert.equal(dayKey(at('2026-10-04T22:30:00Z'), 'UTC'), '2026-10-04');
        assert.equal(dayKey(at('2026-10-05T03:30:00Z'), 'America/New_York'), '2026-10-04');
    }
    {
        // Summer time starts 29/03/2026 at 02:00 → 03:00: midnight is 23:00 UTC before, 22:00 UTC after.
        assert.equal(dayKey(at('2026-03-28T22:59:00Z')), '2026-03-28');
        assert.equal(dayKey(at('2026-03-28T23:00:00Z')), '2026-03-29');
        assert.equal(dayKey(at('2026-03-29T21:59:00Z')), '2026-03-29');
        assert.equal(dayKey(at('2026-03-29T22:00:00Z')), '2026-03-30');
        // Summer time ends 25/10/2026 at 03:00 → 02:00: midnight is 22:00 UTC before, 23:00 UTC after.
        assert.equal(dayKey(at('2026-10-24T21:59:00Z')), '2026-10-24');
        assert.equal(dayKey(at('2026-10-24T22:00:00Z')), '2026-10-25');
        assert.equal(dayKey(at('2026-10-25T22:30:00Z')), '2026-10-25');
        assert.equal(dayKey(at('2026-10-25T23:00:00Z')), '2026-10-26');
    }
    {
        assert.equal(formatDayKey('2026-10-04'), '04/10/2026');
        assert.equal(formatDayKey('2027-01-31'), '31/01/2027');
    }
});
