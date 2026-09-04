import { useStrings } from '../hooks/use-strings.jsx';
// Navigation bar [TH7, TH36].
//
// The skip link rides on this: it is the first focusable thing on the
// page, invisible until focused, and it is the difference between a
// keyboard user reaching the content and tabbing through the whole menu
// on every page.

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
 * @param {{ brand: string, links: {href: string, label: string, current?: boolean}[], skipTo?: string, linkComponent?: import('react').ElementType, strings?: Partial<import('../js/strings.js').Strings>, className?: string, children?: import('react').ReactNode }} props
 */
export default function NavBar({ brand, links, skipTo = '#main', linkComponent: Link = 'a', strings, className = '', children }) {
    const s = useStrings(strings);
    return (
        <>
            <a className="kp-skip-link" href={skipTo}>
                {s.skipToContent}
            </a>
            <nav className={`kp-nav ${className}`.trim()} aria-label={s.mainNavigation}>
                <span className="kp-nav__brand">{brand}</span>
                <ul className="kp-nav__links">
                    {links.map((l) => (
                        <li key={l.href}>
                            <Link className="kp-nav__link" href={l.href} aria-current={l.current ? 'page' : undefined}>
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                {children}
            </nav>
        </>
    );
}
