// research/formgrid-notes-1019: the page's own wiring. The components are the package's (js/auto.js attaches the JSON field and the
// refresh bar); this file only answers the refresh so the control reads as a live one.

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

// The app answers every refresh at once: the freshness line then reads "updated just now".
document.addEventListener('kp-refresh', (event) => {
    const detail = /** @type {CustomEvent} */ (event).detail;
    setTimeout(() => detail.done(true), 300);
});
