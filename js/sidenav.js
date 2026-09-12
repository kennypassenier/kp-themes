// The side navigation [feat-nav-3].
//
// Built to the feature list Kenny pointed at — MDBootstrap's sidenav, read
// on 2026-09-11 — translated into this package's conventions rather than
// copied: every option is a `data-kp-sidenav-*` attribute, so a page that
// never loads a module still gets a navigation, and the module only adds
// what markup cannot express.
//
// What the module owns, and CSS does not:
//
//   · the offset a `side` or `push` mode puts on a content element this
//     component does not own — CSS cannot reach across to a selector the
//     consumer named;
//   · the focus trap and the focus return, which are keyboard facts;
//   · the scroll lock;
//   · the backdrop element, so a consumer can put a class on it;
//   · remembering, when the page asks for it by naming a key.
//
// Every state has a named way out [KT6]: the toggler, Escape, the
// backdrop, the `kp-sidenav-*` events, the handle `sidenavOf()` returns,
// and the detach.

import { getStrings } from './strings.js';

export const SIDENAV_TOGGLE_EVENT = 'kp-sidenav-toggle';
export const SIDENAV_SLIM_EVENT = 'kp-sidenav-slim';
export const SIDENAV_MODE_EVENT = 'kp-sidenav-mode';

/** The mark a consumer puts on a toggler they wire themselves [AR29]. */
export const SIDENAV_OWNED = '[data-kp-sidenav-owner]';

/**
 * Every option, written out.
 *
 * Built by joining a prefix to a name at first, which worked and hid the
 * whole surface: no gate could enumerate the options, and the
 * documentation site's extractor found one attribute whose name was the
 * bare prefix. An option nobody can list is an option nobody can
 * document [AR21].
 */
export const OPTIONS = {
    mode: 'data-kp-sidenav-mode',
    position: 'data-kp-sidenav-position',
    side: 'data-kp-sidenav-side',
    open: 'data-kp-sidenav-open',
    slim: 'data-kp-sidenav-slim',
    slimCollapsed: 'data-kp-sidenav-slim-collapsed',
    expandOnHover: 'data-kp-sidenav-expand-on-hover',
    accordion: 'data-kp-sidenav-accordion',
    backdrop: 'data-kp-sidenav-backdrop',
    backdropClass: 'data-kp-sidenav-backdrop-class',
    closeOnEsc: 'data-kp-sidenav-close-on-esc',
    lockScroll: 'data-kp-sidenav-lock-scroll',
    focusTrap: 'data-kp-sidenav-focus-trap',
    content: 'data-kp-sidenav-content',
    remember: 'data-kp-sidenav-remember',
    toggle: 'data-kp-sidenav-toggle',
    slimHide: 'data-kp-sidenav-slim-hide',
    slimShow: 'data-kp-sidenav-slim-show',
    expanded: 'data-kp-sidenav-expanded',
};

/** @type {WeakMap<Element, Sidenav>} */
const handles = new WeakMap();

/**
 * @typedef {object} Sidenav
 * @property {HTMLElement} element
 * @property {() => void} open
 * @property {() => void} close
 * @property {() => void} toggle
 * @property {(mode: 'over' | 'side' | 'push') => void} setMode
 * @property {(collapsed?: boolean) => void} setSlim
 * @property {() => boolean} isOpen
 * @property {() => void} destroy
 */

/**
 * The handle for one panel, or undefined when it was never attached.
 *
 * @param {Element | null} element
 * @returns {Sidenav | undefined}
 */
export function sidenavOf(element) {
    return element === null ? undefined : handles.get(element);
}

/** localStorage where there is one, null where reaching it throws. */
function storage() {
    try {
        return globalThis.localStorage ?? null;
    } catch {
        // A browser set to refuse site data throws on the property itself.
        return null;
    }
}

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Wire every `.kp-sidenav` under `root`.
 *
 * @param {ParentNode} root
 * @param {{ strings?: Partial<import('./strings.js').Strings>, ownedBy?: string, store?: Storage | null }} [options]
 * @returns {() => void} detach
 */
export function attachSidenavs(root = document, { strings, ownedBy = SIDENAV_OWNED, store } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    const memory = store === undefined ? storage() : store;

    for (const element of root.querySelectorAll('.kp-sidenav')) {
        const panel = /** @type {HTMLElement} */ (element);
        if (panel.dataset.kpSidenavAttached !== undefined) continue;
        panel.dataset.kpSidenavAttached = '';
        if (!panel.id) panel.id = `kp-sidenav-${Math.random().toString(36).slice(2, 8)}`;

        const doc = panel.ownerDocument;
        const read = (/** @type {string} */ attribute) => panel.getAttribute(attribute);
        const on = (/** @type {string} */ attribute, /** @type {boolean} */ fallback) => {
            const value = read(attribute);
            return value === null ? fallback : value !== 'false';
        };
        const key = read(OPTIONS.remember);

        /** @type {HTMLElement | null} */
        let backdrop = null;
        /** @type {Element | null} */
        let restoreFocusTo = null;

        const mode = () => read(OPTIONS.mode) ?? 'side';
        const isOpen = () => panel.getAttribute(OPTIONS.open) !== 'false' && (mode() === 'side' || panel.getAttribute(OPTIONS.open) === 'true');
        const covering = () => mode() === 'over';

        const togglers = () =>
            [...doc.querySelectorAll('[data-kp-sidenav-toggle]')].filter(
                (t) => (t.getAttribute('aria-controls') ?? '') === panel.id || t.getAttribute('aria-controls') === null,
            );

        /** The element a push or side mode makes room in. */
        const contentEl = () => {
            const selector = read(OPTIONS.content);
            return selector === null ? null : /** @type {HTMLElement | null} */ (doc.querySelector(selector));
        };

        /** @param {boolean} open */
        const offsetContent = (open) => {
            const target = contentEl();
            if (!target) return { property: null, value: '' };
            // side pads, push pushes — the reference's own distinction, and
            // it matters: padding keeps a background under the panel, a
            // margin moves the whole box.
            const property = mode() === 'push' ? 'marginInlineStart' : 'paddingInlineStart';
            // The panel's own painted width, not the token's default. The
            // knob is usually set on the panel, where the content element
            // cannot see it: a panel asked for 11rem moved its content by
            // 15rem, and the gap showed.
            const value = open && mode() !== 'over' ? getComputedStyle(panel).inlineSize : '';
            target.style.marginInlineStart = '';
            target.style.paddingInlineStart = '';
            target.style[property] = value;
            return { property, value };
        };

        /** @param {boolean} open */
        const say = (open) => {
            const s = { ...getStrings(), ...strings };
            for (const toggler of togglers()) {
                if (ownedBy !== '' && toggler.matches(ownedBy)) continue;
                toggler.setAttribute('aria-expanded', String(open));
                toggler.setAttribute('aria-controls', panel.id);
                if (toggler.getAttribute('aria-label') !== null || toggler.textContent?.trim() === '') {
                    toggler.setAttribute('aria-label', open ? s.closeSidebar : s.sidebar);
                }
            }
        };

        const dropBackdrop = () => {
            backdrop?.remove();
            backdrop = null;
        };

        const raiseBackdrop = () => {
            if (backdrop || !covering() || !on(OPTIONS.backdrop, true)) return;
            backdrop = doc.createElement('div');
            backdrop.className = `kp-sidenav__backdrop ${read(OPTIONS.backdropClass) ?? ''}`.trim();
            // The backdrop belongs to the same box the panel does. A panel
            // scoped to a container with an absolute position had a fixed
            // backdrop over the whole window, which dimmed a page that was
            // never asked about.
            if (read(OPTIONS.position) === 'absolute') backdrop.style.position = 'absolute';
            backdrop.addEventListener('click', () => close());
            panel.after(backdrop);
        };

        /** @param {KeyboardEvent} event */
        const onTrap = (event) => {
            if (event.key !== 'Tab' || !covering() || !isOpen() || !on(OPTIONS.focusTrap, true)) return;
            const stops = [.../** @type {NodeListOf<HTMLElement>} */ (panel.querySelectorAll(FOCUSABLE))].filter((el) => el.offsetParent !== null);
            if (stops.length === 0) return;
            const first = stops[0];
            const last = stops[stops.length - 1];
            const active = doc.activeElement;
            if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            } else if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            }
        };

        /** @param {boolean} open @param {boolean} [moveFocus] */
        const set = (open, moveFocus = true) => {
            panel.setAttribute(OPTIONS.open, String(open));
            say(open);
            const offset = offsetContent(open);
            if (open) raiseBackdrop();
            else dropBackdrop();

            if (on(OPTIONS.lockScroll, false)) doc.documentElement.style.overflow = open && covering() ? 'hidden' : '';

            if (moveFocus && covering()) {
                if (open) {
                    restoreFocusTo = doc.activeElement;
                    /** @type {HTMLElement | null} */ (panel.querySelector(FOCUSABLE))?.focus();
                } else if (restoreFocusTo instanceof HTMLElement) {
                    restoreFocusTo.focus();
                    restoreFocusTo = null;
                }
            }

            if (key && memory) {
                try {
                    memory.setItem(key, String(open));
                } catch {
                    // A full or refused quota loses the memory, never the panel.
                }
            }
            panel.dispatchEvent(new CustomEvent(SIDENAV_TOGGLE_EVENT, { bubbles: true, detail: { open } }));
            panel.dispatchEvent(new CustomEvent(SIDENAV_MODE_EVENT, { bubbles: true, detail: { mode: mode(), offset } }));
        };

        const close = () => set(false);
        const open = () => set(true);

        /** @param {boolean} [collapsed] */
        const setSlim = (collapsed) => {
            if (read(OPTIONS.slim) === null) return;
            const next = collapsed ?? panel.getAttribute(OPTIONS.slimCollapsed) === null;
            panel.toggleAttribute(OPTIONS.slimCollapsed, next);
            if (key && memory) {
                try {
                    memory.setItem(`${key}:slim`, String(next));
                } catch {
                    // As above: the rail still works, it is only forgotten.
                }
            }
            panel.dispatchEvent(new CustomEvent(SIDENAV_SLIM_EVENT, { bubbles: true, detail: { collapsed: next } }));
        };

        /** @param {'over' | 'side' | 'push'} next */
        const setMode = (next) => {
            panel.setAttribute(OPTIONS.mode, next);
            set(isOpen(), false);
        };

        // Categories. The accordion option is the reference's: with it on,
        // opening one closes the others.
        /** @param {Event} event */
        const onCategory = (event) => {
            const toggle = /** @type {HTMLElement | null} */ (
                event.target instanceof Element ? event.target.closest('.kp-sidenav__category-toggle') : null
            );
            if (!toggle || !panel.contains(toggle)) return;
            const category = toggle.closest('.kp-sidenav__category');
            if (!category) return;
            const expanded = category.hasAttribute(OPTIONS.expanded);
            if (!expanded && on(OPTIONS.accordion, false)) {
                for (const other of panel.querySelectorAll('.kp-sidenav__category[data-kp-sidenav-expanded]')) {
                    other.removeAttribute(OPTIONS.expanded);
                    other.querySelector('.kp-sidenav__category-toggle')?.setAttribute('aria-expanded', 'false');
                }
            }
            category.toggleAttribute(OPTIONS.expanded, !expanded);
            toggle.setAttribute('aria-expanded', String(!expanded));
        };

        /** @param {Event} event */
        const onToggleClick = (event) => {
            const toggler = /** @type {Element | null} */ (event.target instanceof Element ? event.target.closest('[data-kp-sidenav-toggle]') : null);
            if (!toggler) return;
            if (ownedBy !== '' && toggler.matches(ownedBy)) return;
            const controls = toggler.getAttribute('aria-controls');
            if (controls !== null && controls !== panel.id) return;
            set(!isOpen());
        };

        /** @param {KeyboardEvent} event */
        const onEsc = (event) => {
            if (event.key !== 'Escape' || !on(OPTIONS.closeOnEsc, true) || mode() === 'side' || !isOpen()) return;
            close();
        };

        // The starting state. A side panel is there unless told otherwise;
        // the two that cover are away until asked, which is the reference's
        // `hidden` default written as a mode rather than as a flag.
        let start = mode() === 'side';
        if (panel.hasAttribute(OPTIONS.open)) start = panel.getAttribute(OPTIONS.open) === 'true';
        if (key && memory) {
            try {
                const remembered = memory.getItem(key);
                if (remembered === 'true' || remembered === 'false') start = remembered === 'true';
                if (memory.getItem(`${key}:slim`) === 'true') panel.setAttribute(OPTIONS.slimCollapsed, '');
            } catch {
                // Nothing remembered is a valid answer.
            }
        }
        if (read(OPTIONS.slimCollapsed) !== null) panel.setAttribute(OPTIONS.slimCollapsed, '');
        set(start, false);

        for (const toggle of panel.querySelectorAll('.kp-sidenav__category-toggle')) {
            const category = toggle.closest('.kp-sidenav__category');
            toggle.setAttribute('aria-expanded', String(category?.hasAttribute('data-kp-sidenav-expanded') ?? false));
        }

        doc.addEventListener('click', onToggleClick);
        panel.addEventListener('click', onCategory);
        doc.addEventListener('keydown', /** @type {EventListener} */ (onEsc));
        panel.addEventListener('keydown', /** @type {EventListener} */ (onTrap));

        /** @type {Sidenav} */
        const handle = {
            element: panel,
            open,
            close,
            toggle: () => set(!isOpen()),
            setMode,
            setSlim,
            isOpen,
            destroy: () => {},
        };

        const detach = () => {
            doc.removeEventListener('click', onToggleClick);
            panel.removeEventListener('click', onCategory);
            doc.removeEventListener('keydown', /** @type {EventListener} */ (onEsc));
            panel.removeEventListener('keydown', /** @type {EventListener} */ (onTrap));
            dropBackdrop();
            offsetContent(false);
            if (on(OPTIONS.lockScroll, false)) doc.documentElement.style.overflow = '';
            panel.removeAttribute(OPTIONS.open);
            for (const toggler of togglers()) {
                toggler.removeAttribute('aria-expanded');
                toggler.removeAttribute('aria-label');
            }
            delete panel.dataset.kpSidenavAttached;
            handles.delete(panel);
        };
        handle.destroy = detach;
        handles.set(panel, handle);
        cleanups.push(detach);
    }

    return () => {
        for (const c of cleanups) c();
    };
}
