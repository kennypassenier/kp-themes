// research/findings-1019: the page's own wiring. The components are the package's (js/auto.js attaches the command, the flash
// buttons and the ledes); this file gives the check-in its questions and the flash buttons something to wait for.
import { setFocusSteps } from '../../js/focus-steps.js';
import { runFlashButton } from '../../js/flash.js';

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});
await ready;

const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- 2 · the check-in -----------------------------------------------------------------------------
const checkin = () => [
    {
        text: 'How was your energy today?',
        answer: {
            id: 'energy',
            kind: 'choice',
            previous: 'ok',
            usual: 'good',
            choices: [
                { value: 'low', label: 'Low' },
                { value: 'ok', label: 'Okay' },
                { value: 'good', label: 'Good' },
            ],
        },
    },
    { text: 'Anything else worth writing down?', answer: { id: 'note', kind: 'text' } },
];
for (const root of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-f19-checkin]')])) setFocusSteps(root, checkin());

// ---- 3 · the flash buttons: the first press works, the second is refused, then it goes round again ----------
for (const button of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-f19-flash]')])) {
    let presses = 0;
    button.addEventListener('click', () => {
        const refuse = presses++ % 2 === 1;
        void runFlashButton(button, async () => {
            await sleep(700);
            return refuse ? { error: 'The client did not answer.', remedy: 'Try again in a minute.' } : 'Sent';
        });
    });
}
