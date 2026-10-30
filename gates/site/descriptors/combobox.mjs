// Page descriptor for the "combobox" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const comboboxDescriptor = {
        id: 'combobox',
        title: 'Combobox and tag input',
        group: 'Forms',
        classes: ['kp-combobox', 'kp-tag', 'kp-tag-list'],
        exports: ['Combobox'],
        aliases: ['listbox', 'option', 'tags', 'empty-row', 'max-tags', 'backspace-removes', 'close-on-blur', 'disabled', 'duplicates', 'open-on-focus', 'stay-open', 'remove-glyph', 'loop', 'match', 'debounce', 'creatable', 'select', 'select-list', 'select-attached', 'chosen', 'overlay-side'],
        intro: 'A text input with a filtered list under it. The arrow keys move a highlight while the cursor stays in the input, Enter takes the highlighted option, and the count of what is left is announced. With tags on, a choice appends a removable tag and clears the field instead of replacing the value.',
        whenToUse:
            'When there are more options than a select can carry comfortably and the reader knows roughly what they are looking for. Not for a handful of fixed choices — a select is smaller, needs no script and works before the page has finished loading. Not for a free-text field with suggestions you may ignore either: this one is about choosing from a list.',
        examples: [
            {
                title: 'A combobox over a list the server wrote',
                why: 'The options are markup, not a JavaScript array: a page rendered by a server shows the list before any script runs. The status line is not decoration — it is how anyone who cannot see the list shrink is told that it did.',
                markup: `
<div class="kp-combobox" data-kp-combobox>
<label class="kp-field__label" for="doc-combobox-fruit">Fruit</label>
<input class="kp-combobox__input" id="doc-combobox-fruit" type="text" role="combobox" autocomplete="off" aria-expanded="false" aria-controls="doc-combobox-fruit-list" placeholder="Pick or type…" />
<ul class="kp-combobox__list" id="doc-combobox-fruit-list" role="listbox" hidden>
<li class="kp-combobox__option" role="option" data-kp-option data-value="apple">Apple</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="banana">Banana</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="lemon">Lemon</li>
</ul>
<p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p>
</div>
`,
            },
            {
                title: 'The same markup as a tag input',
                why: 'One flag on the wrapper turns choosing into appending. Tags the server already rendered into the list are read at attach, so a reloaded page keeps them.',
                markup: `
<div class="kp-combobox" data-kp-combobox data-kp-tags>
<label class="kp-field__label" for="doc-combobox-labels">Labels</label>
<ul class="kp-tag-list" data-kp-tag-list>
<li class="kp-tag">urgent<button type="button" class="kp-tag__remove" data-kp-tag-remove aria-label="Remove urgent">×</button></li>
</ul>
<input class="kp-combobox__input" id="doc-combobox-labels" type="text" role="combobox" autocomplete="off" aria-expanded="false" aria-controls="doc-combobox-labels-list" />
<ul class="kp-combobox__list" id="doc-combobox-labels-list" role="listbox" hidden>
<li class="kp-combobox__option" role="option" data-kp-option data-value="urgent">Urgent</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="bug">Bug</li>
<li class="kp-combobox__option" role="option" data-kp-option data-value="idea">Idea</li>
</ul>
<p class="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite"></p>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-combobox', what: 'The wrapper. It positions the list, so it is the element the list is measured against.' },
            { name: '.kp-combobox__list', what: 'The floating list: its own surface, a boundary that survives whatever is behind it, and a maximum height it scrolls inside.' },
            { name: 'is-active', what: 'The keyboard’s position in the list. It is mirrored on hover so the mouse and the keyboard agree about what Enter would take.' },
            { name: 'hidden option', what: 'An option filtered out is hidden rather than removed, so the list the server wrote is still the list after typing.' },
            { name: '.kp-combobox__clear', what: 'The clear control inside the input, at the trailing edge.' },
            { name: '.kp-tag-list / .kp-tag', what: 'With tags on: the chosen values as removable chips above the input.' },
            { name: '.kp-tag__remove', what: 'The remove control on a tag. Its hover takes the destructive colour, and the tap target is widened by the tag rather than by growing the glyph.' },
            { name: '.kp-combobox__status', what: 'The live region that says how many options are left after each keystroke.' },
            { name: 'pastel', what: 'In pastel the list has its pass on its ::backdrop and lands on it, and closes as that backwards.' },
            { name: 'in a form grid', what: 'In a `.kp-formgrid` row the status line moves into the row’s value track (the row stays one line high). It stays under the input outside a form-grid row, in a row with value text of its own, and for `data-kp-usual`.' },
        ],
        accessibility: [
            'Built in — virtual focus: the highlight travels the list while the cursor stays in the input, so typing keeps working and the current option is announced.',
            'Built in — the number of matches is announced after typing, which is the single most-skipped part of every hand-written combobox.',
            'Built in — Escape closes the list, Enter takes the highlight, and the input keeps its own expanded state in step.',
            'Yours — write the options with a value and a label. The module filters and announces what is there; it fetches nothing.',
            'Yours — give the input a label and the list a name, and give every tag’s remove button a name that includes the tag.',
            'Yours — keep the status paragraph in the markup. Without it the list is silent to anyone who cannot see it.',
        ],
    };
