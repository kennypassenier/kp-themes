// Opens, closes and keys the navigation dropdowns.
import { getStrings } from '../strings.js';
import { NAV_OWNED } from './nav-toggle.js';
import { DROPDOWN, placeNavMenu, placeNavPanel } from './nav-place.js';

/**
 * Wire every bar's dropdowns and mega menus [fix-27, scope-48].
 *
 * Dropdowns open on hover and on focus within, in CSS; this only places an
 * open one so it stays in the window (`placeNavMenu`), when it opens and
 * again when the window changes size.
 *
 * A mega menu is a `data-kp-nav-disclosure` button beside a
 * `.kp-nav__menu--wide` panel. The button gets `aria-expanded` and an
 * `aria-controls` naming the panel (an id is given when the panel has
 * none), and the panel shows while it says `true`. Every open state has a
 * way out [KT6]: the button again, Escape while the focus is in the bar
 * (the focus goes back to the button), a click outside the item, and the
 * focus leaving it. One panel is open at a time: opening one closes the
 * others. A button with no words of its own is named from the dictionary
 * (`navDisclosure`). The React NavBar wires its own bar and marks it
 * `data-kp-nav-owner`, so this module leaves that bar alone [AR29].
 *
 * @param {ParentNode} root
 * @param {{ strings?: Partial<import('../strings.js').Strings>, ownedBy?: string }} [options]
 * @returns {() => void} detach
 */
export function attachNavMenus(root = document, { strings, ownedBy = NAV_OWNED } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    const navs = [...(root instanceof Element && root.matches('.kp-nav') ? [root] : []), ...root.querySelectorAll('.kp-nav')];

    for (const el of navs) {
        const nav = /** @type {HTMLElement} */ (el);
        if (ownedBy !== '' && nav.matches(ownedBy)) continue;
        if (nav.dataset.kpNavMenusAttached !== undefined) continue;
        nav.dataset.kpNavMenusAttached = '';

        /** @param {EventTarget | null} target */
        const itemOf = (target) => (target instanceof Element ? target.closest('.kp-nav__links > li') : null);

        /** @param {Event} event */
        const onEnter = (event) => {
            const item = itemOf(event.target);
            if (item && nav.contains(item) && item.querySelector(DROPDOWN)) placeNavMenu(item);
        };
        const placeOpen = () => {
            for (const item of nav.querySelectorAll('.kp-nav__links > li')) if (item.querySelector(DROPDOWN)) placeNavMenu(item, false);
            for (const panel of nav.querySelectorAll('.kp-nav__links > li > .kp-nav__menu--wide')) placeNavPanel(panel);
        };

        const buttons = /** @type {HTMLElement[]} */ ([...nav.querySelectorAll('[data-kp-nav-disclosure]')]);
        /** @type {Map<HTMLElement, { panel: Element | null, stamped: string[] }>} */
        const wired = new Map();
        for (const button of buttons) {
            const panel = button.parentElement?.querySelector(':scope > .kp-nav__menu--wide') ?? null;
            /** @type {string[]} */
            const stamped = ['aria-expanded'];
            if (panel && !panel.id) panel.id = `kp-nav-panel-${Math.random().toString(36).slice(2, 10)}`;
            if (panel && !button.hasAttribute('aria-controls')) {
                button.setAttribute('aria-controls', panel.id);
                stamped.push('aria-controls');
            }
            if (!(button.textContent ?? '').trim() && !button.hasAttribute('aria-label') && !button.hasAttribute('aria-labelledby')) {
                button.setAttribute('aria-label', { ...getStrings(), ...strings }.navDisclosure);
                stamped.push('aria-label');
            }
            button.setAttribute('aria-expanded', 'false');
            wired.set(button, { panel, stamped });
        }

        const openButton = () => buttons.find((b) => b.getAttribute('aria-expanded') === 'true') ?? null;
        /**
         * A panel that is closing stays on screen, `[data-kp-nav-closing]` on its
         * item, until the transitions the theme runs to the closed state have
         * played; a panel with none is gone on the next frame, as before.
         * @param {HTMLElement} item
         * @param {Element | null | undefined} panel
         */
        const settleClosing = (item, panel) => {
            item.setAttribute('data-kp-nav-closing', '');
            requestAnimationFrame(() => {
                if (!item.hasAttribute('data-kp-nav-closing')) return;
                const plays = (panel?.getAnimations() ?? []).filter((a) => typeof CSSTransition !== 'undefined' && a instanceof CSSTransition);
                void Promise.all(plays.map((a) => a.finished.catch(() => undefined))).then(() => item.removeAttribute('data-kp-nav-closing'));
            });
        };
        /** @param {HTMLElement} button @param {boolean} open */
        const set = (button, open) => {
            if (open) for (const other of buttons) if (other !== button && other.getAttribute('aria-expanded') === 'true') set(other, false);
            const was = button.getAttribute('aria-expanded') === 'true';
            const panel = wired.get(button)?.panel;
            const item = button.parentElement;
            if (open) item?.removeAttribute('data-kp-nav-closing');
            button.setAttribute('aria-expanded', String(open));
            if (open && panel) placeNavPanel(panel);
            if (!open && was && item) settleClosing(item, panel);
        };

        // A dropdown that opens on hover and focus closes in CSS, the instant
        // the pointer or the focus leaves, which no engine can hold open for a
        // close that plays (Firefox does not hold `display`). A register that
        // plays one (`--kp-nav-close-time`, cyberpunk) gets the same hold as
        // the mega menu: the item is marked while the close plays.
        const holdsClose = () => getComputedStyle(nav).getPropertyValue('--kp-nav-close-time').trim() !== '';
        /** @param {Event} event */
        const onLeave = (event) => {
            if (!holdsClose()) return;
            const item = itemOf(event.target);
            if (!item || !nav.contains(item)) return;
            const panel = item.querySelector(DROPDOWN);
            if (!panel) return;
            const to = /** @type {FocusEvent | PointerEvent} */ (event).relatedTarget;
            if (to instanceof Node && item.contains(to)) return;
            // Still held open by the other way in (the state is read before the
            // leaving event's own effect lands, so only the other one counts).
            if (item.hasAttribute('data-kp-nav-menu-open')) return;
            if (event.type === 'pointerout' ? item.matches(':focus-within') : item.matches(':hover')) return;
            // Held for the close's own time, not for a transition: the pointer's
            // `:hover` may not have changed yet when this runs, so none has begun.
            const raw = getComputedStyle(nav).getPropertyValue('--kp-nav-close-time').trim();
            const ms = raw.endsWith('ms') ? parseFloat(raw) : parseFloat(raw) * 1000;
            if (!(ms > 0)) return;
            item.setAttribute('data-kp-nav-closing', '');
            setTimeout(() => {
                if (!item.matches(':hover, :focus-within, [data-kp-nav-menu-open]')) item.removeAttribute('data-kp-nav-closing');
            }, ms || 0);
        };
        /** @param {Event} event */
        const onReturn = (event) => {
            const item = itemOf(event.target);
            if (item?.hasAttribute('data-kp-nav-closing') && item.querySelector(DROPDOWN)) item.removeAttribute('data-kp-nav-closing');
        };

        /** @param {Event} event */
        const onClick = (event) => {
            const button = /** @type {HTMLElement} */ (event.currentTarget);
            set(button, button.getAttribute('aria-expanded') !== 'true');
        };
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            const button = openButton();
            if (event.key !== 'Escape' || !button) return;
            set(button, false);
            button.focus();
        };
        /** @param {Event} event */
        const onOutside = (event) => {
            const button = openButton();
            if (!button) return;
            if (button.parentElement?.contains(/** @type {Node} */ (event.target))) return;
            set(button, false);
        };
        /** @param {FocusEvent} event */
        const onFocusOut = (event) => {
            const button = openButton();
            const to = event.relatedTarget;
            // A press on the panel's ground moves the focus nowhere; that is not leaving.
            if (!button || !(to instanceof Node)) return;
            if (button.parentElement?.contains(to)) return;
            set(button, false);
        };

        nav.addEventListener('pointerover', onEnter);
        nav.addEventListener('focusin', onEnter);
        nav.addEventListener('pointerover', onReturn);
        nav.addEventListener('focusin', onReturn);
        nav.addEventListener('pointerout', onLeave);
        nav.addEventListener('focusout', onLeave);
        nav.addEventListener('keydown', /** @type {EventListener} */ (onKey));
        nav.addEventListener('focusout', /** @type {EventListener} */ (onFocusOut));
        for (const button of buttons) button.addEventListener('click', onClick);
        document.addEventListener('click', onOutside, true);
        window.addEventListener('resize', placeOpen);
        placeOpen();

        cleanups.push(() => {
            nav.removeEventListener('pointerover', onEnter);
            nav.removeEventListener('focusin', onEnter);
            nav.removeEventListener('pointerover', onReturn);
            nav.removeEventListener('focusin', onReturn);
            nav.removeEventListener('pointerout', onLeave);
            nav.removeEventListener('focusout', onLeave);
            nav.removeEventListener('keydown', /** @type {EventListener} */ (onKey));
            nav.removeEventListener('focusout', /** @type {EventListener} */ (onFocusOut));
            document.removeEventListener('click', onOutside, true);
            window.removeEventListener('resize', placeOpen);
            for (const [button, { stamped }] of wired) {
                button.removeEventListener('click', onClick);
                for (const name of stamped) button.removeAttribute(name);
            }
            for (const menu of nav.querySelectorAll('[data-kp-nav-menu-end]')) menu.removeAttribute('data-kp-nav-menu-end');
            for (const menu of nav.querySelectorAll('.kp-nav__menu')) {
                /** @type {HTMLElement} */ (menu).style.removeProperty('--kp-nav-menu-shift');
            }
            for (const panel of nav.querySelectorAll('.kp-nav__menu--wide')) {
                /** @type {HTMLElement} */ (panel).style.removeProperty('--kp-nav-mega-start');
                /** @type {HTMLElement} */ (panel).style.removeProperty('--kp-nav-mega-end');
            }
            delete nav.dataset.kpNavMenusAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}
