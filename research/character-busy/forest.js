// research/character-busy, forest: the busy overlay's leave. The package
// removes the layer the instant the table stops loading (`drawOverlay()` in
// js/datatable.js calls `.remove()` with no window), so the layer that grew
// up out of its base line could not wither back into it (themes/forest/
// CHARACTER.md G10: a close is its open reversed). This puts the removed
// layer back for one growth time and plays the arrival's keyframes
// `reverse` (`fog-grow-back`, forest.css), then drops it. Only in forest,
// only when the arrival is the decided "grows", never under reduced motion,
// and never when a fresh layer replaces the old one in the same breath.

const LAYER = 'kp-datatable__busy-overlay';
const isLayer = (/** @type {Node} */ node) => node instanceof HTMLElement && node.classList.contains(LAYER);

new MutationObserver((records) => {
    if (document.documentElement.getAttribute('data-theme') !== 'forest') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const record of records) {
        const host = /** @type {HTMLElement} */ (record.target);
        if (!host.matches('[data-bo-arrival="2"]') && !host.closest('[data-bo-arrival="2"]')) continue;
        for (const node of record.removedNodes) {
            if (!isLayer(node) || host.querySelector(`:scope > .${LAYER}`)) continue;
            const layer = /** @type {HTMLElement} */ (node);
            if (layer.hasAttribute('data-fog-leaving')) continue;
            layer.setAttribute('data-fog-leaving', '');
            layer.addEventListener('animationend', () => layer.remove(), { once: true });
            host.append(layer);
        }
    }
}).observe(document.body, { childList: true, subtree: true });
