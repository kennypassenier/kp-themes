// research/character-busy, cyberpunk: the busy overlay's leave. The package
// removes the layer the instant the table stops loading (`drawOverlay()` in
// js/datatable.js calls `.remove()` with no window), so the panel that was
// channel-split in could not split out (themes/cyberpunk/CHARACTER.md G3,
// G12: a close is its open reversed). This puts the removed layer back for
// one split (480 ms) and plays `cyg-split-out` on its panel (cyberpunk.css),
// then drops it. Only in cyberpunk, only when the arrival is the decided one,
// never under reduced motion, and never when a fresh layer replaces the old
// one in the same breath.

const LAYER = 'kp-datatable__busy-overlay';
const isLayer = (/** @type {Node} */ node) => node instanceof HTMLElement && node.classList.contains(LAYER);

new MutationObserver((records) => {
    if (document.documentElement.getAttribute('data-theme') !== 'cyberpunk') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const record of records) {
        const host = /** @type {HTMLElement} */ (record.target);
        if (!host.matches('[data-bo-arrival="1"]') && !host.closest('[data-bo-arrival="1"]')) continue;
        for (const node of record.removedNodes) {
            if (!isLayer(node) || host.querySelector(`:scope > .${LAYER}`)) continue;
            const layer = /** @type {HTMLElement} */ (node);
            if (layer.hasAttribute('data-cyg-leaving')) continue;
            layer.setAttribute('data-cyg-leaving', '');
            layer.querySelector('.kp-datatable__busy-panel')?.addEventListener('animationend', () => layer.remove(), { once: true });
            host.append(layer);
        }
    }
}).observe(document.body, { childList: true, subtree: true });
