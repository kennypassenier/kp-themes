// research/kpadopt56-followups: the page's own wiring. The components are the package's (js/auto.js attaches them); this file
// only opens the selection bar's section on what it asks about: two rows ticked, so the floating bar is on screen at once.

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

const table = document.getElementById('k5-stacks-b');
if (table) {
    const boxes = /** @type {NodeListOf<HTMLInputElement>} */ (table.querySelectorAll('tbody [data-kp-select-row]'));
    for (const box of [...boxes].slice(0, 2)) if (!box.checked) box.click();
}
