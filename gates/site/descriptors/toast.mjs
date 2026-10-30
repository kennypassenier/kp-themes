// Page descriptor for the "toast" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const toastDescriptor = {
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
            {
                title: 'A toast that waits for the reader, and one that stays',
                why: 'Three buttons call toast() from js/overlays.js. The first toast keeps its clock while the pointer is on it or focus is inside it (try resting the pointer on it) and leaves two seconds after both are gone; the second has a close button and the ordinary clock; the third is sticky: no clock, a close button, and Esc closes it from the keyboard.',
                markup: `
<div class="kp-row kp-gap-sm">
<button type="button" class="kp-button" data-doc-toast="pause">Rest on it</button>
<button type="button" class="kp-button" data-doc-toast="close">With a close button</button>
<button type="button" class="kp-button kp-button--primary" data-doc-toast="sticky">Stays until closed</button>
</div>
`,
                script: `
import { toast } from '@kp-soft/themes/js/overlays';

const shows = {
    pause: () => toast('Saved: rest the pointer on this toast and it waits.', { linger: 1500 }),
    close: () => toast('The export finished.', { close: true }),
    sticky: () => toast('The server refused the file. Close this when you have read it.', { sticky: true, live: 'assertive' }),
};
for (const button of document.querySelectorAll('[data-doc-toast]')) {
    button.addEventListener('click', () => shows[button.dataset.docToast]());
}
`,
            },
        ],
        variants: [
            { name: '.kp-toasts', what: 'The stack: fixed at the trailing bottom corner, newest last, above every other layer.' },
            { name: 'assertive stack', what: 'A second region for errors, which interrupts rather than waiting for a pause.' },
            { name: '.kp-toast--success / --warning / --info / --error', what: 'A rule down the leading edge in the status colour. The words say it as well.' },
            { name: '.kp-toast__close', what: 'A dismiss control pushed to the trailing edge, for a toast that does not go by itself.' },
            { name: 'with an action', what: 'A toast can carry one control — an undo — and then it should stay long enough to be used.' },
            { name: 'pause (default true)', what: 'While the pointer is on a toast or focus is inside it, its clock stops and the toast carries `data-kp-paused`; `pause: false` brings back the plain timer. A touch is not hovering. The region hears `kp-toast-pause` with `{ toast, paused }` each time it stops or starts again.' },
            { name: 'linger', what: 'The milliseconds a toast has left once the pointer and the focus are both gone (`TOAST_LINGER_MS`, 2000 by default; per toast as `linger`).' },
            { name: 'close', what: '`close: true` adds a close button at the toast’s end; the toast keeps its clock.' },
            { name: 'sticky', what: '`sticky: true` is no clock plus a close button: the toast stays until it is closed. For an undo that needs a decision or an error that has to be read.' },
            { name: 'Escape', what: 'Esc on a focused toast closes it, whether or not it has a close button.' },
            { name: 'with a tab bar', what: 'The stack, and the back-to-top control, rise by the tab bar’s own height, so a toast never stands behind it on a phone.' },
            { name: 'pastel', what: 'In pastel a toast draws its own plate and pass under its words (no tape: paper in the hand), lands on the pass and leaves as that landing backwards; js/motion.js plays a toast’s arrival as its leave backwards. Each tone names its own paper.' },
        ],
        accessibility: [
            'Built in — the polite region announces without interrupting, and errors get the assertive one; that split is the whole reason there are two.',
            'Built in — a toast is not focused when it appears, so it does not steal the keyboard from what the reader was doing.',
            'Built in — the stack sits above the other layers, so nothing draws over it.',
            'Yours — put the region in the document once, at the end, and leave it there. A region added at the same moment as its message is not announced.',
            'Yours — leave a toast long enough to read, and give anything actionable a home that does not expire.',
            'Yours — repeat the information somewhere permanent if the reader may need it later.',
        ],
    };
