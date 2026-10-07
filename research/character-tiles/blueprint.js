// research/character-tiles, blueprint: loading is ONE pen over the whole tile
// (its outline, then the places its words will stand); when a tile stops
// waiting the tiles of its grid are read out one after another, one pen; a
// timestamp that changed in place is read again, a pointer sliding from the old
// reading to the new one. All three are the register's pictures
// (css/blueprint-register.css); see ../character-shared/.
import { arrive, loading, read } from '../character-shared/blueprint.js';

loading({ scene: '[data-ti] .kp-card[data-tl-tile]', busy: '[data-kp-busy]', places: '.kp-skeleton' });

/** @type {WeakMap<Element, { busy: boolean, age: number }>} */
const seen = new WeakMap();
const age = (/** @type {Element} */ tile) =>
    Number.parseInt(/(\d+)\s*min/.exec(tile.querySelector('[data-tl-time]')?.textContent ?? '')?.[1] ?? '0', 10);

let queued = false;
const look = () => {
    queued = false;
    for (const grid of document.querySelectorAll('[data-ti]')) {
        const arriving = [];
        for (const tile of grid.querySelectorAll('[data-tl-tile]')) {
            const busy = tile.hasAttribute('data-kp-busy');
            const before = seen.get(tile);
            const now = age(tile);
            seen.set(tile, { busy, age: now });
            if (busy) continue;
            if (!before || before.busy) arriving.push(tile);
        }
        if (arriving.length) arrive(arriving, { units: 3 });
    }
};
/** A live update flashes a tile again: the stamp says how old the new reading is (the old one is ten minutes older). */
const flash = (/** @type {Element} */ tile) => {
    const time = tile.querySelector('[data-tl-time]');
    const now = age(tile);
    if (time) read(time, { from: Math.min(1, (now + 10) / 30), to: Math.min(1, now / 30) });
};
const queue = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(look);
};
new MutationObserver((records) => {
    for (const r of records) {
        const tile = /** @type {Element} */ (r.target);
        if (r.attributeName === 'data-tl-flash' && r.oldValue === null && tile.hasAttribute('data-tl-flash')) flash(tile);
    }
    queue();
}).observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['data-kp-busy', 'data-tl-flash'],
    characterData: true,
});
requestAnimationFrame(queue);
