// The buttons of catalogue/motion.html: they add, show and remove rows so the
// package's own motion (js/motion.js) can be watched. Delegated from the
// document like catalogue/demos.js, so the blocks work on their page, on the
// review page that gathers them and in a compare column alike.
import { leave } from '../js/motion.js';

let reading = 0;

/** A reading row, the shape the blocks' own rows have. */
function readingRow() {
    reading += 1;
    const row = document.createElement('div');
    row.className = 'kp-row kp-row--between';
    const bar = (1 + ((reading * 37) % 90) / 100).toFixed(2);
    row.innerHTML = `<span>03:${String(reading % 60).padStart(2, '0')} · ${bar} bar</span>`;
    return row;
}

/** A removable row or message, as the leave blocks start with. */
function leavingRow(text, kind) {
    const row = document.createElement('div');
    row.className = kind ? `kp-alert kp-alert--${kind}` : 'kp-row kp-row--between';
    if (kind) row.setAttribute('role', 'status');
    row.innerHTML = kind
        ? '<span class="kp-alert__body"></span><button type="button" class="kp-icon-button kp-alert__close" data-cat-leave aria-label="Dismiss">×</button>'
        : '<span></span><button type="button" class="kp-button kp-button--ghost kp-button--sm" data-cat-leave aria-label="Remove">✕</button>';
    /** @type {HTMLElement} */ (row.firstElementChild).textContent = text;
    return row;
}

/** What each leave box held when the page loaded, to bring it back. */
const original = new WeakMap();
const remember = (/** @type {Element} */ box) => {
    if (!original.has(box))
        original.set(
            box,
            [...box.children].map((child) => child.cloneNode(true)),
        );
};
for (const box of document.querySelectorAll('[data-cat-motion-leave]')) remember(box);

document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const gone = target?.closest('[data-cat-leave]');
    if (gone?.parentElement) void leave(/** @type {HTMLElement} */ (gone.parentElement));
    const act = target?.closest('[data-cat-motion]')?.getAttribute('data-cat-motion');
    if (!act) return;
    const block = target?.closest('.cat-block');
    if (!block) return;
    const list = block.querySelector('[data-cat-motion-list]');
    if (list && act === 'add') list.append(readingRow());
    if (list && act === 'add3') list.append(readingRow(), readingRow(), readingRow());
    if (list && act === 'remove' && list.children.length > 1) list.lastElementChild?.remove();
    if (act === 'arrive')
        for (const box of block.querySelectorAll('[data-cat-motion-arrive]')) {
            const note = leavingRow('Line 1 is back within range.', 'success');
            box.append(note);
        }
    for (const box of block.querySelectorAll('[data-cat-motion-leave]')) {
        remember(box);
        if (act === 'leave-all') for (const child of box.children) void leave(/** @type {HTMLElement} */ (child));
        if (act === 'leave-reset') box.replaceChildren(...original.get(box).map((/** @type {Node} */ node) => node.cloneNode(true)));
    }
});
