// Page descriptor for the "flash" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const flashDescriptor = {
        id: 'flash',
        title: 'Flash button',
        group: 'Forms',
        classes: ['kp-flash'],
        exports: [],
        aliases: ['failed-word', 'method', 'post', 'post-body', 'refusal', 'refused-word', 'reload', 'reload-target', 'width'],
        intro: 'A button that shows its result for a moment: the theme’s spinner while the work runs, then a short word (“Sent”, “Copied”, “Refused”), then its own words again. It never changes width, because every face it can show shares one grid cell, so the row beside it does not re-flow under the pointer.',
        whenToUse: 'A button whose work takes a moment and has a short answer: send a test, copy, save. For a result that needs reading use the toast; for work that can be undone use the undo toast.',
        examples: [
            {
                title: 'Send a test',
                why: 'The width holds the widest word in `data-kp-flash-words`. A refusal shows its short word on the button and the whole sentence in a line right under it, until the next press.',
                markup: `
<button class="kp-button" type="button" data-kp-flash-button data-kp-flash-words="Sent,Refused">Send test</button>
`,
                script: `
import { attachFlashButtons, runFlashButton } from '@kp-soft/themes/js/flash';

const button = document.querySelector('[data-kp-flash-button]');
attachFlashButtons(button.parentElement);
button.addEventListener('click', () => runFlashButton(button, async () => {
    await new Promise((done) => setTimeout(done, 800));
    return 'Sent';
}));
`,
            },
            {
                title: 'Where a refusal is told, and the words a button says',
                why: 'The work answers `{ error, remedy }` for a refusal: the button shows its short word (`data-kp-refused-word`) and the sentence stands where `data-kp-refusal` says. `line` (the default) writes it in a line right under the button, until the next press; `button` lets the button grow to hold it; `toast` sends it to the toast. `data-kp-busy-label` writes a word beside the spinner, `data-kp-flash-word` is the success word, `data-kp-flash-ms` and `data-kp-flash-error-ms` set how long a result stays, and `data-kp-flash-line` names the element that holds the line. Every press fires `kp-flash` with `{ state, ok, word, line }`, the state being `busy`, `success`, `refused` or `rest`.',
                markup: `
<div class="kp-stack" id="doc-flash-box">
<div><button class="kp-button" type="button" data-kp-flash-button data-kp-refusal="line" data-kp-flash-word="Sent" data-kp-refused-word="Refused">Send to the client</button></div>
<div><button class="kp-button" type="button" data-kp-flash-button data-kp-refusal="button" data-kp-flash-error-ms="4000">Save the settings</button></div>
<div><button class="kp-button" type="button" data-kp-flash-button data-kp-refusal="toast" data-kp-busy-label="Copying" data-kp-flash-word="Copied" data-kp-flash-ms="2500">Copy the key</button></div>
<div><button class="kp-button" type="button" data-kp-flash-button data-kp-flash-line="#doc-flash-line">Export</button></div>
<p class="kp-text-muted" id="doc-flash-line" aria-live="polite"></p>
<p class="kp-text-muted" id="doc-flash-log" aria-live="polite">The first and second buttons are refused, the third copies, the fourth exports.</p>
</div>
`,
                script: `
import { runFlashButton } from '@kp-soft/themes/js/flash';

const [send, save, copy, exportAll] = document.querySelectorAll('#doc-flash-box [data-kp-flash-button]');
const wait = (ms) => new Promise((done) => setTimeout(done, ms));
send.addEventListener('click', () => runFlashButton(send, async () => {
    await wait(700);
    return { error: 'The client refused the test message.', remedy: 'Check that it is switched on, then send again.' };
}));
save.addEventListener('click', () => runFlashButton(save, async () => {
    await wait(700);
    return { error: 'Retention must be 365 days or fewer.', word: 'Too long' };
}));
copy.addEventListener('click', () => runFlashButton(copy, async () => { await wait(500); }));
exportAll.addEventListener('click', () => runFlashButton(exportAll, async () => {
    await wait(900);
    return { word: 'Exported 48 files', line: 'The export is in your downloads.' };
}));
document.addEventListener('kp-flash', (event) => {
    if (event.detail.state === 'success' || event.detail.state === 'refused') {
        document.getElementById('doc-flash-log').textContent = 'The button said “' + event.detail.word + '” (' + event.detail.state + ').';
    }
});
`,
            },
            {
                title: 'Posting to the server with no script of your own',
                why: '`data-kp-post` is the chassis pattern: pressing the button sends the request (`data-kp-method` is POST unless it says otherwise, `data-kp-post-body` is its JSON body) and shows the answer. A success shows `data-kp-flash-word`, and a `message` in the answer’s JSON is written in the line. A failing status is a refusal with the answer’s `error` and `remedy`. `data-kp-reload` is `none` (the default), `page` (the page is read again) or `region`, which fires `kp-flash-reload` with `{ target }` for the region named by `data-kp-reload-target`. Here a stand-in answers the two addresses; a real page has a server.',
                markup: `
<div class="kp-row">
<button class="kp-button" type="button" data-kp-post="/api/doc-flash/test" data-kp-post-body="{&quot;client&quot;:7}" data-kp-flash-word="Sent" data-kp-reload="region" data-kp-reload-target="#doc-flash-region">Send a test</button>
<button class="kp-button" type="button" data-kp-post="/api/doc-flash/busy" data-kp-method="PUT">Start the backup</button>
</div>
<p class="kp-text-muted" id="doc-flash-region" aria-live="polite">Region: not read again yet.</p>
`,
                script: `
// A stand-in for the server, so the example answers without one.
const realFetch = window.fetch.bind(window);
window.fetch = (url, init) => {
    const path = String(url);
    if (path === '/api/doc-flash/test') {
        return new Promise((done) => setTimeout(() => done(Response.json({ message: 'Test message sent to 3 clients.' })), 700));
    }
    if (path === '/api/doc-flash/busy') {
        return Promise.resolve(Response.json({ error: 'A backup is already running.', remedy: 'Wait until it has finished.' }, { status: 409 }));
    }
    return realFetch(url, init);
};
document.addEventListener('kp-flash-reload', (event) => {
    document.querySelector(event.detail.target).textContent = 'Region: read again.';
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-flash-button', what: 'Marks the button; the script gives it its faces.' },
            { name: 'data-kp-busy-label', what: 'A word beside the spinner while busy; none by default, so nothing widens.' },
            { name: 'data-kp-flash-ms', what: 'How long a success stays; 1500.' },
            { name: 'data-kp-flash-error-ms', what: 'How long a refusal’s word stays; 3000.' },
            { name: 'data-kp-flash-word', what: 'The success word; “Done” by default.' },
            { name: 'data-kp-flash-words', what: 'Every word the button may say, comma separated, so the width holds them all.' },
            { name: 'data-kp-width', what: '`keep` (default) or `grow`.' },
            { name: 'data-kp-refusal', what: '`line` (default: the sentence under the button), `button` (the button grows to hold it) or `toast`.' },
            { name: 'data-kp-flash-line', what: 'A selector for the element that holds the line; one is made after the button by default.' },
            { name: 'data-kp-post', what: 'A URL: pressing the button POSTs there and shows the answer. With `data-kp-method`, `data-kp-post-body` and `data-kp-reload` (`none`, `page` or `region`, the region named by `data-kp-reload-target`).' },
            { name: 'data-kp-width="grow"', what: 'Set by hand, `grow` makes the button as wide as what it says: its own words at rest and busy, the result’s width while the result stands. A width set by hand stays after a refusal on the button.' },
        ],
        accessibility: [
            'Built in — a second press while busy does nothing; the result is announced politely whatever its length; the busy state is `aria-disabled`, so the focus stays.',
            'Yours — answer a refusal with `{ error, remedy }`, so the sentence says what is wrong and what to do now.',
        ],
    };
