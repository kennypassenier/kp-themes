import { useStrings } from '../hooks/use-strings.jsx';
// Navigation bar [TH7, TH36].
//
// The skip link rides on this: it is the first focusable thing on the
// page, invisible until focused, and it is the difference between a
// keyboard user reaching the content and tabbing through the whole menu
// on every page.

/**
 * @param {{ brand: string, links: {href: string, label: string, current?: boolean}[], skipTo?: string, strings?: Partial<import('../js/strings.js').Strings>, className?: string, children?: import('react').ReactNode }} props
 */
export default function NavBar({ brand, links, skipTo = '#main', strings, className = '', children }) {
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
                            <a className="kp-nav__link" href={l.href} aria-current={l.current ? 'page' : undefined}>
                                {l.label}
                            </a>
                        </li>
                    ))}
                </ul>
                {children}
            </nav>
        </>
    );
}
