// Page descriptor for the "json-field" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const jsonFieldDescriptor = {
        id: 'json-field',
        title: 'JSON field',
        group: 'Forms',
        classes: ['kp-jsonfield'],
        exports: [],
        aliases: ['json'],
        intro: 'A text box that knows JSON. It checks the text while it is typed, says what is wrong and where (“Line 3, column 12: expected ‘,’”) with the line marked in a gutter of line numbers, formats and minifies on request, and holds the form back while the JSON is broken.',
        whenToUse: 'A field that takes a message body, action arguments or a settings blob. For showing JSON read-only use the code block.',
        examples: [
            {
                title: 'A strict body field',
                why: 'The attribute goes on an ordinary multiline field; the script adds the gutter, the Format and Minify buttons and the status line.',
                markup: `
<div class="kp-field">
<label class="kp-field__label" for="hook-body">Message body</label>
<textarea class="kp-field__input kp-field__input--multiline" id="hook-body" name="body" data-kp-json="strict" placeholder='{"topic":"backup.done"}'>{"topic":"backup.done","ok":true}</textarea>
</div>
`,
            },
            {
                title: 'Broken JSON, said where',
                why: 'The field checks while it is typed. Here the value is cut off after the colon: the line says what is wrong and where, and the gutter marks that line. A form that holds the field stays held back until the text parses.',
                markup: `
<div class="kp-field">
<label class="kp-field__label" for="doc-json-broken">Action arguments</label>
<textarea class="kp-field__input kp-field__input--multiline" id="doc-json-broken" name="arguments" data-kp-json="strict" data-kp-json-indent="4">{
    "topic": "backup.done",
    "ok":
}</textarea>
</div>
`,
            },
        ],
        variants: [
            { name: 'explainJson(text)', what: 'The check on its own (js/json-field.js): answers `{ ok: true, value }` or `{ ok: false, why, line, column }` in one wording whatever the engine says, so a page can word the same fault in its own validation.' },
            { name: 'data-kp-json', what: '`strict` (default: text that is not JSON blocks the form) or `allow-text` (it may be sent, and the line says so). Decided per field.' },
            { name: 'data-kp-json-check', what: '`input` (default, debounced 300 ms) or `blur`.' },
            { name: 'data-kp-json-format', what: '`button` (default: Format and Minify beside the field), `on-blur` or `off`.' },
            { name: 'data-kp-json-indent', what: '`2` (default), `4` or `tab`.' },
            { name: 'data-kp-json-gutter', what: 'On by default; `false` takes the line numbers away.' },
            { name: 'data-kp-json-wrap', what: 'Long lines wrap and the gutter follows; by default they scroll inside the field.' },
            { name: 'data-kp-json-schema', what: 'A URL or inline JSON handed to the page in `kp-json-validate`, whose handler may refuse a value that parses.' },
        ],
        accessibility: [
            'Built in — the message sits in a status line tied to the field with `aria-describedby`; Tab indents, Shift+Tab takes one indent off, Esc then Tab leaves the field, so the keyboard is never trapped; Mod+Shift+F formats.',
            'Yours — label the field, and decide per field whether text that is not JSON may be sent.',
        ],
    };
