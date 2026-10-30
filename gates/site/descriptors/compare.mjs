// Page descriptor for the "compare" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const compareDescriptor = {
        id: 'compare',
        title: 'Compare slider',
        group: 'Content',
        classes: ['kp-compare'],
        aliases: ['pane', 'position', 'ratio', 'state'],
        exports: [],
        intro: 'Two versions stacked with a draggable divider: the before pane shows on the start side, the after pane on the end side. `attachCompares(root)` in js/compare.js adds the divider (a slider: arrow keys by 1, with Shift by 10, Page Up and Down, Home and End), a label on each side that steps aside while the divider covers it, and the waiting state. On images a press anywhere moves the divider and a drag follows; on live HTML panes only the handle drags, so both panes stay usable. Give images their width and height, or the box `data-kp-compare-ratio`, so nothing moves while they load; the theme’s skeleton covers the box meanwhile, and a failed image says so in its pane.',
        whenToUse:
            'To show what a change did: a redesign before and after, two renders of a chart, a photo before and after an edit. For two things that differ in more than looks, put them side by side instead.',
        examples: [
            {
                title: 'A chart before and after',
                why: 'Each pane is marked with its side; the script adds the divider, the labels and the waiting state.',
                markup: `
<div class="kp-compare" data-kp-compare aria-label="Pressure chart, before and after"><div data-kp-compare-pane="before"><img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 160'><rect width='280' height='160' fill='%23f4f4f0'/><polyline points='0,150 40,148 80,140 120,145 160,130 200,135 240,125 280,128' fill='none' stroke='%23b0442f' stroke-width='4'/><text x='8' y='18' font-size='14' font-family='sans-serif' fill='%23333'>Before</text></svg>" width="1200" height="675" alt="The chart before" /></div><div data-kp-compare-pane="after"><img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 160'><rect width='280' height='160' fill='%23f4f4f0'/><polyline points='0,150 40,140 80,120 120,125 160,90 200,80 240,60 280,50' fill='none' stroke='%232a7a4b' stroke-width='4'/><text x='8' y='18' font-size='14' font-family='sans-serif' fill='%23333'>After</text></svg>" width="1200" height="675" alt="The chart after" /></div></div>
`,
            },
            {
                title: 'Two live panes, with their own words and start',
                why: 'Panes may be live HTML: they stay usable, so only the handle drags. `data-kp-compare-before` and `-after` rename the two labels, `data-kp-compare-position="30"` starts the divider at 30 (0 is all after, 100 all before) and `data-kp-compare-ratio="2/1"` keeps the box’s shape where the panes give no size. The arrow keys move the divider by 1, with Shift by 10; Page Up and Down by 10; Home and End to the ends.',
                markup: `
<div class="kp-compare" data-kp-compare data-kp-compare-before="Old layout" data-kp-compare-after="New layout" data-kp-compare-position="30" data-kp-compare-ratio="2/1" aria-label="Settings card, old and new layout">
<div data-kp-compare-pane="before"><div class="kp-card"><h3 class="kp-fw-semibold">Backups</h3><p class="kp-text-muted">Nightly at 03:00.</p><button class="kp-button" type="button">Edit</button></div></div>
<div data-kp-compare-pane="after"><div class="kp-card"><h3 class="kp-fw-semibold">Backups</h3><p class="kp-text-muted">Nightly at 03:00 · last run 4 h ago.</p><button class="kp-button kp-button--primary" type="button">Edit schedule</button></div></div>
</div>
`,
            },
            {
                title: 'Pictures that load, a divider moved by the page',
                why: 'Give images their width and height so nothing moves while they load. `setCompare(el, position)` moves the divider from a script (without an event) and `kp-compare-change` carries `{ position }` when a person moved it. `setCompareBusy(el, true)` holds the box in its loading state, the theme’s busy card over a quiet plate at the whole size, while the page reads its panes itself.',
                markup: `
<div class="kp-compare" id="doc-compare-pics" data-kp-compare aria-label="Chart before and after">
<div data-kp-compare-pane="before"><img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 160 90%27%3E%3Crect width=%27160%27 height=%2790%27 fill=%27%23d9dde6%27/%3E%3Cpath d=%27M0 70 L40 55 L80 62 L120 40 L160 48%27 stroke=%27%23667%27 fill=%27none%27 stroke-width=%273%27/%3E%3C/svg%3E" width="1200" height="675" alt="The chart before: a flat grey line" /></div>
<div data-kp-compare-pane="after"><img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 160 90%27%3E%3Crect width=%27160%27 height=%2790%27 fill=%27%23e6edf9%27/%3E%3Cpath d=%27M0 70 L40 55 L80 62 L120 40 L160 48 L160 90 L0 90Z%27 fill=%27%23284b8c%27 fill-opacity=%27.35%27 stroke=%27%23284b8c%27 stroke-width=%273%27/%3E%3C/svg%3E" width="1200" height="675" alt="The chart after: the same line with its area filled" /></div>
</div>
<p class="kp-text-muted" id="doc-compare-log" aria-live="polite">Drag the divider, or wait for the page to move it.</p>
`,
                script: `
import { setCompare, setCompareBusy } from '@kp-soft/themes/js/compare';

const box = document.getElementById('doc-compare-pics');
const log = document.getElementById('doc-compare-log');
setCompareBusy(box, true);
setTimeout(() => {
    setCompareBusy(box, false);
    setCompare(box, 70);
}, 1500);
box.addEventListener('kp-compare-change', (event) => { log.textContent = 'Divider at ' + Math.round(event.detail.position) + '.'; });
`,
            },
            {
                title: 'A picture that fails, and Retry',
                why: 'An image that fails says so over the whole visible part of its pane, with a normal-size Retry that asks for the image again and fires `kp-compare-retry` with `{ pane }`. Here the page answers by giving the pane a picture that exists.',
                markup: `
<div class="kp-compare" id="doc-compare-failed" data-kp-compare aria-label="Photo before and after">
<div data-kp-compare-pane="before"><img src="missing/before.png" width="1200" height="675" alt="The photo before" /></div>
<div data-kp-compare-pane="after"><img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 160 90%27%3E%3Crect width=%27160%27 height=%2790%27 fill=%27%23e6edf9%27/%3E%3Ccircle cx=%2780%27 cy=%2745%27 r=%2725%27 fill=%27%23284b8c%27/%3E%3C/svg%3E" width="1200" height="675" alt="The photo after" /></div>
</div>
`,
                script: `
const box = document.getElementById('doc-compare-failed');
box.addEventListener('kp-compare-retry', (event) => {
    if (event.detail.pane !== 'before') return;
    box.querySelector('[data-kp-compare-pane="before"] img').src =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 90'%3E%3Crect width='160' height='90' fill='%23d9dde6'/%3E%3Ccircle cx='80' cy='45' r='25' fill='%23667'/%3E%3C/svg%3E";
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-compare', what: 'Marks the slider; `attachCompares` wires it.' },
            { name: 'data-kp-compare-pane', what: '`before` or `after` on each of the two panes.' },
            { name: 'data-kp-compare-position', what: 'Where the divider starts, 0 (all after) to 100 (all before); 50 by default.' },
            { name: 'data-kp-compare-before', what: 'The before side’s label; “Before” by default.' },
            { name: 'data-kp-compare-after', what: 'The after side’s label; “After” by default.' },
            { name: 'data-kp-compare-ratio', what: 'The box’s aspect ratio (`16/9`) when the panes do not give their size.' },
            { name: 'data-kp-compare-drag', what: '`anywhere` (images: a press moves the divider) or `handle` (live panes); set by the script when not given.' },
            { name: 'data-kp-compare-state', what: 'Set by the script: `loading` while an image is on its way, else `ready`.' },
            { name: 'data-kp-compare-dragging', what: 'Set by the script during a drag: the divider follows at once.' },
            { name: 'data-kp-compare-glide', what: 'Set by the script when the divider moves to a press: it glides in the theme’s own time.' },
            { name: 'data-kp-compare-before-hidden', what: 'Set by the script while the divider covers the before label.' },
            { name: 'data-kp-compare-after-hidden', what: 'Set by the script while the divider covers the after label.' },
        ],
        accessibility: [
            'Built in — the divider is a slider with a name, its value and a value text (“40% Before, 60% After”); one tab stop; the arrow keys, Page Up and Down, Home and End move it.',
            'Built in — a finger moving up and down scrolls the page; sideways on the handle it moves the divider. The labels are drawn, the slider says the sides.',
            'Yours — give each image an `alt` that says what it shows, and the slider a name (`aria-label`).',
        ],
    };
