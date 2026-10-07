// research/character-chart, cyberpunk: the tooltip's close. chart.js hides the
// tooltip by setting `hidden`, and the base theme layer holds `[hidden]` at
// `display: none !important`, so no rule can keep the tooltip itself on screen
// for a leave (themes/cyberpunk/CHARACTER.md G3, G12: a close is its open
// reversed). This leaves a ghost of the tooltip, a clone that is not hidden,
// inert and unheard (cyberpunk.css plays `cyg-split-out` on it), and removes it
// when that ends or when the tooltip is shown again. Only in cyberpunk, only
// for the decided tooltip, never under reduced motion.

const GHOST = 'data-cyg-ghost';

new MutationObserver((records) => {
    if (document.documentElement.getAttribute('data-theme') !== 'cyberpunk') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const record of records) {
        const tip = /** @type {HTMLElement} */ (record.target);
        if (!tip.classList.contains('kp-chart__tip') || tip.hasAttribute(GHOST) || !tip.closest('[data-cc-tip="a"]')) continue;
        const ghosts = () => tip.parentElement?.querySelectorAll(`:scope > .kp-chart__tip[${GHOST}]`) ?? [];
        if (!tip.hidden) {
            for (const ghost of ghosts()) ghost.remove();
        } else if (record.oldValue === null) {
            for (const ghost of ghosts()) ghost.remove();
            const ghost = /** @type {HTMLElement} */ (tip.cloneNode(true));
            ghost.hidden = false;
            ghost.removeAttribute('id');
            ghost.setAttribute(GHOST, '');
            ghost.setAttribute('aria-hidden', 'true');
            ghost.inert = true;
            ghost.addEventListener('animationend', () => ghost.remove(), { once: true });
            tip.after(ghost);
        }
    }
}).observe(document.body, { attributes: true, attributeFilter: ['hidden'], attributeOldValue: true, subtree: true });
