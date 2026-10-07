// research/character-chart, cyberpunk: the tooltip's close. chart.js hides the
// tooltip by setting `hidden` (display: none at once), so a tooltip that split
// in could not split out (themes/cyberpunk/CHARACTER.md G3, G12: a close is its
// open reversed). This marks a tooltip that has just been hidden, cyberpunk.css
// keeps it displayed for one split (480 ms) and plays `cyg-split-out` on it,
// and the mark is dropped when that ends (or when the tooltip is shown again).
// Only in cyberpunk, only for the decided tooltip, never under reduced motion.

new MutationObserver((records) => {
    if (document.documentElement.getAttribute('data-theme') !== 'cyberpunk') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const record of records) {
        const tip = /** @type {HTMLElement} */ (record.target);
        if (!tip.classList.contains('kp-chart__tip') || !tip.closest('[data-cc-tip="a"]')) continue;
        if (tip.hidden && record.oldValue === null) {
            tip.setAttribute('data-cyg-leaving', '');
            tip.addEventListener('animationend', () => tip.removeAttribute('data-cyg-leaving'), { once: true });
        } else if (!tip.hidden) tip.removeAttribute('data-cyg-leaving');
    }
}).observe(document.body, { attributes: true, attributeFilter: ['hidden'], attributeOldValue: true, subtree: true });
