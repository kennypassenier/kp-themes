import { forwardRef, useEffect, useRef } from 'react';

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
 * @property {'over' | 'side' | 'push'} [mode]  How it sits beside the content. Default: the module's 'side'.
 * @property {'fixed' | 'absolute'} [position]  Default: the module's own.
 * @property {'start' | 'end'} [side]  Which edge it lives on. Default: the module's own.
 * @property {boolean} [defaultOpen]  Open on first render. The module owns it afterwards.
 * @property {boolean} [slim]  Offer the narrow state at all.
 * @property {boolean} [slimCollapsed]  Start narrow.
 * @property {boolean} [expandOnHover]  Widen while the pointer is over it.
 * @property {boolean} [accordion]  One nested list open at a time.
 * @property {boolean} [backdrop]  Dim the page behind it in `over`.
 * @property {string} [backdropClass]
 * @property {boolean} [closeOnEsc]
 * @property {boolean} [lockScroll]
 * @property {boolean} [focusTrap]
 * @property {string} [contentSelector]  What `push` moves over.
 * @property {string} [remember]  A storage key, so the narrow state survives a reload.
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
        mode,
        position,
        side,
        defaultOpen,
        slim,
        slimCollapsed,
        expandOnHover,
        accordion,
        backdrop,
        backdropClass,
        closeOnEsc,
        lockScroll,
        focusTrap,
        contentSelector,
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
        ...flag('data-kp-sidenav-expand-on-hover', expandOnHover),
        ...flag('data-kp-sidenav-accordion', accordion),
        ...flag('data-kp-sidenav-backdrop', backdrop),
        ...value('data-kp-sidenav-backdrop-class', backdropClass),
        ...flag('data-kp-sidenav-close-on-esc', closeOnEsc),
        ...flag('data-kp-sidenav-lock-scroll', lockScroll),
        ...flag('data-kp-sidenav-focus-trap', focusTrap),
        ...value('data-kp-sidenav-content', contentSelector),
        ...value('data-kp-sidenav-remember', remember),
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
