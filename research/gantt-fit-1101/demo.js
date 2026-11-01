// research/gantt-fit-1101: the page's own wiring. Both timelines are the package's run timeline, attached and fed exactly as Kitchen's cook
// page does it (kitchen/web/js/recipe/timeline.js: mountTimeline, then drawTimeline on every paint, again every 10 s as the app does);
// the plan is Kitchen's own (kitchen-plan.js). This file wires the section's controls by its own elements: the timelines' data states and
// the stage width.

import { attachGantts, setGanttKinds, setGanttLegend, setGanttPoints, setGanttRuns, setGanttState, setGanttWindow, setGanttZones } from '../../js/gantt.js';
import { kitchenPlan } from './kitchen-plan.js';

/** Kitchen repaints its cook plan this often, in ms (cook/timeline.js TIMELINE_EVERY_MS). */
const REPAINT_MS = 10_000;
/** The words Kitchen gives the timeline (en/cook.js). */
const STRINGS = { ganttLoading: 'Reading the steps', ganttOk: 'done', ganttRunning: 'now', ganttPlanned: 'still to do' };
/** What the plates say in the empty and failed states (Kitchen's own cook.noSteps, and a failed read). */
const PLATE = {
    empty: ['This recipe has no steps yet', 'Add steps in the editor and the plan is drawn here.'],
    error: ['The steps could not be read', 'The app did not answer. Try again in a moment.'],
};

const component = /** @type {HTMLElement} */ (document.getElementById('gantt-fit-component'));
const timelines = /** @type {HTMLElement[]} */ ([...component.querySelectorAll('.kp-gantt')]);
/** The state each timeline is in: only a ready one is repainted. */
let state = 'ready';

/** Kitchen's drawTimeline: lanes, runs, the window fixed on the plan, and the tracks' legend. @param {HTMLElement} el */
function draw(el) {
    const { lanes, runs, from, to } = kitchenPlan(Date.now());
    el.setAttribute('data-kp-gantt-ghosts', lanes.map(() => '1').join(' '));
    setGanttRuns(el, runs, lanes);
    setGanttPoints(el, [], lanes);
    setGanttWindow(el, { span: Math.max(60, Math.round((to - from) / 1000)), live: false, to });
    setGanttKinds(el, []);
    setGanttZones(el, []);
    setGanttLegend(el, lanes.map((l) => ({ series: l.series, label: l.label })));
}

/** @param {string} value */
function setState(value) {
    state = value;
    for (const el of timelines) {
        if (value === 'loading') setGanttState(el, 'loading');
        else if (value === 'empty') setGanttState(el, 'empty', PLATE.empty[0], { text: PLATE.empty[1] });
        else if (value === 'error') setGanttState(el, 'error', PLATE.error[0], { text: PLATE.error[1] });
        else {
            setGanttState(el, 'ready');
            draw(el);
        }
    }
}

/** Press a group's button from the page. @param {string} name @param {string} value */
const press = (name, value) => {
    for (const b of component.parentElement?.querySelectorAll(`button[data-pg="${name}"]`) ?? [])
        b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === value));
};

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    if (!button || button.dataset.target !== component.id) return;
    press(button.dataset.pg ?? '', button.dataset.value ?? '');
    if (button.dataset.pg === 'width') component.setAttribute('data-pg-width', button.dataset.value ?? 'phone');
    else if (button.dataset.pg === 'state') setState(button.dataset.value ?? 'ready');
});
// Retry on a failed plate reads the plan again, as the app would.
component.addEventListener('kp-gantt-retry', () => {
    press('state', 'ready');
    setState('ready');
});

attachGantts(component, { strings: STRINGS });
for (const el of timelines) setGanttState(el, 'loading');
// The app reads its recipe first; the plan arrives a moment after the page.
window.setTimeout(() => setState('ready'), 0);
window.setInterval(() => {
    if (state === 'ready') for (const el of timelines) draw(el);
}, REPAINT_MS);
