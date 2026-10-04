// The buttons of catalogue/motion.html: they add, show and remove rows so the
// package's own motion (js/motion.js) can be watched. Delegated from the
// document like catalogue/demos.js, so the blocks work on their page, on the
// review page that gathers them and in a compare column alike.
import { attachMotion, leave, motionWatchCount } from '../js/motion.js';

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

/* ------------------------------------------- only what is new arrives */

// catalogue/motion.html#arrive-new: a live list redrawn the way a poll
// redraws it, and a count of the rows that arrived.
const PUMPS = [
    ['ph-1', 'Pump house 1 · 3.4 bar'],
    ['ph-3', 'Pump house 3 · 2.0 bar'],
    ['ph-7', 'Pump house 7 · no reading'],
];
let extra = 0;
/** @param {string} key @param {string} text */
const pumpRow = (key, text) => {
    const li = document.createElement('li');
    li.setAttribute('data-kp-key', key);
    li.textContent = text;
    return li;
};
/** @param {Element} list */
const countArrivals = (list) => {
    const own = /** @type {any} */ (list);
    if (own.__catCounted) return;
    own.__catCounted = true;
    let arrived = 0;
    new MutationObserver((records) => {
        for (const record of records) if (record.oldValue === null && /** @type {Element} */ (record.target).hasAttribute('data-kp-arriving')) arrived += 1;
        const line = list.closest('.cat-block')?.querySelector('[data-cat-arrive-count]');
        if (line) line.textContent = `Arrivals so far: ${arrived}`;
    }).observe(list, { subtree: true, attributes: true, attributeFilter: ['data-kp-arriving'], attributeOldValue: true });
};
for (const list of document.querySelectorAll('[data-cat-arrive-list]')) countArrivals(list);

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-cat-arrive]') : null;
    const list = button?.closest('.cat-block')?.querySelector('[data-cat-arrive-list]');
    if (!button || !list) return;
    countArrivals(list);
    const act = button.getAttribute('data-cat-arrive');
    /** @type {[string, string][]} */
    const now = [...list.children].map((li) => [li.getAttribute('data-kp-key') ?? '', li.textContent ?? '']);
    const shown = now.length && now.every(([key]) => key) ? now : PUMPS;
    if (act === 'refresh') list.replaceChildren(...shown.map(([key, text]) => pumpRow(key, text)));
    if (act === 'add') {
        extra += 1;
        list.replaceChildren(...shown.map(([key, text]) => pumpRow(key, text)), pumpRow(`new-${extra}`, `Reservoir ${extra} · ${60 + extra} %`));
    }
    if (act === 'sort') list.replaceChildren(...[...list.children].reverse());
    if (act === 'rename') {
        extra += 1;
        list.replaceChildren(...shown.map(([key, text], at) => pumpRow(at === 0 ? `${key}-r${extra}` : key, text)));
    }
    if (act === 'skeleton') {
        const bones = PUMPS.map(() => {
            const li = document.createElement('li');
            li.setAttribute('data-kp-skeleton', '');
            const bar = document.createElement('span');
            bar.className = 'kp-skeleton';
            li.append(bar);
            return li;
        });
        list.replaceChildren(...bones);
        setTimeout(() => list.replaceChildren(...PUMPS.map(([key, text]) => pumpRow(key, text))), 900);
    }
});

/* ------------------------------------- boxes named by a selector, let go */

// catalogue/motion.html#size-selector: this block's cards ease because the
// block is attached with a selector, not because each card is marked; a
// rebuild of a hundred cards, ten times, leaves the watch count where it was.
const sizeBlocks = new WeakSet();
/** @param {Element} block */
const attachSizeBlock = (block) => {
    if (sizeBlocks.has(block)) return;
    sizeBlocks.add(block);
    attachMotion(block, { size: '.kp-card' });
};
/** @param {Element | null} block */
const showCount = (block) => {
    const line = block?.querySelector('[data-cat-size-count]');
    if (line) line.textContent = `Boxes watched on this page: ${motionWatchCount()}`;
};
for (const grid of document.querySelectorAll('[data-cat-size-selector]')) {
    const block = grid.closest('.cat-block');
    if (block) {
        attachSizeBlock(block);
        showCount(block);
    }
}
let grown = 0;
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button[data-cat-size-selector]') : null;
    const block = button?.closest('.cat-block');
    const grid = block?.querySelector('div[data-cat-size-selector]');
    if (!button || !block || !grid) return;
    attachSizeBlock(block);
    if (button.getAttribute('data-cat-size-selector') === 'grow') {
        grown += 1;
        const line = document.createElement('p');
        line.textContent = `Reading ${grown}: level steady.`;
        grid.firstElementChild?.append(line);
        return;
    }
    const keep = [...grid.children].map((card) => card.cloneNode(true));
    const before = motionWatchCount();
    let round = 0;
    const rebuild = () => {
        grid.replaceChildren(
            ...Array.from({ length: 100 }, (_, at) => {
                const card = document.createElement('div');
                card.className = 'kp-card kp-stack';
                card.textContent = `Card ${at + 1}`;
                return card;
            }),
        );
        round += 1;
        if (round < 10) requestAnimationFrame(rebuild);
        else
            requestAnimationFrame(() => {
                grid.replaceChildren(...keep);
                // Let go a microtask after they left; read the count after that.
                queueMicrotask(() => queueMicrotask(() => {
                    showCount(block);
                    const line = block.querySelector('[data-cat-size-count]');
                    if (line) line.textContent += ` (it was ${before} before the rebuild)`;
                }));
            });
    };
    rebuild();
});
