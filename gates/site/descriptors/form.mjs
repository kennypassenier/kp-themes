// Page descriptor for the "form" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const formDescriptor = {
        id: 'form',
        title: 'Form',
        group: 'Forms',
        classes: ['kp-form', 'kp-addrow'],
        exports: ['Form', 'FormField'],
        aliases: ['field', 'submit', 'busy', 'focus-summary', 'validate-on', 'revalidate-on', 'addrow', 'addrow-for', 'addrow-column', 'addrow-submit-column', 'addrow-labels', 'addrow-name', 'addrow-enter', 'addrow-stacked', 'addrow-refusal', 'addrow-add', 'addrow-added', 'error-icon'],
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
            { name: '.kp-field__error: role and icon', what: 'showError gives the message `role="status"` (unless it has one), so it is said once as it appears [forms-1102]. With `data-kp-error-icon` on the message or an element round it (`<html>` for an app), and in every add row, it starts with a round “!” on the destructive plate, the words on a hanging indent.' },
            { name: 'data-kp-addrow', what: 'The add row [forms-1102] (js/add-row.js): a kit form that adds one line. Over a data table (`data-kp-addrow-for`) each `.kp-addrow__cell` stands under the column `data-kp-addrow-column` names, the Add button (`.kp-addrow__submit`) under `data-kp-addrow-submit-column` or the last free column; under the table’s cards it stacks (`data-kp-addrow-stacked`). In a form grid `.kp-addrow--line` is one line: name and unit in the control track, Add in the actions track, the refusal under them. `kp-addrow-add` `{ values, data, waitUntil }`, then `kp-addrow-added`; a refusal is said in `[data-kp-addrow-refusal]`.' },
            { name: 'data-kp-addrow-labels', what: 'On the add row, `show`: the field labels stay shown over their fields when the row is not stacked [kit1-1103]. Default: the labels are for screen readers only, the table’s column words naming the fields. The Add button drops to the fields’ line.' },
            { name: 'data-kp-addrow-name', what: 'On the add row: the name of the field whose value names the line in the “Added x” status [kit1-1103]. Default (or an empty value): the first filled value, which may be an id or a date.' },
            { name: 'data-kp-addrow-enter', what: 'On the add row, `submit`: a plain Enter on a CLOSED select adds the line instead of opening its list [enter-1103]. The list then opens with Space, Alt+Down, the arrows or typing, and an open list still picks its option with Enter. Default: Enter opens the list. Keyboard, always on: Ctrl+Enter (Cmd+Enter on macOS) adds the line from any field of the row, a select and an open list included; plain Enter keeps its meaning everywhere.' },
            { name: '.kp-form', what: 'The column: fields stacked with one distance between them.' },
            { name: '.kp-form__summary', what: 'The error summary. It is a focus target rather than a banner, because a message that appears above the fold is invisible to someone whose focus is at the bottom.' },
            { name: '.kp-form__summary-title', what: 'The line that says what the summary is, in words, above the list of failing fields.' },
            { name: 'busy', what: 'While a save is in flight the form marks itself, so a consumer can disable what it wants to; the outcome is reported back through the callback the event hands over.' },
            { name: 'server errors', what: 'Errors a server found are handed in and shown in the same places as the browser’s own, rather than in a second mechanism beside them.' },
            { name: 'data-kp-form-native-submit', what: 'A valid submit is prevented by default (a behaviour change for every consumer): the page answers `submit`. `data-kp-form-native-submit` on the form, or `nativeSubmit` in the options, brings the browser’s own submit back.' },
        ],
        accessibility: [
            'Built in — the browser’s own popups are turned off and its validation kept: the message is put in the page instead, where it can be styled, read and left standing.',
            'Built in — a failed submit moves focus to the summary, and each entry in it moves focus to the field it names.',
            'Built in — every field that fails is marked invalid and pointed at its message, so it is announced rather than only coloured.',
            'Yours — give each control a name and the constraint that describes it; that is what the browser validates.',
            'Yours — repeat the validation on the server. This is what the reader sees, not what protects the data.',
            'Yours — keep the submit a real submit button, or the form cannot be sent with the keyboard.',
            'Yours — a valid submit is prevented by default; listen for the form’s submit and send it yourself, or choose the native submit.',
        ],
    };
