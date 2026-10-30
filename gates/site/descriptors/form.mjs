// Page descriptor for the "form" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const formDescriptor = {
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
