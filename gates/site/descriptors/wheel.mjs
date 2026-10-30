// Page descriptor for the "wheel" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const wheelDescriptor = {
        id: 'wheel',
        title: 'Wheel',
        group: 'Data',
        classes: ['kp-wheel'],
        exports: [],
        intro: 'A wheel that picks for you: a segment per choice, sized by its weight, a pointer at the top and Spin in the middle. `data-kp-wheel` on the root; js/wheel.js (`setWheelItems`, `spinWheel`, `setWheelState`, `getWheelResult`, `pickWeighted`, `attachWheels`) draws the outcome by the weights first and then turns the wheel to it, never lands on the same choice twice in a row, takes the short way for a reader who asked for less motion, and says the outcome once. `kp-wheel-spin` and `kp-wheel-result` carry the item.',
        whenToUse: 'To take a small choice off someone’s hands (what to eat, who goes first) where any outcome is acceptable. For a choice a person makes use a list or a segmented control.',
        examples: [
            {
                title: 'Tonight’s dinner',
                why: 'The module draws the wheel from the items it is given. The segments are as large as their odds: a weight of 4 beside two of 1 is two thirds of the disc and two thirds likely. The outcome is drawn first, by the weights (`pickWeighted`), and the wheel then turns to it, so the motion is honest; spinning again never lands on the same choice twice in a row. Spin with the button or Space. `kp-wheel-spin` carries `{ item, index, turns }` when the turn starts and `kp-wheel-result` `{ item, index, source }` when it settles; the outcome is also said once to a screen reader. Change the weights with the second button: the segments glide to their new size. The wheel never moves the page: it keeps its size.',
                markup: `
<div class="kp-wheel" id="doc-wheel" data-kp-wheel aria-label="Tonight’s dinner"></div>
<p class="kp-text-muted" id="doc-wheel-said" role="status">Not spun yet.</p>
<button type="button" class="kp-button kp-button--sm" id="doc-wheel-weights">Make the curry less likely</button>
`,
                script: `
import { attachWheels, setWheelItems, getWheelResult } from '@kp-soft/themes/js/wheel';

const wheel = document.getElementById('doc-wheel');
attachWheels(wheel.parentElement);
const items = [
    { id: 'curry', label: 'Chicken curry', weight: 4 },
    { id: 'pasta', label: 'Pasta pesto', weight: 1 },
    { id: 'soup', label: 'Tomato soup', weight: 1 },
    { id: 'stir', label: 'Vegetable stir-fry with a very long name', weight: 2 },
];
setWheelItems(wheel, items);
const said = document.getElementById('doc-wheel-said');
wheel.addEventListener('kp-wheel-spin', (event) => { said.textContent = 'Spinning to ' + event.detail.item.label + ' in ' + event.detail.turns + ' turns.'; });
wheel.addEventListener('kp-wheel-result', (event) => { said.textContent = 'Tonight: ' + event.detail.item.label + ' (' + event.detail.source + '). Last result: ' + getWheelResult(wheel).label + '.'; });
document.getElementById('doc-wheel-weights').addEventListener('click', () => {
    setWheelItems(wheel, items.map((item) => (item.id === 'curry' ? { ...item, weight: 1 } : item)));
});
`,
            },
            {
                title: 'Spin options, one choice, none, loading and failed',
                why: '`data-kp-wheel-turns` fixes the whole turns, else a number between 3 and 6 is drawn per spin (`data-kp-wheel-turns-min` and `-max`); `data-kp-wheel-duration` is the time of the mean travel in ms (3600) and a longer travel takes proportionally longer; `data-kp-wheel-reduced-ms` is the short way for a reader who asked for less motion (600; 0 places it at once, with no whole turn); `data-kp-wheel-repeat="true"` lets a spin land on the same choice again. With one choice there is no spin, the outcome comes at once; with none the wheel says `data-kp-wheel-empty`. `setWheelState(wheel, "loading" | "error" | "ready", message)` lays the busy card over the wheel or says the message where the outcome goes.',
                markup: `
<div class="kp-wheel" id="doc-wheel-fast" data-kp-wheel data-kp-wheel-turns="2" data-kp-wheel-duration="1500" data-kp-wheel-repeat="true" aria-label="A quick wheel"></div>
<div class="kp-wheel" id="doc-wheel-one" data-kp-wheel aria-label="One choice"></div>
<div class="kp-wheel" id="doc-wheel-none" data-kp-wheel data-kp-wheel-empty="Nothing fits. Loosen a filter." aria-label="No choice"></div>
<div class="kp-wheel" id="doc-wheel-loading" data-kp-wheel aria-label="Loading"></div>
<div class="kp-wheel" id="doc-wheel-failed" data-kp-wheel aria-label="Failed"></div>
`,
                script: `
import { attachWheels, setWheelItems, setWheelState } from '@kp-soft/themes/js/wheel';

const fast = document.getElementById('doc-wheel-fast');
attachWheels(fast.parentElement);
setWheelItems(fast, [{ id: 'a', label: 'Left' }, { id: 'b', label: 'Right' }, { id: 'c', label: 'Straight on' }]);
setWheelItems(document.getElementById('doc-wheel-one'), [{ id: 'only', label: 'Soup' }]);
setWheelItems(document.getElementById('doc-wheel-none'), []);
setWheelItems(document.getElementById('doc-wheel-loading'), [{ id: 'a', label: 'One' }, { id: 'b', label: 'Two' }]);
setWheelState(document.getElementById('doc-wheel-loading'), 'loading');
setWheelItems(document.getElementById('doc-wheel-failed'), [{ id: 'a', label: 'One' }, { id: 'b', label: 'Two' }]);
setWheelState(document.getElementById('doc-wheel-failed'), 'error', 'The choices could not be read.');
`,
            },
        ],
        variants: [
            { name: 'data-kp-wheel-turns-min / -max', what: 'The range a spin’s whole turns are drawn from (3 to 6); `data-kp-wheel-turns` fixes both.' },
            { name: 'pickWeighted / wheelAngles', what: '`pickWeighted(items, { random, avoid })` draws a choice by its weight, never the one to `avoid`; `wheelAngles(weights)` gives each segment’s angle.' },
            { name: 'getWheelResult / spinWheel', what: '`spinWheel(wheel)` spins from the page and resolves when it settles; `getWheelResult(wheel)` is the last outcome.' },
            { name: 'data-kp-wheel-duration', what: 'How long a spin takes, in ms (3600).' },
            { name: 'data-kp-wheel-turns', what: 'Whole turns before it settles (4).' },
            { name: 'data-kp-wheel-reduced-ms', what: 'The short turn under reduced motion, in ms (600; 0 places it at once).' },
            { name: 'data-kp-wheel-repeat="true"', what: 'Spin again may land on the same choice.' },
            { name: 'data-kp-wheel-empty', what: 'The sentence when nothing fits.' },
            { name: 'short', what: 'An item field: a shorter name for the face of the wheel. A long name is no longer cut on its segment: it is set at the largest size, over two lines, then `short`, else not drawn, and the segment’s tooltip holds the whole name.' },
            { name: 'data-kp-wheel-kiosk', what: 'No hub button: the wheel is the control, and it stays live. `data-kp-wheel-answer` shows the answer card. Items take `tag` and `resting`; the words are `wheelIdleKiosk`, `wheelSpinKiosk` and `wheelResting`.' },
        ],
        accessibility: [
            'Built in — Spin is a real button (Space, Enter); the outcome is a status region said once, after the turn.',
            'Built in — reduced motion takes the short way, or none.',
            'Yours — give the wheel a name, and offer the outcome as a choice the person can refuse.',
        ],
    };
