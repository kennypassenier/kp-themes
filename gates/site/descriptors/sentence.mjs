// Page descriptor for the "sentence" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const sentenceDescriptor = {
        id: 'sentence',
        title: 'Sentence form',
        group: 'Forms',
        classes: ['kp-sentence'],
        exports: [],
        aliases: ['block', 'hidden-off', 'invalid', 'narrow', 'own-line', 'own-line-ratio', 'show-when', 'was-enabled'],
        intro: 'A form that reads as a sentence: the fields (an input, a select, a combobox, the weekday picker) stand inside the words, an underline in the primary colour, so you read what will happen as you fill it in. The sentence wraps like text and a field too wide for the line takes a line of its own.',
        whenToUse: 'A short rule or schedule that is best read as one sentence (“Run backup on nextcloud every Monday at 03:00”). For an ordinary list of fields use the field rows.',
        examples: [
            {
                title: 'A schedule that reads as a sentence',
                why: 'Each control carries its own `aria-label`; the words round it are not its label. A phrase with `data-kp-show-when="field=value"` shows only then: here the weekday picker is only there when it runs weekly, and a hidden phrase is `hidden` and `inert`, its controls disabled, so it is neither tabbed to nor submitted. A field that is a `data-kp-block` always takes a line of its own. A status region says the whole sentence in words after a change; `sentenceSummary(el)` reads the same text, and `kp-sentence-change` fires with it. Enter in the last field submits the form.',
                markup: `
<form class="kp-sentence" id="doc-sentence" data-kp-sentence>
    <p class="kp-sentence__text">
        Run <span class="kp-sentence__field"><select name="job" aria-label="What to run"><option>backup</option><option>cleanup</option></select></span>
        on <span class="kp-sentence__field"><select name="stack" aria-label="On which stack"><option>nextcloud</option><option>media</option></select></span>
        <span class="kp-sentence__field"><select name="how" aria-label="How often"><option value="once">once</option><option value="weekly" selected>every week</option></select></span><span class="kp-sentence__when" data-kp-show-when="how=weekly"> on <span class="kp-sentence__field" data-kp-block><span class="kp-weekdays" data-kp-weekdays data-kp-value="1" aria-label="On which days"></span></span></span>
        at <span class="kp-sentence__field"><input name="at" size="5" value="03:00" aria-label="At (HH:MM)" /></span>.
    </p>
    <p class="kp-field__error" id="doc-sentence-why" hidden></p>
</form>
<p class="kp-text-muted" id="doc-sentence-said" role="status"></p>
`,
                script: `
import { attachSentences, sentenceSummary, setSentenceInvalid } from '@kp-soft/themes/js/sentence';
import { attachWeekdays } from '@kp-soft/themes/js/weekdays';

const form = document.getElementById('doc-sentence');
attachWeekdays(form);
attachSentences(form.parentElement);
const said = document.getElementById('doc-sentence-said');
said.textContent = sentenceSummary(form);
form.addEventListener('kp-sentence-change', (event) => {
    said.textContent = event.detail.summary;
    const at = form.elements.at.value;
    if (/^([01]\\d|2[0-3]):[0-5]\\d$/.test(at)) setSentenceInvalid(form, 'at', '');
    else setSentenceInvalid(form, 'at', 'Write the time as HH:MM, for example 03:00.');
});
form.addEventListener('submit', (event) => event.preventDefault());
`,
            },
            {
                title: 'Boxed, medium, stacked on a narrow screen, and loading fields',
                why: '`data-kp-look="boxed"` draws each field as a box instead of an underline and `data-kp-sentence-size="md"` sets the text at 1rem. `data-kp-narrow` is `wrap` (default: the sentence runs on over several lines), `stack` (every field on its own line below 30rem) or `flow` (never). A field whose natural width is more than `data-kp-own-line-ratio` of the line takes a line of its own. `setSentenceFieldState(field, "loading")` shows a field’s own skeleton at the width it had, so the sentence does not reflow when its choices arrive; `setSentenceWhy` writes the line that names what is wrong; `data-kp-disabled-reason` on a disabled fieldset says why it is off.',
                markup: `
<fieldset class="kp-sentence" id="doc-sentence-boxed" data-kp-sentence data-kp-look="boxed" data-kp-sentence-size="md" data-kp-narrow="stack" data-kp-own-line-ratio="0.5">
    <p class="kp-sentence__text">
        Move <span class="kp-sentence__field"><input name="count" size="3" value="12" aria-label="How many files" /></span> files to
        <span class="kp-sentence__field" id="doc-sentence-loading-field"><select name="where" aria-label="Where to"><option>archive</option></select></span>.
    </p>
</fieldset>
`,
                script: `
import { attachSentences, setSentenceFieldState } from '@kp-soft/themes/js/sentence';

attachSentences(document.getElementById('doc-sentence-boxed').parentElement);
setSentenceFieldState(document.getElementById('doc-sentence-loading-field'), 'loading');
`,
            },
        ],
        variants: [
            { name: 'data-kp-disabled-reason', what: 'On a disabled fieldset: the sentence that says why the whole sentence is off.' },
            { name: 'sentence / sentenceSummary', what: '`sentence(el)` is the handle of a form; `sentenceSummary(el)` the sentence in words, as the status region says it.' },
            { name: 'setSentenceInvalid / setSentenceWhy / setSentenceFieldState', what: '`setSentenceInvalid(el, name, why)` marks a control and writes the line under the sentence; `setSentenceWhy(el, text)` writes the line alone; `setSentenceFieldState(field, "loading")` shows the field’s skeleton at the width it had.' },
            { name: 'data-kp-look', what: '`underline` (default) or `boxed`.' },
            { name: 'data-kp-sentence-size', what: '`lg` (default, 1.125rem on a 2.4 line) or `md`.' },
            { name: 'data-kp-narrow', what: '`wrap` (default), `stack` or `flow`: what a narrow screen does.' },
            { name: 'data-kp-own-line-ratio', what: 'How much of the line a field may take before it goes on a line of its own; 0.7.' },
            { name: 'data-kp-show-when', what: 'On a phrase: `field=value`; the phrase shows only then.' },
            { name: 'data-kp-block', what: 'On a field: always a line of its own.' },
            { name: 'the computed field', what: '`.kp-sentence__computed` (`data-kp-sentence-computed`) shows a value worked out from the other fields: `attachSentences(root, { computed })`, `sentence().compute()` and `setSentenceComputed()` fill it. It is not a control and is not submitted.' },
        ],
        accessibility: [
            'Built in — a status region says the whole sentence after a change; a hidden phrase is inert and its controls are disabled; an invalid control is marked and described by the line that names it.',
            'Yours — an `aria-label` on every control (“At”, “How often”): the sentence words are not labels.',
        ],
    };
