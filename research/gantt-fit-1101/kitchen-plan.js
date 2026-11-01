// research/gantt-fit-1101: Kitchen's cook-mode plan, built the way Kitchen builds it (kitchen/web/js/pages/cook/logic.js planRuns and
// cook/timeline.js paintTimeline), so the demo's timeline gets exactly the calls the app makes. The recipe is the spaghetti Kitchen's own
// cook-mode checks seed: two tracks (Pasta, Sauce), a step with no track that sits in both rows. The progress is fixed: boiling the water
// is done, the pasta is in the pan, the sauce still has to start.

const MIN = 60_000;

/** The recipe's steps, as Kitchen stores them (`say` is what the bar reads, `track` its row; no track = every row). */
const STEPS = [
    { id: 's1', track: 'tp', say: 'boil the water', mins: 8, active: false },
    { id: 's2', track: 'tp', say: 'cook the pasta', mins: 10, active: true },
    { id: 's3', track: 'ts', say: 'brown the mince', mins: 12, active: true },
    { id: 's4', track: 'ts', say: 'simmer', mins: 15, active: false },
    { id: 'm1', track: null, say: 'sit down', mins: 5, active: true },
];
/** The tracks, each its own series colour (kitchen/web/js/recipe/schedule.js lanesOf). */
const LANES = [
    { id: 'tp', label: 'Pasta', series: /** @type {1} */ (1) },
    { id: 'ts', label: 'Sauce', series: /** @type {2} */ (2) },
];
/** How far the progress is: s1 passed (started 11 min ago, ended 3 min ago), s2 in hand for 3 min. */
const DONE_AGO = { s1: [11, 3] };
const ACTIVE = { id: 's2', since: 3 };

const cap = (/** @type {string} */ s) => s.charAt(0).toUpperCase() + s.slice(1);
const how = (/** @type {number} */ mins, /** @type {boolean} */ active) => `${mins} min, ${active ? 'hands on' : 'you can walk away'}`;
const rowsOf = (/** @type {{ track: string | null }} */ s) => (s.track ? [s.track] : LANES.map((l) => l.id));

/** One step as Kitchen's planStep draws it. @param {typeof STEPS[number]} s @param {number} now @param {number} ahead */
function planStep(s, now, ahead) {
    const ago = DONE_AGO[/** @type {'s1'} */ (s.id)];
    if (ago) return { start: now - ago[0] * MIN, end: now - ago[1] * MIN, state: 'ok', words: `${how(s.mins, s.active)}, done`, next: now - ago[1] * MIN };
    if (s.id === ACTIVE.id) {
        const start = now - ACTIVE.since * MIN;
        const plannedEnd = start + s.mins * MIN;
        return { start, end: now, state: 'running', words: `${how(s.mins, s.active)}, you are on it`, plannedEnd, next: Math.max(now, plannedEnd) };
    }
    const start = Math.max(now, ahead);
    return { start, end: start + s.mins * MIN, state: 'planned', words: `${how(s.mins, s.active)}, still to do`, next: start + s.mins * MIN };
}

/**
 * The plan at `now`: the lanes (with Kitchen's "n of m done" second line), one run per row a step sits in, and the window Kitchen
 * fixes on it (a minute before the first start to three minutes after the last end).
 * @param {number} now epoch ms
 */
export function kitchenPlan(now) {
    const first = now - DONE_AGO.s1[0] * MIN;
    const cursor = new Map(LANES.map((l) => [l.id, first]));
    const runs = [];
    let last = now;
    for (const s of STEPS) {
        const rows = rowsOf(s);
        const part = planStep(s, now, Math.max(...rows.map((r) => cursor.get(r) ?? first)));
        for (const row of rows) cursor.set(row, part.next);
        last = Math.max(last, part.next);
        const say = cap(s.say);
        for (const row of rows)
            runs.push({
                id: `${row}:${s.id}`,
                lane: row,
                label: say,
                start: part.start,
                end: part.end,
                state: part.state,
                series: LANES.find((l) => l.id === row)?.series,
                detail: `${say}, ${part.words}`,
                ...(part.plannedEnd ? { plannedEnd: part.plannedEnd } : {}),
            });
    }
    const counts = (/** @type {string} */ lane) => {
        const mine = STEPS.filter((s) => rowsOf(s).includes(lane));
        return [mine.filter((s) => DONE_AGO[/** @type {'s1'} */ (s.id)]).length, mine.length];
    };
    const lanes = LANES.map((l) => ({ ...l, sub: `${counts(l.id)[0]} of ${counts(l.id)[1]} done` }));
    return { lanes, runs, from: first - MIN, to: last + 3 * MIN };
}
