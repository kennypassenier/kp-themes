// Page descriptor for the "toggle" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const toggleDescriptor = {
        id: 'toggle',
        title: 'Toggle button',
        group: 'Forms',
        classes: ['kp-toggle', 'kp-toggles'],
        exports: [],
        intro: 'A button that stays pressed until it is pressed again: “Only errors”, “Pin”, “Follow”. It keeps its words, shows the state by shape and weight as well as colour, can carry an exact count and a short hint, and a group of them can behave as filters, as a one-of switch or as an “All” chip.',
        whenToUse: 'A filter, a pin, a follow or a show/hide that is on or off. For a setting that is saved with a form, use the switch; for one choice from a few that are always shown together, use the segmented control.',
        examples: [
            {
                title: 'One toggle',
                why: 'The platform attribute `aria-pressed` is the state; the label never changes.',
                markup: `
<button class="kp-button" type="button" data-kp-toggle aria-pressed="false" data-kp-pressed-hint="Showing errors only">Only errors</button>
`,
            },
            {
                title: 'Filter chips with exact counts and an All chip',
                why: 'The All chip is on while nothing else is, and pressing it clears the rest; Clear filters keeps its place.',
                markup: `
<div class="kp-toggles" role="group" aria-label="Level" data-kp-toggle-group="level" data-kp-toggle-clear>
    <button class="kp-button" type="button" data-kp-toggle data-kp-toggle-all data-kp-look="chip" aria-pressed="true" data-kp-count="138">All</button>
    <button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" data-kp-count="12">Error</button>
    <button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" data-kp-count="31">Warning</button>
    <button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" data-kp-count="95">Info</button>
</div>
`,
            },
            {
                title: 'A toggle the server may refuse, a half-on one and an icon',
                why: 'With `data-kp-toggle-async` the app answers the cancelable `kp-toggle` event with `detail.wait(promise)`: the button is busy, and when the promise rejects it is rolled back and the word “Refused” (`data-kp-refused-word` changes it) stands on the button for three seconds. `data-kp-pressed-mark="check"` draws a tick while it is on, its room kept while it is off. `aria-pressed="mixed"` is a dashed edge on a half wash. Press Follow: the page refuses it.',
                markup: `
<div class="kp-row kp-gap-md" id="doc-toggle-more">
<button class="kp-button" type="button" id="doc-toggle-async" data-kp-toggle data-kp-toggle-async data-kp-pressed-mark="check" data-kp-refused-word="Not allowed" aria-pressed="false">Follow</button>
<button class="kp-button" type="button" data-kp-toggle data-kp-look="chip" aria-pressed="mixed" data-kp-count="3">Some stacks</button>
<button class="kp-button" type="button" data-kp-toggle data-kp-look="icon" aria-pressed="false" aria-label="Pin to the top" data-kp-toggle-key="p">★</button>
</div>
`,
                script: `
import { attachToggles } from '@kp-soft/themes/js/toggle';

const row = document.getElementById('doc-toggle-more');
attachToggles(row);
row.addEventListener('kp-toggle', (event) => {
    if (event.detail.button.id !== 'doc-toggle-async') return;
    event.detail.wait(new Promise((resolve, reject) => setTimeout(() => reject(new Error('refused')), 600)));
});
row.addEventListener('kp-toggle-changed', (event) => console.info('pressed', event.detail.pressedKeys));
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachToggles(root, options)` wires every `[data-kp-toggle]` and returns a detach; `toggle(el)` answers a button’s handle, `toggleGroup(button)` its group, `togglePressedKeys(anyMember)` the keys of the pressed members and `toggleKey(el)` the key of one (its `data-kp-toggle-value`, else its id, else its label). `TOGGLE` is the selector, `TOGGLE_LOOKS` and `TOGGLE_MODES` the allowed values.' },
            { name: 'kp-toggle / kp-toggle-changed', what: '`kp-toggle` fires on the button before anything changes, bubbling and cancelable, with `{ button, pressed, previous, group, pressedKeys, wait }`; `kp-toggle-changed` fires after, once per change (`TOGGLE_EVENT`, `TOGGLE_CHANGED_EVENT`). Space and Enter press; in a `single` group the arrow keys walk the buttons.' },
            { name: '.kp-toggle__label / __count / __mark / __hint', what: 'The parts the script writes: the label (it never changes with the state), the exact count, the tick of `data-kp-pressed-mark="check"` and the hint line under the label (`data-kp-pressed-hint`), whose room is always there so nothing moves.' },
            { name: '.kp-toggle__refused / __bone / __live', what: 'The refusal word on a rolled-back button (`TOGGLE_REFUSED_MS`, 3000), the skeleton of a count that is still loading, and the polite line a screen reader hears per change (`data-kp-announce`: `state`, `all` or `off`).' },
            { name: '.kp-toggle__clear', what: 'The “Clear filters (N)” button of a group with `data-kp-toggle-clear`: in place whether or not anything is pressed.' },
            { name: 'data-kp-toggle-value / data-kp-remember', what: 'The member’s key in `pressedKeys`, and a name that keeps a group’s state per device (off by default: most filters start clean). A toggle that cannot be pressed says why with `data-kp-disabled-reason`.' },
            { name: 'data-kp-look', what: '`button` (default), `chip` (a pill) or `icon` (a square).' },
            { name: 'aria-pressed', what: '`false` (default), `true` or `mixed` (a dashed edge on a half wash).' },
            { name: 'data-kp-toggle-mode', what: 'On the group: `multi` (default), `single` (one is always on, arrow keys walk) or `single-or-none`.' },
            { name: 'data-kp-count', what: 'An exact number beside the label, or `loading` for a skeleton; the room for the next digit is held.' },
            { name: 'data-kp-pressed-mark', what: '`check` draws a tick while it is on, its room kept while it is off.' },
            { name: 'data-kp-toggle-async', what: 'The app answers `kp-toggle` with `detail.wait(promise)`: busy, rolled back and the word “Refused” if it fails.' },
            { name: 'data-kp-toggle-key', what: 'A key that presses it, listed in the shortcut sheet; never a bare digit.' },
        ],
        accessibility: [
            'Built in — `aria-pressed` is the one source of the state, `mixed` is announced as partly pressed, a group says one polite line per change (“Only errors on, 12 shown”), the hit area is 44 px on a phone, the label never changes with the state.',
            'Yours — name the group (`aria-label` on the container), and answer `kp-toggle` with a promise when the change takes time; the toggle is its own undo, so no undo is offered.',
        ],
    };
