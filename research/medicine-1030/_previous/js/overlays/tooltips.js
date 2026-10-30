// Tooltips: attaches them to the elements that carry one.
import { playEntranceBackwards, stopReversing } from '../motion.js';
import { TOOLTIP_EVENT, TOOLTIP_OWNED } from './constants.js';

/**
 * Framework-free tooltips on `.kp-tooltip-anchor` [gap-11].
 *
 *   <span class="kp-tooltip-anchor">
 *     <button type="button" class="kp-button">Recalibrate</button>
 *     <span role="tooltip" class="kp-popover kp-tooltip">Takes about two minutes</span>
 *   </span>
 *
 * The same contract as the React Tooltip: hidden at rest, shown after a
 * short delay under the pointer and at once on focus, gone when the
 * pointer or focus leaves, and gone on Escape (WCAG 1.4.13). The trigger
 * is described by the tooltip — an id is given where there was none, and
 * `aria-describedby` gains it rather than losing what it held. The anchor
 * names itself for anchor positioning, as the React channel does. Detach
 * puts back the attributes, the styles and the hidden state it found.
 *
 * @param {ParentNode} root
 * @param {{ openDelayMs?: number, closeDelayMs?: number, closeOnEscape?: boolean, ownedBy?: string }} [options]
 *   Per anchor: `data-kp-open-delay`, `data-kp-close-delay`, `data-kp-close-on-escape="false"`.
 * @returns {() => void} detach
 */
export function attachTooltips(root = document, { openDelayMs = 300, closeDelayMs = 100, closeOnEscape = true, ownedBy = TOOLTIP_OWNED } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    let count = 0;
    for (const el of root.querySelectorAll('.kp-tooltip-anchor')) {
        const anchor = /** @type {HTMLElement} */ (el);
        if (ownedBy !== '' && anchor.matches(ownedBy)) continue;
        if (anchor.dataset.kpTooltipAttached !== undefined) continue;
        const tooltip = /** @type {HTMLElement | null} */ (anchor.querySelector('[role="tooltip"], .kp-tooltip'));
        const trigger = /** @type {HTMLElement | null} */ ([...anchor.children].find((child) => child !== tooltip) ?? null);
        if (tooltip === null || trigger === null) continue;
        anchor.dataset.kpTooltipAttached = '';
        count += 1;

        const before = {
            id: tooltip.getAttribute('id'),
            hidden: tooltip.hidden,
            describedby: trigger.getAttribute('aria-describedby'),
            anchorName: anchor.style.getPropertyValue('anchor-name'),
            positionAnchor: tooltip.style.getPropertyValue('position-anchor'),
        };
        if (!tooltip.id) tooltip.id = `kp-tooltip-${count}-${Math.random().toString(36).slice(2, 8)}`;
        const ids = (before.describedby ?? '').split(/\s+/).filter(Boolean);
        if (!ids.includes(tooltip.id)) trigger.setAttribute('aria-describedby', [...ids, tooltip.id].join(' '));
        if (before.anchorName === '') anchor.style.setProperty('anchor-name', `--${tooltip.id}`);
        if (before.positionAnchor === '') tooltip.style.setProperty('position-anchor', before.anchorName || `--${tooltip.id}`);

        /** @param {string | undefined} value @param {number} fallback */
        const number = (value, fallback) => (value === undefined || Number.isNaN(Number(value)) ? fallback : Number(value));
        const openDelay = number(anchor.dataset.kpOpenDelay, openDelayMs);
        const closeDelay = number(anchor.dataset.kpCloseDelay, closeDelayMs);
        const escapes = anchor.dataset.kpCloseOnEscape === undefined ? closeOnEscape : anchor.dataset.kpCloseOnEscape !== 'false';

        let timer = 0;
        // Going, it plays its entrance backwards before it is hidden, so it
        // leaves as it came (Kenny, 2026-10-05: no discrepancy between
        // opening and closing); wanted back meanwhile, it turns round.
        let going = false;
        /** @param {boolean} open */
        const set = (open) => {
            clearTimeout(timer);
            if (open && going) {
                going = false;
                stopReversing(tooltip);
                anchor.dispatchEvent(new CustomEvent(TOOLTIP_EVENT, { bubbles: true, detail: { open, tooltip } }));
                return;
            }
            if (going || tooltip.hidden === !open) return;
            if (open) tooltip.hidden = false;
            else {
                going = true;
                void playEntranceBackwards(tooltip).then(() => {
                    // Wanted back meanwhile: set(true) took it over.
                    if (!going) return;
                    going = false;
                    tooltip.hidden = true;
                    stopReversing(tooltip);
                });
            }
            anchor.dispatchEvent(new CustomEvent(TOOLTIP_EVENT, { bubbles: true, detail: { open, tooltip } }));
        };
        /** @param {boolean} open @param {number} delay */
        const schedule = (open, delay) => {
            clearTimeout(timer);
            if (delay <= 0) set(open);
            else timer = window.setTimeout(() => set(open), delay);
        };
        const onEnter = () => schedule(true, openDelay);
        const onLeave = () => {
            if (!anchor.contains(document.activeElement)) schedule(false, closeDelay);
        };
        const onFocusIn = () => schedule(true, 0);
        const onFocusOut = () => schedule(false, 0);
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            if (escapes && event.key === 'Escape' && !tooltip.hidden) set(false);
        };

        tooltip.hidden = true;
        anchor.addEventListener('pointerenter', onEnter);
        anchor.addEventListener('pointerleave', onLeave);
        anchor.addEventListener('focusin', onFocusIn);
        anchor.addEventListener('focusout', onFocusOut);
        document.addEventListener('keydown', onKey);

        cleanups.push(() => {
            clearTimeout(timer);
            going = false;
            stopReversing(tooltip);
            anchor.removeEventListener('pointerenter', onEnter);
            anchor.removeEventListener('pointerleave', onLeave);
            anchor.removeEventListener('focusin', onFocusIn);
            anchor.removeEventListener('focusout', onFocusOut);
            document.removeEventListener('keydown', onKey);
            tooltip.hidden = before.hidden;
            if (before.id === null) tooltip.removeAttribute('id');
            if (before.describedby === null) trigger.removeAttribute('aria-describedby');
            else trigger.setAttribute('aria-describedby', before.describedby);
            if (before.anchorName === '') anchor.style.removeProperty('anchor-name');
            if (before.positionAnchor === '') tooltip.style.removeProperty('position-anchor');
            delete anchor.dataset.kpTooltipAttached;
        });
    }
    return () => {
        for (const c of cleanups) c();
    };
}
