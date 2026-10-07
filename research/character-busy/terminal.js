// research/character-busy, terminal: the busy overlay's leave. The package
// removes the layer the instant the table stops loading (`drawOverlay()` in
// js/datatable.js calls `.remove()` with no window), so the layer that was
// typed in could not be untyped (themes/terminal/CHARACTER.md G2: what leaves
// on its own is the arrival played backwards, frame for frame). This puts the
// removed layer back for one typing time and plays the arrival's keyframes
// `reverse` (`tmg-type-back`, terminal.css), then drops it. Only in terminal,
// only when the arrival is the decided "typed", never under reduced motion,
// and never when a fresh layer replaces the old one in the same breath.

const LAYER = 'kp-datatable__busy-overlay';
const isLayer = (/** @type {Node} */ node) => node instanceof HTMLElement && node.classList.contains(LAYER);

new MutationObserver((records) => {
    if (document.documentElement.getAttribute('data-theme') !== 'terminal') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const record of records) {
        const host = /** @type {HTMLElement} */ (record.target);
        if (!host.matches('[data-bo-arrival="1"]') && !host.closest('[data-bo-arrival="1"]')) continue;
        for (const node of record.removedNodes) {
            if (!isLayer(node) || host.querySelector(`:scope > .${LAYER}`)) continue;
            const layer = /** @type {HTMLElement} */ (node);
            if (layer.hasAttribute('data-tmg-leaving')) continue;
            layer.setAttribute('data-tmg-leaving', '');
            layer.addEventListener('animationend', () => layer.remove(), { once: true });
            host.append(layer);
        }
    }
}).observe(document.body, { childList: true, subtree: true });
