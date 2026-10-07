// research/character-trend, blueprint: the three things the tile's own markup
// cannot say in CSS. Loading is ONE pen over the whole tile (its outline, then
// its places in reading order); the arrival reads the tile out on its scales
// when it stops being busy; a new reading is read again, a pointer sliding from
// the old reading to the new one under the figure. The pictures are the
// register's own (css/blueprint-register.css); see ../character-shared/.
import { arrive, lastReading, loading, read } from '../character-shared/blueprint.js';

loading({
    scene: '[data-ct] .kp-kpi--trend',
    busy: '[aria-busy="true"]',
    places: '.kp-kpi__value .kp-skeleton, .kp-kpi__trend .kp-skeleton, .kp-kpi__chart-plot',
});

/** What each tile last said, to tell an arrival from a live update. @type {WeakMap<Element, { busy: boolean, reading: number, line: string }>} */
const seen = new WeakMap();
const tiles = () => [...document.querySelectorAll('[data-ct] .kp-kpi--trend')];

const look = (/** @type {Element} */ tile) => {
    const busy = tile.getAttribute('aria-busy') === 'true';
    const reading = lastReading(tile.querySelector('.kp-kpi__spark'));
    const line = tile.querySelector('.kp-kpi__spark-line')?.getAttribute('d') ?? '';
    const before = seen.get(tile);
    seen.set(tile, { busy, reading, line });
    if (busy) return;
    if (!before || before.busy) arrive([tile], { units: 3 });
    else if (before.line !== line) {
        const value = tile.querySelector('.kp-kpi__value');
        if (value) read(value, { from: before.reading, to: reading });
    }
};

let queued = false;
const queue = () => {
    if (queued) return;
    queued = true;
    queueMicrotask(() => {
        queued = false;
        tiles().forEach(look);
    });
};
new MutationObserver(queue).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-busy', 'd'] });
requestAnimationFrame(queue);
