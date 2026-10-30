// Page descriptor for the "secret" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const secretDescriptor = {
        id: 'secret',
        title: 'Secret field',
        group: 'Data',
        classes: ['kp-secret'],
        exports: [],
        aliases: ['secret'],
        intro: 'A token, a password or a key, shown as a mask, shown in full on request for a few seconds and then hidden again, and copied without being shown. `attachPatterns()` (js/patterns.js, also through js/auto.js) builds what the markup leaves out: the value box, Reveal and Copy, and one line under them for the countdown, the reason the field is off, or why it could not be read. The value is read when it is needed (`kp-secret-request`, or the `secretLoad` option), so it is in the page only while it is shown; `revealSecret(field)` and `hideSecret(field)` do what the button does.',
        whenToUse:
            'For a value a person must sometimes read or paste but should not see by accident: an API token, a client secret, a password a service generated. Not for an identifier everyone may see (use the copyable value).',
        examples: [
            {
                title: 'A token that hides itself after 30 seconds',
                why: 'The markup is the empty field; the script builds the mask, the buttons and the line under them, which always keeps its room so nothing moves when it fills.',
                markup: `
<div class="kp-secret" data-kp-secret data-kp-secret-ttl="30" data-kp-secret-label="API token" data-kp-secret-value="kp_live_7Hq2v9XcLm4TzR8sWb3N"></div>
`,
            },
            {
                title: 'Shown only while held, and a field the reader may not open',
                why: 'Hold to reveal suits a value read over someone’s shoulder; a disabled field says why under its buttons.',
                markup: `
<div class="kp-secret" data-kp-secret data-kp-secret-reveal-on="hold" data-kp-secret-label="Root password" data-kp-secret-value="correct-horse-battery"></div>
<div class="kp-secret" data-kp-secret data-kp-secret-label="Signing key" data-kp-secret-disabled="Only the owner can read the signing key."></div>
`,
            },
            {
                title: 'A value that is read from the server only when it is asked for',
                why: 'A field with no `data-kp-secret-value` asks for its value when it is shown or copied by firing `kp-secret-request` on itself. The page calls `preventDefault()` and answers with `detail.respond(value)` or `detail.fail(reason)`; `detail.purpose` is `reveal` or `copy`. While the page reads, the field is `loading` and says so under its buttons; a refusal shows its reason there and the Reveal button becomes Try again. The value is in the page only while it is shown. The second field never answers, so it shows the failure. A page that asks for its value in one place can pass `secretLoad(field, purpose)` to `attachPatterns` instead.',
                markup: `
<div class="kp-stack">
<div class="kp-secret" data-kp-secret data-kp-secret-ttl="15" data-kp-secret-label="Client secret" data-doc-secret="ok"></div>
<div class="kp-secret" data-kp-secret data-kp-secret-label="Webhook key" data-doc-secret="fail"></div>
</div>
`,
                script: `
const ask = (field, event) => {
    event.preventDefault();
    const { respond, fail } = event.detail;
    setTimeout(() => {
        if (field.dataset.docSecret === 'fail') fail('The vault did not answer.');
        else respond('cs_9f2Qm7Lx4TbV1nRc8WzK');
    }, 700);
};
for (const field of document.querySelectorAll('[data-doc-secret]')) {
    field.addEventListener('kp-secret-request', (event) => ask(field, event));
    field.addEventListener('kp-secret', (event) => console.log(event.detail.shown ? 'shown' : 'hidden', event.detail.reason));
}
`,
            },
            {
                title: 'Options: a long value that wraps, a short mask, no Copy, and a value that stays until hidden',
                why: '`data-kp-secret-wrap="wrap"` lets a long value wrap in a box that keeps `data-kp-secret-lines` lines of room (otherwise it stays on one line and scrolls inside its box, a fade at the end saying there is more). `data-kp-secret-mask` and `data-kp-secret-mask-char` set the mask’s length and character, `data-kp-secret-copy="false"` leaves Copy out and `data-kp-secret-ttl="0"` keeps a shown value until Hide is pressed. While a value is shown, a drain rule under it runs out with the countdown.',
                markup: `
<div class="kp-stack">
<div class="kp-secret" data-kp-secret data-kp-secret-wrap="wrap" data-kp-secret-lines="3" data-kp-secret-label="Private key" data-kp-secret-value="MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKjMzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvuNMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ"></div>
<div class="kp-secret" data-kp-secret data-kp-secret-mask="6" data-kp-secret-mask-char="*" data-kp-secret-ttl="0" data-kp-secret-copy="false" data-kp-secret-label="PIN" data-kp-secret-value="482913"></div>
</div>
`,
            },
            {
                title: 'The input mode: type or paste a secret',
                why: '`data-kp-secret-mode="input"` is a field for entering a value: Show/Hide, Paste and Copy beside it. `data-kp-secret-hide-on-blur` hides it again when focus leaves; `data-kp-secret-invalid` marks it refused.',
                markup: `
<div class="kp-secret" data-kp-secret data-kp-secret-mode="input" data-kp-secret-label="API token" data-kp-secret-name="token" data-kp-secret-placeholder="Paste the token" data-kp-secret-hide-on-blur data-kp-secret-autocomplete="off"></div>
`,
            },
        ],
        variants: [
            { name: 'data-kp-secret', what: 'Marks the field; `attachPatterns` builds its parts.' },
            { name: 'data-kp-secret-ttl', what: 'Seconds a shown value stays (30 by default); `0` keeps it until Hide is pressed.' },
            { name: 'data-kp-secret-label', what: 'The field’s name for a screen reader and in the copied announcement.' },
            { name: 'data-kp-secret-mask', what: 'The mask’s length in characters (12); `data-kp-secret-mask-char` its character (•).' },
            { name: 'data-kp-secret-mask-char', what: 'The mask’s character.' },
            { name: 'data-kp-secret-reveal-on', what: '`hold`: shown only while the button is held, by pointer or with Space or Enter held down.' },
            { name: 'data-kp-secret-copy', what: '`false`: no Copy button.' },
            { name: 'data-kp-secret-clear', what: 'How long after a Copy the clipboard is emptied again; absent: 30 seconds (the `clearAfterMs` option of `attachPatterns`, 30 000). Any duration: `45` (seconds), `500ms`, `90s`, `5min`, `1h`; `0`, `off` or `never`: never. Where the browser lets the page read the clipboard it is emptied only if it still holds the copied secret; where reading is refused it is emptied anyway, as soon as the page has focus. “Clipboard cleared” is announced politely and `kp-secret-clipboard` `{ cleared, reason }` (`SECRET_CLIPBOARD_EVENT`) fires on the field; the value is never in it.' },
            { name: 'data-kp-secret-wrap', what: '`wrap`: a long value wraps, the box keeping `data-kp-secret-lines` lines of room; by default it stays on one line and scrolls inside its box, a fade at its end saying there is more.' },
            { name: 'data-kp-secret-lines', what: 'With `wrap`, the lines of room the box keeps (2).' },
            { name: 'data-kp-secret-disabled', what: 'Both buttons off; its words are the sentence under them that says why. Followed when it changes.' },
            { name: 'data-kp-secret-value', what: 'The value itself, for a page that has it anyway. A page that does not answers `kp-secret-request` instead.' },
            { name: 'data-kp-secret-state', what: 'Written: `hidden`, `loading`, `shown`, `error` or `disabled`.' },
            { name: 'data-kp-secret-paused', what: 'Written while the countdown waits because the reader selects the value or holds the focus in it.' },
            { name: 'data-kp-secret-overflow', what: 'Written while a shown value is longer than its box.' },
            { name: 'data-kp-secret-reveal', what: 'On the Reveal button, when the markup brings its own.' },
            { name: 'kp-secret', what: 'Fired on the field when it is shown or hidden: `{ shown, reason }`, reason `press`, `hold`, `timer`, `away` (the tab went to the background) or `call`.' },
            { name: 'kp-secret-request', what: 'Fired, cancelable, when the field needs its value: call `preventDefault()` and answer with `detail.respond(value)` or `detail.fail(reason)`; `detail.purpose` is `reveal` or `copy`.' },
            { name: 'data-kp-secret-mode="input"', what: 'The field takes a value instead of showing one: a password input with Show/Hide, Paste and Copy. `secretInputValue(el)` reads it, `setSecretInputValue(el, value)` writes it; `data-kp-secret-invalid` marks it refused, `-hide-on-blur` hides it when focus leaves, `-paste` (`false`) takes the Paste button away, and `-name`, `-placeholder` and `-autocomplete` go to the input.' },
            { name: 'live options', what: '`data-kp-secret-ttl`, `-reveal-on` and `-mask` are switchable at runtime: changing the attribute redraws the component.' },
        ],
        accessibility: [
            'Built in — the field is a named group; Reveal says whether the value is shown (`aria-expanded`), and a polite region says “Shown. Hides in 30 s.”, “Hides in 10 s” and “Hidden again”, never every second.',
            'Built in — the countdown pauses while the value is selected or holds the focus, and the value hides at once when the tab goes to the background.',
            'Built in — Copy works while the value is hidden and never puts it in an event or an announcement.',
            'Yours — read the value from the server when it is asked for, so it is not in the page before it is shown.',
        ],
    };
