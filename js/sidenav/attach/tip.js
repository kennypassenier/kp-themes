// The tip beside a rail item and the floating submenu.
import { FLOAT_GAP, FLOAT_MARGIN, TIP_OPEN_MS } from '../constants.js';
import { playEntranceBackwards, stopReversing } from '../../motion.js';
import { OPTIONS } from '../options.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the tip beside a rail item and the floating submenu part adds to the table's context.
 *
 * @typedef {{
 *     floatBeside: (box: HTMLElement, item: Element, align: 'start' | 'centre') => void;
 *     floated: Map<HTMLElement, { added: boolean; }>;
 *     hideTip: () => void;
 *     onTipFocus: (event: FocusEvent) => void;
 *     onTipOut: (event: PointerEvent) => void;
 *     onTipOver: (event: PointerEvent) => void;
 *     show: (box: HTMLElement, then: (() => void)) => void;
 *     submenuOf: (category: Element) => HTMLElement | null;
 *     tip: HTMLElement | null;
 *     tipTimer: number;
 *     toggleOf: (category: Element) => HTMLElement | null;
 * }} TipFields
 */

/**
 * The tip beside a rail item and the floating submenu.
 *
 * @param {SidenavContext} c
 */
export function installTip(c) {
    const { doc, edge, flying, isRail, on, panel } = c;

    /**
     * Place a box that floats beside the rail, in the top layer: beside
     * the item, on the far side of the panel, turned to the near side
     * when the window has no room there, and kept inside the window.
     *
     * @param {HTMLElement} box
     * @param {Element} item
     * @param {'start' | 'centre'} align
     */
    const floatBeside = (box, item, align) => {
        const at = item.getBoundingClientRect();
        const rail = panel.getBoundingClientRect();
        const width = box.offsetWidth;
        const height = box.offsetHeight;
        const view = doc.documentElement.clientWidth;
        const tall = doc.documentElement.clientHeight;
        const towardEnd = edge() !== 'end';
        let x = towardEnd ? rail.right + FLOAT_GAP : rail.left - FLOAT_GAP - width;
        if (towardEnd && x + width > view - FLOAT_MARGIN) x = rail.left - FLOAT_GAP - width;
        if (!towardEnd && x < FLOAT_MARGIN) x = rail.right + FLOAT_GAP;
        x = Math.max(FLOAT_MARGIN, Math.min(x, view - FLOAT_MARGIN - width));
        let y = align === 'centre' ? at.top + at.height / 2 - height / 2 : at.top;
        if (y + height > tall - FLOAT_MARGIN) y = align === 'centre' ? tall - FLOAT_MARGIN - height : at.bottom - height;
        y = Math.max(FLOAT_MARGIN, y);
        box.style.setProperty('--kp-sidenav-float-x', `${Math.round(x)}px`);
        box.style.setProperty('--kp-sidenav-float-y', `${Math.round(y)}px`);
    };
    c.floatBeside = floatBeside;
    /** Show a popover, once more a task later when Firefox refuses during another one's hide. @param {HTMLElement} box @param {() => void} then */
    const show = (box, then) => {
        try {
            box.showPopover();
            then();
        } catch {
            setTimeout(() => {
                try {
                    if (!box.matches(':popover-open')) box.showPopover();
                    then();
                } catch {
                    // Gone meanwhile: nothing to show.
                }
            }, 0);
        }
    };
    c.show = show;
    // The label tip: one per panel, the package's tooltip in the top layer.
    // It repeats the visible-to-nobody label, so it is hidden from the
    // accessibility tree; the label itself stays the item's name.
    /** @type {HTMLElement | null} */
    c.tip = null;
    /** @type {Element | null} */
    let tipFor = null;
    c.tipTimer = 0;
    let tipGoing = false;
    const tipItems = () => (flying() ? '.kp-sidenav__link' : '.kp-sidenav__link, .kp-sidenav__category-toggle');
    const hideTip = () => {
        clearTimeout(c.tipTimer);
        tipFor = null;
        const box = c.tip;
        if (box === null || !box.matches(':popover-open') || tipGoing) return;
        tipGoing = true;
        void playEntranceBackwards(box).then(() => {
            tipGoing = false;
            stopReversing(box);
            if (tipFor === null && box.matches(':popover-open')) box.hidePopover();
        });
    };
    c.hideTip = hideTip;
    /** @param {Element} item */
    const showTip = (item) => {
        clearTimeout(c.tipTimer);
        const words = (item.querySelector('.kp-sidenav__label')?.textContent ?? '').trim();
        if (!isRail() || !on(OPTIONS.railTips, true) || words === '') return;
        if (c.tip === null) {
            c.tip = doc.createElement('span');
            c.tip.className = 'kp-popover kp-tooltip kp-sidenav__tip';
            c.tip.setAttribute('popover', 'manual');
            c.tip.setAttribute('aria-hidden', 'true');
            panel.append(c.tip);
        }
        const box = c.tip;
        tipFor = item;
        if (tipGoing) {
            tipGoing = false;
            stopReversing(box);
        }
        box.textContent = words;
        const place = () => floatBeside(box, item, 'centre');
        if (box.matches(':popover-open')) place();
        else show(box, place);
    };
    /** @param {PointerEvent} event */
    const onTipOver = (event) => {
        const item = event.target instanceof Element ? event.target.closest(tipItems()) : null;
        if (item === null || !panel.contains(item) || item === tipFor || (c.tip !== null && c.tip.contains(item))) return;
        if (item.closest('.kp-sidenav__flyout') !== null) return;
        clearTimeout(c.tipTimer);
        // Moving along the rail with a tip up changes it at once, as a toolbar's tips do.
        if (c.tip?.matches(':popover-open') && !tipGoing) showTip(item);
        else c.tipTimer = window.setTimeout(() => showTip(item), TIP_OPEN_MS);
    };
    c.onTipOver = onTipOver;
    /** @param {PointerEvent} event */
    const onTipOut = (event) => {
        const to = event.relatedTarget instanceof Element ? event.relatedTarget.closest(tipItems()) : null;
        if (to !== null && panel.contains(to) && to.closest('.kp-sidenav__flyout') === null) return;
        hideTip();
    };
    c.onTipOut = onTipOut;
    /** @param {FocusEvent} event */
    const onTipFocus = (event) => {
        const item = event.target instanceof Element ? event.target.closest(tipItems()) : null;
        if (item === null || item.closest('.kp-sidenav__flyout') !== null) return hideTip();
        showTip(item);
    };
    c.onTipFocus = onTipFocus;
    // The groups that float out.
    /** @type {Map<HTMLElement, { added: boolean }>} */
    const floated = new Map();
    c.floated = floated;
    /** @param {Element} category */
    const submenuOf = (category) => /** @type {HTMLElement | null} */ (category.querySelector(':scope > .kp-sidenav__submenu'));
    c.submenuOf = submenuOf;
    /** @param {Element} category */
    const toggleOf = (category) => /** @type {HTMLElement | null} */ (category.querySelector(':scope > .kp-sidenav__category-toggle'));
    c.toggleOf = toggleOf;
}
