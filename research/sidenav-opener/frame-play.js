// research/sidenav-opener: a frame opens and closes its side navigation once each
// time the page asks (rounds.js), through the handle a page would use
// (sidenavOf). Nothing moves until the section's "Play once" is pressed, by the
// reader or by the review dialog's "Play open and close"; opened on its own, a
// frame plays on a loop. ?still keeps a frame from playing, for a screenshot.
import { sidenavOf } from '../../js/sidenav.js';
import { nextRound } from './rounds.js';

const OPEN_HOLD = 2300;
const SHUT_HOLD = 1500;
const SETTLE = 900;

/** @param {number} ms */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const nav = document.querySelector('.kp-sidenav');
if (window.parent !== window) document.documentElement.setAttribute('data-so-framed', '');

async function loop() {
    while (!(nav instanceof HTMLElement) || !sidenavOf(nav)) await wait(100);
    await wait(SETTLE);
    for (;;) {
        await nextRound();
        const handle = sidenavOf(/** @type {HTMLElement} */ (nav));
        if (!handle) return;
        if (handle.isOpen()) {
            handle.close({ remember: false });
            await wait(SHUT_HOLD);
        }
        handle.open({ remember: false });
        await wait(OPEN_HOLD);
        handle.close({ remember: false });
        await wait(SHUT_HOLD);
    }
}

if (!new URLSearchParams(location.search).has('still')) void loop();
