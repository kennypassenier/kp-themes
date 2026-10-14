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
//
// A panel at the window's edge, with its launcher [Kenny, 2026-10-13,
// translated: a static button at the very top left of the page, the panel all
// the way out of the left side of the screen, three variants chosen by
// attribute]. Three ways for such a panel to meet the page, each one
// attribute on the panel:
//
//   · `data-kp-sidenav-mode="push"` with `data-kp-sidenav-content`: opening
//     slides the panel in from the edge and pushes the content over by the
//     panel's width; the push moves on the panel's own time and curve,
//     copied off the panel each time it changes, so the content travels
//     with whatever the theme's slide is and comes back as it reversed;
//   · the same plus `data-kp-sidenav-reserve`: the content keeps the
//     panel's room whether the panel is open or not (a gutter), so the
//     panel opens into empty space and covers nothing;
//   · `data-kp-sidenav-mode="over"` with `data-kp-sidenav-backdrop="false"`:
//     the panel slides over the content, nothing dims.
//
// The launcher is a `.kp-sidenav__launcher` box holding the toggler (a
// `.kp-icon-button` with `data-kp-sidenav-toggle`): fixed at the window's
// start corner, always in the same place, above the panel. The module
// marks the panel it drives `data-kp-sidenav-launched`, which starts the
// panel's header beside the launcher (or the panel's first row below it),
// so the launcher never covers an item; it draws the package's three bars
// in an empty toggler; and it lights the launcher
// (`data-kp-sidenav-lit`) from the first frame of the opening to the last
// frame of the closing, so the launcher's change is the opening's and is
// played back with the close. An element of the page that shares the
// launcher's corner (the page header) carries
// `data-kp-sidenav-launcher-room` and keeps the launcher's width free.

import { getStrings } from './strings.js';
import { paintRemembered, sidenavGroups } from './remember.js';
import { playEntranceBackwards, reversedEase, stopReversing } from './motion.js';

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
    /** The older spelling of `data-kp-remember`, still read [js/remember.js]. */
    remember: 'data-kp-sidenav-remember',
    toggle: 'data-kp-sidenav-toggle',
    slimToggle: 'data-kp-sidenav-slim-toggle',
    slimHide: 'data-kp-sidenav-slim-hide',
    slimShow: 'data-kp-sidenav-slim-show',
    expanded: 'data-kp-sidenav-expanded',
    overBelow: 'data-kp-sidenav-over-below',
    narrow: 'data-kp-sidenav-narrow',
    /**
     * On the panel: the content named by `data-kp-sidenav-content` keeps the
     * panel's width whether it is open or not (push and over modes) — the
     * gutter the panel opens into. Default off.
     */
    reserve: 'data-kp-sidenav-reserve',
    /** Written on the panel while a `.kp-sidenav__launcher` drives it. */
    launched: 'data-kp-sidenav-launched',
    /** Written on the launcher box from the opening's first frame to the closing's last. */
    lit: 'data-kp-sidenav-lit',
    /** On a page element in the launcher's corner: keeps the launcher's width free at its start. */
    launcherRoom: 'data-kp-sidenav-launcher-room',
    /**
     * On the panel: a closed panel is `inert` (out of the tab order and the
     * accessibility tree) from the closing's last frame to the opening's
     * first. Default on; `"false"` leaves a closed panel reachable.
     */
    inert: 'data-kp-sidenav-inert',
    /**
     * On the panel: in the collapsed rail each item shows its label as the
     * package's tooltip on hover and on focus. Default on; `"false"` turns it off.
     */
    railTips: 'data-kp-sidenav-rail-tips',
    /**
     * On a panel with `data-kp-sidenav-slim`: the width of the panel's box at
     * and below which the rail collapses to its icons, a length, or the
     * package's 40rem when empty; wider again it is what the reader left it.
     * `data-kp-sidenav-over-below` is its sibling for the variant: below its
     * length the panel becomes an `over` panel.
     */
    slimBelow: 'data-kp-sidenav-slim-below',
    /**
     * On the panel: in the collapsed rail a group's submenu opens as a
     * floating panel beside the rail, on hover (with intent) and from the
     * keyboard, with the theme's popover effect. Default on; `"false"` keeps
     * groups folding in place.
     */
    flyout: 'data-kp-sidenav-flyout',
    /** Written on a `.kp-sidenav__category` while its submenu floats beside the rail. */
    flown: 'data-kp-sidenav-flown',
    /**
     * On the panel: a key chord that toggles it from anywhere but a text
     * field, e.g. `Control+b`. `Control` means Meta (⌘) on a Mac; `Mod` is
     * the same thing spelled for both. Off by default.
     */
    shortcut: 'data-kp-sidenav-shortcut',
    /**
     * On the panel: a selector, inside the panel, for where the focus lands
     * when the panel opens. Default: the first focusable element, and only
     * for an `over` panel; named, it is used in every mode.
     */
    initialFocus: 'data-kp-sidenav-initial-focus',
    /**
     * On a rail with `data-kp-sidenav-expand-on-hover`: how long the pointer
     * rests before the rail expands, in milliseconds. Default 150. The rail
     * also expands while the focus is inside it.
     */
    hoverDelay: 'data-kp-sidenav-hover-delay',
    /** Written on the rail while it is expanded by the pointer or the focus. */
    peek: 'data-kp-sidenav-peek',
    /**
     * On the panel: its look. Without it the panel is the flush column it
     * always was. `"floating"` detaches the panel from the window's edge: a
     * gap all round, the theme's radius, an edge on every side and a shadow
     * made of the theme's own tokens. Knobs: `--kp-sidenav-float-inset` (the
     * gap, `--kp-space-sm`), `--kp-sidenav-float-radius` (`--radius`),
     * `--kp-sidenav-float-edge` (`1px solid --border-strong`),
     * `--kp-sidenav-float-shadow`. `"inset"` keeps the panel flush with the
     * window and makes the content (the element `data-kp-sidenav-content`
     * names) a rounded card beside it, on the page's ground. Knobs:
     * `--kp-sidenav-inset-gap` (the card's margin, `--kp-space-sm`),
     * `--kp-sidenav-inset-radius` (`--radius`), `--kp-sidenav-inset-edge`
     * (`1px solid --border-strong`). Both keep the slide, the push, the
     * gutter and the over mode working: the push and the gutter leave the
     * room the variant takes, and the edge tab rides on the panel's edge.
     */
    variant: 'data-kp-sidenav-variant',
    /**
     * Written on the content element while the panel is the `inset` variant:
     * the edge the panel comes from, `start` or `end`. The content is a
     * rounded card while it is there.
     */
    inset: 'data-kp-sidenav-inset',
};

/** The fixed box at the panel's far edge that holds a small toggler: the edge tab. */
export const SIDENAV_TAB = '.kp-sidenav__tab';

/** The fixed box at the window's start corner that holds a panel's toggler. */
export const SIDENAV_LAUNCHER = '.kp-sidenav__launcher';

/**
 * The width at and below which a panel with `data-kp-sidenav-over-below`
 * and no length of its own becomes an `over` panel [scope-80]: the 40rem
 * the bar collapses at and the table falls into cards at, so the package
 * steps at one width rather than at two [TH104, TH26].
 */
const NARROW_STEP = '40rem';

/** The inset card's knobs: set on the panel, they are carried to the content the card is made of. */
const INSET_KNOBS = ['--kp-sidenav-inset-gap', '--kp-sidenav-inset-radius', '--kp-sidenav-inset-edge'];

/** @type {WeakMap<Element, Sidenav>} */
const handles = new WeakMap();

/** The pointer's rest before a collapsed rail's group floats out, and its grace before it goes. */
const FLYOUT_OPEN_MS = 150;
const FLYOUT_CLOSE_MS = 250;
/** The pointer's rest before a rail item's label shows, as the package's tooltips wait [js/overlays.js]. */
const TIP_OPEN_MS = 300;
/** The gap between the rail and what floats beside it, in pixels, and the margin kept from the window's edges. */
const FLOAT_GAP = 6;
const FLOAT_MARGIN = 8;

/**
 * A key chord as written on the panel: `Control+b`, `Mod+Shift+k`, `Alt+n`.
 * `Control` and `Mod` are the platform's command key: Meta on a Mac.
 *
 * @param {string} chord
 * @param {boolean} mac
 */
export function parseChord(chord, mac) {
    const parts = chord
        .split('+')
        .map((part) => part.trim())
        .filter(Boolean);
    const key = (parts.pop() ?? '').toLowerCase();
    const mods = new Set(parts.map((part) => part.toLowerCase()));
    const command = mods.has('control') || mods.has('ctrl') || mods.has('mod');
    return {
        key,
        ctrl: command && !mac,
        meta: (command && mac) || mods.has('meta'),
        alt: mods.has('alt') || mods.has('option'),
        shift: mods.has('shift'),
        /** The same chord as `aria-keyshortcuts` writes it. */
        aria: [...(command ? [mac ? 'Meta' : 'Control'] : []), ...(mods.has('meta') && !command ? ['Meta'] : []), ...(mods.has('alt') || mods.has('option') ? ['Alt'] : []), ...(mods.has('shift') ? ['Shift'] : []), key.length === 1 ? key.toUpperCase() : key].join('+'),
    };
}

/** Whether a key press belongs to a text field rather than to the page. @param {EventTarget | null} target */
function typing(target) {
    if (!(target instanceof Element)) return false;
    return target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])') !== null;
}

/**
 * Split a computed list at its top-level commas: a timing function such as
 * `cubic-bezier(0.2, 0, 0, 1)` holds commas of its own.
 *
 * @param {string} list
 * @returns {string[]}
 */
function splitList(list) {
    /** @type {string[]} */
    const out = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < list.length; i += 1) {
        const c = list[i];
        if (c === '(') depth += 1;
        else if (c === ')') depth -= 1;
        else if (c === ',' && depth === 0) {
            out.push(list.slice(start, i).trim());
            start = i + 1;
        }
    }
    out.push(list.slice(start).trim());
    return out;
}

/**
 * The time, curve and delay the panel moves its `translate` on, as its
 * computed style says right now (so after a state flip, the curve of the
 * state it goes to: a theme's own close curve, or the opening's turned
 * around). A panel with no transition on it gives `0s`.
 *
 * @param {Element} panel
 */
function slideTiming(panel) {
    const style = getComputedStyle(panel);
    const names = splitList(style.transitionProperty);
    let at = names.indexOf('translate');
    if (at === -1) at = names.indexOf('all');
    if (at === -1) return { duration: '0s', ease: 'linear', delay: '0s' };
    const pick = (/** @type {string} */ list) => {
        const parts = splitList(list);
        return parts[at % parts.length] ?? '';
    };
    return { duration: pick(style.transitionDuration) || '0s', ease: pick(style.transitionTimingFunction) || 'linear', delay: pick(style.transitionDelay) || '0s' };
}

/**
 * @typedef {object} Sidenav
 * @property {HTMLElement} element
 * @property {(options?: { remember?: boolean }) => void} open
 * @property {(options?: { remember?: boolean }) => void} close  `{ remember: false }` for a close the reader did not ask for — a layout adapting to the room it has
 * @property {(options?: { remember?: boolean }) => void} toggle
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

/**
 * Whether a toggler has no name of its own, so the module gives it one.
 *
 * A toggler that already carries `aria-label` is renamed as the state
 * changes; one with words in it keeps them. What counts as words is what a
 * screen reader would read: a button holding only an `aria-hidden` glyph —
 * the arrow a rail toggle usually is — has text content and no name, and
 * was left as a bare "button" [scope-48].
 *
 * @param {Element} toggler
 */
function wantsName(toggler) {
    if (toggler.getAttribute('aria-label') !== null) return true;
    const clone = /** @type {Element} */ (toggler.cloneNode(true));
    for (const hidden of clone.querySelectorAll('[aria-hidden="true"]')) hidden.remove();
    return (clone.textContent ?? '').trim() === '';
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
        // What this panel remembers, and where: the name comes off the
        // element, never from here [Kenny, 2026-09-16]. The paint happens
        // before anything below reads the markup, so the starting state is
        // read from the memory the same way it is read from the markup.
        const memory = paintRemembered(panel, 'sidenav', { storage: store });

        /** @type {HTMLElement | null} */
        let backdrop = null;
        /** @type {Element | null} */
        let restoreFocusTo = null;

        const mode = () => read(OPTIONS.mode) ?? 'side';
        const isOpen = () => panel.getAttribute(OPTIONS.open) !== 'false' && (mode() === 'side' || panel.getAttribute(OPTIONS.open) === 'true');
        const covering = () => mode() === 'over';
        // A rail that collapses, a panel that slides away and a group that
        // folds play their opening backwards: the theme's curve turned
        // around, which CSS cannot work out, so it is written here as
        // `--kp-sidenav-ease-back` (css/components.css) before each change
        // and before a hover that may expand the rail. Without this module
        // they run on the opening's own curve.
        const turnEase = () => {
            const style = getComputedStyle(panel);
            const ease = style.getPropertyValue('--kp-sidenav-ease').trim() || style.getPropertyValue('--fx-ease').trim() || 'ease';
            panel.style.setProperty('--kp-sidenav-ease-back', reversedEase(ease));
        };
        turnEase();

        const togglers = () =>
            [...doc.querySelectorAll('[data-kp-sidenav-toggle]')].filter(
                (t) => (t.getAttribute('aria-controls') ?? '') === panel.id || t.getAttribute('aria-controls') === null,
            );

        /** The element a push or side mode makes room in. */
        const contentEl = () => {
            const selector = read(OPTIONS.content);
            return selector === null ? null : /** @type {HTMLElement | null} */ (doc.querySelector(selector));
        };

        /**
         * Whether the content keeps the panel's room open or shut: the gutter.
         * Not while `data-kp-sidenav-over-below` has made the panel an `over`
         * panel on a narrow screen, where a gutter would take the page's room.
         */
        const reserved = () => on(OPTIONS.reserve, false) && mode() !== 'side' && !panel.hasAttribute(OPTIONS.narrow);

        /** The edge the panel comes out of: `start` (the default) or `end`. */
        const edge = () => (read(OPTIONS.side) === 'end' ? 'end' : 'start');
        /** The style property that moves something clear of the panel, on the panel's side. */
        const marginAlong = () => (edge() === 'end' ? 'marginInlineEnd' : 'marginInlineStart');
        const paddingAlong = () => (edge() === 'end' ? 'paddingInlineEnd' : 'paddingInlineStart');
        /**
         * The panel's own painted size across its axis, not the token's
         * default. The knob is usually set on the panel, where the content
         * element cannot see it: a panel asked for 11rem moved its content by
         * 15rem, and the gap showed. Across the width it is the size the
         * panel is going to (`--kp-sidenav-w`, resolved), so a rail that
         * collapses or a reserved gutter follows at once, not the frame the
         * width transition stands at.
         */
        const panelSize = () => {
            const style = getComputedStyle(panel);
            const knob = style.getPropertyValue('--kp-sidenav-w').trim();
            const width = knob !== '' ? knob : style.inlineSize;
            // A variant that takes room beside the panel (the floating gap
            // on both sides of it) says so as `--kp-sidenav-room`; the
            // content clears that too.
            const room = style.getPropertyValue('--kp-sidenav-room').trim();
            return room !== '' ? `calc(${width} + ${room})` : width;
        };
        /**
         * Where the panel's far edge stands: its width and what lies between
         * the window's edge and the panel (`--kp-sidenav-lead`, the floating
         * gap). The edge tab rides there.
         */
        const edgeSize = () => {
            const style = getComputedStyle(panel);
            const lead = style.getPropertyValue('--kp-sidenav-lead').trim();
            const width = style.getPropertyValue('--kp-sidenav-w').trim() || style.inlineSize;
            return lead !== '' ? `calc(${width} + ${lead})` : width;
        };

        /** The edge tabs that hold one of this panel's togglers. */
        const tabs = () => {
            /** @type {Set<HTMLElement>} */
            const boxes = new Set();
            for (const toggler of togglers()) {
                const box = toggler.closest(SIDENAV_TAB);
                if (box instanceof HTMLElement) boxes.add(box);
            }
            return [...boxes];
        };
        const MOVED = /** @type {const} */ (['marginInlineStart', 'marginInlineEnd', 'paddingInlineStart', 'paddingInlineEnd']);
        /**
         * Move one element clear of the panel (the content) or along with it
         * (an edge tab), on the panel's own timing.
         *
         * @param {HTMLElement} target
         * @param {'marginInlineStart' | 'marginInlineEnd' | 'paddingInlineStart' | 'paddingInlineEnd'} property
         * @param {string} value
         * @param {string} mark
         * @param {boolean} travels
         */
        const shift = (target, property, value, mark, travels) => {
            // The push travels with the panel: its time, curve and delay are
            // the panel's own for this change, read after the flip, so the
            // content moves on the theme's slide and back on its reverse
            // (css/components.css reads these). A theme that draws the
            // content's move itself (cyberpunk's ticks, nostromo's cut) wins
            // from its register. Other moves are instant.
            const timing = travels ? slideTiming(panel) : { duration: '0s', ease: 'linear', delay: '0s' };
            target.style.setProperty('--kp-sidenav-shift-duration', timing.duration);
            target.style.setProperty('--kp-sidenav-shift-ease', timing.ease);
            target.style.setProperty('--kp-sidenav-shift-delay', timing.delay);
            // A theme may draw the content's move (cyberpunk takes it in ticks): the mark says which way.
            target.setAttribute('data-kp-sidenav-shift', mark);
            for (const one of MOVED) target.style[one] = '';
            target.style[property] = value;
        };

        /** @param {boolean} open */
        const offsetContent = (open) => {
            // The edge tab rides on the panel's far edge in the modes that
            // slide: at the window's edge while the panel is away.
            for (const tab of tabs()) {
                tab.setAttribute('data-kp-sidenav-tab-edge', edge());
                shift(tab, marginAlong(), open && mode() !== 'side' ? edgeSize() : '', open ? 'open' : 'closed', mode() !== 'side');
            }
            const target = contentEl();
            if (!target) return { property: null, value: '' };
            // The inset variant makes the content a card (css/components.css),
            // which reads its knobs from the panel's side of the page too.
            const inset = read(OPTIONS.variant) === 'inset';
            if (inset) target.setAttribute(OPTIONS.inset, edge());
            else target.removeAttribute(OPTIONS.inset);
            for (const name of INSET_KNOBS) {
                const value = inset ? getComputedStyle(panel).getPropertyValue(name).trim() : '';
                if (value !== '') target.style.setProperty(name, value);
                else target.style.removeProperty(name);
            }
            // side pads, push pushes — the reference's own distinction, and
            // it matters: padding keeps a background under the panel, a
            // margin moves the whole box. A gutter is a margin too: the
            // content's box starts where the panel ends.
            const property = mode() === 'push' || reserved() ? marginAlong() : paddingAlong();
            const value = reserved() || (open && mode() !== 'over') ? panelSize() : '';
            shift(target, property, value, reserved() ? 'reserved' : open ? 'open' : 'closed', mode() === 'push' && !reserved());
            return { property, value };
        };

        /** The launcher boxes that hold one of this panel's togglers. */
        const launchers = () => {
            /** @type {Set<HTMLElement>} */
            const boxes = new Set();
            for (const toggler of togglers()) {
                const box = toggler.closest(SIDENAV_LAUNCHER);
                if (box instanceof HTMLElement) boxes.add(box);
            }
            return [...boxes];
        };
        let lightTurn = 0;
        /**
         * Light the launcher with the opening's first frame and put it out
         * with the closing's last: the launcher's change is part of the
         * pair, so the close plays it last, as the open played it first
         * (docs/THEME_LESSONS.md 11 and 45).
         *
         * @param {boolean} open
         * @param {boolean} now no motion to wait for (the starting state, a mode change)
         */
        const light = (open, now) => {
            lightTurn += 1;
            const turn = lightTurn;
            const boxes = launchers();
            // A closed panel that slides away is inert from the closing's last
            // frame, so its links leave the tab order and the accessibility
            // tree; a side panel that is shut is not rendered at all.
            const shut = () => {
                for (const box of boxes) box.removeAttribute(OPTIONS.lit);
                panel.inert = mode() !== 'side' && on(OPTIONS.inert, true);
            };
            if (open) {
                panel.inert = false;
                for (const box of boxes) box.setAttribute(OPTIONS.lit, '');
                return;
            }
            if (now) return shut();
            requestAnimationFrame(() => {
                const target = contentEl();
                const motions = [...panel.getAnimations({ subtree: true }), ...(target ? target.getAnimations() : [])].map((a) =>
                    a.finished.catch(() => {}),
                );
                void Promise.all(motions).then(() => {
                    if (turn !== lightTurn || isOpen()) return;
                    shut();
                });
            });
        };

        /** @param {boolean} open */
        const say = (open) => {
            const s = { ...getStrings(), ...strings };
            for (const toggler of togglers()) {
                if (ownedBy !== '' && toggler.matches(ownedBy)) continue;
                toggler.setAttribute('aria-expanded', String(open));
                toggler.setAttribute('aria-controls', panel.id);
                if (wantsName(toggler)) {
                    toggler.setAttribute('aria-label', open ? s.closeSidebar : s.sidebar);
                }
            }
        };

        const dropBackdrop = () => {
            if (!backdrop) return;
            const target = backdrop;
            backdrop = null;
            void playEntranceBackwards(target).then(() => {
                target.remove();
                stopReversing(target);
            });
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

        /**
         * @param {boolean} open
         * @param {boolean} [moveFocus]
         * @param {boolean} [save] whether this is a state to remember — a
         *   person's choice is, an adaptation to the room the panel is in is
         *   not. A window narrowed past the step closes the panel; widening
         *   it again must not find it closed because of that [Kenny, 2026-09-16].
         */
        const set = (open, moveFocus = true, save = true) => {
            turnEase();
            panel.setAttribute(OPTIONS.open, String(open));
            say(open);
            const offset = offsetContent(open);
            light(open, !moveFocus && !save);
            if (open) raiseBackdrop();
            else dropBackdrop();

            if (on(OPTIONS.lockScroll, false)) doc.documentElement.style.overflow = open && covering() ? 'hidden' : '';

            // A panel that closes with the focus inside it (Escape in a push
            // panel, the shortcut) gives it back to its opener, or to the
            // launcher, rather than to nothing once it is inert.
            if (moveFocus && !open && !covering() && panel.contains(doc.activeElement)) {
                restoreFocusTo = restoreFocusTo ?? togglers().find((t) => t instanceof HTMLElement && !panel.contains(t) && t.offsetParent !== null) ?? null;
            }
            const named = read(OPTIONS.initialFocus);
            if (moveFocus && (covering() || (named !== null && open) || (!open && restoreFocusTo !== null))) {
                if (open) {
                    restoreFocusTo = doc.activeElement;
                    // Where the page asked for the focus to land, or the first stop in the panel.
                    let first = /** @type {HTMLElement | null} */ (null);
                    try {
                        first = named !== null ? /** @type {HTMLElement | null} */ (panel.querySelector(named)) : null;
                    } catch {
                        first = null;
                    }
                    (first ?? /** @type {HTMLElement | null} */ (panel.querySelector(FOCUSABLE)))?.focus({ preventScroll: true });
                } else if (restoreFocusTo instanceof HTMLElement) {
                    // Without scrolling: a panel that is fixed inside a scrolled box (a review
                    // dialog's stage, a dashboard's main) is carried off with that scroll, so the
                    // content seemed to vanish the moment the close began.
                    // And once the panel is gone, the way the focus left when it came: a ring
                    // that comes back on the opener at the start of the close is not the opening
                    // played backwards (docs/THEME_LESSONS.md 11). The close's motions start in
                    // the next frame, so they are read there.
                    const back = restoreFocusTo;
                    restoreFocusTo = null;
                    requestAnimationFrame(() => {
                        const motions = panel.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => {}));
                        void Promise.all(motions).then(() => {
                            if (panel.getAttribute(OPTIONS.open) !== 'true' && back.isConnected) back.focus({ preventScroll: true });
                        });
                    });
                }
            }

            if (save) memory?.write('open', open);
            panel.dispatchEvent(new CustomEvent(SIDENAV_TOGGLE_EVENT, { bubbles: true, detail: { open } }));
            panel.dispatchEvent(new CustomEvent(SIDENAV_MODE_EVENT, { bubbles: true, detail: { mode: mode(), offset } }));
        };

        /** @param {{ remember?: boolean }} [options] */
        const close = ({ remember = true } = {}) => set(false, true, remember);
        /** @param {{ remember?: boolean }} [options] */
        const open = ({ remember = true } = {}) => set(true, true, remember);

        /**
         * The buttons that collapse and expand this rail without a line of
         * script [gap-12]: `data-kp-sidenav-slim-toggle`, pointed at the panel
         * by `aria-controls` — or at every rail, when it names none, the way
         * `data-kp-sidenav-toggle` does.
         */
        const slimTogglers = () =>
            [...doc.querySelectorAll(`[${OPTIONS.slimToggle}]`)].filter(
                (t) => (t.getAttribute('aria-controls') ?? '') === panel.id || t.getAttribute('aria-controls') === null,
            );

        /** @param {boolean} collapsed */
        const saySlim = (collapsed) => {
            if (read(OPTIONS.slim) === null) return;
            const s = { ...getStrings(), ...strings };
            for (const toggler of slimTogglers()) {
                if (ownedBy !== '' && toggler.matches(ownedBy)) continue;
                // Expanded is the state a button reports: pressed, a
                // collapsed rail widens [ARIA disclosure].
                toggler.setAttribute('aria-expanded', String(!collapsed));
                toggler.setAttribute('aria-controls', panel.id);
                if (wantsName(toggler)) {
                    toggler.setAttribute('aria-label', collapsed ? s.expandRail : s.collapseRail);
                }
            }
        };

        /** @param {boolean} [collapsed] */
        const setSlim = (collapsed, save = true) => {
            if (read(OPTIONS.slim) === null) return;
            turnEase();
            const next = collapsed ?? panel.getAttribute(OPTIONS.slimCollapsed) === null;
            panel.toggleAttribute(OPTIONS.slimCollapsed, next);
            saySlim(next);
            if (save) memory?.write('rail', next);
            // A gutter or a push keeps pace with the rail's new width.
            offsetContent(isOpen());
            syncRail();
            panel.dispatchEvent(new CustomEvent(SIDENAV_SLIM_EVENT, { bubbles: true, detail: { collapsed: next } }));
        };

        /** @param {'over' | 'side' | 'push'} next */
        const setMode = (next) => {
            panel.setAttribute(OPTIONS.mode, next);
            set(isOpen(), false, false);
        };

        // ---- The collapsed rail: peek, labels as tooltips, groups that float out.

        /** Whether the rail stands collapsed to its icons, not expanded by the pointer or the focus. */
        const isRail = () => panel.hasAttribute(OPTIONS.slimCollapsed) && !panel.hasAttribute(OPTIONS.peek);
        const flying = () => isRail() && on(OPTIONS.flyout, true);

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

        // The label tip: one per panel, the package's tooltip in the top layer.
        // It repeats the visible-to-nobody label, so it is hidden from the
        // accessibility tree; the label itself stays the item's name.
        /** @type {HTMLElement | null} */
        let tip = null;
        /** @type {Element | null} */
        let tipFor = null;
        let tipTimer = 0;
        let tipGoing = false;
        const tipItems = () => (flying() ? '.kp-sidenav__link' : '.kp-sidenav__link, .kp-sidenav__category-toggle');
        const hideTip = () => {
            clearTimeout(tipTimer);
            tipFor = null;
            const box = tip;
            if (box === null || !box.matches(':popover-open') || tipGoing) return;
            tipGoing = true;
            void playEntranceBackwards(box).then(() => {
                tipGoing = false;
                stopReversing(box);
                if (tipFor === null && box.matches(':popover-open')) box.hidePopover();
            });
        };
        /** @param {Element} item */
        const showTip = (item) => {
            clearTimeout(tipTimer);
            const words = (item.querySelector('.kp-sidenav__label')?.textContent ?? '').trim();
            if (!isRail() || !on(OPTIONS.railTips, true) || words === '') return;
            if (tip === null) {
                tip = doc.createElement('span');
                tip.className = 'kp-popover kp-tooltip kp-sidenav__tip';
                tip.setAttribute('popover', 'manual');
                tip.setAttribute('aria-hidden', 'true');
                panel.append(tip);
            }
            const box = tip;
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
            if (item === null || !panel.contains(item) || item === tipFor || (tip !== null && tip.contains(item))) return;
            if (item.closest('.kp-sidenav__flyout') !== null) return;
            clearTimeout(tipTimer);
            // Moving along the rail with a tip up changes it at once, as a toolbar's tips do.
            if (tip?.matches(':popover-open') && !tipGoing) showTip(item);
            else tipTimer = window.setTimeout(() => showTip(item), TIP_OPEN_MS);
        };
        /** @param {PointerEvent} event */
        const onTipOut = (event) => {
            const to = event.relatedTarget instanceof Element ? event.relatedTarget.closest(tipItems()) : null;
            if (to !== null && panel.contains(to) && to.closest('.kp-sidenav__flyout') === null) return;
            hideTip();
        };

        /** @param {FocusEvent} event */
        const onTipFocus = (event) => {
            const item = event.target instanceof Element ? event.target.closest(tipItems()) : null;
            if (item === null || item.closest('.kp-sidenav__flyout') !== null) return hideTip();
            showTip(item);
        };

        // The groups that float out.
        /** @type {Map<HTMLElement, { added: boolean }>} */
        const floated = new Map();
        /** @param {Element} category */
        const submenuOf = (category) => /** @type {HTMLElement | null} */ (category.querySelector(':scope > .kp-sidenav__submenu'));
        /** @param {Element} category */
        const toggleOf = (category) => /** @type {HTMLElement | null} */ (category.querySelector(':scope > .kp-sidenav__category-toggle'));
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
        /** @type {Map<Element, number>} */
        const flyTimers = new Map();
        /** @param {PointerEvent} event */
        const onFlyOver = (event) => {
            if (!flying() || event.pointerType === 'touch') return;
            const category = event.target instanceof Element ? event.target.closest('.kp-sidenav__category') : null;
            if (category === null || !panel.contains(category)) return;
            clearTimeout(flyTimers.get(category));
            if (category.hasAttribute(OPTIONS.flown)) return;
            flyTimers.set(category, window.setTimeout(() => flyOut(category), FLYOUT_OPEN_MS));
        };
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
        /** @param {FocusEvent} event */
        const onFlyFocusOut = (event) => {
            const category = event.target instanceof Element ? event.target.closest(`.kp-sidenav__category[${OPTIONS.flown}]`) : null;
            if (category === null) return;
            if (event.relatedTarget instanceof Node && category.contains(event.relatedTarget)) return;
            if (!category.matches(':hover')) flyIn(category);
        };

        // Peek: a rail told to expand on hover waits for the pointer to rest,
        // and expands while the focus is inside it.
        let peekTimer = 0;
        let pointerIn = false;
        let peekTurn = 0;
        /**
         * Widen (`open`) or narrow the rail. Narrowing, the rail is `leaving`
         * until its width transition is over, then the attribute goes: the
         * words stay while the width closes, as they came at once when it opened.
         * @param {boolean} value
         */
        const setPeek = (value) => {
            clearTimeout(peekTimer);
            const now = panel.getAttribute(OPTIONS.peek);
            if (value ? now === 'open' : now !== 'open') return;
            turnEase();
            peekTurn += 1;
            const turn = peekTurn;
            if (value) {
                panel.setAttribute(OPTIONS.peek, 'open');
                syncRail();
                return;
            }
            panel.setAttribute(OPTIONS.peek, 'leaving');
            requestAnimationFrame(() => {
                const motions = panel.getAnimations().map((a) => a.finished.catch(() => {}));
                void Promise.all(motions).then(() => {
                    if (turn !== peekTurn) return;
                    panel.removeAttribute(OPTIONS.peek);
                    syncRail();
                });
            });
        };
        const peeks = () => read(OPTIONS.expandOnHover) !== null && read(OPTIONS.expandOnHover) !== 'false' && panel.hasAttribute(OPTIONS.slimCollapsed);
        const onPeekEnter = () => {
            pointerIn = true;
            if (!peeks()) return;
            const delay = Number(read(OPTIONS.hoverDelay) ?? 150);
            clearTimeout(peekTimer);
            peekTimer = window.setTimeout(() => setPeek(true), Number.isFinite(delay) ? delay : 150);
        };
        const onPeekLeave = () => {
            pointerIn = false;
            clearTimeout(peekTimer);
            if (!panel.contains(doc.activeElement)) setPeek(false);
        };
        const onPeekFocusIn = () => {
            if (peeks()) setPeek(true);
        };
        /** @param {FocusEvent} event */
        const onPeekFocusOut = (event) => {
            if (event.relatedTarget instanceof Node && panel.contains(event.relatedTarget)) return;
            if (!pointerIn) setPeek(false);
        };

        // The shortcut.
        const mac = /Mac|iPhone|iPad/.test(globalThis.navigator?.platform ?? '') || /Mac/.test(globalThis.navigator?.userAgent ?? '');
        const chordText = read(OPTIONS.shortcut);
        const chord = chordText !== null && chordText.trim() !== '' ? parseChord(chordText, mac) : null;
        /** @param {KeyboardEvent} event */
        const onShortcut = (event) => {
            if (chord === null || event.defaultPrevented || event.repeat || typing(event.target)) return;
            if (event.key.toLowerCase() !== chord.key) return;
            if (event.ctrlKey !== chord.ctrl || event.metaKey !== chord.meta || event.altKey !== chord.alt || event.shiftKey !== chord.shift) return;
            event.preventDefault();
            set(!isOpen());
        };


        // Categories. The accordion option is the reference's: with it on,
        // opening one closes the others.
        const saveGroups = () => {
            if (memory === null) return;
            /** @type {Record<string, boolean>} */
            const state = {};
            for (const { group, id } of sidenavGroups(panel)) state[id] = group.hasAttribute(OPTIONS.expanded);
            memory.write('groups', state);
        };

        /** @param {Event} event */
        const onCategory = (event) => {
            const toggle = /** @type {HTMLElement | null} */ (
                event.target instanceof Element ? event.target.closest('.kp-sidenav__category-toggle') : null
            );
            if (!toggle || !panel.contains(toggle)) return;
            const category = toggle.closest('.kp-sidenav__category');
            if (!category) return;
            // In the collapsed rail a press floats the group out (and back);
            // from the keyboard the focus goes into it.
            if (flying()) {
                if (category.hasAttribute(OPTIONS.flown)) flyIn(category);
                else flyOut(category, { focusFirst: /** @type {MouseEvent} */ (event).detail === 0 });
                return;
            }
            const expanded = category.hasAttribute(OPTIONS.expanded);
            turnEase();
            if (!expanded && on(OPTIONS.accordion, false)) {
                for (const other of panel.querySelectorAll('.kp-sidenav__category[data-kp-sidenav-expanded]')) {
                    other.removeAttribute(OPTIONS.expanded);
                    other.querySelector('.kp-sidenav__category-toggle')?.setAttribute('aria-expanded', 'false');
                }
            }
            category.toggleAttribute(OPTIONS.expanded, !expanded);
            toggle.setAttribute('aria-expanded', String(!expanded));
            saveGroups();
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

        /** @param {Event} event */
        const onSlimClick = (event) => {
            const toggler = /** @type {Element | null} */ (event.target instanceof Element ? event.target.closest(`[${OPTIONS.slimToggle}]`) : null);
            if (!toggler) return;
            if (ownedBy !== '' && toggler.matches(ownedBy)) return;
            const controls = toggler.getAttribute('aria-controls');
            if (controls !== null && controls !== panel.id) return;
            setSlim();
        };

        /** @param {KeyboardEvent} event */
        const onEsc = (event) => {
            if (event.key !== 'Escape' || !on(OPTIONS.closeOnEsc, true) || mode() === 'side' || !isOpen()) return;
            close();
        };

        // Narrow [scope-80]. A rail beside the content is right on a wide
        // screen and a column of its own on a phone, so a panel that says
        // `data-kp-sidenav-over-below` — with a length, or the package's
        // 40rem — becomes the `over` panel while the box it lives in is that
        // wide or narrower: away until its toggle opens it, with the focus
        // trap, Escape, the backdrop and the focus return that mode already
        // has, and its words back even when the rail was collapsed to
        // icons. Above the width it is what the markup declared again, slim
        // state included. The box is the panel's parent, as the bar measures
        // its own wrapper [TH104]; an over panel is fixed, so it does not
        // change the width it is measured by.
        //
        // The controls follow the state, through `hidden`, which the package
        // lets win over every display rule [KT13]: this panel's
        // `data-kp-sidenav-toggle` buttons — the one in the bar and the close
        // inside the panel, which is the way out while the panel covers the
        // bar — are shown only while narrow, and its slim toggles only while
        // wide. Markup that starts them `hidden` stays right without the
        // module. `data-kp-sidenav-narrow` on the panel says which it is.
        const overBelow = read(OPTIONS.overBelow);
        /** @type {{ mode: string | null, slim: boolean } | null} */
        let declared = null;
        /** @type {Map<HTMLElement, boolean>} */
        const hiddenAtAttach = new Map();
        /** @param {Element} control @param {boolean} hide */
        const hideControl = (control, hide) => {
            if (!(control instanceof HTMLElement) || (ownedBy !== '' && control.matches(ownedBy))) return;
            if (!hiddenAtAttach.has(control)) hiddenAtAttach.set(control, control.hasAttribute('hidden'));
            control.toggleAttribute('hidden', hide);
        };
        /** A length the page wrote, in pixels; empty is the package's 40rem step. @param {string | null} written */
        const threshold = (written = overBelow) => {
            const length = (written ?? '').trim() || NARROW_STEP;
            const size = parseFloat(length);
            if (length.endsWith('rem')) return size * parseFloat(getComputedStyle(doc.documentElement).fontSize);
            if (length.endsWith('em')) return size * parseFloat(getComputedStyle(panel.parentElement ?? panel).fontSize);
            return size;
        };
        /** Change the mode without the slide: a resize is not an opening. @param {() => void} change */
        const still = (change) => {
            const before = panel.style.transition;
            panel.style.transition = 'none';
            change();
            void panel.offsetWidth;
            panel.style.transition = before;
        };
        const applyNarrow = () => {
            const box = panel.parentElement;
            if (overBelow === null || box === null) return;
            const narrow = box.clientWidth <= threshold();
            // A launcher is the page's fixed way in at every width: never hidden.
            for (const control of togglers()) if (control.closest(SIDENAV_LAUNCHER) === null) hideControl(control, !narrow);
            if (read(OPTIONS.slim) !== null) for (const control of slimTogglers()) hideControl(control, narrow);
            if (narrow === (declared !== null)) return;
            still(() => {
                if (narrow) {
                    declared = { mode: read(OPTIONS.mode), slim: panel.hasAttribute(OPTIONS.slimCollapsed) };
                    panel.setAttribute(OPTIONS.narrow, '');
                    panel.removeAttribute(OPTIONS.slimCollapsed);
                    panel.setAttribute(OPTIONS.mode, 'over');
                    set(false, false, false);
                } else {
                    const was = /** @type {{ mode: string | null, slim: boolean }} */ (declared);
                    declared = null;
                    panel.removeAttribute(OPTIONS.narrow);
                    if (was.mode === null) panel.removeAttribute(OPTIONS.mode);
                    else panel.setAttribute(OPTIONS.mode, was.mode);
                    panel.toggleAttribute(OPTIONS.slimCollapsed, was.slim);
                    saySlim(was.slim);
                    set(mode() === 'side', false, false);
                }
            });
        };
        // The rail's step [Kenny, 2026-10-13, from the libraries survey]: the
        // page names the width at and below which the rail collapses to its
        // icons; wider again it is what the reader left it, and a collapse
        // the step made is never remembered as the reader's.
        const slimBelow = read(OPTIONS.slimBelow);
        /** @type {boolean | null} the reader's own rail state while the step holds it collapsed */
        let slimHeld = null;
        const applySlimBelow = () => {
            const box = panel.parentElement;
            if (slimBelow === null || box === null || read(OPTIONS.slim) === null || declared !== null) return;
            const narrow = box.clientWidth <= threshold(slimBelow);
            if (narrow === (slimHeld !== null)) return;
            if (narrow) {
                slimHeld = panel.hasAttribute(OPTIONS.slimCollapsed);
                if (!slimHeld) setSlim(true, false);
            } else {
                const was = slimHeld;
                slimHeld = null;
                if (!was) setSlim(false, false);
            }
        };
        const onResize = () => {
            applyNarrow();
            applySlimBelow();
        };
        const narrowWatch =
            (overBelow !== null || slimBelow !== null) && panel.parentElement !== null && typeof ResizeObserver === 'function'
                ? new ResizeObserver(onResize)
                : null;

        // A launcher: the panel makes room for it, and an empty toggler in it
        // gets the package's three bars, the glyph the bar's own toggle draws.
        const launchedHere = launchers().length > 0 && !panel.hasAttribute(OPTIONS.launched);
        if (launchedHere) panel.setAttribute(OPTIONS.launched, '');
        /** @type {HTMLElement[]} */
        const glyphs = [];
        for (const toggler of togglers()) {
            const box = toggler.closest(`${SIDENAV_LAUNCHER}, ${SIDENAV_TAB}`);
            if (box === null || toggler.children.length > 0 || (toggler.textContent ?? '').trim() !== '') continue;
            const glyph = doc.createElement('span');
            // The launcher's three bars; the edge tab's grip, which has no state to change.
            glyph.className = box.matches(SIDENAV_TAB) ? 'kp-sidenav__grip' : 'kp-sidenav__bars';
            glyph.setAttribute('aria-hidden', 'true');
            toggler.append(glyph);
            glyphs.push(glyph);
        }

        // The starting state. A side panel is there unless told otherwise;
        // the two that cover are away until asked, which is the reference's
        // `hidden` default written as a mode rather than as a flag.
        let start = mode() === 'side';
        if (panel.hasAttribute(OPTIONS.open)) start = panel.getAttribute(OPTIONS.open) === 'true';
        if (read(OPTIONS.slimCollapsed) !== null) panel.setAttribute(OPTIONS.slimCollapsed, '');
        set(start, false, false);
        saySlim(panel.getAttribute(OPTIONS.slimCollapsed) !== null);
        applyNarrow();
        applySlimBelow();
        if (narrowWatch !== null && panel.parentElement !== null) narrowWatch.observe(panel.parentElement);

        for (const toggle of panel.querySelectorAll('.kp-sidenav__category-toggle')) {
            const category = toggle.closest('.kp-sidenav__category');
            toggle.setAttribute('aria-expanded', String(category?.hasAttribute('data-kp-sidenav-expanded') ?? false));
        }
        syncRail();
        if (chord !== null) for (const toggler of togglers()) toggler.setAttribute('aria-keyshortcuts', chord.aria);

        /**
         * The rail's keys: Right (or Left on the end edge) floats a group out
         * and goes into it, Escape or the way back folds it and returns to its
         * heading, and Escape takes a label tip away.
         * @param {KeyboardEvent} event
         */
        const onRailKey = (event) => {
            if (event.key === 'Escape' && tip?.matches(':popover-open')) hideTip();
            if (!flying() || !(event.target instanceof Element)) return;
            const out = edge() === 'end' ? 'ArrowLeft' : 'ArrowRight';
            const back = edge() === 'end' ? 'ArrowRight' : 'ArrowLeft';
            const toggle = event.target.closest('.kp-sidenav__category-toggle');
            if (toggle !== null && event.key === out) {
                const category = toggle.closest('.kp-sidenav__category');
                if (category) {
                    event.preventDefault();
                    flyOut(category, { focusFirst: true });
                }
                return;
            }
            const inside = event.target.closest(`.kp-sidenav__category[${OPTIONS.flown}]`);
            if (inside !== null && event.target.closest('.kp-sidenav__flyout') !== null && (event.key === 'Escape' || event.key === back)) {
                event.preventDefault();
                event.stopPropagation();
                flyIn(inside, { refocus: true });
            }
        };

        doc.addEventListener('click', onToggleClick);
        doc.addEventListener('click', onSlimClick);
        panel.addEventListener('click', onCategory);
        doc.addEventListener('keydown', /** @type {EventListener} */ (onEsc));
        panel.addEventListener('keydown', /** @type {EventListener} */ (onTrap));
        panel.addEventListener('keydown', /** @type {EventListener} */ (onRailKey));
        panel.addEventListener('pointerenter', turnEase);
        panel.addEventListener('pointerenter', onPeekEnter);
        panel.addEventListener('pointerleave', onPeekLeave);
        panel.addEventListener('focusin', onPeekFocusIn);
        panel.addEventListener('focusout', /** @type {EventListener} */ (onPeekFocusOut));
        panel.addEventListener('pointerover', /** @type {EventListener} */ (onTipOver));
        panel.addEventListener('pointerout', /** @type {EventListener} */ (onTipOut));
        panel.addEventListener('focusin', /** @type {EventListener} */ (onTipFocus));
        panel.addEventListener('focusout', hideTip);
        panel.addEventListener('pointerover', /** @type {EventListener} */ (onFlyOver));
        panel.addEventListener('pointerout', /** @type {EventListener} */ (onFlyOut));
        panel.addEventListener('focusout', /** @type {EventListener} */ (onFlyFocusOut));
        if (chord !== null) doc.addEventListener('keydown', /** @type {EventListener} */ (onShortcut));

        /** @type {Sidenav} */
        const handle = {
            element: panel,
            open,
            close,
            toggle: ({ remember = true } = {}) => set(!isOpen(), true, remember),
            setMode,
            setSlim,
            isOpen,
            destroy: () => {},
        };

        const detach = () => {
            narrowWatch?.disconnect();
            if (declared !== null) {
                panel.removeAttribute(OPTIONS.narrow);
                if (declared.mode === null) panel.removeAttribute(OPTIONS.mode);
                else panel.setAttribute(OPTIONS.mode, declared.mode);
                panel.toggleAttribute(OPTIONS.slimCollapsed, declared.slim);
                declared = null;
            }
            for (const [control, hidden] of hiddenAtAttach) control.toggleAttribute('hidden', hidden);
            doc.removeEventListener('click', onToggleClick);
            doc.removeEventListener('click', onSlimClick);
            panel.removeEventListener('click', onCategory);
            doc.removeEventListener('keydown', /** @type {EventListener} */ (onEsc));
            panel.removeEventListener('keydown', /** @type {EventListener} */ (onTrap));
            panel.removeEventListener('pointerenter', turnEase);
            panel.removeEventListener('keydown', /** @type {EventListener} */ (onRailKey));
            panel.removeEventListener('pointerenter', onPeekEnter);
            panel.removeEventListener('pointerleave', onPeekLeave);
            panel.removeEventListener('focusin', onPeekFocusIn);
            panel.removeEventListener('focusout', /** @type {EventListener} */ (onPeekFocusOut));
            panel.removeEventListener('pointerover', /** @type {EventListener} */ (onTipOver));
            panel.removeEventListener('pointerout', /** @type {EventListener} */ (onTipOut));
            panel.removeEventListener('focusin', /** @type {EventListener} */ (onTipFocus));
            panel.removeEventListener('focusout', hideTip);
            panel.removeEventListener('pointerover', /** @type {EventListener} */ (onFlyOver));
            panel.removeEventListener('pointerout', /** @type {EventListener} */ (onFlyOut));
            panel.removeEventListener('focusout', /** @type {EventListener} */ (onFlyFocusOut));
            doc.removeEventListener('keydown', /** @type {EventListener} */ (onShortcut));
            clearTimeout(peekTimer);
            clearTimeout(tipTimer);
            for (const timer of flyTimers.values()) clearTimeout(timer);
            panel.removeAttribute(OPTIONS.peek);
            // Fold the floating groups back into the panel as they were.
            const wasSlim = slimHeld ?? panel.hasAttribute(OPTIONS.slimCollapsed);
            slimHeld = null;
            panel.removeAttribute(OPTIONS.slimCollapsed);
            syncRail();
            panel.toggleAttribute(OPTIONS.slimCollapsed, wasSlim);
            tip?.remove();
            tip = null;
            panel.inert = false;
            for (const tab of tabs()) {
                tab.removeAttribute('data-kp-sidenav-shift');
                tab.removeAttribute('data-kp-sidenav-tab-edge');
                tab.style.marginInlineStart = tab.style.marginInlineEnd = '';
            }
            for (const toggler of togglers()) toggler.removeAttribute('aria-keyshortcuts');
            panel.style.removeProperty('--kp-sidenav-ease-back');
            dropBackdrop();
            offsetContent(false);
            const target = contentEl();
            if (target) {
                target.removeAttribute('data-kp-sidenav-shift');
                target.removeAttribute(OPTIONS.inset);
                for (const name of INSET_KNOBS) target.style.removeProperty(name);
                for (const name of ['--kp-sidenav-shift-duration', '--kp-sidenav-shift-ease', '--kp-sidenav-shift-delay']) target.style.removeProperty(name);
                target.style.marginInlineStart = '';
            }
            lightTurn += 1;
            for (const box of launchers()) box.removeAttribute(OPTIONS.lit);
            for (const glyph of glyphs) glyph.remove();
            if (launchedHere) panel.removeAttribute(OPTIONS.launched);
            if (on(OPTIONS.lockScroll, false)) doc.documentElement.style.overflow = '';
            panel.removeAttribute(OPTIONS.open);
            for (const toggler of togglers()) {
                toggler.removeAttribute('aria-expanded');
                toggler.removeAttribute('aria-label');
            }
            if (read(OPTIONS.slim) !== null) {
                for (const toggler of slimTogglers()) {
                    if (ownedBy !== '' && toggler.matches(ownedBy)) continue;
                    toggler.removeAttribute('aria-expanded');
                    toggler.removeAttribute('aria-label');
                }
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
