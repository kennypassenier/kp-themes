// Attaches the menu buttons of a page.
import { MENU_BUTTON, MENU_SELECT_EVENT } from './constants.js';
import { countMenu } from './count.js';
import { ITEM_ROLES, decorateItem, labelOf, menuItems } from './items.js';
import { menuKeyTarget } from './keys.js';
import { menus } from './model.js';
import { closeMenu, decorateButton, openMenu, wireMenu } from './open.js';
/** @typedef {import('./types.js').MenuButtonOptions} MenuButtonOptions */
/** @typedef {import('./types.js').MenuState} MenuState */

/** The wrappers some `attachMenuButtons` already listens on, so a second call is a no-op for them. */
const attached = new WeakSet();

/**
 * Wire every menu button under `root`: the button opens and closes the menu,
 * and the menu answers the keys of a menu (APG menu button). A disabled
 * entry (`aria-disabled`) keeps the focus, so its reason is read; it does
 * nothing. Idempotent.
 * @param {ParentNode} [root]
 * @param {MenuButtonOptions} [options]
 * @returns {() => void} detach
 */
export function attachMenuButtons(root = document, { decorate, strings } = {}) {
    /** @type {(() => void)[]} */
    const undo = [];
    for (const wrapper of /** @type {HTMLElement[]} */ ([...root.querySelectorAll(MENU_BUTTON)])) {
        if (attached.has(wrapper)) continue;
        let s = menus.get(wrapper);
        if (s) {
            // Filled before it was attached: the options join now, and the
            // controls already built are handed to `decorate`.
            if (decorate) s.decorate = decorate;
            if (strings) s.strings = strings;
            if (decorate) {
                decorateButton(s);
                menuItems(s).forEach((item, index) => decorateItem(/** @type {MenuState} */ (s), item, index));
            }
        } else s = wireMenu(wrapper, { decorate, strings }) ?? undefined;
        if (!s) continue;
        const state = s;
        attached.add(wrapper);
        const onClick = () => {
            if (state.button.getAttribute('aria-disabled') === 'true') return;
            if (state.open) closeMenu(wrapper);
            else openMenu(wrapper, { focus: 'first' });
        };
        /** @param {KeyboardEvent} event */
        const onButtonKey = (event) => {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
            event.preventDefault();
            if (state.open) closeMenu(wrapper);
            openMenu(wrapper, { focus: event.key === 'ArrowUp' ? 'last' : 'first' });
        };
        /** @param {MouseEvent} event */
        const onPick = (event) => {
            const item = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest(ITEM_ROLES) : null);
            if (!item || !state.menu.contains(item)) return;
            if (item.getAttribute('aria-disabled') === 'true') {
                event.preventDefault();
                return;
            }
            const value = item.dataset.kpValue ?? labelOf(item);
            const go = wrapper.dispatchEvent(new CustomEvent(MENU_SELECT_EVENT, { bubbles: true, cancelable: true, detail: { item, value } }));
            if (!go) {
                event.preventDefault();
                return;
            }
            closeMenu(wrapper, { focus: !item.matches('a[href]') });
        };
        /** @param {KeyboardEvent} event */
        const onMenuKey = (event) => {
            const items = menuItems(state);
            if (!items.length) return;
            const active = /** @type {HTMLElement | null} */ (state.menu.ownerDocument.activeElement);
            if (event.key === 'Tab') {
                // The focus goes back to the button first, so the browser's
                // own Tab moves on from there: to what follows the button,
                // or (with Shift) to what comes before it.
                closeMenu(wrapper, { focus: true });
                return;
            }
            if (event.key === ' ' && active?.matches('a[href]')) {
                event.preventDefault();
                active.click();
                return;
            }
            const to = menuKeyTarget(event, items.indexOf(/** @type {HTMLElement} */ (active)), items.map(labelOf));
            if (to == null) return;
            event.preventDefault();
            items[to].focus();
        };
        state.button.addEventListener('click', onClick);
        state.button.addEventListener('keydown', onButtonKey);
        state.menu.addEventListener('click', onPick);
        state.menu.addEventListener('keydown', onMenuKey);
        undo.push(() => {
            closeMenu(wrapper);
            state.button.removeEventListener('click', onClick);
            state.button.removeEventListener('keydown', onButtonKey);
            state.menu.removeEventListener('click', onPick);
            state.menu.removeEventListener('keydown', onMenuKey);
            attached.delete(wrapper);
            menus.delete(wrapper);
        });
    }
    // A popover with a menu in it has no wrapper to wire, but a register that
    // rules its lines needs the same count.
    for (const menu of /** @type {HTMLElement[]} */ ([...root.querySelectorAll('.kp-popover[popover] > .kp-menu')])) countMenu(menu);
    return () => undo.splice(0).forEach((off) => off());
}
