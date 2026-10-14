import { forwardRef, useEffect, useRef } from 'react';

import { SIDENAV_MODE_EVENT, SIDENAV_PREVENTED_EVENT, SIDENAV_SLIM_EVENT, SIDENAV_TOGGLE_EVENT } from '../js/sidenav.js';

// Side navigation [feat-nav-3, sidenav-react 2026-09-12].
//
// The framework-free channel shipped first and this is the other half.
// It follows the division every shared element in this package follows,
// the one `components/marquee.jsx` states plainly: the component renders
// the markup and the knobs, and `js/sidenav.js` — attached by
// `js/auto.js` — does the behaviour. Both channels therefore produce the
// same DOM, and a page that never loads the module still shows a working
// list of links rather than an empty box.
//
// Everything the module reads as a `data-kp-sidenav-*` attribute is a
// prop here, with the module's own default [KT6: every feature
// configurable, every state with a named way out]. The way out of the
// opened state is the handle: `sidenavOf(ref.current)` returns it, with
// `open`, `close`, `toggle`, `setMode`, `setSlim`, `isOpen` and
// `destroy`, and the three events fire on the element either way.
//
// No user-visible string is written here [KT5]. The title, the labels and
// the toggle's own words are the consumer's; what the module announces
// comes from `js/strings.js`.

/**
 * @typedef {object} SidenavItem
 * @property {import('react').ReactNode} label  What the reader sees.
 * @property {string} [href]
 * @property {boolean} [current]  Renders `aria-current="page"`.
 * @property {import('react').ReactNode} [icon]  Shown in the slim state, where the label is not.
 * @property {SidenavItem[]} [children]  A nested list, which the module makes collapsible.
 */

/**
 * @typedef {object} SidenavProps
 * @property {SidenavItem[]} [items]  The list. Omit and pass children to build it by hand.
 * @property {import('react').ReactNode} [title]  The heading above the list. Omit for no header.
 * @property {import('react').ReactNode} [footer]  What stays under the list, in `.kp-sidenav__footer` — an account row, or the rail's own SidenavSlimToggle. Omit for no footer.
 * @property {'over' | 'side' | 'push'} [mode]  How it sits beside the content. Default: the module's 'side'.
 * @property {'fixed' | 'absolute'} [position]  Default: the module's own.
 * @property {'start' | 'end'} [side]  Which edge it lives on. Default: the module's own.
 * @property {boolean} [defaultOpen]  Open on first render. The module owns it afterwards.
 * @property {boolean} [slim]  Offer the narrow state at all.
 * @property {boolean} [slimCollapsed]  Start narrow.
 * @property {boolean | string} [overBelow]  Become the `over` panel while the box it lives in is this wide or narrower: `true` for the package's 40rem step, or a length. Its toggles are shown only then, its slim toggles only above it [scope-80].
 * @property {boolean} [expandOnHover]  Widen while the pointer is over it.
 * @property {boolean} [accordion]  One nested list open at a time.
 * @property {boolean | 'static'} [backdrop]  Dim the page behind it in `over`; `false` for no scrim; `'static'` keeps the scrim and refuses a click on it with the theme's cue (the panel does not close, `onSidenavPrevented` fires).
 * @property {string} [backdropClass]
 * @property {boolean} [closeOnEsc]
 * @property {boolean} [lockScroll]
 * @property {boolean} [focusTrap]
 * @property {string} [contentSelector]  What `push` moves over.
 * @property {boolean} [reserve]  The content keeps the panel's width whether it is open or not (push and over): the gutter the panel opens into.
 * @property {string} [shortcut]  A key chord that toggles it from anywhere but a text field, e.g. `Control+b` (`Mod` is Meta on a Mac).
 * @property {string} [initialFocus]  A selector, inside the panel, for where the focus lands on opening; used in every mode.
 * @property {number} [hoverDelay]  Milliseconds the pointer rests before an `expandOnHover` rail widens. Left out, the module waits 150.
 * @property {boolean | string} [slimBelow]  Collapse the rail to its icons while its box is this wide or narrower: `true` for the 40rem step, or a length.
 * @property {boolean} [railTips]  In the collapsed rail each item shows its label as a tooltip. Default on.
 * @property {boolean} [flyout]  In the collapsed rail a group's submenu floats beside it. Default on.
 * @property {boolean} [inert]  A closed panel leaves the tab order and the accessibility tree. Default on.
 * @property {boolean} [cancelable]  `onSidenavToggle` and `onSidenavSlim` fire before the change and `preventDefault()` refuses it (`onSidenavPrevented` then fires).
 * @property {boolean} [closeOnBackdrop]  A click on the backdrop closes it. Default on.
 * @property {boolean} [resizable]  A handle on the content-facing edge makes the width the reader's; kept with `remember`.
 * @property {string} [minWidth]  The narrowest width the handle allows, a length. Default 12rem.
 * @property {string} [maxWidth]  The widest width the handle allows, a length. Default 32rem.
 * @property {'floating' | 'inset'} [variant]  The panel's look: `floating` detaches it from the window's edge, `inset` makes the content a rounded card beside it.
 * @property {'compact' | 'default' | 'comfortable'} [density]  Row height and panel padding.
 * @property {(event: CustomEvent<{ open: boolean, reason: string }>) => void} [onSidenavToggle]  The panel opened or closed (before, with `cancelable`).
 * @property {(event: CustomEvent<{ collapsed: boolean, reason: string }>) => void} [onSidenavSlim]  The rail collapsed or expanded (before, with `cancelable`).
 * @property {(event: CustomEvent<{ mode: 'over' | 'side' | 'push', offset: unknown, reason: string }>) => void} [onSidenavMode]  The mode or the room it takes changed.
 * @property {(event: CustomEvent<{ kind: string, reason: string, source: string }>) => void} [onSidenavPrevented]  A change was refused (by a listener or a static backdrop); `detail.reason` says who asked.
 * @property {string} [remember]  A name, so what the reader folded, opened or collapsed survives a reload. Writes `data-kp-remember`; the key is composed from it [js/remember.js].
 * @property {import('react').ElementType} [linkComponent]  What renders a link [TH62]. Default 'a'.
 * @property {string} [label]  The accessible name of the navigation landmark.
 * @property {boolean} [autoAttach]  Hand the rendered markup to js/sidenav.js on mount. Default true.
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {import('react').ReactNode} [children]
 */

/** An attribute the module reads, present only when the consumer asked for it. */
const flag = (/** @type {string} */ name, /** @type {boolean | undefined} */ value) =>
    value === undefined ? null : { [name]: value ? '' : 'false' };
const value = (/** @type {string} */ name, /** @type {string | undefined} */ v) => (v === undefined ? null : { [name]: v });

/**
 * @param {SidenavItem[]} items
 * @param {import('react').ElementType} Link
 * @returns {import('react').ReactNode}
 */
function list(items, Link) {
    return (
        <ul className="kp-sidenav__list">
            {items.map((item, i) => (
                <li key={i}>
                    <Link className="kp-sidenav__link" href={item.href} aria-current={item.current ? 'page' : undefined}>
                        {item.icon === undefined ? null : (
                            <span className="kp-sidenav__icon" aria-hidden="true">
                                {item.icon}
                            </span>
                        )}
                        <span className="kp-sidenav__label">{item.label}</span>
                    </Link>
                    {item.children === undefined ? null : list(item.children, Link)}
                </li>
            ))}
        </ul>
    );
}

/**
 * @param {SidenavProps & import('react').HTMLAttributes<HTMLElement>} props
 * @param {import('react').ForwardedRef<HTMLElement>} ref
 */
function SidenavInner(
    {
        items,
        title,
        footer,
        mode,
        position,
        side,
        defaultOpen,
        slim,
        slimCollapsed,
        overBelow,
        expandOnHover,
        accordion,
        backdrop,
        backdropClass,
        closeOnEsc,
        lockScroll,
        focusTrap,
        contentSelector,
        reserve,
        shortcut,
        initialFocus,
        hoverDelay,
        slimBelow,
        railTips,
        flyout,
        inert,
        cancelable,
        closeOnBackdrop,
        resizable,
        minWidth,
        maxWidth,
        variant,
        density,
        onSidenavToggle,
        onSidenavSlim,
        onSidenavMode,
        onSidenavPrevented,
        remember,
        linkComponent: Link = 'a',
        autoAttach = true,
        label,
        className = '',
        style,
        children,
        ...rest
    },
    ref,
) {
    // Only the attributes the consumer actually set. An attribute that is
    // absent leaves the module's own default in place, which is what makes
    // every one of these optional rather than a value to be restated.
    const knobs = {
        ...value('data-kp-sidenav-mode', mode),
        ...value('data-kp-sidenav-position', position),
        ...value('data-kp-sidenav-side', side),
        ...flag('data-kp-sidenav-open', defaultOpen),
        ...flag('data-kp-sidenav-slim', slim),
        ...flag('data-kp-sidenav-slim-collapsed', slimCollapsed),
        ...(overBelow === undefined || overBelow === false ? null : { 'data-kp-sidenav-over-below': overBelow === true ? '' : overBelow }),
        ...flag('data-kp-sidenav-expand-on-hover', expandOnHover),
        ...flag('data-kp-sidenav-accordion', accordion),
        ...(backdrop === 'static' ? { 'data-kp-sidenav-backdrop': 'static' } : flag('data-kp-sidenav-backdrop', backdrop)),
        ...value('data-kp-sidenav-backdrop-class', backdropClass),
        ...flag('data-kp-sidenav-close-on-esc', closeOnEsc),
        ...flag('data-kp-sidenav-lock-scroll', lockScroll),
        ...flag('data-kp-sidenav-focus-trap', focusTrap),
        ...value('data-kp-sidenav-content', contentSelector),
        ...flag('data-kp-sidenav-reserve', reserve),
        ...value('data-kp-sidenav-shortcut', shortcut),
        ...value('data-kp-sidenav-initial-focus', initialFocus),
        ...value('data-kp-sidenav-hover-delay', hoverDelay === undefined ? undefined : String(hoverDelay)),
        ...(slimBelow === undefined || slimBelow === false ? null : { 'data-kp-sidenav-slim-below': slimBelow === true ? '' : slimBelow }),
        ...flag('data-kp-sidenav-rail-tips', railTips),
        ...flag('data-kp-sidenav-flyout', flyout),
        ...flag('data-kp-sidenav-inert', inert),
        ...flag('data-kp-sidenav-cancelable', cancelable),
        ...flag('data-kp-sidenav-close-on-backdrop', closeOnBackdrop),
        ...flag('data-kp-sidenav-resizable', resizable),
        ...value('data-kp-sidenav-min-width', minWidth),
        ...value('data-kp-sidenav-max-width', maxWidth),
        ...value('data-kp-sidenav-variant', variant),
        ...value('data-kp-sidenav-density', density),
        ...value('data-kp-remember', remember),
    };

    // js/auto.js attaches on load; React mounts after that, so a
    // consumer would otherwise have to know to attach again by hand —
    // and the first sign of not knowing is a navigation that renders
    // perfectly and does nothing. The module guards its own re-entry
    // (`data-kp-sidenav-attached`), so this is safe to call whether or
    // not auto.js already ran. `autoAttach={false}` is the way out, for
    // a consumer who attaches on their own schedule [KT6].
    const own = useRef(/** @type {HTMLElement | null} */ (null));
    useEffect(() => {
        if (!autoAttach || own.current === null) return undefined;
        let detach = /** @type {(() => void) | undefined} */ (undefined);
        let cancelled = false;
        import('../js/sidenav.js').then(({ attachSidenavs }) => {
            if (cancelled || own.current === null) return;
            detach = attachSidenavs(own.current.parentNode ?? document);
        });
        return () => {
            cancelled = true;
            detach?.();
        };
    }, [autoAttach]);

    // The module's events fire on the element either way; these props are
    // the same events as callbacks. The listeners are added once and read the
    // latest handler, so a new function on every render re-subscribes nothing.
    const heard = useRef({ onSidenavToggle, onSidenavSlim, onSidenavMode, onSidenavPrevented });
    heard.current = { onSidenavToggle, onSidenavSlim, onSidenavMode, onSidenavPrevented };
    useEffect(() => {
        const node = own.current;
        if (node === null) return undefined;
        const pairs = /** @type {const} */ ([
            [SIDENAV_TOGGLE_EVENT, 'onSidenavToggle'],
            [SIDENAV_SLIM_EVENT, 'onSidenavSlim'],
            [SIDENAV_MODE_EVENT, 'onSidenavMode'],
            [SIDENAV_PREVENTED_EVENT, 'onSidenavPrevented'],
        ]);
        const listeners = pairs.map(([type, name]) => {
            const listener = (/** @type {Event} */ event) => {
                // A nested panel's event bubbles through this one.
                if (event.target === node) /** @type {any} */ (heard.current)[name]?.(event);
            };
            node.addEventListener(type, listener);
            return /** @type {const} */ ([type, listener]);
        });
        return () => {
            for (const [type, listener] of listeners) node.removeEventListener(type, listener);
        };
    }, []);

    /** @param {HTMLElement | null} node */
    const hold = (node) => {
        own.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
    };

    return (
        <nav ref={hold} className={`kp-sidenav ${className}`.trim()} aria-label={label} style={style} {...knobs} {...rest}>
            {title === undefined ? null : (
                <div className="kp-sidenav__header">
                    <p className="kp-sidenav__title">{title}</p>
                </div>
            )}
            <div className="kp-sidenav__scroll">{items === undefined ? children : list(items, Link)}</div>
            {footer === undefined ? null : <div className="kp-sidenav__footer">{footer}</div>}
        </nav>
    );
}

const Sidenav = forwardRef(SidenavInner);
export default Sidenav;

/**
 * @typedef {object} SidenavToggleProps
 * @property {string} controls  The `id` of the navigation this opens.
 * @property {string} [className]
 * @property {import('react').ReactNode} [children]  The consumer's own word for it [KT5].
 */

/**
 * The button that opens it. Its own element rather than a prop of the
 * navigation, because it lives outside the navigation in the markup — and
 * because a consumer with a header of their own puts it where they like.
 *
 * @param {SidenavToggleProps & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props
 * @param {import('react').ForwardedRef<HTMLButtonElement>} ref
 */
function SidenavToggleInner({ controls, className = '', children, ...rest }, ref) {
    return (
        <button
            ref={ref}
            type="button"
            className={`kp-sidenav__toggle ${className}`.trim()}
            data-kp-sidenav-toggle=""
            aria-controls={controls}
            {...rest}
        >
            {children}
        </button>
    );
}

export const SidenavToggle = forwardRef(SidenavToggleInner);

/**
 * @typedef {object} SidenavSlimToggleProps
 * @property {string} controls  The `id` of the rail this collapses and expands.
 * @property {string} [className]
 * @property {import('react').ReactNode} [children]  The consumer's own word or glyph [KT5]. A glyph alone, marked aria-hidden, takes its accessible name from js/strings.js and the name follows the state.
 */

/**
 * The button that collapses the rail to its icons and gives the words back
 * [scope-48]. The React half of `data-kp-sidenav-slim-toggle`: it renders
 * that attribute and nothing else of its own, and js/sidenav.js writes
 * `aria-expanded`, `aria-controls` and — when the button has no words — the
 * accessible name, exactly as it does for the markup a server writes. The
 * button is not replaced when the rail changes, so the focus stays on it.
 *
 * @param {SidenavSlimToggleProps & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props
 * @param {import('react').ForwardedRef<HTMLButtonElement>} ref
 */
function SidenavSlimToggleInner({ controls, className, children, ...rest }, ref) {
    return (
        <button ref={ref} type="button" className={className} data-kp-sidenav-slim-toggle="" aria-controls={controls} {...rest}>
            {children}
        </button>
    );
}

export const SidenavSlimToggle = forwardRef(SidenavSlimToggleInner);
