// research/ux-parts-1101: the data the page fills its components with, from the apps' own shapes: Almanac's deliveries per day
// and its syncs, Medicine Cabinet's stock. Every day, count and run is mock.

const two = (/** @type {number} */ n) => String(n).padStart(2, '0');
/** A day of 2026 as `YYYY-MM-DD`. @param {number} month 1-12 @param {number} day */
const day = (month, day) => `2026-${two(month)}-${two(day)}`;

/** Days with a warning: how many of the day's deliveries arrived, and which did not. */
const LATE = {
    '2026-10-07': ['8/9', 'the school calendar arrived 40 min late'],
    '2026-10-19': ['7/9', 'two club fixtures did not arrive'],
    '2026-10-28': ['8/9', 'the bin collection feed did not answer'],
};

/**
 * Almanac's deliveries per day, October to December 2026, up to today (Sunday 1 November): all nine arrived, or a warning.
 * @returns {Record<string, { tone: 'ok' | 'warn', count: string, label: string }>}
 */
export function deliveryDays() {
    /** @type {Record<string, { tone: 'ok' | 'warn', count: string, label: string }>} */
    const days = {};
    const LAST_OCTOBER_DAY = 31;
    for (let d = 1; d <= LAST_OCTOBER_DAY; d += 1) {
        const iso = day(10, d);
        const late = /** @type {Record<string, string[]>} */ (LATE)[iso];
        days[iso] = late ? { tone: 'warn', count: late[0], label: `${late[0]} delivered; ${late[1]}` } : { tone: 'ok', count: '9/9', label: 'all 9 delivered' };
    }
    days[day(11, 1)] = { tone: 'ok', count: '9/9', label: 'all 9 delivered' };
    return days;
}

/** The hours (Brussels) of the syncs that run every day, and the weekly clean-up on a Sunday. */
const DAILY = [
    ['google', '06:00', 'Google Calendar sync', 1],
    ['school', '07:30', 'School calendar import', 2],
    ['clubs', '18:00', 'Club fixtures import', 3],
];

/** An ISO moment with Brussels' offset that day (summer time ends on 25 October 2026). @param {string} iso @param {string} time */
const at = (iso, time) => `${iso}T${time}:00${iso < '2026-10-25' ? '+02:00' : '+01:00'}`;

/** Almanac's syncs from 19 October to 15 November 2026, one pill per run. */
export function syncRuns() {
    /** @type {{ id: string, start: string, label: string, series: 1 | 2 | 3 | 4 | 5, detail: string, state?: 'next' }[]} */
    const runs = [];
    const first = Date.UTC(2026, 9, 19);
    const DAYS = 28;
    const DAY_MS = 86_400_000;
    const SUNDAY = 0;
    for (let i = 0; i < DAYS; i += 1) {
        const date = new Date(first + i * DAY_MS);
        const iso = date.toISOString().slice(0, 10);
        for (const [key, time, label, series] of DAILY) {
            runs.push({ id: `${key}-${iso}`, start: at(iso, String(time)), label: String(label), series: /** @type {1 | 2 | 3} */ (series), detail: `${label}, ${iso.slice(8)}/${iso.slice(5, 7)} ${time}` });
        }
        if (date.getUTCDay() === SUNDAY) runs.push({ id: `journal-${iso}`, start: at(iso, '03:00'), label: 'Journal clean-up', series: 4, detail: `Journal clean-up, ${iso.slice(8)}/${iso.slice(5, 7)} 03:00` });
    }
    return runs;
}
