// Page descriptor for the "field" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const fieldDescriptor = {
        id: 'field',
        title: 'Form field',
        group: 'Forms',
        classes: ['kp-field', 'kp-fieldset'],
        exports: ['Field'],
        intro: 'A label, a control, optional help text and an error, with the wiring between them: the label points at the control, the help and the error are announced with it, and an invalid field says what is wrong in words rather than by turning red.',
        whenToUse:
            'For a single control that stands on its own — a search box in a toolbar, one filter in a sidebar. Inside a form that validates, reach for the form field instead: it is the same shape connected to the form’s own state, and using this one there means writing the error handling twice.',
        examples: [
            {
                title: 'A field with help, and the same field invalid',
                why: 'The error is text and it names the problem. A red border is one carrier and a silent one; the message is read out because the control points at it.',
                markup: `
<div class="kp-field">
<label class="kp-field__label" for="doc-field-mail">Email</label>
<input class="kp-field__input" id="doc-field-mail" type="email" placeholder="name@example.com" aria-describedby="doc-field-mail-help" />
<span class="kp-field__help" id="doc-field-mail-help">We never pass this on.</span>
</div>
<div class="kp-field kp-field--invalid">
<label class="kp-field__label" for="doc-field-bad">Email</label>
<input class="kp-field__input" id="doc-field-bad" type="email" value="not-an-address" aria-invalid="true" aria-describedby="doc-field-bad-error" />
<span class="kp-field__error" id="doc-field-bad-error">Enter a valid address.</span>
</div>
`,
            },
            {
                title: 'The other four controls',
                why: 'A field is not always a text box. Select, textarea, checkbox and a radio group carry the same label, help and error wiring, so a real form does not grow a hand-written half beside the component.',
                markup: `
<div class="kp-field">
<label class="kp-field__label" for="doc-field-country">Country</label>
<select class="kp-field__input" id="doc-field-country"><option>Pick…</option><option>Belgium</option><option>The Netherlands</option></select>
</div>
<div class="kp-field">
<label class="kp-field__label" for="doc-field-notes">Notes</label>
<textarea class="kp-field__input kp-field__input--multiline" id="doc-field-notes"></textarea>
</div>
<div class="kp-field kp-field--check">
<input class="kp-field__check" id="doc-field-post" type="checkbox" checked />
<label class="kp-field__label" for="doc-field-post">Keep me posted</label>
</div>
<fieldset class="kp-field kp-fieldset" role="radiogroup">
<legend class="kp-field__label">How do we reach you?</legend>
<div class="kp-field__option"><input class="kp-field__check" id="doc-field-r1" name="doc-field-reach" type="radio" /><label for="doc-field-r1">Email</label></div>
<div class="kp-field__option"><input class="kp-field__check" id="doc-field-r2" name="doc-field-reach" type="radio" /><label for="doc-field-r2">Telephone</label></div>
</fieldset>
`,
            },
            {
                title: 'Choices as tiles',
                why: 'The same fieldset, legend and `.kp-field__option` labels as any group, with `data-kp-layout="tiles"`: each option is a tile the whole of which is the target, the native box at the start, a `.kp-field__option-title` and a `.kp-field__option-hint` under it. A checkbox group picks several and a radio group one. Tiles share one height per row, wrap to one column on a phone, and a disabled tile is dashed with its hint saying why. A group that is not valid takes `aria-invalid="true"`, which outlines the fieldset, and the error line under it is tied to it with `aria-describedby`.',
                markup: `
<div class="kp-stack">
<fieldset class="kp-fieldset" data-kp-layout="tiles">
<legend class="kp-field__label">What should the reply do?</legend>
<label class="kp-field__option"><input class="kp-field__check" type="checkbox" name="doc-tiles-act" value="thank" checked /><span class="kp-field__option-title">Thank them for the interview</span><span class="kp-field__option-hint">One sentence about Tuesday’s talk.</span></label>
<label class="kp-field__option"><input class="kp-field__check" type="checkbox" name="doc-tiles-act" value="confirm" /><span class="kp-field__option-title">Confirm the second round</span><span class="kp-field__option-hint">Accept Thursday at 14:00 and ask who joins.</span></label>
<label class="kp-field__option"><input class="kp-field__check" type="checkbox" name="doc-tiles-act" value="portfolio" disabled /><span class="kp-field__option-title">Send the portfolio again</span><span class="kp-field__option-hint">Not possible: this dossier has no portfolio file.</span></label>
</fieldset>
<div class="kp-stack">
<fieldset class="kp-fieldset" data-kp-layout="tiles" aria-invalid="true" aria-describedby="doc-tiles-error">
<legend class="kp-field__label">Which CV goes with it?</legend>
<label class="kp-field__option"><input class="kp-field__check" type="radio" name="doc-tiles-cv" value="master" /><span class="kp-field__option-title">Master CV</span><span class="kp-field__option-hint">Two pages, 12/10/2026.</span></label>
<label class="kp-field__option"><input class="kp-field__check" type="radio" name="doc-tiles-cv" value="platform" /><span class="kp-field__option-title">Platform variant</span><span class="kp-field__option-hint">Leads with Kubernetes and Rust.</span></label>
</fieldset>
<p class="kp-field__error" id="doc-tiles-error">Choose a CV: the reply needs one attached.</p>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-field', what: 'The stacked default: label above control, help and error under it.' },
            { name: '.kp-field--check', what: 'Box first, label beside it — the order it is read in and the order it is clicked in. Help and error move under both.' },
            { name: '.kp-field--invalid', what: 'Colours the control’s boundary, or outlines a checkbox, which has no boundary of its own to colour.' },
            { name: '.kp-field__input--multiline', what: 'A textarea: taller, and resizable vertically only, because one dragged wider breaks the column it sits in.' },
            { name: '.kp-fieldset', what: 'A group of radios or checkboxes with a legend, so the question is read once before the answers rather than once per answer.' },
            { name: 'inline layout', what: 'A radio group laid out in a row instead of a column, with the legend on its own line above them.' },
            { name: 'tiles layout', what: '`data-kp-layout="tiles"` on a `.kp-fieldset`: every option a tile with a title and a hint. A tile that is checked takes the primary edge, an inner ring and a faint wash; hover lights the edge, focus puts the ring round the whole tile, disabled is dashed on the muted ground, and an invalid group outlines the fieldset.' },
            { name: '.kp-field__option-title, __option-hint', what: 'A tile’s name in the heavier weight, and one muted line under it that says more, or why the tile is disabled.' },
            { name: '.kp-field__required', what: 'The required marking: a star and the word, because a star alone is read as “star”.' },
            { name: 'width', what: '`.kp-field` fills its place by default; its width knob is `none` (it was 28rem). Set the knob where a page wants a measure.' },
        ],
        accessibility: [
            'Built in — the label is a real label, the help and the error are pointed at by the control, and the invalid state is announced rather than only painted.',
            'Built in — the checkbox and the radio are drawn larger than the browser’s default, and their tick takes a colour the theme can correct; the label is clickable too, which is what actually makes the target big enough for WCAG 2.5.8.',
            'Built in — a select’s open list is drawn by the package in the combobox’s look in every browser, Firefox included, while the native select stays the control a screen reader reads and a form submits. Write data-kp-select="native" (React: drawn={false}) on a select that should keep the browser’s own list; a multiple select always does.',
            'Yours — give every control an id and point the label at it, or wrap the control in the label.',
            'Yours — write the error as a sentence that says what to do. “Invalid” tells the reader only that you noticed.',
            'Yours — keep the help text short: it is read out before the reader has typed anything.',
        ],
    };
