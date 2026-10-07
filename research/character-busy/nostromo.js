// research/character-busy, nostromo: the busy overlay's leave. The package
// removes the layer the instant the table stops loading (`drawOverlay()` in
// js/datatable.js calls `.remove()` with no window), so the layer the raster
// drew could not be erased (themes/nostromo/CHARACTER.md G12: every close is
// its open reversed). This puts the removed layer back for one draw time and
// plays the raster's erase (`kp-sig-nostromo-erase`, the draw backwards
// frame for frame), then drops it. Only in nostromo, only when the arrival
// is the decided one (2), never under reduced motion, and never when a
// fresh layer replaces the old one in the same breath. The same method as
// forest.js beside it.

const LAYER = 'kp-datatable__busy-overlay';
const isLayer = (/** @type {Node} */ node) => node instanceof HTMLElement && node.classList.contains(LAYER);

new MutationObserver((records) => {
    if (document.documentElement.getAttribute('data-theme') !== 'nostromo') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const record of records) {
        const host = /** @type {HTMLElement} */ (record.target);
        if (!host.matches('[data-bo-arrival="2"]') && !host.closest('[data-bo-arrival="2"]')) continue;
        for (const node of record.removedNodes) {
            if (!isLayer(node) || host.querySelector(`:scope > .${LAYER}`)) continue;
            const layer = /** @type {HTMLElement} */ (node);
            if (layer.hasAttribute('data-no-leaving')) continue;
            layer.setAttribute('data-no-leaving', '');
            layer.addEventListener('animationend', () => layer.remove(), { once: true });
            host.append(layer);
        }
    }
}).observe(document.body, { childList: true, subtree: true });
