// research/character-chart, blueprint: loading is ONE pen over the whole chart
// (its outline, then the places its plot and its legend will stand); a chart
// that arrives is read out on its scales (the register's own
// `[data-kp-arriving]`); a new reading is read again, an amber pointer on the
// plot's own scale sliding from the old reading to the new one. The pictures
// are the register's (css/blueprint-register.css); see ../character-shared/.
import { arrive, loading, readY } from '../character-shared/blueprint.js';

loading({
    scene: '[data-cc] .kp-chart, [data-cc-preview] .kp-chart',
    busy: ':has(> .kp-chart__plot[aria-busy="true"])',
    places: '.kp-chart__state, .kp-chart__source-stub',
});

/** The height of each series' last reading, as a share of the plot's height from its top. */
const readings = (/** @type {Element} */ chart) => {
    const plot = chart.querySelector('.kp-chart__plot');
    const height = Number(plot?.querySelector('svg')?.getAttribute('viewBox')?.split(/\s+/)[3]);
    return [...(plot?.querySelectorAll('.kp-chart__line') ?? [])].map((line) => {
        const y = Number(/([-\d.]+)\s*$/.exec(line.getAttribute('d') ?? '')?.[1]);
        return height > 0 && !Number.isNaN(y) ? Math.min(1, Math.max(0, y / height)) : 0.5;
    });
};

/** What each chart's series said last. @type {WeakMap<Element, number[]>} */
const said = new WeakMap();
const charts = () => [...document.querySelectorAll('[data-cc] .kp-chart, [data-cc-preview] .kp-chart')];

new MutationObserver((records) => {
    for (const r of records) {
        const wrapper = /** @type {Element} */ (r.target);
        if (r.type !== 'attributes' || !wrapper.hasAttribute(/** @type {string} */ (r.attributeName))) continue;
        const own = [...wrapper.querySelectorAll('.kp-chart')];
        if (r.attributeName === 'data-cc-arriving') arrive(own, { units: 3 });
        if (r.attributeName === 'data-cc-updating')
            for (const chart of own) {
                const before = said.get(chart) ?? [];
                const now = readings(chart);
                const plot = chart.querySelector('.kp-chart__plot');
                if (plot && now.length)
                    readY(
                        plot,
                        now.map((to, at) => ({ from: before[at] ?? to, to })),
                    );
            }
    }
    // What the charts say now is what the next update is read from.
    for (const chart of charts()) said.set(chart, readings(chart));
}).observe(document.body, { subtree: true, attributes: true, childList: true, attributeFilter: ['data-cc-arriving', 'data-cc-updating', 'd'] });
requestAnimationFrame(() => charts().forEach((chart) => said.set(chart, readings(chart))));
