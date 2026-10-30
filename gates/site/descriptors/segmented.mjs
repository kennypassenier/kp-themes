// Page descriptor for the "segmented" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const segmentedDescriptor = {
        id: 'segmented',
        title: 'Segmented control and filter chips',
        group: 'Forms',
        classes: ['kp-segmented'],
        exports: [],
        intro: 'A group of buttons that choose among a few values, in two looks: a track with a plate under the chosen segment, or the same buttons as separate pills (`.kp-segmented--chips`). With `data-kp-segmented="single"` (the default) it is a radio group with one value on; with `multi` each press turns one value on or off, several may be on, and none on means everything is shown. js/segmented.js writes the roles, the states, the roving tab stop and, in the track look, the position of the plate.',
        whenToUse:
            'For a choice among two to six values that changes what a list or a chart shows, where every value should stay in sight: a status filter, a view, a range. Not for a long list of values (use a select or a combobox), and not for navigation between pages (use tabs or links).',
        examples: [
            {
                title: 'One value on, with counts',
                why: 'The markup is complete without the script: the roles and `aria-checked` are written, so it is right before anything runs. The script adds the roving tab stop, the arrow keys and the plate.',
                markup: `
<div class="kp-segmented" data-kp-segmented="single" role="radiogroup" aria-label="Show">
<button type="button" class="kp-segmented__item" data-value="changed" role="radio" aria-checked="true"><span class="kp-segmented__label">Changed</span><span class="kp-segmented__count">12</span></button>
<button type="button" class="kp-segmented__item" data-value="all" role="radio" aria-checked="false"><span class="kp-segmented__label">All</span><span class="kp-segmented__count">48</span></button>
<button type="button" class="kp-segmented__item" data-value="failed" role="radio" aria-checked="false"><span class="kp-segmented__label">Failed</span><span class="kp-segmented__count">2</span></button>
</div>
`,
            },
            {
                title: 'Chips that combine, with an All chip',
                why: 'In `multi` mode each chip is a toggle with `aria-pressed`. The chip marked `data-kp-segmented-all` is pressed while nothing else is, and pressing it turns the rest off.',
                markup: `
<div class="kp-segmented kp-segmented--chips" data-kp-segmented="multi" role="group" aria-label="Status">
<button type="button" class="kp-segmented__item" data-value="all" data-kp-segmented-all aria-pressed="true"><span class="kp-segmented__label">All</span></button>
<button type="button" class="kp-segmented__item" data-value="running" aria-pressed="false"><span class="kp-segmented__label">Running</span></button>
<button type="button" class="kp-segmented__item" data-value="stopped" aria-pressed="false"><span class="kp-segmented__label">Stopped</span></button>
</div>
`,
            },
            {
                title: 'Full width, and counts that arrive later',
                why: '`.kp-segmented--block` gives every segment the same width on a full-width control. While the group is `aria-busy="true"` the counts show as quiet placeholders that keep their place; `setSegmentedCounts` writes the numbers, and the group is released, so nothing moves. Press the button to load them again. The group also reports `kp-segmented-change` with `{ value, values, item }`.',
                markup: `
<div class="kp-segmented kp-segmented--block" id="doc-seg-load" data-kp-segmented="single" role="radiogroup" aria-label="Show" aria-busy="true">
<button type="button" class="kp-segmented__item" data-value="all" role="radio" aria-checked="true"><span class="kp-segmented__label">All</span><span class="kp-segmented__count"></span></button>
<button type="button" class="kp-segmented__item" data-value="running" role="radio" aria-checked="false"><span class="kp-segmented__label">Running</span><span class="kp-segmented__count"></span></button>
<button type="button" class="kp-segmented__item" data-value="failed" role="radio" aria-checked="false"><span class="kp-segmented__label">Failed</span><span class="kp-segmented__count"></span></button>
</div>
<button type="button" class="kp-button kp-mt-sm" id="doc-seg-reload">Load the counts again</button>
`,
                script: `
import { attachSegmented, setSegmentedCounts } from '@kp-soft/themes/js/segmented';

const group = document.getElementById('doc-seg-load');
attachSegmented(group.parentElement);
const load = () => {
    group.setAttribute('aria-busy', 'true');
    setTimeout(() => {
        setSegmentedCounts(group, { all: 48, running: 31, failed: 2 });
        group.removeAttribute('aria-busy');
    }, 1500);
};
document.getElementById('doc-seg-reload').addEventListener('click', load);
load();
`,
            },
            {
                title: 'Three ways: with, without, or either',
                why: '`data-kp-segmented="tri"` on a chip group: each chip stands for something that must be in, must not be in, or does not matter. A press includes it (the chip filled, a ✓ mark), a second press leaves it out (the destructive edge, a ✕, the label struck through), a third lets it go; Delete or Backspace lets the focused chip go at once. The mark is always there and always the same size, so nothing moves. The chip marked `data-kp-segmented-all` is Clear all, dimmed while nothing is chosen, and `data-kp-segmented-summary` keeps one line after the group: its value is the hint while nothing is chosen, then it says what is. `kp-segmented-change` gains `include`, `exclude` and `state`; `getSegmentedTri` and `setSegmentedTri` read and write the two lists without an event.',
                markup: `
<div class="kp-segmented kp-segmented--chips" id="doc-seg-tri" data-kp-segmented="tri" data-kp-segmented-summary="Press a chip to require it, again to leave it out." role="group" aria-label="Ingredients">
<button type="button" class="kp-segmented__item" data-value="all" data-kp-segmented-all><span class="kp-segmented__label">Clear all</span></button>
<button type="button" class="kp-segmented__item" data-value="chicken"><span class="kp-segmented__label">Chicken</span></button>
<button type="button" class="kp-segmented__item" data-value="rice"><span class="kp-segmented__label">Rice</span></button>
<button type="button" class="kp-segmented__item" data-value="mushrooms"><span class="kp-segmented__label">Mushrooms</span></button>
<button type="button" class="kp-segmented__item" data-value="peanuts"><span class="kp-segmented__label">Peanuts</span></button>
</div>
<p class="kp-text-muted" id="doc-seg-tri-said" role="status">Nothing chosen.</p>
<button type="button" class="kp-button kp-button--sm" id="doc-seg-tri-set">Set: with chicken, without peanuts</button>
`,
                script: `
import { attachSegmented, getSegmentedTri, setSegmentedTri } from '@kp-soft/themes/js/segmented';

const group = document.getElementById('doc-seg-tri');
attachSegmented(group.parentElement);
const said = document.getElementById('doc-seg-tri-said');
group.addEventListener('kp-segmented-change', (event) => {
    const { include, exclude, state } = event.detail;
    said.textContent = 'With: ' + (include.join(', ') || 'nothing') + '. Without: ' + (exclude.join(', ') || 'nothing') + '. (' + event.detail.value + ' is now ' + state + '.)';
});
document.getElementById('doc-seg-tri-set').addEventListener('click', () => {
    setSegmentedTri(group, { include: ['chicken'], exclude: ['peanuts'] });
    said.textContent = 'Set from the page: ' + JSON.stringify(getSegmentedTri(group)) + '.';
});
`,
            },
            {
                title: 'A track wider than its room, at rest, mid-scroll and at the end',
                why: 'A track wider than its room scrolls (`data-kp-segmented-overflow`), snaps to whole segments and keeps room for the fade at its edges. The fade appears only on the side that has more out of sight, which the script names in `data-kp-segmented-more` (`start`, `end`): a label at a side with nothing beyond it stays whole. The three tracks are scrolled for you: to the start, to the middle, to the end.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-seg-scroll" style="inline-size: 17rem; max-inline-size: 100%">
<div class="kp-segmented" data-kp-segmented="single" role="radiogroup" aria-label="Range, at rest">
<button type="button" class="kp-segmented__item" data-value="5m" role="radio" aria-checked="false"><span class="kp-segmented__label">5 min</span></button>
<button type="button" class="kp-segmented__item" data-value="15m" role="radio" aria-checked="false"><span class="kp-segmented__label">15 min</span></button>
<button type="button" class="kp-segmented__item" data-value="1h" role="radio" aria-checked="true"><span class="kp-segmented__label">1 hour</span></button>
<button type="button" class="kp-segmented__item" data-value="6h" role="radio" aria-checked="false"><span class="kp-segmented__label">6 hours</span></button>
<button type="button" class="kp-segmented__item" data-value="24h" role="radio" aria-checked="false"><span class="kp-segmented__label">24 hours</span></button>
<button type="button" class="kp-segmented__item" data-value="7d" role="radio" aria-checked="false"><span class="kp-segmented__label">7 days</span></button>
<button type="button" class="kp-segmented__item" data-value="30d" role="radio" aria-checked="false"><span class="kp-segmented__label">30 days</span></button>
</div>
<div class="kp-segmented" data-kp-segmented="single" role="radiogroup" aria-label="Range, mid-scroll">
<button type="button" class="kp-segmented__item" data-value="5m" role="radio" aria-checked="false"><span class="kp-segmented__label">5 min</span></button>
<button type="button" class="kp-segmented__item" data-value="15m" role="radio" aria-checked="false"><span class="kp-segmented__label">15 min</span></button>
<button type="button" class="kp-segmented__item" data-value="1h" role="radio" aria-checked="true"><span class="kp-segmented__label">1 hour</span></button>
<button type="button" class="kp-segmented__item" data-value="6h" role="radio" aria-checked="false"><span class="kp-segmented__label">6 hours</span></button>
<button type="button" class="kp-segmented__item" data-value="24h" role="radio" aria-checked="false"><span class="kp-segmented__label">24 hours</span></button>
<button type="button" class="kp-segmented__item" data-value="7d" role="radio" aria-checked="false"><span class="kp-segmented__label">7 days</span></button>
<button type="button" class="kp-segmented__item" data-value="30d" role="radio" aria-checked="false"><span class="kp-segmented__label">30 days</span></button>
</div>
<div class="kp-segmented" data-kp-segmented="single" role="radiogroup" aria-label="Range, at the end">
<button type="button" class="kp-segmented__item" data-value="5m" role="radio" aria-checked="false"><span class="kp-segmented__label">5 min</span></button>
<button type="button" class="kp-segmented__item" data-value="15m" role="radio" aria-checked="false"><span class="kp-segmented__label">15 min</span></button>
<button type="button" class="kp-segmented__item" data-value="1h" role="radio" aria-checked="true"><span class="kp-segmented__label">1 hour</span></button>
<button type="button" class="kp-segmented__item" data-value="6h" role="radio" aria-checked="false"><span class="kp-segmented__label">6 hours</span></button>
<button type="button" class="kp-segmented__item" data-value="24h" role="radio" aria-checked="false"><span class="kp-segmented__label">24 hours</span></button>
<button type="button" class="kp-segmented__item" data-value="7d" role="radio" aria-checked="false"><span class="kp-segmented__label">7 days</span></button>
<button type="button" class="kp-segmented__item" data-value="30d" role="radio" aria-checked="false"><span class="kp-segmented__label">30 days</span></button>
</div>
</div>
`,
                script: `
const tracks = document.querySelectorAll('#doc-seg-scroll > .kp-segmented');
setTimeout(() => {
    tracks[1].scrollLeft = (tracks[1].scrollWidth - tracks[1].clientWidth) / 2;
    tracks[2].scrollLeft = tracks[2].scrollWidth;
}, 400);
`,
            },
        ],
        variants: [
            { name: 'data-kp-segmented="tri"', what: 'The three-way chip group, used with `.kp-segmented--chips`. Each chip carries `data-kp-segmented-tri="include|exclude"`, absent for either way (`TRI_ATTRIBUTE`, `TRI_STATES`), and the parts `.kp-segmented__mark`, `__state` (the word a screen reader hears after the name, “Chicken, required”), `__summary` and `__live`.' },
            { name: 'getSegmentedTri / setSegmentedTri', what: 'Read `{ include, exclude }`, or set both lists without an event. `SegmentedItem.state` is the state a chip is given in `setSegmentedItems`.' },
            { name: 'data-kp-segmented-more', what: 'Written by the script on a scrolling track, never by you: `start`, `end` or both name the sides that have more segments out of sight, so the stylesheet fades only those edges (`MORE_ATTRIBUTE` in js/segmented.js; `OVERFLOW_ATTRIBUTE` is the overflow mark).' },
            { name: 'snapping', what: 'A track wider than its room snaps to whole segments (`scroll-snap-type: x proximity`) and keeps a scroll padding of the fade’s width, so a segment is never left half under the fade.' },
            { name: '.kp-segmented--chips', what: 'The same buttons as separate pills instead of a track; the chosen chip takes the primary colour.' },
            { name: '.kp-segmented__count', what: 'A number beside the label. While the group is `aria-busy="true"` it shows a placeholder, so nothing moves when the numbers arrive.' },
            { name: 'disabled', what: '`disabled` on an item, or `aria-disabled="true"` on the group, takes it out of the arrow keys and dims it.' },
            { name: 'overflow', what: 'When the segments are wider than the group, the group scrolls and the chosen segment is kept in view.' },
            { name: '.kp-segmented--block', what: 'Every segment the same width, on a full-width control.' },
            { name: 'data-kp-segmented-collapse="false"', what: 'In `multi`, turning every other value on is the same as none, so the group goes back to All. This keeps them on.' },
            { name: 'data-kp-segmented-thumb / -glide / -overflow', what: 'Written by the script, never by you: the plate is placed, it glides only after its first placement, and the segments are wider than the group. The plate’s place is two custom properties on the group, which the theme moves in its own time.' },
            { name: 'setSegmentedValues / getSegmentedValues / resetSegmented', what: 'Read the values that are on (empty is All), set them without an event (the address changed), or turn every value off and fire the event if anything was on.' },
            { name: 'setSegmentedCounts / setSegmentedItems', what: 'Write the numbers beside the values (null empties one, a value not named keeps its number), or replace the items in place: the values still present stay on and the focus stays on its value.' },
            { name: 'aria-busy="true"', what: 'On the group: the counts show a placeholder while their numbers load. Pressing is not blocked.' },
            { name: 'switchable at runtime', what: 'Switchable at runtime: changing `data-kp-segmented` redraws the control.' },
        ],
        accessibility: [
            'Built in — single is a `radiogroup` with `aria-checked`, multi is a group of toggle buttons with `aria-pressed`; one tab stop in, arrow keys within, Home and End jump.',
            'Built in — in multi the arrow keys only move the focus; Space and Enter turn the value, so a keyboard user never changes a filter by passing it.',
            'Yours — name the group (`aria-label` or `aria-labelledby`), and say in text near the list what is being filtered.',
        ],
    };
