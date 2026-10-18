// research/kpadopt56-formal: the page's own wiring. The components are the package's (js/auto.js attaches them); this file only
// narrows a section to a phone on request, places the scrolling segmented bars and, once theme/t56-h is merged, sets the
// operations page's failed option from the dialog's choice.

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

// The width switch: one pressed button per group; the stage of the same section follows.
document.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('[data-k56f-width]') : null);
    if (!button || !button.matches('button')) return;
    const group = button.closest('[role="group"]');
    for (const other of group?.querySelectorAll('[data-k56f-width]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    const stage = button.closest('section')?.querySelector('[data-k56f-stage]');
    stage?.setAttribute('data-k56f-width', button.getAttribute('data-k56f-width') ?? 'full');
});

await ready;

// The scrolling segmented bars: each is put at rest, in the middle or at the end of its scroll, and keeps that until a person
// scrolls it (a resize or a theme change puts it back; "Put the three bars back" does too).
/** @type {WeakSet<Element>} */
const touched = new WeakSet();

/** @param {HTMLElement} bar */
function place(bar) {
    const at = bar.getAttribute('data-k56f-seg-at');
    const max = bar.scrollWidth - bar.clientWidth;
    if (max <= 1) return bar.scrollTo({ left: 0, behavior: 'instant' });
    let left = 0;
    if (at === 'end') left = max;
    if (at === 'middle') {
        const fade =
            parseFloat(getComputedStyle(bar).getPropertyValue('--kp-seg-fade')) * parseFloat(getComputedStyle(document.documentElement).fontSize) ||
            24;
        const here = bar.getBoundingClientRect().left;
        // The first whole choice that starts past the middle of the scroll.
        const items = [...bar.querySelectorAll('.kp-segmented__item')];
        const starts = items.map((item) => item.getBoundingClientRect().left - here + bar.scrollLeft - fade);
        left = Math.min(max, Math.max(0, starts.find((s) => s >= max / 2) ?? max / 2));
    }
    bar.scrollTo({ left, behavior: 'instant' });
}

const bars = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-k56f-seg-at]')]);
for (const bar of bars) {
    for (const type of ['pointerdown', 'wheel', 'touchstart', 'keydown']) bar.addEventListener(type, () => touched.add(bar), { passive: true });
    new ResizeObserver(() => {
        if (!touched.has(bar)) place(bar);
    }).observe(bar);
    place(bar);
}
document.fonts?.ready.then(() => {
    for (const bar of bars) if (!touched.has(bar)) place(bar);
});
document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-k56f-seg-reset]')) return;
    for (const bar of bars) {
        touched.delete(bar);
        place(bar);
    }
});

// The operations page's failed option (theme/t56-h, S13): `data-kp-ops-failed` on every .kp-ops, plate by default.
document.addEventListener('review:choice', (event) => {
    const detail = /** @type {CustomEvent} */ (event).detail;
    if (detail?.id !== 'ops-failed') return;
    for (const ops of document.querySelectorAll('.kp-ops')) ops.setAttribute('data-kp-ops-failed', String(detail.value));
});
