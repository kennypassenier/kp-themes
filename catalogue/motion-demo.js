// The buttons of catalogue/motion.html: they add, show and remove rows so the
// package's own motion (js/motion.js) can be watched. Delegated from the
// document like catalogue/demos.js, so the blocks work on their page, on the
// review page that gathers them and in a compare column alike.
import { attachMotion, leave, motionWatchCount } from '../js/motion.js';
import { update } from '../js/update.js';

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
        for (const record of records)
            if (record.oldValue === null && /** @type {Element} */ (record.target).hasAttribute('data-kp-arriving')) arrived += 1;
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
// hundred rebuilds from the sample data leave the watch count where it was.
const sizeBlocks = new WeakSet();
/** @param {Element} block */
const attachSizeBlock = (block) => {
    if (sizeBlocks.has(block)) return;
    sizeBlocks.add(block);
    attachMotion(block, { size: '.kp-card', arrive: 'new' });
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
// The cards as the server sends them: three readings each. A rebuild draws
// every card from this again, so a reading added on the page is thrown away.
const SIZE_SAMPLE = /** @type {const} */ ([
    ['reservoir-north', 'Reservoir North · 71 %', 3],
    ['reservoir-south', 'Reservoir South · 64 %', 3],
]);
/** One card's lines, built anew. @param {string} title @param {number} readings */
const sizeCardLines = (title, readings) => {
    const lines = [title, ...Array.from({ length: readings }, (_, i) => `Reading ${i + 1}: level steady.`)];
    return lines.map((text) => {
        const line = document.createElement('p');
        line.textContent = text;
        return line;
    });
};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('button[data-cat-size-selector]') : null;
    const block = button?.closest('.cat-block');
    const grid = block?.querySelector('div[data-cat-size-selector]');
    if (!button || !block || !grid) return;
    attachSizeBlock(block);
    const act = button.getAttribute('data-cat-size-selector');
    // The second card leaves the theme's way and attachMotion lets its box
    // go (the count drops by one); brought back under its key, it is a new
    // card to this grid, so it arrives and is watched again.
    const [southKey, southTitle, southReadings] = SIZE_SAMPLE[1];
    const south = grid.querySelector(`:scope > [data-kp-key="${southKey}"]`);
    if (act === 'remove') {
        if (south instanceof HTMLElement && !south.hasAttribute('data-kp-leaving'))
            void leave(south).then(() => requestAnimationFrame(() => showCount(block)));
        return;
    }
    if (act === 'back') {
        if (south) return;
        const card = document.createElement('div');
        card.className = 'kp-card kp-stack';
        card.setAttribute('data-kp-key', southKey);
        card.append(...sizeCardLines(southTitle, southReadings));
        grid.append(card);
        requestAnimationFrame(() => showCount(block));
        return;
    }
    if (act === 'grow') {
        const card = grid.firstElementChild;
        if (!card) return;
        const line = document.createElement('p');
        line.textContent = `Reading ${card.children.length}: level steady.`;
        card.append(line);
        return;
    }
    // A page that redraws itself from the server on every navigation: a
    // hundred times, one rebuild a frame, every card drawn anew from the
    // sample data and matched to the card on the page by its key, as a keyed
    // renderer does. The card under a key stays the box motion watches and
    // only its lines are new, so a card grown on the page eases back to its
    // three readings while one left alone does not move; the block is
    // attached with `arrive: 'new'` (and marked `data-kp-arrive="new"`), so a
    // redrawn line is a repaint and nothing arrives (Kenny, 2026-10-05:
    // "rebuild the cards doesn't throw anything away?").
    const before = motionWatchCount();
    let round = 0;
    const rebuild = () => {
        for (const [key, title, readings] of SIZE_SAMPLE) {
            const card = grid.querySelector(`:scope > [data-kp-key="${key}"]`);
            if (card) card.replaceChildren(...sizeCardLines(title, readings));
        }
        round += 1;
        if (round < 100) requestAnimationFrame(rebuild);
        else
            requestAnimationFrame(() => {
                showCount(block);
                const line = block.querySelector('[data-cat-size-count]');
                if (line) line.textContent += ` (it was ${before} before the rebuild; the cards were drawn anew ${round} times)`;
            });
    };
    rebuild();
});

/* ------------------------------------------------------------- update */

// Information that updates in place [Kenny's picks on research/update-motion,
// 2026-10-05]: Update writes the second state into the key figure, its
// chart, a state word and a table cell at once through update(), Update
// again the first; each changed value plays its theme's update once. The
// note under the buttons says how long the last one played (the longest of
// the four), which is what a measurement reads.
const UPDATE_SERIES = [
    3.3, 3.31, 3.29, 3.27, 3.24, 3.22, 3.25, 3.31, 3.36, 3.38, 3.35, 3.33, 3.3, 3.28, 3.3, 3.32, 3.34, 3.37, 3.39, 3.35, 3.31, 3.28, 3.27,
];
const UPDATE_STATES = [
    { figure: '3.26', chart: [...UPDATE_SERIES, 3.26], state: 'Running', time: '08:12' },
    { figure: '3.41', chart: [...UPDATE_SERIES, 3.41], state: 'Restarting', time: '08:27' },
];

document.addEventListener('click', async (event) => {
    const button = event.target instanceof Element ? event.target.closest('button[data-cat-update]') : null;
    const block = button?.closest('.cat-block');
    const stage = block?.querySelector('[data-cat-update]:not(button)');
    if (!button || !block || !stage) return;
    const next = UPDATE_STATES[Number(button.getAttribute('data-cat-update'))];
    const parts = /** @type {const} */ (['figure', 'chart', 'state', 'time']);
    const took = await Promise.all(
        parts.map((part) => {
            const el = stage.querySelector(`[data-cat-update-part="${part}"]`);
            return el ? update(el, next[part]) : Promise.resolve(0);
        }),
    );
    const note = block.querySelector('[data-cat-update-took]');
    const longest = Math.max(...took);
    if (note)
        note.textContent = longest > 0 ? `The last update played in ${Math.round(longest)} ms.` : 'The values changed; nothing played in this theme.';
});
