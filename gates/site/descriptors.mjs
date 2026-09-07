// What a documentation page says, and where each part comes from [AR19].
//
// One descriptor per documented unit. The shape is pinned here because
// roughly 45 pages depend on it and changing it later touches all of
// them.
//
// A descriptor holds only what no machine can extract:
//
//   id            the page's file name and its anchor in the navigation
//   title         what the unit is called
//   group         which navigation section it sits under
//   intro         one paragraph: what it is
//   whenToUse     one paragraph: when to reach for it, and when not
//   classes       the `kp-` class families this page documents; the
//                 coverage gate reads them, so every family in
//                 css/components.css belongs to exactly one page
//   exports       the React exports this page documents, likewise
//   aliases       names this page also answers to, for events and
//                 attributes whose name does not follow from a class:
//                 `kp-color-change` is the colour picker's, whose family
//                 is `kp-colorpicker`. gates/site/selection.mjs states
//                 the rule; the coverage gate holds every attribute to it
//   examples      each { title, why, markup } -- `markup` is
//                 framework-free HTML, rendered live AND printed as the
//                 snippet from the same string, so the two cannot
//                 diverge (AR19)
//   variants      each { name, what } -- every variant and state
//   accessibility bullets: what the package does, and what the consumer
//                 still has to do
//
// Everything else on the page is extracted from the sources: the props
// table from the `@typedef` blocks, the events from the `*_EVENT`
// constants, the knobs from `css/components.css`, the attributes from
// `js/`. A descriptor MAY NOT restate any of those -- gates/check-site.mjs
// refuses it, so a rename cannot leave a table behind (AR21).

/**
 * @typedef {{ title: string, why: string, markup: string, react?: string }} Example
 * @typedef {{ name: string, what: string }} Variant
 * @typedef {{
 *   id: string,
 *   title: string,
 *   group: string,
 *   intro: string,
 *   whenToUse: string,
 *   classes: string[],
 *   exports: string[],
 *   aliases?: string[],
 *   examples: Example[],
 *   variants: Variant[],
 *   accessibility: string[],
 * }} Descriptor
 */

/** The navigation sections, in order. */
export const GROUPS = ['Getting started', 'Theming', 'Layout', 'Forms', 'Data', 'Feedback', 'Navigation', 'Structure'];

/** @type {Descriptor[]} */
export const DESCRIPTORS = [
    {
        id: 'theme-switcher',
        title: 'Theme switcher',
        group: 'Theming',
        classes: ['kp-theme-menu', 'kp-theme-group', 'kp-theme-option', 'kp-swatch'],
        exports: ['ThemeSwitcher'],
        aliases: ['theme'],
        intro: 'The control that changes the page’s theme. Two shapes share one behaviour: a flat row of buttons, and an icon button whose dropdown groups the light themes above the dark ones. Both write the chosen name onto the document and remember it.',
        whenToUse:
            'Put one in the page’s header when the reader picks their own theme. Do not reach for it to preview a theme in one corner of a page — every element can wear a theme by carrying the theme attribute, which is what the swatch beside each option does — and do not put it in a settings form behind a save button: the choice applies the moment it is made, so a form around it promises something it does not do.',
        examples: [
            {
                title: 'A flat picker',
                why: 'The markup a server writes; one module attaches the behaviour to the attribute, not to the layout. The paragraph underneath stays empty unless the browser refuses to store the choice.',
                markup: `
<div data-kp-theme-picker>
<button type="button" data-kp-theme="formal"><span class="kp-swatch" data-theme="formal"></span> Formal</button>
<button type="button" data-kp-theme="dark"><span class="kp-swatch" data-theme="dark"></span> Dark</button>
<button type="button" data-kp-theme="terminal"><span class="kp-swatch" data-theme="terminal"></span> Terminal</button>
</div>
<p data-kp-theme-status hidden></p>
`,
            },
            {
                title: 'The same picker in a menu, grouped',
                why: 'An icon button with a popover: Escape and light dismiss are the browser’s. Each group carries its label on its own list, so a screen reader hears “Light, list, two items” rather than reading the heading twice.',
                markup: `
<span class="kp-theme-menu">
<button type="button" class="kp-icon-button" popovertarget="doc-theme-menu" aria-label="Choose a theme" style="anchor-name: --doc-theme-menu">Aa</button>
<div popover="auto" id="doc-theme-menu" class="kp-popover" style="position-anchor: --doc-theme-menu">
<ul class="kp-menu" data-kp-theme-picker aria-label="Choose a theme">
<li role="presentation" class="kp-theme-group" data-kp-theme-group="light"><span class="kp-theme-group__label" aria-hidden="true">Light</span>
<ul class="kp-theme-group__list" aria-label="Light">
<li><button type="button" data-kp-theme="formal"><span class="kp-swatch" data-theme="formal"></span>Formal</button></li>
<li><button type="button" data-kp-theme="sepia"><span class="kp-swatch" data-theme="sepia"></span>Sepia</button></li>
</ul></li>
<li role="presentation" class="kp-theme-group" data-kp-theme-group="dark"><span class="kp-theme-group__label" aria-hidden="true">Dark</span>
<ul class="kp-theme-group__list" aria-label="Dark">
<li><button type="button" data-kp-theme="dark"><span class="kp-swatch" data-theme="dark"></span>Dark</button></li>
<li><button type="button" data-kp-theme="cyberpunk"><span class="kp-swatch" data-theme="cyberpunk"></span>Cyberpunk</button></li>
</ul></li>
</ul>
</div>
</span>
`,
            },
        ],
        variants: [
            { name: '.kp-swatch', what: 'The two-colour disc beside an option. It wears the theme it names, so it shows that theme’s live colours rather than a copy.' },
            { name: '.kp-theme-group', what: 'One labelled group of options — light above dark. Flat, the groups become two rows; in a menu they become two sections with a rule between them.' },
            { name: '.kp-theme-menu', what: 'The wrapper of the icon button and its list. The React switcher positions its own list under the button; the framework-free menu is a popover.' },
            { name: '.kp-theme-option__label / __check', what: 'The parts of one option in the React channel: the name, and the check that marks the current theme.' },
            { name: 'selected', what: 'The current theme is marked twice — a border and a check mark flat, weight and a check in a menu — because colour alone is not a carrier.' },
            { name: 'storage refused', what: 'When the browser will not store the choice the status line says so out loud instead of leaving a picker that looks broken on the next load.' },
        ],
        accessibility: [
            'Built in — each option is a real button with a pressed state, so a screen reader says which theme is current without seeing the border.',
            'Built in — the check mark and the border are two carriers beside the colour, which is what DI4 asks for.',
            'Built in — in a menu the browser gives Escape, light dismiss and focus return, because the list is a popover rather than a hand-written dropdown.',
            'Built in — every word the picker itself speaks comes from the dictionary and can be replaced.',
            'Yours — give the menu button an accessible name; an icon on its own says nothing.',
            'Yours — write the options your server knows about. The module attaches behaviour to markup that is already there; it renders nothing on its own.',
        ],
    },
    {
        id: 'button',
        title: 'Button',
        group: 'Forms',
        classes: ['kp-button'],
        exports: ['Button'],
        aliases: ['confirm', 'contract', 'destructive', 'armed', 'undo', 'action', 'key'],
        intro: 'One button in four looks, and the two contracts a button can carry: an action that cannot be taken back must offer a confirmation or an undo, and a row action can act at once and offer the way back beside itself while the window is open.',
        whenToUse:
            'For anything that acts on the page or sends something. Not for navigation — a control that goes to another URL is a link, and a link painted as a button loses the middle click, the context menu and what a screen reader says about it. Not for a bar of icons either: that is the icon button, which is the same paint at a square size.',
        examples: [
            {
                title: 'The four looks and a disabled one',
                why: 'Hover, active and disabled are derived from the base colour by the theme generator rather than authored per theme, so a new theme gets all three by declaring one.',
                markup: `
<button type="button" class="kp-button">Default</button>
<button type="button" class="kp-button kp-button--primary">Primary</button>
<button type="button" class="kp-button kp-button--destructive">Destructive</button>
<button type="button" class="kp-button kp-button--ghost">Ghost</button>
<button type="button" class="kp-button kp-button--primary" disabled>Disabled</button>
`,
            },
            {
                title: 'A destructive button that confirms',
                why: 'The first click arms the button and changes its label; a second click within the window acts, and moving away disarms it. A destructive button carrying neither a confirmation nor an undo is disarmed by the contract enforcer and reported.',
                markup: `
<button type="button" class="kp-button kp-button--destructive" data-kp-destructive data-kp-confirm="Delete this application?">Delete</button>
`,
            },
            {
                title: 'A row action that acts at once and offers the way back',
                why: 'The optimistic half: the row goes away immediately, an undo appears beside it, and the action commits only when the window closes. The consumer hears both outcomes as events.',
                markup: `
<ul class="kp-stack">
<li data-kp-undo-target>Application at Example Inc
<button type="button" class="kp-button kp-button--ghost" data-kp-undo-action>Delete</button>
</li>
</ul>
`,
            },
        ],
        variants: [
            { name: '.kp-button', what: 'The default: the secondary surface with a boundary, for the actions that are neither the main one nor dangerous.' },
            { name: '.kp-button--primary', what: 'One per view. The action the reader came to take.' },
            { name: '.kp-button--destructive', what: 'Deletes and disconnections. It has to carry a confirmation or an undo as well.' },
            { name: '.kp-button--ghost', what: 'No ground and no boundary until it is hovered, for actions that sit inside dense rows.' },
            { name: '.kp-button__undo', what: 'The undo the pattern puts beside a committed action, inline rather than in a toast that may already be gone.' },
            { name: ':hover / :active', what: 'Both are derived colours; on a theme that lifts its controls the button also rises, and by nothing at all where the theme answers zero.' },
            { name: ':disabled', what: 'A dimmed ground and a refusing cursor. DI8 records the decision that a disabled control may fall below the contrast floor.' },
            { name: 'armed', what: 'A confirming button between its first and second click. The module writes the state, the label changes, and a timeout disarms it.' },
        ],
        accessibility: [
            'Built in — a destructive action with no way back is disarmed rather than left to fire, which is SC 3.3.4 turned into something a review cannot forget.',
            'Built in — the confirmation label, the undo label and the announcement all come from the dictionary, so they can be replaced in one place.',
            'Built in — the disabled look is not carried by colour alone: the cursor changes and the button refuses the click.',
            'Yours — use a real button element. The class paints; it does not make a div focusable or operable by Enter.',
            'Yours — a button with only an icon in it needs a name of its own.',
            'Yours — say what happens in the label. “Delete application” survives being read out of context; “OK” does not.',
        ],
    },
    {
        id: 'icon-button',
        title: 'Icon button',
        group: 'Forms',
        classes: ['kp-icon-button'],
        exports: [],
        intro: 'A square, quiet button for a single glyph: the theme menu’s trigger, the close on a dialog, an alert or a toast. It has no ground until it is hovered, and the wash it takes then has no hue of its own, so it stays quiet in every theme.',
        whenToUse:
            'Where the meaning is obvious from the glyph and the row has no room for words — a close, a menu, a sort. Not for the main action of a view: an icon alone is a guess for anyone who does not already know what it means. Not as a decoration either; if there is nothing to press, it is a span.',
        examples: [
            {
                title: 'A close button and a menu trigger',
                why: 'The size is fixed so a row of them lines up, and the glyph inside is capped rather than the button growing around it.',
                markup: `
<button type="button" class="kp-icon-button" aria-label="Close">×</button>
<button type="button" class="kp-icon-button" aria-label="More actions">⋯</button>
`,
            },
        ],
        variants: [
            { name: '.kp-icon-button', what: 'The only look. It has no variants on purpose: a destructive or primary icon button is colour as the only carrier.' },
            { name: ':hover', what: 'A wash of the page’s own ink, so it does not take the accent colour that made a highlighted row turn lavender in one theme and emerald in another.' },
            { name: 'with an svg child', what: 'An inline glyph is sized by the button rather than by its own attributes, so icons from different sets end up the same size.' },
        ],
        accessibility: [
            'Built in — the target is larger than the glyph, which is what keeps it above the 24px minimum of WCAG 2.5.8.',
            'Yours — every one of these needs an accessible name; the glyph is not one.',
            'Yours — mark a decorative glyph as hidden so it is not read out beside the name you gave the button.',
        ],
    },
    {
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
        ],
        variants: [
            { name: '.kp-field', what: 'The stacked default: label above control, help and error under it.' },
            { name: '.kp-field--check', what: 'Box first, label beside it — the order it is read in and the order it is clicked in. Help and error move under both.' },
            { name: '.kp-field--invalid', what: 'Colours the control’s boundary, or outlines a checkbox, which has no boundary of its own to colour.' },
            { name: '.kp-field__input--multiline', what: 'A textarea: taller, and resizable vertically only, because one dragged wider breaks the column it sits in.' },
            { name: '.kp-fieldset', what: 'A group of radios or checkboxes with a legend, so the question is read once before the answers rather than once per answer.' },
            { name: 'inline layout', what: 'A radio group laid out in a row instead of a column, with the legend on its own line above them.' },
            { name: '.kp-field__required', what: 'The required marking: a star and the word, because a star alone is read as “star”.' },
        ],
        accessibility: [
            'Built in — the label is a real label, the help and the error are pointed at by the control, and the invalid state is announced rather than only painted.',
            'Built in — the checkbox and the radio are drawn larger than the browser’s default, and their tick takes a colour the theme can correct; the label is clickable too, which is what actually makes the target big enough for WCAG 2.5.8.',
            'Built in — where the browser lets a page take over the select’s own list, it wears the theme instead of the platform’s highlight colour.',
            'Yours — give every control an id and point the label at it, or wrap the control in the label.',
            'Yours — write the error as a sentence that says what to do. “Invalid” tells the reader only that you noticed.',
            'Yours — keep the help text short: it is read out before the reader has typed anything.',
        ],
    },
    {
        id: 'form',
        title: 'Form',
        group: 'Forms',
        classes: ['kp-form'],
        exports: ['Form', 'FormField'],
        aliases: ['field', 'submit', 'busy', 'focus-summary', 'validate-on', 'revalidate-on'],
        intro: 'A form that makes the browser’s own validation reachable: the messages the browser already found are put where a screen reader will read them, gathered into a summary at the top, and the first one takes focus when a submit fails.',
        whenToUse:
            'For anything the reader fills in and sends. Not for a single filter or search box — that is one field and needs no summary. Not as a validation engine either: the rules stay the browser’s, so a field validates by declaring what it is rather than by a rule written twice, once here and once on the server.',
        examples: [
            {
                title: 'A form that validates on submit',
                why: 'The summary is empty and hidden until a submit fails; then it names each failing field as a link, takes focus, and each field’s own message appears under it. Native validation stays on, its popups do not.',
                markup: `
<form class="kp-form" data-kp-form>
<div class="kp-form__summary" data-kp-form-summary tabindex="-1" hidden></div>
<div class="kp-field">
<label class="kp-field__label" for="doc-form-name">Name <span class="kp-field__required">required</span></label>
<input class="kp-field__input" id="doc-form-name" name="name" required aria-describedby="doc-form-name-help" />
<span class="kp-field__help" id="doc-form-name-help">As it appears on your pass.</span>
<span class="kp-field__error" data-kp-field-error hidden></span>
</div>
<div class="kp-field">
<label class="kp-field__label" for="doc-form-mail">Email <span class="kp-field__required">required</span></label>
<input class="kp-field__input" id="doc-form-mail" name="email" type="email" required />
<span class="kp-field__error" data-kp-field-error hidden></span>
</div>
<button type="submit" class="kp-button kp-button--primary" data-kp-submit>Save</button>
</form>
`,
            },
        ],
        variants: [
            { name: '.kp-form', what: 'The column: fields stacked with one distance between them.' },
            { name: '.kp-form__summary', what: 'The error summary. It is a focus target rather than a banner, because a message that appears above the fold is invisible to someone whose focus is at the bottom.' },
            { name: '.kp-form__summary-title', what: 'The line that says what the summary is, in words, above the list of failing fields.' },
            { name: 'busy', what: 'While a save is in flight the form marks itself, so a consumer can disable what it wants to; the outcome is reported back through the callback the event hands over.' },
            { name: 'server errors', what: 'Errors a server found are handed in and shown in the same places as the browser’s own, rather than in a second mechanism beside them.' },
        ],
        accessibility: [
            'Built in — the browser’s own popups are turned off and its validation kept: the message is put in the page instead, where it can be styled, read and left standing.',
            'Built in — a failed submit moves focus to the summary, and each entry in it moves focus to the field it names.',
            'Built in — every field that fails is marked invalid and pointed at its message, so it is announced rather than only coloured.',
            'Yours — give each control a name and the constraint that describes it; that is what the browser validates.',
            'Yours — repeat the validation on the server. This is what the reader sees, not what protects the data.',
            'Yours — keep the submit a real submit button, or the form cannot be sent with the keyboard.',
        ],
    },
    {
        id: 'combobox',
        title: 'Combobox and tag input',
        group: 'Forms',
        classes: ['kp-combobox', 'kp-tag', 'kp-tag-list'],
        exports: ['Combobox'],
        aliases: ['listbox', 'option', 'tags', 'max-tags', 'backspace-removes', 'close-on-blur', 'disabled', 'duplicates', 'open-on-focus', 'stay-open', 'remove-glyph', 'loop', 'match', 'debounce'],
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
        ],
        accessibility: [
            'Built in — virtual focus: the highlight travels the list while the cursor stays in the input, so typing keeps working and the current option is announced.',
            'Built in — the number of matches is announced after typing, which is the single most-skipped part of every hand-written combobox.',
            'Built in — Escape closes the list, Enter takes the highlight, and the input keeps its own expanded state in step.',
            'Yours — write the options with a value and a label. The module filters and announces what is there; it fetches nothing.',
            'Yours — give the input a label and the list a name, and give every tag’s remove button a name that includes the tag.',
            'Yours — keep the status paragraph in the markup. Without it the list is silent to anyone who cannot see it.',
        ],
    },
    {
        id: 'datepicker',
        title: 'Date picker',
        group: 'Forms',
        classes: ['kp-datepicker'],
        exports: ['DatePicker'],
        aliases: ['date', 'day', 'min', 'max', 'week-starts-on', 'close-on-select', 'next-glyph', 'previous-glyph', 'disabled', 'disabled-days', 'locale'],
        intro: 'A text input that takes a typed date, with a calendar beside it for the reader who would rather look. The value is kept as an ISO date whatever the page’s locale prints, so a consumer never parses a localised string.',
        whenToUse:
            'For a date a person knows or can find in a month — a start date, a deadline. Not for a birth date far in the past, where three selects or a typed field beat paging a calendar back forty years; and not for a date the browser can own entirely, where the native date input is smaller and already localised.',
        examples: [
            {
                title: 'Typed, with the calendar as an aid',
                why: 'Typing always works and the grid never has to open, which is what keeps the control usable for someone who would otherwise be walked through thirty-one buttons. The panel is built when it is opened rather than written by the server.',
                markup: `
<div class="kp-datepicker" data-kp-datepicker>
<div class="kp-field">
<label class="kp-field__label" for="doc-date-from">From</label>
<input class="kp-field__input" id="doc-date-from" type="text" inputmode="numeric" placeholder="dd-mm-yyyy" data-kp-date-input />
</div>
<button type="button" class="kp-button kp-button--ghost" data-kp-date-open aria-label="Open the calendar">Calendar</button>
<div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
</div>
`,
            },
            {
                title: 'A range with a floor and weekends closed',
                why: 'The bounds and the closed days are declared on the markup, so a server that already knows them does not have to repeat them in script.',
                markup: `
<div class="kp-datepicker" data-kp-datepicker data-kp-min="2026-01-01" data-kp-max="2026-12-31" data-kp-disabled-days="0,6">
<div class="kp-field">
<label class="kp-field__label" for="doc-date-visit">Visit</label>
<input class="kp-field__input" id="doc-date-visit" type="text" inputmode="numeric" data-kp-date-input />
</div>
<button type="button" class="kp-button kp-button--ghost" data-kp-date-open aria-label="Open the calendar">Calendar</button>
<div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-datepicker__panel', what: 'The calendar, floating under the input on its own surface. It is rendered when it opens because a month grid is derived from a date.' },
            { name: '.kp-datepicker__head / __title', what: 'The month, its name, and the two controls that page it.' },
            { name: '.kp-datepicker__grid / __weekday', what: 'Seven columns with the week starting where the locale says, unless the markup overrules it.' },
            { name: '.kp-datepicker__day', what: 'One day. Exactly one of them is in the tab order at a time; the arrows move between the rest.' },
            { name: 'selected day', what: 'Carries a boundary as well as a fill, so it is still the chosen day when the fill matches the hover.' },
            { name: 'disabled day', what: 'Outside the bounds or on a closed weekday: present, marked, and refusing the click.' },
        ],
        accessibility: [
            'Built in — the grid is a real grid: arrows by day, Page keys by month, Home and End to the ends of the week, and one tab stop for the whole month.',
            'Built in — typing is a complete route to a date, so nobody is forced through the calendar at all.',
            'Built in — the month and the chosen date are announced when they change, in the page’s own locale.',
            'Yours — label the input and name the button that opens the calendar.',
            'Yours — read the ISO value the module keeps rather than the text on screen, which is localised.',
            'Yours — say what format you expect near the field; a placeholder disappears the moment someone types.',
        ],
    },
    {
        id: 'colorpicker',
        title: 'Colour picker',
        group: 'Forms',
        classes: ['kp-colorpicker'],
        exports: ['ColorPicker'],
        aliases: ['color', 'swatch', 'against', 'channel', 'follow', 'contrast-ok'],
        intro: 'Three labelled sliders, a swatch, and the number that makes this one different: the WCAG contrast ratio of the chosen colour against the current theme’s own background, measured with the same function the contrast gate uses.',
        whenToUse:
            'Where somebody picks a colour that text or a boundary will later have to survive on — a status colour, a label, a theme of their own. Not as a general colour wheel: three sliders are exact and operable from the keyboard, but they are slower than a canvas for browsing. Not for choosing from a fixed set either; that is a row of swatch buttons.',
        examples: [
            {
                title: 'A picker measured against the page background',
                why: 'The verdict is a sentence in a live region, not a green tick: the colour is the second carrier, never the only one. Sliders rather than a canvas, because a canvas needs a pointer.',
                markup: `
<div class="kp-colorpicker" data-kp-colorpicker data-kp-against="--background">
<label class="kp-field__label" for="doc-color-h">Hue</label>
<input id="doc-color-h" type="range" data-kp-channel="h" min="0" max="360" value="220" />
<label class="kp-field__label" for="doc-color-s">Saturation</label>
<input id="doc-color-s" type="range" data-kp-channel="s" min="0" max="100" value="90" />
<label class="kp-field__label" for="doc-color-l">Lightness</label>
<input id="doc-color-l" type="range" data-kp-channel="l" min="0" max="100" value="56" />
<span class="kp-colorpicker__swatch" data-kp-swatch aria-hidden="true"></span>
<output class="kp-colorpicker__value" data-kp-colorpicker-value></output>
<p class="kp-colorpicker__contrast" data-kp-colorpicker-contrast role="status" aria-live="polite"></p>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-colorpicker__channel', what: 'One label and its slider. The wrapper contributes nothing to the box tree, so the three pairs line up as one grid.' },
            { name: '.kp-colorpicker__swatch', what: 'The chosen colour, with a boundary — a pale swatch on a pale card is otherwise an invisible square.' },
            { name: '.kp-colorpicker__value', what: 'The colour in numbers, in the mono face, so it can be read back and copied.' },
            { name: '.kp-colorpicker__contrast', what: 'The verdict. It takes the destructive colour while the ratio fails and the quiet one once it passes.' },
            { name: 'measured against another token', what: 'The comparison surface is declared on the markup: a card, a primary plate, or the page itself.' },
            { name: 'following the theme', what: 'The picker can re-measure when the page’s theme changes, so the same colour is judged again against the new background.' },
        ],
        accessibility: [
            'Built in — three range inputs are operable from the keyboard, announced with their values, and give exact numbers back; a canvas gradient does none of that.',
            'Built in — the verdict is words in a live region, so it reaches someone who cannot compare the two colours by eye.',
            'Built in — the swatch is marked decorative, because the value beside it is the thing that carries the information.',
            'Yours — label each of the three sliders. They are hue, saturation and lightness only if something says so.',
            'Yours — decide what the ratio has to clear. The picker measures; it does not refuse.',
        ],
    },
    {
        id: 'upload',
        title: 'File upload',
        group: 'Forms',
        classes: ['kp-upload'],
        exports: ['Upload'],
        aliases: ['drop', 'max-bytes', 'max-files', 'max-total', 'remove-glyph', 'locale', 'dragging'],
        intro: 'A drop zone that is a label over a real file input, a list of the chosen files, and a per-file state the consumer drives: progress, done, or an error with its reason. The sending stays yours.',
        whenToUse:
            'Wherever a person attaches files. Not as an upload client — the request, the retry and the endpoint are the application’s, and a component that owned them would have to know your auth. Not for a single hidden image swap either, where a plain file input with a label is the whole story.',
        examples: [
            {
                title: 'A drop zone with a size limit',
                why: 'The zone is a label pointing at a real file input: Tab reaches it, Enter opens the picker, and a screen reader announces a file field rather than a mysterious box. Dropping is added on top and is nobody’s only route in.',
                markup: `
<div class="kp-upload" data-kp-upload data-kp-max-bytes="5000000" data-kp-max-files="5">
<input type="file" multiple class="kp-sr-only" id="doc-upload-files" data-kp-upload-input />
<label class="kp-upload__zone" for="doc-upload-files" data-kp-upload-zone>Drop files here or choose them</label>
<ul class="kp-upload__list" data-kp-upload-list></ul>
</div>
`,
            },
            {
                title: 'What a row looks like while it is sending, and when it failed',
                why: 'The rows are normally written by the module as files arrive; printed here so the states can be seen at rest. The bar is one element filled by a gradient stop rather than a second element kept in step by hand.',
                markup: `
<ul class="kp-upload__list">
<li class="kp-upload__file" data-state="uploading">
<span>quarterly-report.pdf</span><span class="kp-upload__size">1.2 MB</span>
<span class="kp-upload__bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="40" aria-label="Uploading quarterly-report.pdf"></span>
</li>
<li class="kp-upload__file" data-state="error">
<span>holiday.mov</span><span class="kp-upload__size">210 MB</span>
<span class="kp-upload__message">Larger than the 5 MB limit.</span>
</li>
</ul>
`,
            },
        ],
        variants: [
            { name: '.kp-upload__zone', what: 'The target. It is a label, which is what makes it operable without a pointer.' },
            { name: 'dragging', what: 'While files are over the zone it takes the primary boundary and the page’s full ink.' },
            { name: '.kp-upload__file', what: 'One row: name, size, and room underneath for a bar or a message.' },
            { name: '.kp-upload__bar', what: 'Progress, as a fill across the row rather than a separate element.' },
            { name: '.kp-upload__message', what: 'Why a file was refused, or what is happening to it, in words under the row.' },
            { name: 'error', what: 'A refused or failed row takes the destructive boundary and its message the destructive colour.' },
        ],
        accessibility: [
            'Built in — the real file input stays in the tab order under the zone, so the keyboard route is the same one the pointer uses.',
            'Built in — a refusal is a sentence in the row, and sizes are printed in the page’s locale rather than in one hard-coded format.',
            'Built in — removing a file is a button with a name, and the removal is an event a consumer can refuse.',
            'Yours — send the files and report back what happened; the component shows the outcome you give it.',
            'Yours — say what is allowed before the reader picks: the types, the size and how many.',
            'Yours — keep the file input in the markup even though it is visually hidden. Hiding it with display none takes it out of the tab order.',
        ],
    },
    {
        id: 'wizard',
        title: 'Wizard',
        group: 'Forms',
        classes: ['kp-wizard'],
        exports: ['Wizard'],
        aliases: ['step', 'step-label', 'navigable', 'finish', 'validate', 'focus-step', 'next'],
        intro: 'A form in steps, with an indicator that says where you are and what is still coming. It borrows the form’s validation rather than repeating it, so a step that will not validate does not advance.',
        whenToUse:
            'When a long form has a natural order and the later parts depend on the earlier ones. Not to hide the length of a form the reader could have filled in one screen — steps make a short form feel long. Not for anything the reader may want to fill in out of order either: that is a page with sections.',
        examples: [
            {
                title: 'Two steps, a back and a next',
                why: 'The indicator is an ordered list rather than a row of dots: the steps have names and a number, which is what “step two of four” needs in order to be said out loud.',
                markup: `
<div class="kp-wizard" data-kp-wizard>
<ol class="kp-wizard__steps">
<li data-kp-step-label>Details</li>
<li data-kp-step-label>Review</li>
</ol>
<p data-kp-wizard-status role="status" aria-live="polite"></p>
<section data-kp-step>
<div class="kp-field">
<label class="kp-field__label" for="doc-wizard-name">Name</label>
<input class="kp-field__input" id="doc-wizard-name" required />
</div>
</section>
<section data-kp-step hidden>Ready to send.</section>
<div class="kp-wizard__actions">
<button type="button" class="kp-button" data-kp-wizard-back>Back</button>
<button type="button" class="kp-button kp-button--primary" data-kp-wizard-next>Next</button>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-wizard__steps', what: 'The indicator. Each step is numbered by the stylesheet rather than by markup, so inserting one renumbers the rest.' },
            { name: 'current step', what: 'Marked by weight, by a filled circle, and by the current-step attribute — three carriers, one of which survives without colour.' },
            { name: 'done step', what: 'Its number becomes a check in the success colour.' },
            { name: 'navigable labels', what: 'The step labels can be made clickable, for a wizard whose earlier steps stay open.' },
            { name: '.kp-wizard__actions', what: 'The back and next pair, at the end of the current step.' },
            { name: 'held transition', what: 'A step change can be refused or delayed by a listener or an async check, which is what a step that needs a server answer was missing.' },
        ],
        accessibility: [
            'Built in — the current step is marked with the attribute that exists for exactly this, which is what a screen reader announces on arrival.',
            'Built in — the status line says which step you are on out loud when it changes.',
            'Built in — the step that becomes visible takes focus, so the keyboard does not stay behind on the previous panel.',
            'Yours — validate on the server as well; a wizard that will not advance is a courtesy, not a guard.',
            'Yours — name each step in a word or two. “Step 2” tells the reader nothing about what is in it.',
            'Yours — let people go back. A step that cannot be revisited turns a typo into a restart.',
        ],
    },
    {
        id: 'table',
        title: 'Table',
        group: 'Data',
        classes: ['kp-table', 'kp-table-wrap', 'kp-cell-break', 'kp-cell-truncate', 'kp-col-low'],
        exports: ['Table'],
        aliases: ['region'],
        intro: 'The plain table: header, rows, tabular numerals, and a wrapper that scrolls a wide table inside its own box instead of pushing the page sideways. That box is a named region a keyboard can reach.',
        whenToUse:
            'For data the server already knows and the reader only reads. Reach for the data table instead as soon as sorting, filtering or paging is wanted. Do not use a table for layout — the row and grid classes of the layout layer are for that, and a layout table is announced to a screen reader as data with rows and columns.',
        examples: [
            {
                title: 'A table in its scroll region',
                why: 'The wrapper is upgraded on attach: it becomes focusable, takes the region role, and is named after the caption — so someone who cannot use a mouse can reach the scrollbar and is told which table they landed in.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table">
<caption>Applications</caption>
<thead><tr><th scope="col">Company</th><th scope="col">Status</th><th scope="col">Amount</th></tr></thead>
<tbody>
<tr><td>Example Inc</td><td>Interview</td><td class="kp-numeric">1,284.50</td></tr>
<tr><td>Second Ltd</td><td>Offer</td><td class="kp-numeric">998.00</td></tr>
</tbody>
</table>
</div>
`,
            },
            {
                title: 'Cells that do not fit, and a column that may go',
                why: 'Two different problems: an identifier is one unbreakable word that widens the whole table, and a sentence is prose that should be cut with the full value still in the cell. The low-priority column is dropped at the same width the rows become cards.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table">
<caption>Deliveries</caption>
<thead><tr><th scope="col">Key</th><th scope="col">Note</th><th scope="col" class="kp-col-low">Updated</th></tr></thead>
<tbody>
<tr>
<td class="kp-cell-break">7f3a9c21-4e18-4b7d-9f02-6d5e8a1c0b44</td>
<td class="kp-cell-truncate" title="Left with a neighbour who was not in when the courier came back">Left with a neighbour who was not in when the courier came back</td>
<td class="kp-col-low kp-timestamp">2026-09-06 14:07</td>
</tr>
</tbody>
</table>
</div>
`,
            },
            {
                title: 'Rows as cards in a narrow container',
                why: 'Opt-in, because every table that already ships would otherwise change shape in a minor release. The width that decides is the width of the table’s own container, not the window’s, so a table in a narrow column falls into cards on a wide page.',
                markup: `
<div class="kp-table-wrap">
<table class="kp-table" data-kp-cards>
<caption>Orders</caption>
<thead><tr><th scope="col">Customer</th><th scope="col">Amount</th></tr></thead>
<tbody>
<tr><td data-label="Customer">Acme</td><td data-label="Amount" class="kp-numeric">100.00</td></tr>
<tr><td data-label="Customer">Bakker</td><td data-label="Amount" class="kp-numeric">20.00</td></tr>
</tbody>
</table>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-table', what: 'The table itself: collapsed borders, quiet header ink, and same-width digits so a column of numbers does not shimmer.' },
            { name: '.kp-table-wrap', what: 'The scroll box. It is also the element the card layout measures, so the query asks about the space the table actually has.' },
            { name: '.kp-cell-break', what: 'For identifiers: a long unbroken key wraps anywhere instead of widening every row.' },
            { name: '.kp-cell-truncate', what: 'For prose: one line with an ellipsis, the whole value still in the cell for a reader, a search and a copy.' },
            { name: '.kp-col-low', what: 'A column that disappears when the rows become cards. Header and cells together, because values with no column name are worse than no column.' },
            { name: 'cards', what: 'Opt-in on the table: below the threshold each row becomes a card and each cell carries its column name.' },
            { name: 'row hover', what: 'A quiet wash on the hovered row; it is not a selection, and nothing depends on it.' },
        ],
        accessibility: [
            'Built in — the scroll region gets a tab stop, a role and a name from the caption, which is the repair for a wide table nobody without a mouse could scroll.',
            'Built in — the card layout carries each column name into its cell, so a value never appears without its question.',
            'Built in — the wrapper keeps the page from scrolling sideways, which is what SC 1.4.10 asks for.',
            'Yours — write a caption. It is the table’s name, for the region as well as for a reader.',
            'Yours — mark header cells with their scope, and use a header cell for a row’s own label.',
            'Yours — put the column name on each cell if you turn the card layout on; nothing else can know it.',
        ],
    },
    {
        id: 'datatable',
        title: 'Data table',
        group: 'Data',
        classes: ['kp-datatable'],
        exports: ['DataTable'],
        aliases: ['sort', 'select', 'page', 'row', 'debounce', 'locale'],
        intro: 'Sorting, searching, paging and row selection over a table the server already rendered. It works on the rows that are in the document: it does not fetch, and it does not own the data.',
        whenToUse:
            'For a table a reader will interrogate — hundreds of rows, a search box, a sort. Not for thousands: there is no virtualisation, no in-cell editing and no export here, and a grid is a different product. Not for a handful of rows either, where a search box over six lines is furniture.',
        examples: [
            {
                title: 'Search, sort, page and select',
                why: 'Everything is markup the server wrote, so the table is readable before any script runs. The status paragraph says how many rows are showing after each change, which is what makes the filtering audible.',
                markup: `
<div class="kp-datatable" data-kp-datatable data-kp-page-size="3">
<div class="kp-datatable__bar">
<input class="kp-datatable__search" type="search" data-kp-datatable-search aria-label="Search the table" placeholder="Search…" />
</div>
<div class="kp-table-wrap">
<table class="kp-table">
<caption>Orders</caption>
<thead><tr>
<th scope="col"><input type="checkbox" data-kp-select-all aria-label="Select all visible rows" /></th>
<th scope="col" data-kp-sort="text">Customer</th>
<th scope="col" data-kp-sort="number">Amount</th>
<th scope="col" data-kp-sort="date">Date</th>
</tr></thead>
<tbody>
<tr data-kp-row-key="r0"><td><input type="checkbox" data-kp-select-row aria-label="Select Acme" /></td><td>Acme</td><td class="kp-numeric">100.00</td><td class="kp-timestamp">2026-03-01</td></tr>
<tr data-kp-row-key="r1"><td><input type="checkbox" data-kp-select-row aria-label="Select Bakker" /></td><td>Bakker</td><td class="kp-numeric">20.00</td><td class="kp-timestamp">2026-01-12</td></tr>
<tr data-kp-row-key="r2"><td><input type="checkbox" data-kp-select-row aria-label="Select Cerise" /></td><td>Cerise</td><td class="kp-numeric">1,284.50</td><td class="kp-timestamp">2026-09-04</td></tr>
<tr data-kp-row-key="r3"><td><input type="checkbox" data-kp-select-row aria-label="Select Delta" /></td><td>Delta</td><td class="kp-numeric">7.00</td><td class="kp-timestamp">2025-11-30</td></tr>
</tbody>
</table>
</div>
<div class="kp-empty" data-kp-datatable-empty hidden>Nothing found.</div>
<div class="kp-datatable__bar">
<p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
<div class="kp-datatable__pager" data-kp-datatable-pager></div>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-datatable__bar', what: 'A row of controls above or below the table: the search box, the status line, the pager.' },
            { name: '.kp-datatable__sort', what: 'The sort control inside a header cell. It takes the whole cell, so a click anywhere in the header sorts.' },
            { name: 'sorted ascending / descending', what: 'An arrow after the header text and the sort state on the header itself; the arrow is the second carrier, the state is what is announced.' },
            { name: '.kp-datatable__pager / __page', what: 'The page controls and the “page m of n” label, in same-width digits.' },
            { name: '.kp-datatable__page-size', what: 'The rows-per-page control, before the pager.' },
            { name: '.kp-datatable__status', what: 'The live region that says how many rows are showing after a search, a sort or a page.' },
            { name: '.kp-datatable__search', what: 'The search box. Typing is debounced so a long list is not re-sorted on every keystroke.' },
            { name: 'empty', what: 'When a filter matches nothing the empty state takes the table’s place rather than leaving a header over nothing.' },
            { name: 'clickable rows', what: 'A row can be marked as a control, which gives it the pointer cursor and an activation of its own.' },
        ],
        accessibility: [
            'Built in — every sortable header is a real button inside the cell, so sorting is reachable without a pointer.',
            'Built in — the sort state, the row count and the current page are announced in words, not only drawn.',
            'Built in — numbers and dates are read in the page’s locale, so a sort agrees with what the reader sees.',
            'Yours — give every row a stable key if you care which rows are selected after a sort.',
            'Yours — name the search box and every row checkbox; “select row” is not a name when there are forty of them.',
            'Yours — render the rows on the server. This works on what is there; a table that appears only after a script has run is an empty box on first paint.',
        ],
    },
    {
        id: 'tree',
        title: 'Tree',
        group: 'Data',
        classes: ['kp-tree'],
        exports: ['Tree'],
        aliases: ['typeahead', 'selectable', 'click'],
        intro: 'A nested list a keyboard can walk: arrows move and open, Home and End jump to the ends, and typing a few letters finds the next matching item. The twisty points the way the branch will go rather than the way it is.',
        whenToUse:
            'For a hierarchy the reader browses — a file list, a category tree, a menu of settings. Not for a flat list of options, which is a listbox and cheaper in every way. Not for navigation that could be links: a tree that replaces a nav takes the middle click and the address bar away.',
        examples: [
            {
                title: 'A tree with one closed branch',
                why: 'A closed branch is skipped by the arrows, because Down should go to the next thing you can see; walking into a folder that is shut is the bug that makes a tree feel broken rather than merely awkward.',
                markup: `
<ul class="kp-tree" role="tree" data-kp-tree aria-label="Project files">
<li role="treeitem" aria-expanded="false">Components
<ul role="group">
<li role="treeitem">button.jsx</li>
<li role="treeitem">card.jsx</li>
</ul>
</li>
<li role="treeitem" aria-expanded="true">Styles
<ul role="group">
<li role="treeitem">components.css</li>
</ul>
</li>
<li role="treeitem">README.md</li>
</ul>
`,
            },
        ],
        variants: [
            { name: 'expanded / collapsed', what: 'The twisty is a second carrier beside the expanded state, and a collapsed branch is out of the walk as well as out of sight.' },
            { name: 'selected', what: 'Selection is separate from the highlight: a click can select or toggle, and which one it does is a choice.' },
            { name: 'depth', what: 'The indent per level is a measure the tree sets from its own depth, so a deep branch does not need a class per level.' },
            { name: 'typeahead', what: 'Typing letters jumps to the next item that starts with them; it can be turned off for a tree whose labels are numbers.' },
            { name: 'hover', what: 'A quiet ground on the item under the pointer. It is not selection and nothing depends on it.' },
        ],
        accessibility: [
            'Built in — the whole tree is one tab stop and the arrows move within it, which is the pattern a screen reader expects.',
            'Built in — expanding, collapsing and selecting are events, so a consumer can persist what the reader opened.',
            'Built in — the open state is on the item itself, so it is announced rather than inferred from the twisty.',
            'Yours — write the roles and the nesting. The module drives markup that is already a tree; it does not build one.',
            'Yours — give the tree a name, or a reader who lands in it is told only “tree”.',
            'Yours — keep the labels short. They are read one at a time as the arrows move.',
        ],
    },
    {
        id: 'reorder',
        title: 'Reorder list',
        group: 'Data',
        classes: ['kp-reorder'],
        exports: ['Reorder'],
        aliases: ['item', 'handle', 'label', 'pointer', 'dragging'],
        intro: 'A list whose items can be moved: a real grab handle that moves an item with the arrow keys, and a pointer drag beside it. Every move is announced in words and reported as the new order.',
        whenToUse:
            'When the order is the data — a playlist, a checklist, columns in a report. Not for sorting by a property, which belongs to the table and needs no dragging. Not for a list of two: a pair is better served by a swap.',
        examples: [
            {
                title: 'Three items with a handle each',
                why: 'The handle is a real button, not a decorative grip: it has to be reachable by Tab or the arrow keys have nothing to act on. Dragging is the easy half and the platform gives it away.',
                markup: `
<ul class="kp-reorder" data-kp-reorder aria-label="Report columns">
<li data-kp-item="name"><button type="button" data-kp-handle aria-label="Move Name">⠿</button> Name</li>
<li data-kp-item="amount"><button type="button" data-kp-handle aria-label="Move Amount">⠿</button> Amount</li>
<li data-kp-item="date"><button type="button" data-kp-handle aria-label="Move Date">⠿</button> Date</li>
</ul>
`,
            },
        ],
        variants: [
            { name: 'keyboard move', what: 'With the handle focused the arrows move the item and the list says where it went.' },
            { name: 'pointer drag', what: 'The same move with a pointer, added beside the keyboard rather than instead of it.' },
            { name: 'dragging', what: 'While an item is being moved it is marked, so the stylesheet can lift it out of the row.' },
            { name: 'item label', what: 'The name used in the announcement can be the item’s own text or a label element inside it.' },
        ],
        accessibility: [
            'Built in — the whole gesture exists on the keyboard, which is the half a drag library leaves out.',
            'Built in — each move is announced (“Amount, position two of three”) through the dictionary, so it can be translated.',
            'Built in — the new order is an event, so the consumer stores what the reader arranged.',
            'Yours — name each handle after the item it moves; “drag” repeated six times is not a name.',
            'Yours — give every item a stable identifier, or the order you get back cannot be applied to your data.',
            'Yours — save the order. The list reports the move and forgets it.',
        ],
    },
    {
        id: 'grid-layout',
        title: 'Movable grid layout',
        group: 'Data',
        classes: ['kp-grid', 'kp-grid-wrap'],
        exports: ['GridLayout'],
        aliases: ['tile', 'columns', 'rows', 'commit', 'label', 'step', 'pointer', 'dragging'],
        intro: 'A dashboard the reader arranges: tiles on a coarse grid that move with the arrow keys and resize with Shift and the arrows, and a layout that can be handed back to be stored. Dragging exists too, and it is the half that was easy.',
        whenToUse:
            'For a dashboard whose readers do not agree about what matters. Not for a page whose layout you decide — the automatic grid of the layout layer is a class, needs no script and cannot be knocked out of shape. Not on a phone: below the narrow threshold the arrangement stops being an arrangement and becomes one column in source order.',
        examples: [
            {
                title: 'Three tiles on a six-column grid',
                why: 'The position lives in attributes rather than in inline styles, because the consumer stores the numbers and the stylesheet turns them into a grid area. Reading a layout back out of a style string is how a dashboard loses somebody’s arrangement. The wrapper is what the narrow rule measures: a container query styles a container’s contents, never the container itself, so the element that changes column count cannot be the one that is the container. GridLayout renders it for you.',
                markup: `
<div class="kp-grid-wrap">
<div class="kp-grid" data-kp-grid data-kp-columns="6">
<div class="kp-grid__tile" data-kp-tile="cpu" data-kp-label="CPU" data-x="0" data-y="0" data-w="2" data-h="1" tabindex="0" role="group">CPU</div>
<div class="kp-grid__tile" data-kp-tile="ram" data-kp-label="RAM" data-x="2" data-y="0" data-w="2" data-h="1" tabindex="0" role="group">RAM</div>
<div class="kp-grid__tile" data-kp-tile="disk" data-kp-label="Disk" data-x="4" data-y="0" data-w="2" data-h="2" tabindex="0" role="group">Disk</div>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-grid__tile', what: 'One tile. It is a tab stop, because moving it is a keyboard gesture first and a drag second.' },
            { name: 'moving / resizing', what: 'Arrows move, Shift and the arrows resize, and the tile says where it is and how big it is in words.' },
            { name: 'dragging', what: 'While a pointer is moving a tile it is marked, so the stylesheet can show it leaving its place.' },
            { name: '.kp-grid-wrap', what: 'The box the grid measures itself against. Below the narrow threshold it is the wrapper’s width that decides, not the window’s, so a grid in a 300px panel of a wide page collapses too.' },
            { name: 'narrow', what: 'Below the narrow threshold the grid becomes one column in source order: a six-column dashboard on a phone is six columns of nothing.' },
            { name: 'commit', what: 'A drag reports its final layout once the movement settles rather than on every pixel.' },
        ],
        accessibility: [
            'Built in — every gesture has a keyboard equivalent, and the keyboard one is the one the browser suite drives.',
            'Built in — a tile keeps its own name and gets its geometry as a description, so the announcement is “CPU, two by one at column one” rather than a number salad instead of the name.',
            'Built in — the layout is reported as data and can be applied again, so a reader’s arrangement survives a reload.',
            'Yours — name every tile. A group with no name is announced as a group.',
            'Yours — store the layout you are handed; the grid does not.',
            'Yours — keep a sensible source order, because that is the order on a narrow screen and for a screen reader.',
        ],
    },
    {
        id: 'timeline',
        title: 'Timeline',
        group: 'Data',
        classes: ['kp-timeline'],
        exports: ['Timeline'],
        intro: 'An ordered list of things that happened, each with its moment and a marker down the left. The rule between markers is drawn on the marker itself, so a one-item timeline has no line hanging under it.',
        whenToUse:
            'For a history in order — releases, an audit trail, the states an application passed through. Not for a schedule of what is still to come, where a list with dates reads better than a line. Not as a chart: this is prose in order, not a measurement of time.',
        examples: [
            {
                title: 'Two events',
                why: 'The moment is a time element and the marker is decorative, so the entry reads as “2026-09-04 14:07, version 1.1.0 released” rather than as a bullet with a date attached.',
                markup: `
<ol class="kp-timeline">
<li class="kp-timeline__item"><span class="kp-timeline__marker" aria-hidden="true"></span>
<span><time class="kp-timeline__when" datetime="2026-09-04T14:07">2026-09-04 14:07</time>Version 1.1.0 released</span></li>
<li class="kp-timeline__item"><span class="kp-timeline__marker" aria-hidden="true"></span>
<span><time class="kp-timeline__when" datetime="2026-09-04T12:27">2026-09-04 12:27</time>Version 1.0.0 released</span></li>
</ol>
`,
            },
        ],
        variants: [
            { name: '.kp-timeline__item', what: 'One entry: a marker column and the text beside it.' },
            { name: '.kp-timeline__marker', what: 'The dot, and the rule to the next entry — except on the last, which draws no line.' },
            { name: '.kp-timeline__when', what: 'The moment, quiet, above the text, in same-width digits so a column of times lines up.' },
        ],
        accessibility: [
            'Built in — the markers are decorative and the list is an ordered list, so the order is announced rather than drawn only.',
            'Yours — use a time element with a machine-readable moment; the printed text is for the reader.',
            'Yours — put the newest entry where your readers expect it, and say which end that is if the order could be either.',
        ],
    },
    {
        id: 'diff',
        title: 'Diff',
        group: 'Data',
        classes: ['kp-diff'],
        exports: ['Diff'],
        intro: 'Two versions of a text side by side in one column: a line number, a sign, and the line. The sign has a column of its own, so the difference survives printing, high contrast, and a reader who cannot tell green from red.',
        whenToUse:
            'For showing what changed in something textual — a configuration, a record, a theme’s tokens. Not for a review tool with comments and threads, which is an application rather than a component. Not for two long documents: this is a rendering, not a diff algorithm.',
        examples: [
            {
                title: 'One line changed',
                why: 'Colour is the second carrier here, never the only one. Removing the tints leaves a diff that still reads correctly.',
                markup: `
<pre class="kp-diff">
<span class="kp-diff__line" data-kind="same"><span class="kp-diff__number">1</span><span class="kp-diff__sign"> </span><span>--background: 0 0% 100%;</span></span>
<span class="kp-diff__line" data-kind="removed"><span class="kp-diff__number">2</span><span class="kp-diff__sign">-</span><span>--primary: 220 90% 56%;</span></span>
<span class="kp-diff__line" data-kind="added"><span class="kp-diff__number">2</span><span class="kp-diff__sign">+</span><span>--primary: 220 90% 48%;</span></span>
</pre>
`,
            },
        ],
        variants: [
            { name: 'same', what: 'Context: no tint, a blank sign, the line as it is.' },
            { name: 'added', what: 'A wash of the success colour behind the line, and a plus in the sign column.' },
            { name: 'removed', what: 'A wash of the destructive colour, and a minus.' },
            { name: '.kp-diff__number', what: 'The line number, quiet, right-aligned, in same-width digits.' },
            { name: 'long lines', what: 'The block scrolls sideways inside its own boundary rather than widening the page.' },
        ],
        accessibility: [
            'Built in — the sign is text in its own column, which is the carrier that survives without colour.',
            'Built in — the lines keep their whitespace, so indentation is part of what is compared.',
            'Yours — say what the two sides are above the block. “Added” and “removed” are relative to something.',
            'Yours — keep the numbers if the reader may need to point at a line.',
        ],
    },
    {
        id: 'copyable',
        title: 'Copyable value',
        group: 'Data',
        classes: ['kp-copyable'],
        exports: ['Copyable'],
        aliases: ['copy', 'copied'],
        intro: 'A value in the mono face with a button beside it that copies it and then says so, in words on the button, for as long as the confirmation lasts. When the clipboard refuses, that is said too.',
        whenToUse:
            'For a value someone has to paste somewhere else — a token, an identifier, a command. Not for prose, which is selected and copied the ordinary way. Not for a secret you would rather nobody copied by accident: the button makes it one click.',
        examples: [
            {
                title: 'A token with a copy button',
                why: 'The confirmation is words on the button rather than a green flash, because a flash is invisible to a screen reader and to anyone who looked away.',
                markup: `
<span class="kp-copyable">
<span class="kp-copyable__value" id="doc-copy-token">a3f9-2b71</span>
<button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy="doc-copy-token">Copy</button>
</span>
`,
            },
            {
                title: 'Copying a value that is not on screen',
                why: 'The button can carry the text itself, for a value that is shortened on screen or not shown at all.',
                markup: `
<span class="kp-copyable">
<span class="kp-copyable__value">https://example.test/i/a3f9…</span>
<button type="button" class="kp-button kp-button--ghost kp-copyable__button" data-kp-copy data-kp-copy-value="https://example.test/invite/a3f9-2b71-0c4d" aria-label="Copy the invitation link">Copy</button>
</span>
`,
            },
        ],
        variants: [
            { name: '.kp-copyable__value', what: 'The value, in the mono face, so an identifier can be read character by character.' },
            { name: 'copied', what: 'The button wears the success colour and says it copied, then goes back by itself.' },
            { name: 'refused', what: 'When the clipboard is unavailable the button says so instead of silently doing nothing.' },
            { name: 'with a toast', what: 'The confirmation can be a toast as well as the button’s own label, for a copy that happens far from where the reader is looking.' },
        ],
        accessibility: [
            'Built in — the confirmation is a change of text, and the button announces itself when its own label changes.',
            'Built in — a refusal is reported rather than swallowed; a copy button that does nothing looks broken.',
            'Built in — both outcomes are events, so a consumer can log or count them.',
            'Yours — name the button after what it copies when the value is long or shortened on screen.',
            'Yours — do not put a copy button on something that has to stay secret.',
        ],
    },
    {
        id: 'data-formatting',
        title: 'Showing data',
        group: 'Data',
        classes: ['kp-url', 'kp-id', 'kp-numeric', 'kp-timestamp', 'kp-masked', 'kp-truncate'],
        exports: [],
        intro: 'Six classes that are not components — nobody imports a URL — but that every data-heavy page rewrites badly. Each fixes one specific failure: a page that scrolls sideways because of one long link, or a column of numbers that jitters between rows.',
        whenToUse:
            'On the values themselves, wherever they appear: in a table, in a card, in a definition list. Do not reach for the truncation where the value must stay readable — a cut identifier with no way back is data hidden rather than shortened — and do not use the masked class to hide anything a viewer could not already see.',
        examples: [
            {
                title: 'All six at rest',
                why: 'The URL and the identifier wrap anywhere rather than pushing the page sideways; the amount and the moment use same-width digits; the masked value keeps its shape without claiming to be the real one; the last line is cut with an ellipsis.',
                markup: `
<p class="kp-url">https://example.test/a/very/long/path/that-would-otherwise-widen-the-page?with=query&amp;and=more</p>
<p class="kp-id">a3f9-2b71-0c4d-8e15</p>
<p class="kp-numeric">1,284.50 · 998.00 · 12.75</p>
<p class="kp-timestamp">2026-09-06 14:07</p>
<p class="kp-masked">•••• •••• •••• 4417</p>
<p class="kp-truncate">This sentence is cut off with an ellipsis as soon as its column is narrower than the text itself, instead of making the row taller.</p>
`,
            },
        ],
        variants: [
            { name: '.kp-url', what: 'Wraps anywhere, so one long link cannot widen the page.' },
            { name: '.kp-id', what: 'The same wrapping, in the mono face and slightly smaller, for keys and identifiers.' },
            { name: '.kp-numeric', what: 'Same-width digits, so a column of amounts lines up and does not shimmer as values change.' },
            { name: '.kp-timestamp', what: 'The same digits, in the quiet ink, because a moment is rarely the point of the row.' },
            { name: '.kp-masked', what: 'Mono, letter-spaced and quiet: a value with its shape kept and its content gone.' },
            { name: '.kp-truncate', what: 'One line with an ellipsis. Put the whole value in the title, or use the cell class that keeps it.' },
        ],
        accessibility: [
            'Built in — none of these hides anything from a screen reader: they change how a value is drawn, not what it is.',
            'Built in — the wrapping classes are what keep a page from needing sideways scrolling at 320 pixels.',
            'Yours — put the full text within reach of anyone who meets a truncated one.',
            'Yours — mask on the server. A masked class over a real number is a value in the page source.',
        ],
    },
    {
        id: 'empty-state',
        title: 'Empty state',
        group: 'Data',
        classes: ['kp-empty'],
        exports: ['EmptyState'],
        intro: 'A bordered box that says a list is empty, and which emptiness it is: nothing yet, or nothing that matched. A blank area says the page is broken instead.',
        whenToUse:
            'Wherever a list, a table or a search can come back with nothing. Not as an error message — a failed request is an alert, because the reader can do something about it. Not for a section that is empty by design, where a sentence in the ordinary prose is enough.',
        examples: [
            {
                title: 'Nothing yet, and nothing found',
                why: '“No applications yet” and “nothing matched your filter” are different messages, and offering “create one” to somebody who just typed a filter is noise.',
                markup: `
<div class="kp-empty">
<p class="kp-empty__title">No applications yet</p>
<p class="kp-empty__body">Applications you send appear here.</p>
<button type="button" class="kp-button kp-button--primary">New application</button>
</div>
<div class="kp-empty">
<p class="kp-empty__title">Nothing matched</p>
<p class="kp-empty__body">No application matches “bakery”.</p>
<button type="button" class="kp-button">Clear the filter</button>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-empty', what: 'The box on its own: a dashed boundary and quiet ink, for a one-line emptiness with nothing to offer.' },
            { name: '.kp-empty__title', what: 'The line that names the emptiness, in the page’s full ink so it is not mistaken for help text.' },
            { name: '.kp-empty__body', what: 'One sentence under it, saying what would put something here.' },
            { name: 'filtered', what: 'The same box in its other state, with the action that clears the filter instead of the one that creates a first item.' },
            { name: 'as a heading', what: 'The title can be rendered as a real heading where the empty state stands for a whole section.' },
        ],
        accessibility: [
            'Built in — the title is text in the page’s own ink rather than a picture of a shrug, so it is read out like any other message.',
            'Yours — put the empty state where the list was, so a reader who moved focus into the list is not left with nothing.',
            'Yours — announce the change if the list emptied because of something the reader typed; the box appearing is silent on its own.',
            'Yours — offer one action, and only the one that fits the emptiness in front of you.',
        ],
    },
    {
        id: 'alert',
        title: 'Alert',
        group: 'Feedback',
        classes: ['kp-alert'],
        exports: ['Alert'],
        aliases: ['semantic'],
        intro: 'A message on a coloured plate that also says, in words, what kind of message it is. Four flavours, no hover and no active state: an alert is a message, not a control.',
        whenToUse:
            'For something the reader has to know about the page or their last action, in place, where it happened. Not for a message about a single field — that belongs under the field, where the eye already is. Not for something that can be missed either: an alert appears in the page rather than announcing itself, so a passing confirmation is a toast.',
        examples: [
            {
                title: 'The four flavours',
                why: 'Each names itself in text as well as in colour: four coloured plates are one plate to somebody who sees them all the same. The contract enforcer disarms a semantic alert that carries no words.',
                markup: `
<div class="kp-alert kp-alert--success" role="status" data-kp-semantic><span><span class="kp-alert__label">Success: </span>The application was sent.</span></div>
<div class="kp-alert kp-alert--warning" role="status" data-kp-semantic><span><span class="kp-alert__label">Warning: </span>Two attachments were larger than the limit.</span></div>
<div class="kp-alert kp-alert--info" role="status" data-kp-semantic><span><span class="kp-alert__label">Note: </span>Applications are kept for twelve months.</span></div>
<div class="kp-alert kp-alert--destructive" role="alert" data-kp-semantic><span><span class="kp-alert__label">Error: </span>The server refused the file.</span></div>
`,
            },
            {
                title: 'With an icon and a way out',
                why: 'The icon is decorative — the word beside it is what carries the meaning — and the close button is a named control rather than a bare glyph.',
                markup: `
<div class="kp-alert kp-alert--warning" role="status" data-kp-semantic>
<span class="kp-alert__icon" aria-hidden="true">!</span>
<span class="kp-alert__body"><span class="kp-alert__label">Warning: </span>Your session ends in five minutes.</span>
<button type="button" class="kp-icon-button kp-alert__close" aria-label="Dismiss this message">×</button>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-alert', what: 'The neutral plate, for a message with no flavour at all.' },
            { name: '.kp-alert--success / --warning / --info / --destructive', what: 'The four semantic plates. Each takes its own ground and the ink that is measured against it.' },
            { name: '.kp-alert__label', what: 'The word that names the flavour, in bold, before the message.' },
            { name: '.kp-alert__icon', what: 'A decorative glyph at the leading edge, sized so it does not stretch with the text.' },
            { name: '.kp-alert__body', what: 'The message itself, taking the remaining width — a bare span here leaves the close button in the middle of the plate.' },
            { name: '.kp-alert__close', what: 'The dismiss control, pushed to the trailing edge.' },
        ],
        accessibility: [
            'Built in — a semantic alert with no words is refused by the contract enforcer, which is DI4 made mechanical rather than remembered.',
            'Built in — every ground and ink pair on these plates is in the contrast gate; no alert invents a colour.',
            'Yours — choose the role: a status for something the reader can finish reading first, an alert only for what interrupts.',
            'Yours — an alert added after the page has loaded needs a live region, or it appears silently.',
            'Yours — name the dismiss button, and leave the reader a way back to what the message was about.',
        ],
    },
    {
        id: 'badge',
        title: 'Badge',
        group: 'Feedback',
        classes: ['kp-badge'],
        exports: ['Badge'],
        aliases: ['semantic'],
        intro: 'A small pill for a state — a status, a count, a label. It says what it is in text; the colour is the second channel and never the only one.',
        whenToUse:
            'To mark a row or a card with a state the reader scans for. Not as a button: a pill that acts is a button, and painting one as a badge hides that it can be pressed. Not for long text either — a badge that wraps to two lines is a sentence wearing a costume.',
        examples: [
            {
                title: 'A row of statuses',
                why: 'Each badge names its status. The status colours come from the theme’s own scale, so the same seven states look right in all twenty-four themes.',
                markup: `
<span class="kp-badge" data-kp-semantic data-status="draft">draft</span>
<span class="kp-badge" data-kp-semantic data-status="sent">sent</span>
<span class="kp-badge" data-kp-semantic data-status="interview">interview</span>
<span class="kp-badge" data-kp-semantic data-status="offer">offer</span>
<span class="kp-badge" data-kp-semantic data-status="rejected">rejected</span>
`,
            },
            {
                title: 'A count beside a label',
                why: 'Without the semantic marking a badge is just a pill on the quiet surface, which is what a count wants: it is a number, not a state.',
                markup: `
<span>Unread <span class="kp-badge">12</span></span>
`,
            },
        ],
        variants: [
            { name: '.kp-badge', what: 'The default: the quiet ground and its ink, for counts and neutral labels.' },
            { name: 'semantic', what: 'A badge carrying a status colour. It must say what it means in text; one carrying none is refused by the contract enforcer.' },
            { name: 'with a status', what: 'The status attribute is what a consumer paints from, using the theme’s own status pair for that name.' },
        ],
        accessibility: [
            'Built in — a coloured badge with no words is disarmed and reported, because seven pale plates are one plate to somebody who cannot tell them apart.',
            'Yours — write the state in the badge. A colour with no word is a colour.',
            'Yours — if a badge is a filter, make it a button; if it is a link, make it a link.',
            'Yours — say what the badge belongs to when it stands alone in a row: “12 unread”, not “12”.',
        ],
    },
    {
        id: 'toast',
        title: 'Toast',
        group: 'Feedback',
        classes: ['kp-toast', 'kp-toasts'],
        exports: ['Toasts'],
        intro: 'A short message in a stack at the corner of the window that removes itself after a while. Errors go to a second, assertive stack, because those are the ones that must interrupt.',
        whenToUse:
            'For confirming something the reader just did, when the result is elsewhere on the page or not visible at all. Not for anything they have to act on — a toast that disappears is not a place for a decision — and not for errors that block progress, which belong beside the thing that failed.',
        examples: [
            {
                title: 'The four flavours, at rest',
                why: 'Printed here on the page so the variants can be seen; in an application the module puts them into the fixed stack at the corner of the window. The flavour is a rule down the leading edge and the message says it too.',
                markup: `
<div class="kp-toast kp-toast--success">Saved: the application was sent.</div>
<div class="kp-toast kp-toast--warning">Two files were skipped.</div>
<div class="kp-toast kp-toast--info">Your session ends in five minutes.</div>
<div class="kp-toast kp-toast--error">The server refused the file.<button type="button" class="kp-icon-button kp-toast__close" aria-label="Dismiss">×</button></div>
`,
            },
            {
                title: 'The region a consumer writes once',
                why: 'One polite region for ordinary messages; the module makes a second assertive one for errors when it needs it. The stack is fixed to the corner of the window and sits above the texture layer, because a toast under an overlay is a toast nobody can read.',
                markup: `
<div class="kp-toasts" role="status" aria-live="polite"></div>
`,
            },
        ],
        variants: [
            { name: '.kp-toasts', what: 'The stack: fixed at the trailing bottom corner, newest last, above every other layer.' },
            { name: 'assertive stack', what: 'A second region for errors, which interrupts rather than waiting for a pause.' },
            { name: '.kp-toast--success / --warning / --info / --error', what: 'A rule down the leading edge in the status colour. The words say it as well.' },
            { name: '.kp-toast__close', what: 'A dismiss control pushed to the trailing edge, for a toast that does not go by itself.' },
            { name: 'with an action', what: 'A toast can carry one control — an undo — and then it should stay long enough to be used.' },
        ],
        accessibility: [
            'Built in — the polite region announces without interrupting, and errors get the assertive one; that split is the whole reason there are two.',
            'Built in — a toast is not focused when it appears, so it does not steal the keyboard from what the reader was doing.',
            'Built in — the stack sits above the other layers, so nothing draws over it.',
            'Yours — put the region in the document once, at the end, and leave it there. A region added at the same moment as its message is not announced.',
            'Yours — leave a toast long enough to read, and give anything actionable a home that does not expire.',
            'Yours — repeat the information somewhere permanent if the reader may need it later.',
        ],
    },
    {
        id: 'progress',
        title: 'Progress',
        group: 'Feedback',
        classes: ['kp-progress'],
        exports: ['Progress'],
        intro: 'A determinate bar for work whose end is known, painted in the theme’s own colours rather than the browser’s grey — the one control the package did not paint was the one that looked wrong in every theme.',
        whenToUse:
            'When you can say how far along something is: an upload, an import, a step count. Not for waiting on a server that will answer when it answers — that is the spinner. Not as a rating or a gauge: a progress element means work in flight.',
        examples: [
            {
                title: 'A bar, and a bar with its number',
                why: 'The value belongs on the element, where the browser reports it, rather than in a width. The percentage beside it is for the reader who wants the number.',
                markup: `
<progress class="kp-progress" value="40" max="100" aria-label="Import"></progress>
<span class="kp-progress__wrap">
<progress class="kp-progress" value="40" max="100" aria-label="Import"></progress>
<span class="kp-progress__value">40%</span>
</span>
`,
            },
        ],
        variants: [
            { name: '.kp-progress', what: 'The bar: the quiet ground as a track, the accent as a fill, a boundary and a rounded end in all three engines.' },
            { name: '.kp-progress__wrap', what: 'The bar with something beside it, on one baseline.' },
            { name: '.kp-progress__value', what: 'The number, quiet and small, after the bar.' },
            { name: 'indeterminate', what: 'A progress element with no value is the browser’s own indeterminate bar; for waiting with no end in sight the spinner says it better.' },
        ],
        accessibility: [
            'Built in — this is the browser’s own progress element, so its value is reported without a hand-written role.',
            'Built in — the track and the fill are theme colours in every engine, including the two that need their own vendor rules.',
            'Yours — give it a name. A bar with no label is progress on something unspecified.',
            'Yours — add a value text where a percentage is not the useful number (“3 of 12 files”).',
            'Yours — say when it is finished; a full bar is silent.',
        ],
    },
    {
        id: 'spinner',
        title: 'Spinner',
        group: 'Feedback',
        classes: ['kp-spinner'],
        exports: ['Spinner'],
        intro: 'A small ring that turns while something is happening whose end is not known. It stops turning for a reader who asked for less motion, and it says what it is in words.',
        whenToUse:
            'For a wait you cannot measure, and only for the part of the page that is waiting. Not for a whole page that is loading, where a skeleton shows the shape of what is coming; and not for something that finishes in a blink, where a spinner is a flash of anxiety.',
        examples: [
            {
                title: 'A spinner with its name',
                why: 'The ring’s track is its own head at a quarter of its alpha rather than a grey boundary: in a theme where both were black, nothing visibly turned.',
                markup: `
<span class="kp-spinner" role="status" aria-label="Loading"></span>
`,
            },
            {
                title: 'Inside the button that started the wait',
                why: 'Beside the label rather than instead of it: a button whose text disappears has changed size and meaning at the moment the reader is looking away.',
                markup: `
<button type="button" class="kp-button kp-button--primary" aria-busy="true"><span class="kp-spinner" aria-hidden="true"></span> Saving…</button>
`,
            },
        ],
        variants: [
            { name: '.kp-spinner', what: 'The one size, set by a measure so a consumer can make it smaller inside a button.' },
            { name: 'reduced motion', what: 'The animation is inside the reduced-motion guard: for a reader who asked for stillness the ring is simply drawn, not turning.' },
            { name: 'decorative', what: 'Beside a label that already says what is happening, the ring is marked hidden so the wait is not announced twice.' },
        ],
        accessibility: [
            'Built in — the animation only runs where motion is welcome, which is DI7 and not a preference honoured where convenient.',
            'Built in — the turn does not change luminance in a way that approaches the flash threshold, and the motion gate measures that.',
            'Yours — give a standalone spinner a name, or nothing says what is being waited for.',
            'Yours — say when the wait ends. A spinner that disappears is silent.',
        ],
    },
    {
        id: 'skeleton',
        title: 'Skeleton',
        group: 'Feedback',
        classes: ['kp-skeleton'],
        exports: ['Skeleton'],
        intro: 'Grey shapes standing in for content that is on its way, in the shape of what will arrive. It pulses where motion is welcome and stands still where it is not.',
        whenToUse:
            'For a first paint whose layout you already know — a list of cards, a table, a profile. Not for a short wait, where the skeleton is on screen more briefly than it takes to understand; and not where the shape is a guess, because a skeleton that does not match what arrives is a jump.',
        examples: [
            {
                title: 'A paragraph, a block and an avatar',
                why: 'Three shapes: lines, a block for an image or a card, and a circle. Stacked lines take their distance from the stylesheet rather than from an inline style nothing could beat.',
                markup: `
<div aria-hidden="true">
<span class="kp-skeleton"></span>
<span class="kp-skeleton"></span>
<span class="kp-skeleton"></span>
</div>
<div aria-hidden="true"><span class="kp-skeleton kp-skeleton--block"></span></div>
<div aria-hidden="true"><span class="kp-skeleton kp-skeleton--circle"></span></div>
`,
            },
        ],
        variants: [
            { name: '.kp-skeleton', what: 'One line, at the height of a line of text.' },
            { name: '.kp-skeleton--block', what: 'A taller rectangle for an image, a card or a chart.' },
            { name: '.kp-skeleton--circle', what: 'A round one for an avatar; it keeps its aspect whatever width it is given.' },
            { name: 'stacked', what: 'Adjacent skeletons take a distance from the stylesheet, so a paragraph of them needs no wrapper.' },
            { name: 'reduced motion', what: 'The pulse is inside the reduced-motion guard; the shapes are simply there for a reader who asked for stillness.' },
        ],
        accessibility: [
            'Built in — the pulse changes opacity slowly enough to stay well under the flash threshold, and the motion gate measures it.',
            'Built in — the animation stops entirely where less motion was asked for.',
            'Yours — hide the skeleton from a screen reader. It stands for content; it is not content.',
            'Yours — announce the arrival of the real thing, and keep the shape close enough that nothing jumps.',
        ],
    },
    {
        id: 'health',
        title: 'Health',
        group: 'Feedback',
        classes: ['kp-health'],
        exports: ['Health'],
        intro: 'A dot and a word for the state of something being watched — a service, a job, a connection. The word is what carries it; the dot is the second channel.',
        whenToUse:
            'In a list of things whose state a reader scans down — a status page, a fleet, a set of integrations. Not for the outcome of a single action, which is an alert or a toast. Not for a numeric measurement, where the number itself says more than three colours can.',
        examples: [
            {
                title: 'Three states',
                why: 'The dot is marked decorative and the word beside it is the label, so the row reads as “Database, healthy” rather than as a coloured circle nobody can name.',
                markup: `
<span class="kp-health" data-state="ok"><span class="kp-health__dot" aria-hidden="true"></span> Healthy</span>
<span class="kp-health" data-state="warn"><span class="kp-health__dot" aria-hidden="true"></span> Degraded</span>
<span class="kp-health" data-state="down"><span class="kp-health__dot" aria-hidden="true"></span> Unreachable</span>
`,
            },
        ],
        variants: [
            { name: 'ok', what: 'The success colour in the dot, with the word beside it.' },
            { name: 'warn', what: 'The warning colour: something is wrong but the thing still works.' },
            { name: 'down', what: 'The destructive colour: it does not work.' },
            { name: 'no state', what: 'Without a state the dot takes the quiet ground — unknown, which is a fourth thing and not a fourth colour.' },
        ],
        accessibility: [
            'Built in — the dot is decorative and carries a boundary, so it is visible on a pale card and never the only carrier.',
            'Yours — write the state as a word. Three coloured dots in a column are one dot to somebody who cannot tell them apart.',
            'Yours — say what the state belongs to, and when it was last measured.',
        ],
    },
    {
        id: 'tooltip',
        title: 'Tooltip',
        group: 'Feedback',
        classes: ['kp-tooltip'],
        exports: ['Tooltip'],
        intro: 'A short label on the popover surface, anchored to the thing it describes. The React component opens it on hover and on focus, with a delay at both ends, and closes it on Escape.',
        whenToUse:
            'For naming a control whose glyph is not obvious, in a few words. Never for anything the reader needs — a tooltip cannot be reached on a touch screen, cannot be selected, and is gone the moment the pointer moves. Instructions, errors and help text belong in the page.',
        examples: [
            {
                title: 'The surface, on a popover',
                why: 'Shown here as the browser’s own popover so it can be opened and looked at; the React component adds the hover and focus timing on top of the same two classes.',
                markup: `
<button type="button" class="kp-button" popovertarget="doc-tooltip" style="anchor-name: --doc-tooltip">What is a register?</button>
<span popover="auto" id="doc-tooltip" role="tooltip" class="kp-popover kp-tooltip" style="position-anchor: --doc-tooltip">An optional stylesheet that changes the texture of a theme without changing its colours.</span>
`,
            },
        ],
        variants: [
            { name: '.kp-tooltip', what: 'The popover surface at tooltip size: smaller text and a maximum width, so it wraps instead of running across the page.' },
            { name: 'hover and focus', what: 'Both open it in the React channel, with a delay before and after, so a pointer crossing the control does not flash it.' },
            { name: 'interactive', what: 'A tooltip can be made to take the pointer, for one that contains a link; by default it does not, so it cannot get in the way.' },
            { name: 'Escape', what: 'Closes it, like every other layer in the package.' },
        ],
        accessibility: [
            'Built in — focus opens it as well as hover, so it is reachable from the keyboard.',
            'Built in — the described element points at the tooltip, so its text is read as part of the control rather than as a stray paragraph.',
            'Yours — never put anything essential in one. It is unreachable on touch and invisible in print.',
            'Yours — keep it to a few words; a tooltip that wraps to four lines is help text in the wrong place.',
            'Yours — do not put a control inside a tooltip that closes when the pointer leaves it.',
        ],
    },
    {
        id: 'nav-bar',
        title: 'Navigation bar',
        group: 'Navigation',
        classes: ['kp-nav', 'kp-nav-wrap'],
        exports: ['NavBar'],
        intro: 'The bar across the top of an application: a brand, a row of links, and room at the end for whatever the page keeps there. The current page is marked by weight and by a thicker underline, not by colour alone.',
        whenToUse:
            'For the handful of places every page of an application can reach. Not for a deep hierarchy — that is a sidebar with a tree, or a breadcrumb saying where you are. Not for actions: a bar of buttons pretending to be navigation confuses the browser’s own history.',
        examples: [
            {
                title: 'A brand and three links',
                why: 'The current page carries the current-page marking, which is what a screen reader announces, and the weight and underline are what everyone else sees. The wrapper is what the narrow rule measures: a container query styles a container’s contents, never the container itself, and the rule that changes is the bar’s own padding. NavBar renders it for you.',
                markup: `
<div class="kp-nav-wrap">
<nav class="kp-nav" aria-label="Main">
<a class="kp-nav__brand" href="#nav-bar">kp</a>
<ul class="kp-nav__links">
<li><a class="kp-nav__link" href="#nav-bar" aria-current="page">Overview</a></li>
<li><a class="kp-nav__link" href="#example">Applications</a></li>
<li><a class="kp-nav__link" href="#variants">Settings</a></li>
</ul>
</nav>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-nav__brand', what: 'The name at the leading edge, in bold. As a link it keeps its look and takes the page’s ordinary link underline, which is what says it is one.' },
            { name: '.kp-nav__links', what: 'The row itself. It wraps rather than scrolling, so a narrow window gets two rows instead of a hidden third link.' },
            { name: '.kp-nav-wrap', what: 'The box the bar measures itself against. In a narrow one the bar takes a smaller inset, and the width that decides is the wrapper’s rather than the window’s.' },
            { name: 'current page', what: 'Weight and a thicker underline, with the state on the link so it is announced as well as drawn.' },
        ],
        accessibility: [
            'Built in — the current page is marked in three ways at once: weight, an underline and the attribute that says so out loud.',
            'Built in — the bar wraps at narrow widths rather than pushing the page sideways.',
            'Yours — give the nav element a name; a page with two of them is otherwise “navigation” twice.',
            'Yours — use links, and give the reader a skip link past the bar.',
            'Yours — keep the list short. A bar that wraps to three rows on a laptop is a menu.',
        ],
    },
    {
        id: 'breadcrumb',
        title: 'Breadcrumb',
        group: 'Navigation',
        classes: ['kp-breadcrumb'],
        exports: ['Breadcrumb'],
        intro: 'The trail from the top of the hierarchy to where the reader is now, with a separator drawn by the stylesheet rather than written into the markup.',
        whenToUse:
            'On a page that sits inside a hierarchy deeper than one level, where “up” is a useful move. Not as a history of where somebody has been — that is the back button — and not on a flat application, where every crumb but the last would say the same thing.',
        examples: [
            {
                title: 'Three levels, the last one where you are',
                why: 'The separator is a stylesheet glyph, so it is never selected or read out as text; the last entry is not a link, because it is the page you are on.',
                markup: `
<nav class="kp-breadcrumb" aria-label="Breadcrumb">
<ol>
<li><a href="#breadcrumb">Home</a></li>
<li><a href="#example">Applications</a></li>
<li><span aria-current="page">Example Inc</span></li>
</ol>
</nav>
`,
            },
        ],
        variants: [
            { name: 'separator', what: 'Drawn before every entry but the first, from a glyph the theme can change.' },
            { name: 'current page', what: 'The last entry is text rather than a link, and says it is the current page.' },
            { name: 'wrapping', what: 'A long trail wraps to a second line instead of scrolling sideways.' },
        ],
        accessibility: [
            'Built in — the separator is a stylesheet glyph, so a screen reader does not read a slash between every crumb.',
            'Yours — use an ordered list; the order is the information.',
            'Yours — name the nav element and mark the last entry as the current page.',
            'Yours — shorten long names in the middle of the trail rather than dropping levels out of it.',
        ],
    },
    {
        id: 'pagination',
        title: 'Pagination',
        group: 'Navigation',
        classes: ['kp-pagination'],
        exports: ['Pagination'],
        intro: 'Numbered pages with previous and next, gaps where the range is cut, and the current page marked by weight as well as by the attribute that announces it.',
        whenToUse:
            'For a list a reader may want to come back to, where a page number is a place they can return to and link to. Not for a feed, where endless scrolling suits the reading; and not inside the data table, which builds its own pager.',
        examples: [
            {
                title: 'Five pages with a gap',
                why: 'The gap is decorative and hidden from a screen reader — “…” read out between page numbers is noise. Real links, so a page can be opened in a new tab.',
                markup: `
<nav class="kp-pagination" aria-label="Pagination">
<ul>
<li><a href="#pagination">Previous</a></li>
<li><a href="#pagination">1</a></li>
<li><a href="#pagination" aria-current="page">2</a></li>
<li><a href="#pagination">3</a></li>
<li class="kp-pagination__gap" aria-hidden="true">…</li>
<li><a href="#pagination">9</a></li>
<li><a href="#pagination">Next</a></li>
</ul>
</nav>
`,
            },
        ],
        variants: [
            { name: 'current page', what: 'Bold with a thicker underline, and the attribute that says so, because weight alone is a fine distinction.' },
            { name: '.kp-pagination__gap', what: 'The cut in the range: quiet, decorative and not a link.' },
            { name: 'previous / next', what: 'Words rather than arrows by default, and left out at the ends rather than rendered as links to a page that is not there.' },
            { name: 'first / last', what: 'Optional jumps to either end for a long list.' },
        ],
        accessibility: [
            'Built in — the gap is hidden from a screen reader and the current page is announced rather than only drawn.',
            'Built in — a link that would point outside the range is not rendered, so nobody tabs onto a page that does not exist.',
            'Yours — name the nav element, and give each number a label if the number alone is not clear (“page 3”).',
            'Yours — use real links with real URLs. A page number that only works with script cannot be shared.',
            'Yours — say how many pages there are; a reader cannot guess from a cut range.',
        ],
    },
    {
        id: 'tabs',
        title: 'Tabs',
        group: 'Navigation',
        classes: ['kp-tabs', 'kp-tab'],
        exports: ['Tabs'],
        aliases: ['activation', 'loop'],
        intro: 'One panel at a time, with a row of tabs above it. The arrows move between tabs, one tab is in the tab order at a time, and by default moving the arrows also selects.',
        whenToUse:
            'For alternative views of the same subject, where the reader wants one of them at a time — a record’s details, its history, its files. Not to split a form into parts, where a reader has to fill in all of them and a wizard says so; and not for content anyone might want to search or print as a whole.',
        examples: [
            {
                title: 'Two tabs and their panels',
                why: 'The wiring is markup: each tab controls a panel and each panel names its tab. The module adds the roving tab order and the arrow keys, and nothing else.',
                markup: `
<div class="kp-tabs">
<div class="kp-tabs__list" role="tablist" aria-label="Application">
<button type="button" class="kp-tab" role="tab" id="doc-tab-0" aria-controls="doc-panel-0" aria-selected="true">Overview</button>
<button type="button" class="kp-tab" role="tab" id="doc-tab-1" aria-controls="doc-panel-1" aria-selected="false">History</button>
</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-0" aria-labelledby="doc-tab-0">Sent on 4 September, interview on the eleventh.</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-1" aria-labelledby="doc-tab-1" hidden>Three earlier applications to this company.</div>
</div>
`,
            },
            {
                title: 'Tabs that only select when you say so',
                why: 'With manual activation the arrows move focus and Enter or Space selects — the right choice when showing a panel is expensive, and the wrong one when it is free.',
                markup: `
<div class="kp-tabs">
<div class="kp-tabs__list" role="tablist" aria-label="Reports" data-kp-activation="manual" data-kp-loop="false">
<button type="button" class="kp-tab" role="tab" id="doc-tab-m0" aria-controls="doc-panel-m0" aria-selected="true">Summary</button>
<button type="button" class="kp-tab" role="tab" id="doc-tab-m1" aria-controls="doc-panel-m1" aria-selected="false">Full export</button>
</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-m0" aria-labelledby="doc-tab-m0">Twelve applications this quarter.</div>
<div class="kp-tabs__panel" role="tabpanel" id="doc-panel-m1" aria-labelledby="doc-tab-m1" hidden>Everything, as a table.</div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-tabs__list', what: 'The row, with a rule under it that the selected tab’s own rule sits on.' },
            { name: '.kp-tab', what: 'One tab: quiet ink until it is chosen.' },
            { name: 'selected', what: 'The page’s full ink, bold, and a coloured rule underneath — three carriers, and the selected state is what is announced.' },
            { name: 'automatic activation', what: 'The default: moving with the arrows selects as it goes.' },
            { name: 'manual activation', what: 'The arrows move focus only; Enter or Space selects.' },
            { name: 'looping', what: 'The arrows wrap from the last tab to the first, unless the list says not to.' },
            { name: '.kp-tabs__panel', what: 'The panel. Exactly one is visible; the others are hidden, which also takes them out of the search and the tab order.' },
        ],
        accessibility: [
            'Built in — a roving tab order, so Tab leaves the list rather than walking through every tab in it.',
            'Built in — the arrows, Home and End move between tabs, and the selection is reflected on the tab itself.',
            'Built in — every change of tab is an event, so a consumer can put the choice in the URL.',
            'Yours — write the roles and the pairing between tab and panel. The module drives markup that is already a tab list.',
            'Yours — name the tab list, and give each panel a label that is its tab.',
            'Yours — do not hide something behind a tab that the reader has to find by searching the page.',
        ],
    },
    {
        id: 'accordion',
        title: 'Accordion',
        group: 'Navigation',
        classes: ['kp-accordion'],
        exports: ['Accordion'],
        intro: 'Disclosure sections built on the browser’s own details element, so opening, closing and the keyboard come from the platform rather than from a hand-written toggle.',
        whenToUse:
            'For a long page of questions or optional detail the reader dips into. Not for content most readers need — anything folded away is missed and, in some browsers, not found by a search of the page. Not as tabs either: an accordion can have everything open at once, which is often the point.',
        examples: [
            {
                title: 'Two sections, one open',
                why: 'A details element is already keyboard-operable and its state is already announced; the classes only paint. The open attribute is the whole of the open state.',
                markup: `
<div class="kp-accordion">
<details class="kp-accordion__item" open>
<summary class="kp-accordion__summary">What is a theme?</summary>
<div class="kp-accordion__body">A block of tokens on the document, which every component reads.</div>
</details>
<details class="kp-accordion__item">
<summary class="kp-accordion__summary">What is a register?</summary>
<div class="kp-accordion__body">An optional stylesheet that adds a texture without changing the colours.</div>
</details>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-accordion__item', what: 'One section, with a rule under it so a stack of them reads as a list.' },
            { name: '.kp-accordion__summary', what: 'The header. It is the button, in bold, with the browser’s own marker.' },
            { name: '.kp-accordion__body', what: 'The content, in quiet ink, with room under it.' },
            { name: 'open', what: 'The browser’s own state; the React component can also keep one section open at a time.' },
        ],
        accessibility: [
            'Built in — the element is a real disclosure: Enter and Space open it, and its state is announced without a written role.',
            'Yours — write a summary that says what is inside; “more” tells the reader nothing.',
            'Yours — open the section that matters on arrival rather than leaving the page as a row of closed lids.',
            'Yours — do not fold away anything the reader must not miss.',
        ],
    },
    {
        id: 'menu',
        title: 'Dropdown menu',
        group: 'Navigation',
        classes: ['kp-menu', 'kp-popover'],
        exports: ['DropdownMenu'],
        intro: 'A list of actions on the popover layer, anchored under the control that opens it. The browser gives it light dismiss, Escape and focus return; the package gives it the looks and the anchor.',
        whenToUse:
            'For actions that belong to one thing and would crowd the row they sit in. Not for navigation, which reads better as links; not for a choice that changes a value, which is a select or a listbox; and not for more than a handful of entries, where a command palette or a page is kinder.',
        examples: [
            {
                title: 'A menu with a destructive entry',
                why: 'Anchor positioning puts the list under its button without either of them measuring the other, and the popover is the browser’s, so Escape and clicking away are free.',
                markup: `
<button type="button" class="kp-button" popovertarget="doc-menu" style="anchor-name: --doc-menu">Actions</button>
<div popover="auto" id="doc-menu" class="kp-popover" style="position-anchor: --doc-menu">
<ul class="kp-menu">
<li><button type="button" class="kp-menu__item">Edit</button></li>
<li><button type="button" class="kp-menu__item">Duplicate</button></li>
<li><hr class="kp-menu__separator" /></li>
<li><button type="button" class="kp-menu__item kp-menu__item--destructive">Delete</button></li>
</ul>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-popover', what: 'The floating surface: its own ground, a boundary, a maximum height it scrolls inside, and a position taken from its anchor.' },
            { name: '.kp-menu', what: 'The column of entries. It never wraps into a second column, whatever height it is given.' },
            { name: '.kp-menu__item', what: 'One entry: a real button that fills the row and wears no button chrome.' },
            { name: '.kp-menu__item--destructive', what: 'An entry in the destructive colour. It still needs a confirmation or an undo behind it.' },
            { name: '.kp-menu__separator', what: 'A rule between groups of entries.' },
            { name: 'hover', what: 'A wash of the page’s ink rather than the accent colour, so a highlighted row is quiet in every theme.' },
        ],
        accessibility: [
            'Built in — light dismiss, Escape and focus return are the browser’s, because a hand-written focus trap is how focus traps break.',
            'Built in — the list scrolls inside the popover instead of running off the bottom of the window.',
            'Yours — make every entry a real button or link; a div with a click handler is not reachable.',
            'Yours — name the trigger, and say when it opens a menu rather than acting.',
            'Yours — put a destructive entry behind the same confirmation you would give a destructive button.',
        ],
    },
    {
        id: 'dialog',
        title: 'Dialog',
        group: 'Navigation',
        classes: ['kp-dialog'],
        exports: ['Dialog'],
        intro: 'The browser’s own dialog element, painted. Opened as a modal it traps focus, closes on Escape and puts focus back where it came from — all three for free, which is why none of them is written here.',
        whenToUse:
            'For a decision that has to be made before anything else continues, and for a short form that would lose its context on its own page. Not for a message, which is an alert or a toast; not for anything long, because a dialog cannot be scrolled comfortably or printed; and not for something the reader may want to keep open while working.',
        examples: [
            {
                title: 'A button that opens a modal dialog',
                why: 'The trigger names the dialog by id and the module wires the two together. Escape closes it and focus returns to the button.',
                markup: `
<button type="button" class="kp-button" data-kp-dialog="doc-dialog">Delete application</button>
<dialog class="kp-dialog" id="doc-dialog">
<h2 class="kp-dialog__title">Delete this application?</h2>
<p class="kp-dialog__description">It disappears from your list. This cannot be undone.</p>
<div class="kp-dialog__actions">
<button type="button" class="kp-button" data-kp-dialog-close>Cancel</button>
<button type="button" class="kp-button kp-button--destructive" data-kp-dialog-close>Delete</button>
</div>
</dialog>
`,
            },
            {
                title: 'The parts, with the dialog left open',
                why: 'Printed open so the pieces can be seen at rest: the title, the description under it, the close in the corner and the actions at the end.',
                markup: `
<dialog class="kp-dialog" open>
<h2 class="kp-dialog__title">Invite a colleague</h2>
<p class="kp-dialog__description">They get an email with a link that expires in a week.</p>
<button type="button" class="kp-icon-button kp-dialog__close" aria-label="Close">×</button>
<div class="kp-field">
<label class="kp-field__label" for="doc-dialog-mail">Email</label>
<input class="kp-field__input" id="doc-dialog-mail" type="email" />
</div>
<div class="kp-dialog__actions">
<button type="button" class="kp-button">Cancel</button>
<button type="button" class="kp-button kp-button--primary">Send</button>
</div>
</dialog>
`,
            },
        ],
        variants: [
            { name: 'modal', what: 'The default: the rest of the page is inert behind a dimmed backdrop, focus is trapped, and Escape closes.' },
            { name: 'non-modal', what: 'Opened without inerting the page, for a panel that has to sit beside what it is about.' },
            { name: '.kp-dialog__title / __description', what: 'The heading and the sentence under it, which are also what name and describe the dialog.' },
            { name: '.kp-dialog__close', what: 'The close in the corner, on top of the padding rather than in the flow.' },
            { name: '.kp-dialog__actions', what: 'The buttons at the end, pushed to the trailing edge, primary last.' },
            { name: 'backdrop', what: 'A dimming rather than a theme colour: a tinted backdrop paints the page instead of pushing it back.' },
        ],
        accessibility: [
            'Built in — focus trapping, Escape and focus return come from the element itself, so they work the way the platform’s do.',
            'Built in — opening from a wired trigger is an event that says which trigger and whether it was modal, so a consumer can restore state.',
            'Yours — name the dialog with its title, and point it at its description.',
            'Yours — give every dialog a way out that is not Escape; a modal with only a submit is a trap on touch.',
            'Yours — keep it short. A dialog is not a page.',
        ],
    },
    {
        id: 'command-palette',
        title: 'Command palette',
        group: 'Navigation',
        classes: ['kp-palette'],
        exports: ['CommandPalette'],
        aliases: ['listbox', 'option', 'disabled', 'group', 'keys', 'generated', 'primary', 'match', 'hotkey', 'clear-on-close', 'close-on-run'],
        intro: 'A dialog with a filter box and a list of commands, opened by a key from anywhere on the page. The commands are markup a server wrote, not an array this module owns, so they are there before any script runs.',
        whenToUse:
            'In an application dense enough that a reader will want to jump rather than navigate — and only as a second route, never the only one. Not as a menu for three commands; not as a search over data, which is a search field with results.',
        examples: [
            {
                title: 'A palette, grouped, left open',
                why: 'Shown open so it can be looked at; in an application it opens on its key and closes when a command runs. The hotkey is turned off here so that this page does not take a key from your browser.',
                markup: `
<dialog class="kp-palette" data-kp-palette data-kp-hotkey="none" id="doc-palette" aria-label="Commands" open>
<input class="kp-palette__input" type="text" role="combobox" aria-label="Commands" aria-expanded="true" aria-controls="doc-palette-list" autocomplete="off" placeholder="Type a command…" />
<ul class="kp-palette__list" id="doc-palette-list" role="listbox" aria-label="Commands">
<li role="presentation" class="kp-palette__group" data-kp-group><span class="kp-palette__group-label">Applications</span>
<ul role="group" aria-label="Applications">
<li class="kp-palette__option" role="option" data-kp-option data-value="new">New application<span class="kp-palette__description">Start from an empty form</span><kbd class="kp-palette__keys" data-kp-keys="n">n</kbd></li>
<li class="kp-palette__option" role="option" data-kp-option data-value="import">Import from a file</li>
</ul></li>
<li role="presentation" class="kp-palette__group" data-kp-group><span class="kp-palette__group-label">Account</span>
<ul role="group" aria-label="Account">
<li class="kp-palette__option" role="option" data-kp-option data-value="theme">Change theme</li>
<li class="kp-palette__option" role="option" data-kp-option data-value="signout">Sign out</li>
</ul></li>
</ul>
<p class="kp-palette__status" role="status" aria-live="polite"></p>
</dialog>
`,
            },
        ],
        variants: [
            { name: '.kp-palette', what: 'The dialog: near the top rather than in the middle, so a list that grows downwards does not push its own input off centre.' },
            { name: '.kp-palette__input', what: 'The filter, at full width, with the list under it.' },
            { name: '.kp-palette__group / __group-label', what: 'Commands under a small heading. A group whose commands are all filtered out hides itself.' },
            { name: '.kp-palette__option', what: 'One command; is-active marks where the keyboard is.' },
            { name: '.kp-palette__description', what: 'A second line on a command, for one whose name is not enough.' },
            { name: '.kp-palette__keys', what: 'The key hint at the end of a row, which never competes with the label.' },
            { name: '.kp-palette__status', what: 'The live region that says how many commands are left after typing.' },
            { name: 'matching', what: 'The filter is subsequence matching by default — “nap” finds “new application” — and can be made a plain substring instead.' },
        ],
        accessibility: [
            'Built in — the dialog gives focus trapping, Escape and focus return, so the palette cannot strand the keyboard.',
            'Built in — virtual focus keeps the cursor in the input while the highlight moves, and the current command is announced.',
            'Built in — the number of matches is announced after typing.',
            'Yours — offer every command somewhere else as well. A palette is a shortcut, not an interface.',
            'Yours — write the commands as markup, with a value each, and name the groups.',
            'Yours — pick a key that is not already the browser’s, and say what it is somewhere visible.',
        ],
    },
    {
        id: 'shortcut-sheet',
        title: 'Shortcut sheet',
        group: 'Navigation',
        classes: ['kp-shortcuts'],
        exports: ['ShortcutSheet'],
        aliases: ['hotkey'],
        intro: 'The dialog that lists what the keys do — the page every application with shortcuts owes its readers, and the one that is usually a paragraph in a help centre.',
        whenToUse:
            'As soon as the application has keys worth learning. Not as the only place the keys appear: a shortcut is most useful printed next to the command it repeats, which is what the palette’s key hints are for.',
        examples: [
            {
                title: 'A sheet with two groups, left open',
                why: 'Shown open here; in an application it opens on its own key. The rows are a definition list, so each key is read together with what it does.',
                markup: `
<dialog class="kp-shortcuts" data-kp-shortcuts data-kp-hotkey="none" aria-label="Keyboard shortcuts" open>
<h2 class="kp-dialog__title">Keyboard shortcuts</h2>
<section class="kp-shortcuts__group">
<h3 class="kp-shortcuts__group-label">Anywhere</h3>
<dl class="kp-shortcuts__list">
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">Ctrl K</kbd></dt><dd>Open the commands</dd></div>
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">?</kbd></dt><dd>Show this sheet</dd></div>
</dl>
</section>
<section class="kp-shortcuts__group">
<h3 class="kp-shortcuts__group-label">In a list</h3>
<dl class="kp-shortcuts__list">
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">J</kbd></dt><dd>Next row</dd></div>
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">K</kbd></dt><dd>Previous row</dd></div>
</dl>
</section>
</dialog>
`,
            },
        ],
        variants: [
            { name: '.kp-shortcuts', what: 'The dialog, narrower than the palette because a key and a sentence need less room.' },
            { name: '.kp-shortcuts__list', what: 'The definition list, with room above and below.' },
            { name: '.kp-shortcuts__row', what: 'One pair: the keys in a fixed column, the description beside them in quiet ink.' },
            { name: '.kp-shortcuts__group-label', what: 'A small heading over a group of rows, for a sheet long enough to need sections.' },
        ],
        accessibility: [
            'Built in — the dialog gives the focus trap, Escape and focus return; the sheet adds nothing to them.',
            'Yours — mark the keys as keyboard input so they are read as keys.',
            'Yours — offer a way to open the sheet that is not itself a shortcut, or it can only be found by people who already know.',
            'Yours — keep the list current. A sheet that lies is worse than none.',
        ],
    },
    {
        id: 'skip-link',
        title: 'Skip link',
        group: 'Navigation',
        classes: ['kp-skip-link'],
        exports: [],
        aliases: ['skip'],
        intro: 'The first thing a keyboard user meets on a page: a link past the header and the navigation, invisible until it is focused and then unmissable.',
        whenToUse:
            'On every page with anything repeated before its content — a bar, a sidebar, a set of filters. There is no case for leaving it out; the only choice is where it lands, and the answer is the main content, not the first heading.',
        examples: [
            {
                title: 'The link and its target',
                why: 'It is out of sight until it takes focus, then it appears at the top corner. Tab into the box below to see it. The target takes focus itself, so the next Tab continues inside the content.',
                markup: `
<a class="kp-skip-link" href="#doc-skip-main">Skip to content</a>
<div id="doc-skip-main" tabindex="-1">The page’s content starts here.</div>
`,
            },
        ],
        variants: [
            { name: 'at rest', what: 'Off the top of the page, taking no space and reachable by nothing but the tab order.' },
            { name: 'focused', what: 'It drops into the top corner on the primary plate, above every other layer, with an underline.' },
        ],
        accessibility: [
            'Built in — it is above every other layer, so nothing sticky draws over it when it appears.',
            'Built in — the module moves focus to the target rather than only jumping the view, which is the half a bare anchor gets wrong.',
            'Yours — put it first in the document, before anything else focusable.',
            'Yours — point it at the main content; the module gives that element a focus target itself if it has none.',
            'Yours — keep the words plain. This one is read out of context by definition.',
        ],
    },
    {
        id: 'card',
        title: 'Card',
        group: 'Structure',
        classes: ['kp-card'],
        exports: ['Card'],
        intro: 'A raised surface with its own ground and ink: a title, a body, and optional slots for a header row, its actions and a footer. A raised surface is never darker than the one below it.',
        whenToUse:
            'To group what belongs together and to separate one record from the next in a grid or a list. Not as a box around everything — a page of cards inside cards has no hierarchy left — and not as a button: a card that is entirely clickable hides where the target is.',
        examples: [
            {
                title: 'Title and body',
                why: 'The smallest useful card. The body takes the quiet ink, which is what makes the title the title without a size change.',
                markup: `
<div class="kp-card">
<h3 class="kp-card__title">Example Inc</h3>
<p class="kp-card__body">Applied on 4 September; interview on the eleventh.</p>
</div>
`,
            },
            {
                title: 'With a header row, actions and a footer',
                why: 'The header lays the title and its controls on one baseline; the footer is separated by a rule rather than by distance alone, so it still reads as a footer in a dense list.',
                markup: `
<div class="kp-card">
<div class="kp-card__header">
<h3 class="kp-card__title">Example Inc</h3>
<div class="kp-card__actions">
<button type="button" class="kp-button kp-button--ghost">Edit</button>
<button type="button" class="kp-button">Open</button>
</div>
</div>
<p class="kp-card__body">Applied on 4 September; interview on the eleventh.</p>
<div class="kp-card__footer"><span class="kp-timestamp">Updated 2026-09-06 14:07</span></div>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-card', what: 'The surface: the card ground, a boundary, a rounded corner, and in one theme a hard shadow the knob paints and every other theme leaves at nothing.' },
            { name: '.kp-card__title', what: 'The heading, at body size — a card is not a page and its title is not a display line.' },
            { name: '.kp-card__body', what: 'The text, in quiet ink.' },
            { name: '.kp-card__header', what: 'A row that lays the title and its actions on one baseline and pushes them apart.' },
            { name: '.kp-card__actions', what: 'The controls in that row, spaced by the scale.' },
            { name: '.kp-card__footer', what: 'A closing row, separated by a rule and the scale’s own distance.' },
        ],
        accessibility: [
            'Built in — the card ground and its ink are a measured pair, so text on a card clears the contrast floor in every theme.',
            'Yours — use a real heading for the title if the card is a section of the page rather than one of many equal records.',
            'Yours — put the link or the button inside the card rather than making the whole card clickable.',
            'Yours — keep the reading order the source order; a card that reads bottom to top on a screen reader is a card laid out with the visual only in mind.',
        ],
    },
    {
        id: 'split-pane',
        title: 'Split pane',
        group: 'Structure',
        classes: ['kp-split'],
        exports: ['SplitPane'],
        aliases: ['orientation', 'collapse', 'large-step', 'step'],
        intro: 'Two panes with a separator between them that can be dragged, and moved with the arrow keys. One custom property drives the whole layout, so the pointer and the keyboard move the same thing.',
        whenToUse:
            'For a list beside a detail, or an editor beside its preview, where readers disagree about how much room each deserves. Not on a narrow screen, where two panes are two half-width columns; and not for a fixed proportion, which is a grid and needs no separator.',
        examples: [
            {
                title: 'A list beside a detail',
                why: 'The separator is a real separator with a value, minimum and maximum, so it is announced as a slider and moved with the arrows rather than only dragged.',
                markup: `
<div class="kp-split" data-kp-split>
<div class="kp-split__pane">
<p class="kp-fw-semibold">Applications</p>
<p>Example Inc</p>
<p>Second Ltd</p>
</div>
<div class="kp-split__separator" role="separator" tabindex="0" aria-orientation="vertical" aria-valuemin="10" aria-valuemax="90" aria-valuenow="50" aria-label="Resize the panes"></div>
<div class="kp-split__pane">
<p class="kp-fw-semibold">Example Inc</p>
<p>Applied on 4 September; interview on the eleventh.</p>
</div>
</div>
`,
            },
        ],
        variants: [
            { name: 'vertical separator', what: 'The default: two panes side by side, the separator moving left and right.' },
            { name: 'horizontal', what: 'The same control stacked, for an editor above its output.' },
            { name: 'collapsing', what: 'A double click on the separator can put a pane away and bring it back.' },
            { name: 'step / large step', what: 'How far one arrow press moves the divider, and how far a Page key does.' },
            { name: 'focused separator', what: 'It takes the focus ring inside its own edge, because a two-pixel bar has no room for a ring outside it.' },
        ],
        accessibility: [
            'Built in — the separator is in the tab order and the arrows move it, which is the half a drag-only splitter leaves out.',
            'Built in — each move is an event carrying the new percentage, so a consumer can store the arrangement.',
            'Yours — write the separator role with its value, minimum and maximum, and name it.',
            'Yours — decide what happens below a narrow width; two panes on a phone are two half-columns.',
            'Yours — keep both panes usable at their extremes, or set bounds that stop the reader from erasing one.',
        ],
    },
    {
        id: 'page-shell',
        title: 'Page shell',
        group: 'Structure',
        classes: ['kp-footer', 'kp-error'],
        exports: [],
        intro: 'The two pieces every application has and nobody designs: the footer under the content, and the page that says something went wrong.',
        whenToUse:
            'The footer wherever a page needs a quiet closing line — a version, a licence, a link to the source. The error page for the states a server returns rather than for a failed action inside a working page, which is an alert. Do not put navigation a reader needs only in the footer.',
        examples: [
            {
                title: 'An error page',
                why: 'A message, not a wall: the destructive colour names the failure in the heading, and the explanation stays in the ordinary ink at a readable measure.',
                markup: `
<div class="kp-error">
<h1>404</h1>
<p>This page does not exist. It may have been renamed, or the link may be older than the page.</p>
<a class="kp-button" href="#page-shell">Back to the start</a>
</div>
`,
            },
            {
                title: 'A footer',
                why: 'Quiet ink over a rule, with the page’s own outer distance, so it closes the page rather than starting a new region.',
                markup: `
<footer class="kp-footer">kp-themes · twenty-four themes, one set of tokens</footer>
`,
            },
        ],
        variants: [
            { name: '.kp-error', what: 'A centred column at a readable measure, with room above it.' },
            { name: '.kp-error h1', what: 'The heading in the destructive colour: the one place a whole page names a failure.' },
            { name: '.kp-footer', what: 'A rule above, quiet ink, and the same outer distance as the page.' },
        ],
        accessibility: [
            'Built in — the error heading takes a colour measured against the page, so it is not a red that only just reads.',
            'Yours — say what happened and what to do next; a number on its own is a code, not a message.',
            'Yours — send the right status from the server as well. The page is what the reader sees; the status is what everything else reads.',
            'Yours — use the footer element itself, so it is announced as one.',
        ],
    },
    {
        id: 'visually-hidden',
        title: 'Visually hidden',
        group: 'Structure',
        classes: ['kp-sr-only'],
        exports: [],
        intro: 'Text that is not drawn and is still announced. It is for the things a page says by looking, which are silent to anyone who is not looking.',
        whenToUse:
            'For a name a control needs but the layout cannot show, and for a change that is obvious on screen and silent otherwise. Not to hide anything a sighted reader also needs, and never to bury text for a search engine: this class is a promise that the words are true.',
        examples: [
            {
                title: 'A name for a control that shows a glyph',
                why: 'The word is read out and takes no room; the glyph is marked decorative so it is not announced beside it.',
                markup: `
<button type="button" class="kp-button kp-button--ghost"><span aria-hidden="true">⌫</span><span class="kp-sr-only">Remove this filter</span></button>
<label class="kp-sr-only" for="doc-hidden-search">Search applications</label>
<input class="kp-field__input" id="doc-hidden-search" type="search" placeholder="Search…" />
`,
            },
        ],
        variants: [
            { name: '.kp-sr-only', what: 'The only state. It keeps the text in the document and out of the picture: one pixel, clipped, and never with display taken away, which would take it out of the reading too.' },
        ],
        accessibility: [
            'Built in — the text stays in the accessibility tree; nothing here is hidden from a screen reader.',
            'Built in — the file input under an upload zone uses this rather than being hidden away, which is what keeps it in the tab order.',
            'Yours — prefer visible words. Hidden text is unread by everyone who is looking at the screen.',
            'Yours — do not put a focusable control inside it unless it becomes visible when focused, as the skip link does.',
        ],
    },
];
