// Page descriptor for the "formgrid" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const formgridDescriptor = {
        id: 'formgrid',
        title: 'Form grid',
        group: 'Forms',
        classes: ['kp-formgrid'],
        exports: [],
        intro: 'The one layout for forms, settings, key-value panels and button groups: four tracks, `label | control | value | actions`, shared by every row so labels, controls, the words about a value and its buttons each stand on one edge. Rows are `.kp-formgrid__row`; `.kp-formrows`, `.kp-kv`, `fieldset` and `form` placed inside it become subgrids of the same tracks. Under 36rem of the grid’s own width every row reads top to bottom.',
        whenToUse: 'Any page that is a list of labelled things: a settings form, the facts of a job, a group of buttons under what they act on. Reach for form rows when the page is a single narrow column of independent values and needs no value or action track.',
        examples: [
            {
                title: 'Label, control, value and actions in four tracks',
                why: 'Each row is label, control, then the words about the value and its buttons. A row marked `data-kp-changed` gets the changed rule; `data-kp-formgrid-lines="lines"` draws a hairline between rows. A short control (a stepper, a time, a number, a date) takes the short width, and the cells stand on the first baseline.',
                markup: `
<div class="kp-formgrid" data-kp-formgrid-lines="lines" aria-label="Offsite backup settings">
<section class="kp-formgrid__group" aria-labelledby="doc-fg-heading">
<h3 class="kp-formgrid__heading" id="doc-fg-heading">Upload</h3>
<div class="kp-formgrid__row">
<label class="kp-formgrid__label" for="doc-fg-target">Upload target<small>Where the snapshots go.</small></label>
<div class="kp-formgrid__control"><input class="kp-field__input" id="doc-fg-target" value="b2:family-photos/offsite" /></div>
<p class="kp-formgrid__value">changed 12/10/2026 21:14</p>
<div class="kp-formgrid__actions"><button type="button" class="kp-button kp-button--sm">Reset target</button></div>
</div>
<div class="kp-formgrid__row" data-kp-changed>
<span class="kp-formgrid__label" id="doc-fg-par">Parallel uploads</span>
<div class="kp-formgrid__control"><div class="kp-quantity" data-kp-quantity data-kp-quantity-min="1" data-kp-quantity-max="16" data-kp-quantity-unit="files" data-kp-quantity-unit-one="file" data-kp-quantity-label="Parallel uploads"><input class="kp-quantity__input" value="4" /></div></div>
<p class="kp-formgrid__value">1 to 16; more is faster on fibre</p>
<div class="kp-formgrid__actions"></div>
</div>
<div class="kp-formgrid__row kp-formgrid__row--buttons">
<span class="kp-formgrid__label"></span>
<div class="kp-formgrid__control"><div class="kp-formgrid__buttons"><button type="button" class="kp-button">Pause the schedule</button></div></div>
<p class="kp-formgrid__value"></p>
<div class="kp-formgrid__actions"></div>
</div>
</section>
</div>
`,
                script: `
import { attachQuantities } from '@kp-soft/themes/js/quantity';

attachQuantities(document.querySelector('.kp-formgrid'));
`,
            },
            {
                title: 'An error line that keeps its room, and typed text at the start edge',
                why: 'In a form grid a field’s error line keeps its room while it says nothing (invisible and out of the accessibility tree), so the message appearing moves nothing under it and a press lands where it was aimed. `data-kp-formgrid-errors="flow"` gives the old behaviour back: the line takes room only while it has words. Typed text and a placeholder start at the field’s start edge; a select keeps its centred look, and `data-kp-formgrid-align="center"` on the grid centres the typed text again.',
                markup: `
<div class="kp-row kp-gap-sm">
<button type="button" class="kp-button kp-button--sm" id="doc-fg-check" aria-controls="doc-fg-errors">Save without a name</button>
<button type="button" class="kp-button kp-button--sm" id="doc-fg-flow" aria-pressed="false" aria-controls="doc-fg-errors">Let the error line flow</button>
</div>
<div class="kp-formgrid" id="doc-fg-errors" aria-label="A new medicine">
<div class="kp-formgrid__row">
<label class="kp-formgrid__label" for="doc-fg-name">Name</label>
<div class="kp-formgrid__control">
<input class="kp-field__input" id="doc-fg-name" placeholder="Ibuprofen 400 mg" aria-describedby="doc-fg-name-error" required />
<p class="kp-field__error" id="doc-fg-name-error" hidden>Give the medicine a name.</p>
</div>
<p class="kp-formgrid__value">as on the box</p>
<div class="kp-formgrid__actions"></div>
</div>
<div class="kp-formgrid__row">
<label class="kp-formgrid__label" for="doc-fg-form">Form</label>
<div class="kp-formgrid__control"><select class="kp-field__input" id="doc-fg-form"><option>Tablet</option><option>Capsule</option><option>Syrup</option><option>Nasal spray</option></select></div>
<p class="kp-formgrid__value">how it is taken</p>
<div class="kp-formgrid__actions"></div>
</div>
<div class="kp-formgrid__row">
<label class="kp-formgrid__label" for="doc-fg-note">Note</label>
<div class="kp-formgrid__control"><input class="kp-field__input" id="doc-fg-note" value="Take with food" /></div>
<p class="kp-formgrid__value"></p>
<div class="kp-formgrid__actions"></div>
</div>
</div>
`,
                script: `
const grid = document.getElementById('doc-fg-errors');
const name = document.getElementById('doc-fg-name');
const error = document.getElementById('doc-fg-name-error');
document.getElementById('doc-fg-check').addEventListener('click', () => {
    const empty = name.value.trim() === '';
    error.hidden = !empty;
    name.setAttribute('aria-invalid', String(empty));
});
document.getElementById('doc-fg-flow').addEventListener('click', (event) => {
    const flow = event.currentTarget.getAttribute('aria-pressed') !== 'true';
    event.currentTarget.setAttribute('aria-pressed', String(flow));
    if (flow) grid.setAttribute('data-kp-formgrid-errors', 'flow');
    else grid.removeAttribute('data-kp-formgrid-errors');
});
`,
            },
        ],
        variants: [
            { name: '.kp-formgrid__row / __row--buttons', what: 'One row of the four tracks; the buttons row holds a group of buttons under what they act on, on the control edge.' },
            { name: '.kp-formgrid__label / __control / __value / __actions', what: 'The four cells: the label (a real `label` or a `span` named by the control), the control, the words about its value, and its buttons. A short control takes the short width; a field fills its track.' },
            { name: '.kp-formgrid__buttons / __group / __heading / __note', what: 'A group of buttons, a labelled section of rows, its heading and a quiet note. `__fill` and `__short` set a control that fills its track or takes the short width.' },
            { name: 'subgrids', what: '`.kp-formrows`, `.kp-kv`, `fieldset` and `form` inside the grid become subgrids of its tracks; a `form.kp-form` placed directly in the grid takes the grid’s gap in every theme. A `data-kp-subgrid` list (attention, problems) shares the tracks too.' },
            { name: 'rows with a JSON field', what: 'In a row holding a `.kp-jsonfield` the actions cell is one tool row high (the button is centred on the tools) and the value text is centred on it too.' },
            { name: 'data-kp-formgrid-label', what: '`fit` (default: the label track is as wide as the longest label) or `wide`.' },
            { name: 'data-kp-formgrid-align', what: '`baseline` (default) or `center`: where the cells of a row stand. Typed text and a placeholder start at the field’s start edge either way, a select stays centred; `center` also centres the typed text, the look before.' },
            { name: 'data-kp-formgrid-errors', what: 'Unset (default): a field’s hidden error line keeps its room, so showing it moves nothing. `flow`: the line takes room only while it has words.' },
            { name: 'data-kp-formgrid-stack', what: '`auto` (fold under 36rem of the grid), `always` or `never`.' },
            { name: 'data-kp-formgrid-lines', what: '`none` (default) or `lines`: a hairline between rows.' },
            { name: 'data-kp-formgrid-span', what: 'On a cell: `control-value`, `wide` or `all`, the tracks it covers.' },
            { name: 'other components in a row', what: 'The refresh bar inherits the grid’s column gap and its label takes the label track; the combobox’s status line moves into the value track; an anchor mark sits at the end of the label cell; the theme picker takes its baseline from its name.' },
        ],
        accessibility: [
            'Built in — the grid is layout only: labels stay real labels, order in the markup is reading order, and a folded row keeps it.',
            'Yours — name the grid (`aria-label`) when it is a landmark of the page, and tie hints and errors to the control with aria-describedby.',
        ],
    };
