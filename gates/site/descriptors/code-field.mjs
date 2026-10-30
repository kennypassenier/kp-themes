// Page descriptor for the "code-field" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const codeFieldDescriptor = {
        id: 'code-field',
        title: 'Code field',
        group: 'Forms',
        classes: ['kp-codefield'],
        exports: [],
        aliases: ['code-field', 'code-check', 'code-indent', 'code-gutter', 'code-wrap', 'code-block'],
        intro: 'A text box for a configuration file (YAML, TOML, INI): line numbers, “Line 3, column 12 · YAML” under the caret, Tab that indents, and the line a problem is on marked in the gutter with its sentence under the field. It does not parse: the page, or its server, says what is wrong and the field draws it. It wears the JSON field’s look in every theme.',
        whenToUse: 'Editing a file that is lines of text. For JSON use the JSON field, which parses by itself; for read-only code use the code block.',
        examples: [
            {
                title: 'A YAML file with the page’s own check',
                why: 'The field fires `kp-code-field-check` 300 ms after typing stops, on blur and once at attach; the handler calls `event.detail.error(line, column, message)` when it finds a problem. A server that answers later calls `setCodeFieldError(area, line, column, message)`; `setCodeFieldError(area, null)` takes the mark back. The form is held back while a problem stands (`data-kp-code-block=\"false\"` lets it through).',
                markup: `
<div class="kp-field">
<label class="kp-field__label" for="doc-code-field">Compose file</label>
<textarea class="kp-field__input kp-field__input--multiline" id="doc-code-field" name="compose" data-kp-code-field="yaml" rows="6">services:
  web:
    image: nginx
   ports: ["80:80"]</textarea>
</div>
`,
                script: `
import { attachCodeFields, setCodeFieldError } from '@kp-soft/themes/js/code-field';

const area = document.getElementById('doc-code-field');
attachCodeFields(area.closest('.kp-field'));
area.addEventListener('kp-code-field-check', (event) => {
    const lines = event.detail.value.split('\\n');
    const bad = lines.findIndex((line) => /^ {3}\\S/.test(line));
    if (bad >= 0) event.detail.error(bad + 1, 4, 'bad indentation of a mapping entry');
});
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachCodeFields(root)` wires every `textarea[data-kp-code-field]` and returns a detach; `setCodeFieldError(area, line, column, message)` marks a problem (`null` for the line takes it back); `codeField(area)` is the handle (`position()`, `setError()`, `check()`, `state()`); `caretPosition(text, offset)` is the pure calculation. `CODE_FIELD` is the selector.' },
            { name: 'events', what: '`kp-code-field-check` `{ value, language, error(line, column, message) }`, `kp-code-field-state` `{ state, line, column, message }` and `kp-code-field-caret` `{ line, column }`, bubbling from the textarea.' },
            { name: 'data-kp-code-field', what: 'The language’s name, printed in the readout (`yaml`, `toml`, `ini`, any word).' },
            { name: 'data-kp-code-check', what: '`input` (default, debounced) or `blur`.' },
            { name: 'data-kp-code-indent', what: '`2` (default), `4` or `tab`: what Tab writes.' },
            { name: 'data-kp-code-gutter', what: '`false` takes the line numbers away.' },
            { name: 'data-kp-code-wrap', what: 'Long lines wrap and the gutter follows; by default they scroll inside the field.' },
            { name: 'data-kp-code-block', what: '`false`: a problem does not hold the form back.' },
            { name: 'states', what: 'Ready (the readout only), invalid (the line in the gutter, the sentence under the field, `aria-invalid`, the form held back), disabled or read-only (the tools stand still, copy still works).' },
        ],
        accessibility: [
            'Built in — the textarea is described by the readout, the problem and the Tab hint; Esc then Tab leaves the field; the problem is a status line that is read once.',
            'Yours — word the problem in plain words and give the real line and column.',
        ],
    };
