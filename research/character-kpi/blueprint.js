// research/character-kpi, blueprint: loading is ONE pen over the whole key
// figure (its outline, then the places its reading and words will stand), and
// a new reading is read again: the figure is written at once and a pointer
// slides on a ruler under it, from the old reading to the new one. Both are
// the register's pictures (css/blueprint-register.css); see ../character-shared/.
import { loading, read } from '../character-shared/blueprint.js';

loading({ scene: '[data-kf-tile]', busy: '[data-kp-loading]', places: '.kp-skeleton' });

const number = (/** @type {string | null | undefined} */ text) => Number.parseFloat((text ?? '').replace(/\s/g, '').replace(',', '.'));

/** The figure as it was drawn, grouped by the same separator, with the decimals it had. */
const write = (/** @type {string} */ original, /** @type {number} */ to) => {
    const decimals = /[.,](\d+)\s*$/.exec(original.trim())?.[1].length ?? 0;
    const text = to.toFixed(decimals);
    return /\d\s\d/.test(original) ? text.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') : text;
};

/** The reading each tile's figure started from, and how many new readings landed. @type {WeakMap<Element, { base: number, n: number }>} */
const readings = new WeakMap();

new MutationObserver((records) => {
    for (const r of records) {
        const tile = /** @type {Element} */ (r.target);
        if (!tile.classList.contains('kf-flash') || tile.hasAttribute('data-kp-loading')) continue;
        const value = tile.querySelector('[data-kf-value]');
        const figure = value?.firstChild;
        if (!value || !figure || figure.nodeType !== Node.TEXT_NODE) continue;
        const state = readings.get(tile) ?? { base: number(figure.textContent), n: 0 };
        if (Number.isNaN(state.base)) continue;
        const before = number(figure.textContent);
        state.n += 1;
        // A new reading lands near the one before: the figure is written at once.
        const now = Math.max(0, state.base * (1 + 0.06 * Math.sin(state.n * 1.7)));
        figure.textContent = write(figure.textContent ?? '', now);
        readings.set(tile, state);
        const top = Math.max(before, now) * 1.25;
        read(value, { from: before / top, to: now / top });
    }
}).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
