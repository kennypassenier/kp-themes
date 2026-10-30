// Page descriptor for the "autosize" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const autosizeDescriptor = {
        id: 'autosize',
        title: 'Growing text box',
        group: 'Forms',
        classes: ['kp-autosize'],
        aliases: ['resize'],
        exports: [],
        intro: 'A multiline field that is as tall as its text, from its least rows up to a cap, then scrolls inside. An opt-in attribute on the existing field: nothing that already exists changes. It measures on input, paste, a script writing the value, a change of width and a font arriving, and it never animates its height.',
        whenToUse: 'A message, a note or a pasted mail, where the whole text should be seen and the Save button should stay in reach. For code or JSON, the JSON box uses the same growth.',
        examples: [
            {
                title: 'A message box',
                why: 'The attribute is all it takes; rows is the least height and 20 lines is the most.',
                markup: `
<div class="kp-field">
<label class="kp-field__label" for="msg">Message</label>
<textarea class="kp-field__input kp-field__input--multiline" id="msg" rows="3" maxlength="4000" data-kp-autosize data-kp-counter="chars"></textarea>
</div>
`,
            },
            {
                title: 'A cap, a counter, a draft and a send key',
                why: '`data-kp-autosize-max="5"` stops the growth at five lines and the box scrolls inside from there; `rows` is the least. `data-kp-counter="both"` writes an exact count under the box, and with `maxlength` it reads “312 of 400”, in a warning tone from 90 %. `data-kp-autosize-shrink="off"` keeps the tallest height, `data-kp-resize="none"` removes the drag handle, `data-kp-remember` keeps an unsent draft on this device until the form is sent, and `data-kp-submit-key="mod-enter"` makes Ctrl or Command with Enter submit the form (the shortcut sheet lists it). `kp-autosize-resize` carries `{ height, lines, capped }` whenever the height changes.',
                markup: `
<form id="doc-autosize-form" class="kp-stack">
<div class="kp-field">
<label class="kp-field__label" for="doc-autosize-note">Reply</label>
<textarea class="kp-field__input kp-field__input--multiline" id="doc-autosize-note" name="note" rows="2" maxlength="400" data-kp-autosize data-kp-autosize-max="5" data-kp-autosize-shrink="off" data-kp-resize="none" data-kp-counter="both" data-kp-submit-key="mod-enter" data-kp-remember="doc-autosize-draft">Hello, thank you for the invitation. I can join on Friday at 10:00 and bring the signed contract. Please let me know whether the room is booked, and whether parking is free for visitors. I will also bring the two printed copies you asked for, and my laptop in case the projector needs a different cable. Kind regards, Kenny</textarea>
</div>
<div class="kp-row"><button class="kp-button kp-button--primary" type="submit">Send</button><span class="kp-text-muted" id="doc-autosize-log" aria-live="polite">Press Ctrl+Enter to send.</span></div>
</form>
`,
                script: `
const form = document.getElementById('doc-autosize-form');
const note = document.getElementById('doc-autosize-note');
const log = document.getElementById('doc-autosize-log');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    log.textContent = 'Sent ' + note.value.length + ' characters.';
});
note.addEventListener('kp-autosize-resize', (event) => {
    log.textContent = event.detail.lines + ' lines' + (event.detail.capped ? ', at the cap' : '') + '.';
});
`,
            },
            {
                title: 'Loading, a failed save, off with a reason and a fixed engine',
                why: '`setAutosizeState(el, "loading")` lays the busy card over the box at its least height and makes it read-only; `setAutosizeState(el, "error", sentence)` keeps the text and the height and writes the sentence in the field’s error line; `"ready"` puts it back. A disabled box grows to show its whole value and says why through `data-kp-disabled-reason`. `data-kp-autosize-engine` is `auto` (the browser’s own `field-sizing` where it has it), `css` or `js`; `refreshAutosize(el)` measures again after a script wrote a value some other way.',
                markup: `
<div class="kp-stack">
<div class="kp-field">
<label class="kp-field__label" for="doc-autosize-load">Message being fetched</label>
<textarea class="kp-field__input kp-field__input--multiline" id="doc-autosize-load" rows="3" data-kp-autosize></textarea>
</div>
<div class="kp-field">
<label class="kp-field__label" for="doc-autosize-fail">Message that did not save</label>
<textarea class="kp-field__input kp-field__input--multiline" id="doc-autosize-fail" rows="3" data-kp-autosize data-kp-autosize-engine="js">Meet at the station at 09:30.</textarea>
</div>
<div class="kp-field">
<label class="kp-field__label" for="doc-autosize-off">Locked message</label>
<textarea class="kp-field__input kp-field__input--multiline" id="doc-autosize-off" rows="2" data-kp-autosize disabled data-kp-disabled-reason="The thread was closed on 12/10/2026.">This thread was closed. The final answer was sent on 12/10/2026, and every attachment was archived with it, so nothing more can be added here.</textarea>
</div>
</div>
`,
                script: `
import { attachAutosize, setAutosizeState } from '@kp-soft/themes/js/autosize';

attachAutosize(document.getElementById('doc-autosize-load').closest('.kp-stack'));
setAutosizeState(document.getElementById('doc-autosize-load'), 'loading');
setAutosizeState(document.getElementById('doc-autosize-fail'), 'error', 'The message could not be saved. Try again.');
`,
            },
        ],
        variants: [
            { name: 'data-kp-autosize', what: 'Present: on. `off`: off. Existing fields never change by themselves.' },
            { name: 'data-kp-autosize-max', what: 'The most lines (20 by default) or `none`; beyond it the box scrolls inside.' },
            { name: 'data-kp-autosize-engine', what: '`auto` (default: the browser\'s own `field-sizing` where it has it), `css` or `js`.' },
            { name: 'data-kp-autosize-shrink', what: '`on` (default) gives the height back when text is deleted; `off` keeps the tallest.' },
            { name: 'data-kp-resize', what: '`vertical` (default) or `none`: the drag handle.' },
            { name: 'data-kp-counter', what: '`off` (default), `chars`, `lines` or `both`: an exact count under the box; with `maxlength` it reads "1,204 of 4,000".' },
            { name: 'data-kp-submit-key', what: '`mod-enter`: Ctrl or Command with Enter sends the form, and the shortcut sheet lists it.' },
            { name: 'data-kp-remember', what: 'A name: an unsent draft is kept on this device and cleared when the form is sent.' },
            { name: 'data-kp-state', what: '`loading` lays the busy card over the box and makes it read-only; `error` keeps the text and writes the sentence in the error line.' },
        ],
        accessibility: [
            'Built in — the field stays a native textarea; the counter is announced politely only at 90 % and 100 % of the limit; a disabled box says why through `data-kp-disabled-reason`.',
            'Yours — label the box and give the failed state a sentence that says what to do.',
        ],
    };
