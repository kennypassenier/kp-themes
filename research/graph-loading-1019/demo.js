// research/graph-loading-1019: the page's own wiring. js/auto.js attaches each graph with its network; this file then puts every
// graph into the loading state, where the package draws the theme's decided loading picture (css/<theme>-register.css).
import { setGraphState } from '../../js/graph.js';

await new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

for (const el of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-gl-graph]')])) setGraphState(el, 'loading');
