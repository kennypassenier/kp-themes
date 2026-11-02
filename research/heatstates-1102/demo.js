// research/heatstates-1102: the page's own wiring. Every component is the package's; this file draws the Habits app's counters history
// (data.js) into each section's grid and wires each section's controls by that section's own elements, so a section works on any page
// that shows it.

import { attachHeats, closeHeatDays, openHeatDays, setHeat } from '../../js/heat.js';
import { attachFootprints } from '../../js/footprint.js';
import { on, say, settle } from './controls.js';
import { HISTORY } from './data.js';

/** The day's name a column key stands for. @param {string} key */
const dayName = (key) => HISTORY.columns.find((c) => c.key === key)?.full ?? key;
/** The counter's name a row key stands for. @param {string} key */
const counterName = (key) => HISTORY.rows.find((r) => r.key === key)?.label ?? key;

// ---------------------------------------------------------------- 1 · a tap on a row opens its days
const days = document.getElementById('pg-heat-days');
if (days) {
    setHeat(days, HISTORY);
    attachHeats(days.parentElement ?? document);
    days.addEventListener('kp-heat-pick', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        const how = d.source === 'days' ? 'chosen in the list of days' : 'tapped on its cell';
        say('pg-heat-days-log', d.picked ? `${dayName(d.colKey)} of ${counterName(d.rowKey)} ${how}: its column is marked.` : `${dayName(d.colKey)} ${how} again: the mark is gone.`);
    });
    days.addEventListener('kp-heat-days', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        if (d.open) say('pg-heat-days-log', `${counterName(d.rowKey)}: its days are open. Choose one, or press Escape.`);
        const button = document.querySelector(`button[data-pg="days-open"][data-value="${d.open ? 'open' : 'closed'}"]`);
        for (const other of button?.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    });
    on('days-open', (value) => {
        if (value === 'open') openHeatDays(days, 'walk', '2026-10-15');
        else closeHeatDays(days);
    });
    on('days-mode', (value) => {
        days.setAttribute('data-kp-heat-days', value);
        const what = { auto: 'a tap on a touch screen opens a row when its cells are smaller than a fingertip', always: 'every click on a row opens its days, also with a mouse', off: 'the cells only, as before' };
        say('pg-heat-days-log', `When a row opens its days: ${value}: ${what[/** @type {keyof typeof what} */ (value)] ?? ''}.`);
    });
    say('pg-heat-days-log', 'Press Opened, or set Always and click a row.');
}

// ---------------------------------------------------------------- 2 · the four states keep the footprint
const states = document.getElementById('pg-heat-states');
if (states) {
    setHeat(states, HISTORY);
    attachHeats(states.parentElement ?? document);
    attachFootprints(states.parentElement ?? document);
    let loaded = 0;
    const measure = async (/** @type {string} */ what) => {
        await settle();
        // The busy card arrives the theme's way; the height is read once it stands.
        await new Promise((done) => setTimeout(done, 700));
        const now = Math.round(states.getBoundingClientRect().height);
        if (what === 'Loaded') loaded = now;
        say('pg-heat-states-log', `${what}: the grid is ${now} px high; loaded it is ${loaded} px.`);
    };
    states.addEventListener('kp-heat-retry', () => {
        setHeat(states, HISTORY);
        say('pg-heat-states-log', 'Retry pressed: the page reads the history again (here: draws it at once).');
    });
    on('heat-state', (value) => {
        const message = { empty: 'Nothing counted yet', error: 'The history could not be read' }[value];
        if (value === 'ready') setHeat(states, { ...HISTORY, state: 'ready' });
        else setHeat(states, { columns: [], rows: [], skeleton: { rows: HISTORY.rows.length, columns: HISTORY.columns.length }, state: /** @type {'loading' | 'empty' | 'error'} */ (value), ...(message ? { message } : {}) });
        void measure({ ready: 'Loaded', loading: 'Loading', empty: 'Empty', error: 'Failed' }[value] ?? value);
    });
    void measure('Loaded');
}

