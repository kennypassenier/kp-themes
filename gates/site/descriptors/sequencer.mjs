// Page descriptor for the "sequencer" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const sequencerDescriptor = {
        id: 'sequencer',
        title: 'Sequencer',
        group: 'Data',
        classes: ['kp-sequencer'],
        aliases: ['editing', 'flip', 'grabbed', 'linked', 'locked', 'mode'],
        exports: [],
        intro: 'An editable multi-track timeline: bars in lanes, moved along the axis and between lanes, resized at either edge by pointer or keyboard, snapping to a step in any unit and to the edges of other items, with a live total and an optional line for now. It is the run timeline’s own look on a plan instead of the clock: the host is `section.kp-gantt.kp-sequencer`, so every register that dresses the run timeline dresses this. `attachSequencers(root)` in js/sequencer.js fills `[data-kp-sequencer]`; `setSequencerItems` hands it the plan.',
        whenToUse:
            'When a reader arranges steps in time and in parallel: the steps of a recipe, a deployment plan, a rota. Not for what already ran (use the run timeline), not for a list that only changes order (use reorder), and not for a calendar of dated events (use the week agenda).',
        examples: [
            {
                title: 'A recipe, two lanes, one step that runs alongside',
                why: 'The markup is the empty host with its options; the page hands over the lanes and the items. Values are minutes. “Brown the mince” runs alongside “Boil the water”, so dragging either moves both. The page saves what `kp-sequencer-change` carries.',
                markup: `
<section class="kp-gantt kp-sequencer" data-kp-sequencer data-kp-sequencer-unit="minute" data-kp-sequencer-snap="1" aria-label="Spaghetti bolognese"></section>
<p class="kp-text-muted" data-doc-sequencer-total></p>
`,
                script: `
import { attachSequencers, setSequencerItems, setSequencerNow } from '@kp-soft/themes/js/sequencer';

const plan = document.querySelector('[data-kp-sequencer]:not([id])');
attachSequencers(plan.parentElement);
setSequencerItems(
    plan,
    [
        { id: 'boil', lane: 'pasta', label: 'Boil the water', start: 20, duration: 8 },
        { id: 'cook', lane: 'pasta', label: 'Cook the spaghetti', start: 28, duration: 10 },
        { id: 'brown', lane: 'sauce', label: 'Brown the mince', start: 20, duration: 11, with: 'boil' },
        { id: 'simmer', lane: 'sauce', label: 'Simmer the sauce', start: 31, duration: 7 },
    ],
    [
        { id: 'sauce', label: 'Sauce' },
        { id: 'pasta', label: 'Pasta' },
    ],
);
setSequencerNow(plan, 12);
plan.addEventListener('kp-sequencer-change', (e) => {
    document.querySelector('[data-doc-sequencer-total]').textContent = 'Saved: ' + e.detail.items.length + ' steps, ' + e.detail.total + ' min in all.';
});
`,
            },
            {
                title: 'Pushing, a locked step and the failed state',
                why: '`data-kp-sequencer-overlap="push"` moves the items in the way later instead of refusing; `locked` pins one. The second host shows the failed plate with its Retry (`kp-sequencer-retry`), which keeps the footprint the sequencer had.',
                markup: `
<section class="kp-gantt kp-sequencer" id="doc-seq-push" data-kp-sequencer data-kp-sequencer-overlap="push" data-kp-sequencer-lanes="fixed" data-kp-sequencer-unit="hour" data-kp-sequencer-toolbar="off" aria-label="Release plan"></section>
<section class="kp-gantt kp-sequencer" id="doc-seq-failed" data-kp-sequencer data-kp-sequencer-hint="off" aria-label="Release plan, failed to load"></section>
`,
                script: `
import { attachSequencers, setSequencerItems, setSequencerState } from '@kp-soft/themes/js/sequencer';

const plan = document.getElementById('doc-seq-push');
const failed = document.getElementById('doc-seq-failed');
attachSequencers(plan.parentElement);
setSequencerItems(
    plan,
    [
        { id: 'freeze', lane: 'build', label: 'Freeze', start: 0, duration: 2, locked: true },
        { id: 'build', lane: 'build', label: 'Build', start: 2, duration: 3 },
        { id: 'test', lane: 'build', label: 'Test', start: 5, duration: 3 },
        { id: 'docs', lane: 'ship', label: 'Docs', start: 2, duration: 4 },
    ],
    [
        { id: 'build', label: 'Build' },
        { id: 'ship', label: 'Ship' },
    ],
);
setSequencerState(failed, 'error', 'The plan did not load', { text: 'Try again in a moment.' });
failed.addEventListener('kp-sequencer-retry', () => setSequencerState(failed, 'empty', 'Nothing planned yet'));
`,
            },
        ],
        variants: [
            { name: 'data-kp-sequencer-unit', what: 'What `start` and `duration` are counted in: `second`, `minute` (default), `hour`, `day` or `week` (short forms `s`, `min`, `h`, `d`, `w` too). Read again when it changes.' },
            { name: 'data-kp-sequencer-snap', what: 'The step, in the unit, that every move and resize snaps to (1). Edges of other items pull a dragged edge within 8 px as well.' },
            { name: 'data-kp-sequencer-snap-items', what: '`off` leaves out the pull to other items’ edges and keeps the step alone.' },
            { name: 'data-kp-sequencer-overlap', what: '`refuse` (default: an edit that would overlap in a lane does not happen, and `kp-sequencer-refuse` says why), `push` (the items in the way, with what runs alongside them, move later) or `allow` (items overlap and take rows of their lane).' },
            { name: 'data-kp-sequencer-lanes', what: '`fixed` keeps every item in its lane; the default lets an item change lane, by pointer or with Alt and the up and down arrows.' },
            { name: 'data-kp-sequencer-editable', what: '`off` shows the plan and edits nothing; the bars are still reachable by keyboard and still announce themselves.' },
            { name: 'data-kp-sequencer-zoom', what: 'The zoom, 0.5 to 16; 1 fits the plot to its box. Under 26rem the plot (its knob is listed below) keeps that width and the frame scrolls sideways, with the lane names held at the start edge. Ctrl and the wheel, or a pinch, zoom too; `setSequencerZoom` sets it from code.' },
            { name: 'data-kp-sequencer-span', what: 'The shortest window, in the unit (0, the default, fits the plan with a little room after the last item).' },
            { name: 'data-kp-sequencer-toolbar', what: '`off` leaves out the zoom row and the live total in it.' },
            { name: 'data-kp-sequencer-hint', what: '`off` leaves out the line that says how to move and resize.' },
            { name: 'with', what: 'An item field naming another item it “runs alongside”: it starts together with it. Moving any member of a group moves the whole group by the same amount, and a join is drawn from the item to its partner. L chooses the partner for the focused item, U lets it run on its own.' },
            { name: 'locked', what: 'An item field: the bar cannot be moved or resized (`data-kp-locked`); an attempt is refused with the reason `locked`.' },
            { name: 'setSequencerItems(el, items, lanes)', what: 'Gives the sequencer its items and lanes. Items are kept by id, so a refresh keeps focus and selection; an edit in progress is not disturbed, the set is applied when it ends. `getSequencerItems` and `getSequencerTotal` read the plan back.' },
            { name: 'setSequencerNow(el, at)', what: 'Puts the line for now at a point of the plan (null takes it away).' },
            { name: 'setSequencerState(el, state, words, { text, art })', what: '`loading` (the busy card), `empty` or `error` (the state plate; Retry fires `kp-sequencer-retry`) or `ready`. The plate keeps the footprint the sequencer had.' },
            { name: 'kp-sequencer-change', what: 'Fired when an edit is dropped, with `{ items, changed, source: "pointer" | "keyboard" | "link", total }`; save `items` (each `{ id, lane, start, duration, with }`).' },
            { name: 'kp-sequencer-refuse', what: 'Fired when an edit did not happen, with the `reason` (`locked`, `overlap`, `edge`, `lane`, `cycle`, `unknown`) and the `blocker`; the bar shakes by a mark and the status line says it.' },
            { name: 'pure logic', what: '`sequencerPlan`, `sequencerSnap`, `sequencerLink`, `sequencerRows` and the other functions exported next to `attachSequencers` need no DOM; a server or a test can run the same overlap rule the page does.' },
        ],
        accessibility: [
            'Built in: every bar is a button in a list of lanes; arrows move between items, Enter or Space picks one up, the arrows then move it by the snap step (Ctrl: ten steps), Shift and the arrows resize the end, Ctrl and Shift the start, Alt and the up and down arrows change lane, Enter drops it and Escape puts it back.',
            'Built in: every step is said in one polite status region (the bar picked up, its new start and length, the refusal and its reason); the pointer drag has the same refusals, and Escape during a drag puts the bar back.',
            'Built in: a locked bar, a linked pair and a refused edit carry a mark and a word, not a colour alone; the live total and the line for now are text.',
            'Yours: saving what `kp-sequencer-change` carries, and what an item means; the sequencer does not know what a minute is for.',
        ],
    };
