// research/heatstates-1102: the Habits app's counters history (~/Projects/habits/web/js/features/counters/history.js), its own data
// shape: a row per counter, a column per day for the last 30 days, the newest on the right, a cell's level how far the day got
// toward the goal. The counters, the counts and the dates are mock; the dates are fixed, so the page never reads the clock.

/** The 30 days, oldest first, ending on Sunday 01/11/2026. */
const DAYS = Array.from({ length: 30 }, (_, i) => new Date(Date.UTC(2026, 9, 3 + i)));
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const two = (/** @type {number} */ n) => String(n).padStart(2, '0');

/** The counters: a daily goal (Water 8 glasses), a weekly one (Walk, 3 a week), a yes-or-no (Read) and one without a goal. */
const COUNTERS = [
    { key: 'water', label: 'Water', goal: 8, kind: 'count', seed: 5 },
    { key: 'walk', label: 'Walk', goal: 3, kind: 'week', seed: 3 },
    { key: 'read', label: 'Read before bed', goal: 1, kind: 'check', seed: 7 },
    { key: 'stretch', label: 'Stretch', goal: 0, kind: 'count', seed: 2 },
];

/** A steady mock count for a counter on a day: no randomness, so every visit shows the same history. */
const countOf = (/** @type {typeof COUNTERS[number]} */ c, /** @type {number} */ day) => {
    const v = (c.seed * 7 + day * (c.seed + 3)) % 11;
    if (c.kind === 'check') return v > 4 ? 1 : 0;
    if (c.kind === 'week') return v > 6 ? 1 : 0;
    return v > 2 ? Math.min(v - 1, c.goal || 9) : 0;
};

/** What a day says in words, as Habits writes it. */
const words = (/** @type {typeof COUNTERS[number]} */ c, /** @type {number} */ n) => {
    if (!n) return 'Nothing logged';
    if (c.kind === 'check') return 'Yes';
    if (c.kind === 'count' && c.goal) return `${n} of ${c.goal}`;
    return String(n);
};

/** How full a day is, 0 to 1, as Habits works it out. */
const fill = (/** @type {typeof COUNTERS[number]} */ c, /** @type {number} */ n) =>
    Math.min(1, n / (c.kind === 'week' ? Math.max(1, c.goal / 7) : Math.max(1, c.goal || 1)));

/** The heat grid's spec, the shape Habits hands setHeat, with each day's whole name for the list of days. */
export const HISTORY = {
    label: 'Last 30 days',
    every: 7,
    columns: DAYS.map((d) => ({
        key: d.toISOString().slice(0, 10),
        label: two(d.getUTCDate()),
        full: `${WEEKDAY[d.getUTCDay()]} ${two(d.getUTCDate())}/${two(d.getUTCMonth() + 1)}`,
    })),
    rows: COUNTERS.map((c) => ({
        key: c.key,
        label: c.label,
        cells: DAYS.map((_, i) => {
            const n = countOf(c, i);
            return n ? { tone: 'level', level: Math.max(0.15, fill(c, n)), label: words(c, n) } : { tone: 'none', label: words(c, 0) };
        }),
    })),
    legend: [{ ramp: true, less: 'Less', more: 'More' }],
};
