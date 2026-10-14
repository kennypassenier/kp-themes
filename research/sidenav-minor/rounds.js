// research/sidenav-minor: a window plays one round only when it is asked to
// (Kenny, 2026-10-14: every window played by itself from the start, and a
// focus inside one scrolled the whole page down to it). The page asks through
// the section's "Play once" button, which the review dialog's "Play open and
// close" presses again and again; opened on its own, a window plays on.

const framed = window.parent !== window;
let pending = false;
/** @type {(() => void) | null} */
let wake = null;

addEventListener('message', (event) => {
    if (event.source !== window.parent || event.data?.type !== 'mn-round') return;
    pending = true;
    wake?.();
});

/** Resolves when the page has asked for the next round; at once in a window opened on its own. */
export async function nextRound() {
    if (!framed) return;
    while (!pending) await new Promise((resolve) => (wake = () => resolve(undefined)));
    pending = false;
}
