// The fly-out of a rail item: opening, closing and its timers.
import { OPTIONS } from '../options.js';
import { FOCUSABLE } from '../helpers.js';
import { FLYOUT_CLOSE_MS, FLYOUT_OPEN_MS } from '../constants.js';
/** @typedef {import('./context.js').SidenavContext} SidenavContext */

/**
 * What the the fly-out of a rail item: opening, closing and its timers part adds to the table's context.
 *
 * @typedef {{
 *     flyIn: (category: Element, arg1?: { refocus?: boolean | undefined; }) => void;
 *     flyOut: (category: Element, arg1?: { focusFirst?: boolean | undefined; }) => void;
 *     flyTimers: Map<Element, number>;
 *     onFlyFocusOut: (event: FocusEvent) => void;
 *     onFlyOut: (event: PointerEvent) => void;
 *     onFlyOver: (event: PointerEvent) => void;
 *     syncRail: () => void;
 * }} FlyoutFields
 */

/**
 * The fly-out of a rail item: opening, closing and its timers.
 *
 * @param {SidenavContext} c
 */
export function installFlyout(c) {
    const { doc, floatBeside, floated, flying, hideTip, isRail, panel, show, submenuOf, toggleOf } = c;

    /** @param {Element} category @param {{ focusFirst?: boolean }} [options] */
    const flyOut = (category, { focusFirst = false } = {}) => {
        const submenu = submenuOf(category);
        if (submenu === null || !floated.has(submenu)) return;
        for (const other of panel.querySelectorAll(`.kp-sidenav__category[${OPTIONS.flown}]`)) if (other !== category) flyIn(other);
        hideTip();
        category.setAttribute(OPTIONS.flown, '');
        toggleOf(category)?.setAttribute('aria-expanded', 'true');
        const toggle = toggleOf(category) ?? category;
        show(submenu, () => {
            floatBeside(submenu, toggle, 'start');
            if (focusFirst) /** @type {HTMLElement | null} */ (submenu.querySelector(FOCUSABLE))?.focus({ preventScroll: true });
        });
    };
    c.flyOut = flyOut;
    /** @param {Element} category @param {{ refocus?: boolean }} [options] */
    const flyIn = (category, { refocus = false } = {}) => {
        const submenu = submenuOf(category);
        category.removeAttribute(OPTIONS.flown);
        toggleOf(category)?.setAttribute('aria-expanded', String(category.hasAttribute(OPTIONS.expanded) && !flying()));
        // js/motion.js plays the theme's popover close as its opening backwards.
        if (submenu?.matches(':popover-open')) submenu.hidePopover();
        // The focus comes back to the group's heading when the close is
        // over, not when it starts (docs/THEME_LESSONS.md 45).
        if (refocus) {
            const toggle = toggleOf(category);
            requestAnimationFrame(() => {
                const motions = category.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {}));
                void Promise.all(motions).then(() => {
                    if (!category.hasAttribute(OPTIONS.flown) && toggle?.isConnected) toggle.focus({ preventScroll: true });
                });
            });
        }
    };
    c.flyIn = flyIn;
    /** Make the groups float out in the collapsed rail, and fold in place again outside it. */
    const syncRail = () => {
        if (!isRail()) hideTip();
        const fly = flying();
        for (const category of panel.querySelectorAll('.kp-sidenav__category')) {
            const submenu = submenuOf(category);
            if (submenu === null) continue;
            if (fly && !floated.has(submenu)) {
                floated.set(submenu, { added: !submenu.hasAttribute('popover') });
                submenu.setAttribute('popover', 'manual');
                submenu.classList.add('kp-popover', 'kp-sidenav__flyout');
                toggleOf(category)?.setAttribute('aria-expanded', 'false');
            } else if (!fly && floated.has(submenu)) {
                flyIn(category);
                const { added } = /** @type {{ added: boolean }} */ (floated.get(submenu));
                floated.delete(submenu);
                submenu.classList.remove('kp-popover', 'kp-sidenav__flyout');
                if (added) submenu.removeAttribute('popover');
                toggleOf(category)?.setAttribute('aria-expanded', String(category.hasAttribute(OPTIONS.expanded)));
            }
        }
    };
    c.syncRail = syncRail;
    /** @type {Map<Element, number>} */
    const flyTimers = new Map();
    c.flyTimers = flyTimers;
    /** @param {PointerEvent} event */
    const onFlyOver = (event) => {
        if (!flying() || event.pointerType === 'touch') return;
        const category = event.target instanceof Element ? event.target.closest('.kp-sidenav__category') : null;
        if (category === null || !panel.contains(category)) return;
        clearTimeout(flyTimers.get(category));
        if (category.hasAttribute(OPTIONS.flown)) return;
        flyTimers.set(
            category,
            window.setTimeout(() => flyOut(category), FLYOUT_OPEN_MS),
        );
    };
    c.onFlyOver = onFlyOver;
    /** @param {PointerEvent} event */
    const onFlyOut = (event) => {
        const category = event.target instanceof Element ? event.target.closest('.kp-sidenav__category') : null;
        if (category === null || !panel.contains(category)) return;
        if (event.relatedTarget instanceof Node && category.contains(event.relatedTarget)) return;
        clearTimeout(flyTimers.get(category));
        if (!category.hasAttribute(OPTIONS.flown)) return;
        flyTimers.set(
            category,
            window.setTimeout(() => {
                if (!category.matches(':hover') && !category.contains(doc.activeElement)) flyIn(category);
            }, FLYOUT_CLOSE_MS),
        );
    };
    c.onFlyOut = onFlyOut;
    /** @param {FocusEvent} event */
    const onFlyFocusOut = (event) => {
        const category = event.target instanceof Element ? event.target.closest(`.kp-sidenav__category[${OPTIONS.flown}]`) : null;
        if (category === null) return;
        if (event.relatedTarget instanceof Node && category.contains(event.relatedTarget)) return;
        if (!category.matches(':hover')) flyIn(category);
    };
    c.onFlyFocusOut = onFlyFocusOut;
}
