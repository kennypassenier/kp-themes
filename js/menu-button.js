// A menu button with a rich menu: every other action, grouped [scope-143].
//
// The homelab dashboard's "More ▾" (port spec B), moved into the package on
// the menu it already has: the menu is a `.kp-menu` with `.kp-menu__item`
// entries, the registers paint it as they paint every menu, and the keys are
// the ones the data table's column menu answers (↓ ↑ wrap, Home, End). What
// this adds is the rich shape and the wiring a menu button needs:
//
//   <div class="kp-menu-button" data-kp-menu-button data-kp-key="pump-more">
//     <button type="button" class="kp-button">More ▾</button>
//     <div class="kp-menu kp-menu--rich" role="menu" aria-label="Every other action"></div>
//   </div>
//
// setMenu(wrapper, groups) fills it: groups of entries under small muted
// capitals (`.kp-menu__heading`, which names its `role="group"`), each entry
// a label over a one-line hint. An entry that cannot be used now stays in
// the list and in the keyboard's reach (`aria-disabled`, focusable, as the
// APG menu pattern asks), keeps its hint, and says why under it
// (`.kp-menu__reason`), as its accessible description too; it does nothing.
// A fill that shows the same as now is skipped, and while the menu is open a
// new fill waits until it closes, so a live refill never moves an entry
// under the pointer or the focus.
//
// The keys are a menu's: ↓ or ↑ on the button opens it on the first or last
// entry; ↓ ↑ (wrapping), Home and End move; a letter jumps to the next entry
// that starts with it; Esc closes and refocuses the button, and the page's
// own Escape listeners hear nothing; Tab closes and moves on from the
// button. A click outside closes it. A pick fires `kp-menu-select`, which a
// page may cancel to keep the menu open.
//
// Every word is in the dictionary (`menuLoading`, `menuEmpty` in
// js/strings.js). `decorate(part, info)` is called with the button and with
// every entry, each time one is built, so a consumer can mark them. Nothing
// runs on import; attachMenuButtons(root) returns a detach.

import { resolveStrings } from './strings.js';

/** A menu button's wrapper: a button, then its `[role=menu]`. */
export const MENU_BUTTON = '[data-kp-menu-button]';

/** Fired on the wrapper, bubbling, when the menu opened. */
export const MENU_OPEN_EVENT = 'kp-menu-open';
/** Fired on the wrapper, bubbling, when the menu closed. */
export const MENU_CLOSE_EVENT = 'kp-menu-close';
/** Fired on the wrapper, bubbling, when an entry was picked: `{ item, value }`. Cancelable: preventing it keeps the menu open. */
export const MENU_SELECT_EVENT = 'kp-menu-select';

/** @typedef {import('./strings.js').Strings} Strings */

/**
 * One entry of a menu.
 * @typedef {object} MenuItem
 * @property {string} label what the action is called
 * @property {string} [hint] what it does, in one line
 * @property {string} [href] a link rather than a button
 * @property {string} [download] with `href`: the file name to save under
 * @property {string | null} [disabled] why it cannot be used now; the entry stays, keeps its hint, and says this under it
 * @property {boolean} [danger] a destructive action, in the destructive colour
 * @property {Record<string, string | null>} [attrs] more attributes for the entry (`null` removes one)
 * @property {string} [value] what `kp-menu-select` reports (`data-kp-value`); the label when absent
 */

/**
 * A group of entries under its heading. A nameless group, or a menu of one
 * entry, has no heading.
 * @typedef {object} MenuGroup
 * @property {string} group its heading
 * @property {MenuItem[]} items
 */

/**
 * What `decorate` is told about the control it is handed: the same shape every kp module's `decorate` takes.
 * `kind` is `menu-button` (the button that opens the menu) or `menu-item` (an entry; `index` counts from 0 across
 * the groups, `label` is its label, `value` its `data-kp-value`). `host` is the wrapper and `key` its `data-kp-key`.
 * @typedef {{ kind: 'menu-button' | 'menu-item', host: HTMLElement, key?: string, index?: number, label?: string, value?: string }} MenuDecorateInfo
 */

/**
 * @typedef {object} MenuButtonOptions
 * @property {(part: HTMLElement, info: MenuDecorateInfo) => void} [decorate]  Called with the button and every entry the menu builds,
 *   each time it builds one, so the consumer can mark them [R-DRIVE].
 * @property {Partial<Strings>} [strings]  any of the dictionary's `menu…` words, for these menus only
 */

/**
 * @typedef {object} MenuState
 * @property {HTMLElement} wrapper
 * @property {HTMLElement} button
 * @property {HTMLElement} menu
 * @property {((part: HTMLElement, info: MenuDecorateInfo) => void) | undefined} decorate
 * @property {Partial<Strings> | undefined} strings
 * @property {string} drawn what the menu shows now, as `menuSignature` writes it
 * @property {MenuGroup[] | 'loading' | null} pending a fill that waits for the menu to close
 * @property {boolean} open
 * @property {boolean} empty
 * @property {(() => void)[]} off what an open menu listens to, undone when it closes
 */

/** @type {WeakMap<Element, MenuState>} */
const menus = new WeakMap();

let idSeq = 0;
/** @param {string} prefix */
const nextId = (prefix) => `${prefix}-${(idSeq += 1)}`;

/** @param {Element} host @returns {string | undefined} */
const keyOf = (host) => host.getAttribute('data-kp-key') ?? undefined;

/**
 * What a fill shows, as one string: a fill that shows the same as the menu
 * does now is skipped.
 * @param {MenuGroup[] | 'loading'} groups
 * @returns {string}
 */
export const menuSignature = (groups) =>
    groups === 'loading'
        ? 'loading'
        : JSON.stringify(
              groups.map((g) => [
                  g.group,
                  g.items.map((i) => [
                      i.label,
                      i.hint ?? '',
                      i.href ?? '',
                      i.download ?? '',
                      i.disabled ?? '',
                      !!i.danger,
                      i.attrs ?? null,
                      i.value ?? '',
                  ]),
              ]),
          );

/**
 * Where a key moves the focus in an open menu, or null when the key is not
 * the menu's: ↓ and ↑ step and wrap, Home and End go to the ends, and a
 * printable letter goes to the next entry after `at` whose label starts with
 * it (wrapping, the entry at `at` itself last). `at` is -1 when no entry has
 * the focus.
 * @param {{ key: string, ctrlKey?: boolean, metaKey?: boolean, altKey?: boolean }} event
 * @param {number} at
 * @param {readonly string[]} labels every entry's label, in order
 * @returns {number | null}
 */
export function menuKeyTarget(event, at, labels) {
    const n = labels.length;
    if (!n) return null;
    const { key } = event;
    if (key === 'ArrowDown') return (at + 1) % n;
    if (key === 'ArrowUp') return (at - 1 + n) % n;
    if (key === 'Home') return 0;
    if (key === 'End') return n - 1;
    if (key.length !== 1 || key === ' ' || event.ctrlKey || event.metaKey || event.altKey) return null;
    const letter = key.toLocaleLowerCase();
    for (let step = 1; step <= n; step += 1) {
        const index = (((at + step) % n) + n) % n;
        if (labels[index].trim().toLocaleLowerCase().startsWith(letter)) return index;
    }
    return null;
}

/** @param {MenuState} s @returns {HTMLElement[]} */
const menuItems = (s) => /** @type {HTMLElement[]} */ ([...s.menu.querySelectorAll('[role="menuitem"]')]);

/** @param {HTMLElement} item */
const labelOf = (item) => item.querySelector('.kp-menu__label')?.textContent ?? item.textContent ?? '';

/** @param {MenuState} s @param {HTMLElement} item @param {number} index */
const decorateItem = (s, item, index) => {
    if (!s.decorate) return;
    /** @type {MenuDecorateInfo} */
    const info = { kind: 'menu-item', host: s.wrapper, index, label: labelOf(item) };
    const key = keyOf(s.wrapper);
    if (key !== undefined) info.key = key;
    if (item.dataset.kpValue !== undefined) info.value = item.dataset.kpValue;
    s.decorate(item, info);
};

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {Document} doc
 * @param {K} tag
 * @param {string} className
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
const make = (doc, tag, className, text) => {
    const el = doc.createElement(tag);
    el.className = className;
    if (text != null) el.textContent = text;
    return el;
};

/**
 * One entry: the label over the hint; a disabled one keeps its hint and
 * says why under it.
 * @param {Document} doc
 * @param {MenuItem} item
 * @returns {HTMLElement}
 */
function menuEntry(doc, item) {
    const el = /** @type {HTMLElement} */ (doc.createElement(item.href ? 'a' : 'button'));
    if (item.href) {
        el.setAttribute('href', item.href);
        if (item.download) el.setAttribute('download', item.download);
    } else el.setAttribute('type', 'button');
    el.setAttribute('role', 'menuitem');
    el.className = `kp-menu__item${item.danger ? ' kp-menu__item--destructive' : ''}`;
    el.tabIndex = -1;
    const label = make(doc, 'span', 'kp-menu__label', item.label);
    label.id = nextId('kp-menu-label');
    el.setAttribute('aria-labelledby', label.id);
    el.append(label);
    /** @type {string[]} */
    const described = [];
    if (item.hint) {
        const hint = make(doc, 'span', 'kp-menu__hint', item.hint);
        hint.id = nextId('kp-menu-hint');
        described.push(hint.id);
        el.append(hint);
    }
    if (item.disabled) {
        const reason = make(doc, 'span', 'kp-menu__hint kp-menu__reason', item.disabled);
        reason.id = nextId('kp-menu-reason');
        described.push(reason.id);
        el.append(reason);
        el.setAttribute('aria-disabled', 'true');
        el.dataset.kpReason = item.disabled;
    }
    if (described.length) el.setAttribute('aria-describedby', described.join(' '));
    el.title = item.disabled ?? item.hint ?? '';
    if (item.value) el.dataset.kpValue = item.value;
    for (const [name, value] of Object.entries(item.attrs ?? {})) {
        if (value == null) el.removeAttribute(name);
        else el.setAttribute(name, value);
    }
    return el;
}

/** @param {MenuState} s @param {MenuGroup[] | 'loading'} groups */
function drawMenu(s, groups) {
    const doc = s.menu.ownerDocument;
    const strings = resolveStrings(s.strings);
    s.drawn = menuSignature(groups);
    if (groups === 'loading') {
        // One disabled entry at the final row height: a label over a hint
        // line. The hint is a no-break space, which keeps its line; a plain
        // space collapsed and left the row a line short (39 px for 58.5).
        const entry = menuEntry(doc, { label: strings.menuLoading, hint: '\u00a0' });
        entry.setAttribute('aria-disabled', 'true');
        entry.dataset.kpLoading = '';
        s.menu.replaceChildren(entry);
        s.menu.setAttribute('aria-busy', 'true');
        setEmpty(s, false, strings);
        return;
    }
    s.menu.removeAttribute('aria-busy');
    const used = groups.filter((g) => g.items.length);
    const total = used.reduce((n, g) => n + g.items.length, 0);
    /** @type {HTMLElement[]} */
    const blocks = [];
    let index = 0;
    for (const group of used) {
        const block = make(doc, 'div', 'kp-menu__group');
        // One entry, or a nameless group: no heading, so nothing to name it by.
        if (group.group && total > 1) {
            const heading = make(doc, 'p', 'kp-menu__heading', group.group);
            heading.id = nextId('kp-menu-group');
            heading.setAttribute('role', 'presentation');
            block.setAttribute('role', 'group');
            block.setAttribute('aria-labelledby', heading.id);
            block.append(heading);
        } else block.setAttribute('role', 'none');
        for (const item of group.items) {
            const entry = menuEntry(doc, item);
            block.append(entry);
            decorateItem(s, entry, index);
            index += 1;
        }
        blocks.push(block);
    }
    s.menu.replaceChildren(...blocks);
    setEmpty(s, total === 0, strings);
}

/**
 * No entries: the button hides (`data-kp-menu-empty="hide"`) or stays,
 * `aria-disabled`, and says why it does nothing.
 * @param {MenuState} s
 * @param {boolean} empty
 * @param {Strings} strings
 */
function setEmpty(s, empty, strings) {
    s.empty = empty;
    const hide = s.wrapper.dataset.kpMenuEmpty === 'hide';
    s.wrapper.hidden = empty && hide;
    if (empty && !hide) {
        s.button.setAttribute('aria-disabled', 'true');
        s.button.title = strings.menuEmpty;
    } else if (s.button.getAttribute('aria-disabled') === 'true') {
        s.button.removeAttribute('aria-disabled');
        s.button.removeAttribute('title');
    }
}

/**
 * Open a menu button's menu and put the focus on its first (or last) entry;
 * `none` leaves the focus where it is (a page showing the menu on its own,
 * not the reader asking for it).
 * @param {Element} wrapper
 * @param {{ focus?: 'first' | 'last' | 'none' }} [options]
 */
export function openMenu(wrapper, { focus = 'first' } = {}) {
    const s = menus.get(wrapper);
    if (!s || s.open || s.empty) return;
    const doc = s.menu.ownerDocument;
    const view = doc.defaultView;
    s.open = true;
    s.menu.hidden = false;
    s.button.setAttribute('aria-expanded', 'true');
    /** @param {MouseEvent} event */
    const outside = (event) => {
        if (!s.wrapper.contains(/** @type {Node} */ (event.target))) closeMenu(s.wrapper);
    };
    /** @param {KeyboardEvent} event */
    const escape = (event) => {
        if (event.key !== 'Escape') return;
        // Capture, on the window: the menu's Escape is its own, and the
        // page's Escape (or a dialog's) does not fire as well.
        event.preventDefault();
        event.stopPropagation();
        closeMenu(s.wrapper, { focus: true });
    };
    doc.addEventListener('click', outside, true);
    view?.addEventListener('keydown', escape, true);
    s.off.push(
        () => doc.removeEventListener('click', outside, true),
        () => view?.removeEventListener('keydown', escape, true),
    );
    const items = menuItems(s);
    const target = focus === 'none' ? null : focus === 'last' ? items.at(-1) : items[0];
    target?.focus();
    s.wrapper.dispatchEvent(new CustomEvent(MENU_OPEN_EVENT, { bubbles: true }));
}

/**
 * Close it; with `focus`, the focus goes back to the button. A fill that
 * waited while it was open is drawn now.
 * @param {Element} wrapper
 * @param {{ focus?: boolean }} [options]
 */
export function closeMenu(wrapper, { focus = false } = {}) {
    const s = menus.get(wrapper);
    if (!s || !s.open) return;
    s.open = false;
    s.menu.hidden = true;
    s.button.setAttribute('aria-expanded', 'false');
    for (const off of s.off.splice(0)) off();
    if (focus) s.button.focus();
    if (s.pending) {
        const next = s.pending;
        s.pending = null;
        drawMenu(s, next);
    }
    s.wrapper.dispatchEvent(new CustomEvent(MENU_CLOSE_EVENT, { bubbles: true }));
}

/**
 * Give a menu button its entries. Skipped when they show the same as now;
 * while the menu is open the change waits until it closes, so a live refill
 * never moves an entry under the pointer or the focus. `'loading'` shows one
 * disabled entry at the final row height. A wrapper not attached yet is
 * wired (without listeners) so the fill is kept.
 * @param {Element} wrapper
 * @param {MenuGroup[] | 'loading'} groups
 */
export function setMenu(wrapper, groups) {
    const s = menus.get(wrapper) ?? wireMenu(/** @type {HTMLElement} */ (wrapper), {});
    if (!s) return;
    if (menuSignature(groups) === s.drawn) {
        s.pending = null;
        return;
    }
    if (s.open) {
        s.pending = groups;
        return;
    }
    drawMenu(s, groups);
}

/**
 * @param {HTMLElement} wrapper
 * @param {MenuButtonOptions} options
 * @returns {MenuState | null}
 */
function wireMenu(wrapper, { decorate, strings }) {
    const button = /** @type {HTMLElement | null} */ (wrapper.querySelector(':scope > button'));
    const menu = /** @type {HTMLElement | null} */ (wrapper.querySelector(':scope > [role="menu"]'));
    if (!button || !menu) return null;
    if (!menu.id) menu.id = nextId('kp-menu');
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-controls', menu.id);
    button.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
    /** @type {MenuState} */
    const s = { wrapper, button, menu, decorate, strings, drawn: '', pending: null, open: false, empty: false, off: [] };
    menus.set(wrapper, s);
    decorateButton(s);
    menuItems(s).forEach((item, index) => {
        item.tabIndex = -1;
        decorateItem(s, item, index);
    });
    return s;
}

/** @param {MenuState} s */
const decorateButton = (s) => {
    if (!s.decorate) return;
    /** @type {MenuDecorateInfo} */
    const info = { kind: 'menu-button', host: s.wrapper };
    const key = keyOf(s.wrapper);
    if (key !== undefined) info.key = key;
    s.decorate(s.button, info);
};

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
            const item = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('[role="menuitem"]') : null);
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
    return () => undo.splice(0).forEach((off) => off());
}
