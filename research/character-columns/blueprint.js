// research/character-columns, blueprint: loading is ONE pen over the whole strip
// (its outline, then every place a figure and its words will stand, column after
// column); when the figures arrive the columns are read out one after another;
// a figure that changed is read again, a pointer sliding from the old reading to
// the new one. All three are the register's pictures (css/blueprint-register.css);
// see ../character-shared/.
import { arrive, loading, read } from '../character-shared/blueprint.js';

loading({ scene: '[data-cs] .kp-kpis', busy: '[aria-busy="true"]', places: '.kp-skeleton', outside: true });

const figure = (/** @type {Element} */ tile) =>
    Number.parseFloat((tile.querySelector('.kp-kpi__value')?.firstChild?.textContent ?? '').replace(/\s/g, '').replace(',', '.'));

/** What each strip's figures said at its last arrival or update. @type {WeakMap<Element, number[]>} */
const said = new WeakMap();
const columns = (/** @type {Element} */ strip) => [...strip.children].filter((el) => el.classList.contains('kp-kpi'));

new MutationObserver((records) => {
    for (const r of records) {
        const strip = /** @type {Element} */ (r.target);
        const moment = strip.getAttribute('data-cs-moment');
        if (!moment) continue;
        const tiles = columns(strip);
        const now = tiles.map(figure);
        if (moment === 'arrive') arrive(tiles, { units: 2 });
        if (moment === 'live') {
            const before = said.get(strip) ?? [];
            tiles.forEach((tile, at) => {
                if (!tile.hasAttribute('data-cs-changed')) return;
                const value = tile.querySelector('.kp-kpi__value');
                const top = Math.max(before[at], now[at]) * 1.25;
                if (value && top > 0) read(value, { from: before[at] / top, to: now[at] / top });
            });
        }
        said.set(strip, now);
    }
}).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-cs-moment'] });
document.querySelectorAll('[data-cl-strip]').forEach((strip) => said.set(strip, columns(strip).map(figure)));
