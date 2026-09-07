import { forwardRef, Fragment } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';
import { skipTo as jumpTo } from '../js/components.js';
// Navigation bar [TH7, TH36].
//
// The skip link rides on this: it is the first focusable thing on the
// page, invisible until focused, and it is the difference between a
// keyboard user reaching the content and tabbing through the whole menu
// on every page.
//
// Since 3.0.0 [KT6]: the brand can be a link — the owner's own example
// of a forced decision, one element over from the links `linkComponent`
// already freed; the skip link moves focus rather than only the scroll
// position (JobTracker found that without `tabindex="-1"` on the target
// the next Tab went back to the menu, and nothing in the package said
// so); every part is a prop; and a ref is forwarded.

/**
 * @typedef {{ href: string, label: import('react').ReactNode, current?: boolean | 'page' | 'location' | 'step' | 'true', icon?: import('react').ReactNode, disabled?: boolean, className?: string, target?: string, rel?: string, links?: NavLink[] }} NavLink
 */

/**
 * `linkComponent` is how a consumer with a router keeps their routing.
 *
 * The default is a plain `<a>`, which is correct HTML and reloads the
 * page — fine for a server-rendered site, and the wrong thing inside a
 * React Router or Next application, where every click would throw the
 * state away. Passing `linkComponent={Link}` hands the rendering over;
 * the component still receives `href`, so a router whose prop is called
 * something else gets a two-line wrapper rather than a fork of this file.
 *
 * The skip link is deliberately not routed. It is a same-page anchor to
 * an element on this page, and sending it through a router turns the one
 * link a keyboard user needs into a navigation.
 *
 * @typedef {object} NavBarProps
 * @property {import('react').ReactNode} [brand]
 * @property {string} [brandHref]  Makes the brand a link home.
 * @property {import('react').ElementType} [brandComponent]  What renders the brand link. Default: linkComponent.
 * @property {NavLink[]} [links]
 * @property {string} [skipTo]     Default '#main'.
 * @property {boolean} [skipLink]  Default true. False for a page that has its own.
 * @property {import('react').ReactNode} [skipLabel]
 * @property {import('react').ElementType} [linkComponent]
 * @property {(link: NavLink, props: { className: string, href: string, 'aria-current': string | undefined }) => import('react').ReactNode} [renderLink]
 * @property {'ul' | 'div'} [listAs]  Default 'ul'.
 * @property {boolean} [wrap]       Render the `.kp-nav-wrap` container the narrow rule needs. Default true.
 * @property {string} [wrapClassName]  Extra classes for that wrapper.
 * @property {string} [label]       The nav's accessible name. Default: the dictionary's.
 * @property {{ brand?: string, list?: string, item?: string, link?: string, skip?: string, menu?: string, menuLink?: string }} [classNames]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').ReactNode} [children]  Trailing slot.
 */

/**
 * @param {NavBarProps & import('react').HTMLAttributes<HTMLElement>} props
 * @param {import('react').ForwardedRef<HTMLElement>} ref
 */
function NavBarInner(
    {
        brand,
        brandHref,
        brandComponent,
        links = [],
        skipTo = '#main',
        skipLink = true,
        skipLabel,
        linkComponent: Link = 'a',
        renderLink,
        listAs: List = 'ul',
        wrap = true,
        wrapClassName = '',
        label,
        classNames = {},
        strings,
        className = '',
        children,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const Brand = brandComponent ?? Link;
    const Item = List === 'ul' ? 'li' : 'div';
    // The wrapper is what the narrow rule reads [TH104, AR24]: a container
    // query styles a container's contents, never the container itself, and
    // the rule that changes is the bar's own padding. It is rendered here
    // rather than left to the consumer, because a component that needs a
    // div around it to work is a component that does not work.
    // `wrap={false}` is the way out for a page that already establishes a
    // container of its own [KT6]. The skip link stays OUTSIDE it: it is
    // the first focusable thing on the page and belongs to the page, not
    // to the bar.
    const Wrap = wrap ? 'div' : Fragment;
    const wrapProps = wrap ? { className: `kp-nav-wrap ${wrapClassName}`.trim() } : {};
    return (
        <>
            {skipLink && (
                <a
                    className={`kp-skip-link ${classNames.skip ?? ''}`.trim()}
                    href={skipTo}
                    onClick={(event) => {
                        // Focus, not only scroll: the link exists for the
                        // person whose next Tab would otherwise land back
                        // in the menu.
                        if (jumpTo(skipTo)) event.preventDefault();
                    }}
                >
                    {skipLabel ?? s.skipToContent}
                </a>
            )}
            <Wrap {...wrapProps}>
                <nav ref={ref} className={`kp-nav ${className}`.trim()} aria-label={label ?? s.mainNavigation} {...rest}>
                    {brand !== undefined &&
                        (brandHref ? (
                            <Brand className={`kp-nav__brand ${classNames.brand ?? ''}`.trim()} href={brandHref}>
                                {brand}
                            </Brand>
                        ) : (
                            <span className={`kp-nav__brand ${classNames.brand ?? ''}`.trim()}>{brand}</span>
                        ))}
                    <List className={`kp-nav__links ${classNames.list ?? ''}`.trim()}>
                        {links.map((l) => {
                            const current = l.current === true ? 'page' : l.current === false || l.current === undefined ? undefined : l.current;
                            const sub = Array.isArray(l.links) && l.links.length > 0 ? l.links : null;
                            const props = {
                                className: `kp-nav__link ${classNames.link ?? ''} ${l.className ?? ''}`.trim(),
                                href: l.href,
                                'aria-current': current,
                                // A register may glitch the label as a copy of itself
                                // [TH117]; a label that is not text has no copy.
                                'data-kp-text': typeof l.label === 'string' ? l.label : undefined,
                                'aria-haspopup': sub ? 'true' : undefined,
                            };
                            return (
                                <Item key={l.href} className={classNames.item}>
                                    {renderLink ? (
                                        renderLink(l, props)
                                    ) : (
                                        <Link {...props} aria-disabled={l.disabled ? 'true' : undefined} target={l.target} rel={l.rel}>
                                            {l.icon}
                                            {l.label}
                                        </Link>
                                    )}
                                    {sub && (
                                        <ul className={`kp-nav__menu ${classNames.menu ?? ''}`.trim()}>
                                            {sub.map((child) => (
                                                <li key={child.href}>
                                                    <Link className={classNames.menuLink} href={child.href}>
                                                        {child.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </Item>
                            );
                        })}
                    </List>
                    {children}
                </nav>
            </Wrap>
        </>
    );
}

const NavBar = forwardRef(NavBarInner);
export default NavBar;
