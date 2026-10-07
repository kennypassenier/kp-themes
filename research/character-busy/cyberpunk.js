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

// The failure alert's leave. The alert is hidden with `hidden`, which the base
// layer pins to `display: none !important`, so a ghost of it (a clone that is
// not hidden, inert and unheard) plays `cyg-split-out` and its brackets open
// again (cyberpunk.css), then goes; a fresh alert removes the ghost at once.
const ALERT = '[data-kp-datatable-failed]';

new MutationObserver((records) => {
    if (document.documentElement.getAttribute('data-theme') !== 'cyberpunk') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const record of records) {
        const alert = /** @type {HTMLElement} */ (record.target);
        if (!alert.matches(ALERT) || alert.hasAttribute('data-cyg-ghost') || !alert.closest('[data-bo-failure="1"]')) continue;
        for (const ghost of alert.parentElement?.querySelectorAll(`:scope > ${ALERT}[data-cyg-ghost]`) ?? []) ghost.remove();
        if (!alert.hidden || record.oldValue !== null) continue;
        const ghost = /** @type {HTMLElement} */ (alert.cloneNode(true));
        ghost.hidden = false;
        ghost.setAttribute('data-cyg-ghost', '');
        ghost.setAttribute('aria-hidden', 'true');
        ghost.removeAttribute('role');
        ghost.inert = true;
        ghost.addEventListener('animationend', (event) => event.target === ghost && ghost.remove());
        alert.after(ghost);
    }
}).observe(document.body, { attributes: true, attributeFilter: ['hidden'], attributeOldValue: true, subtree: true });
