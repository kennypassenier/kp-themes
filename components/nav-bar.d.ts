export type NavLink = {
    href: string;
    label: import('react').ReactNode;
    current?: boolean | 'page' | 'location' | 'step' | 'true';
    icon?: import('react').ReactNode;
    disabled?: boolean;
    className?: string;
    target?: string;
    rel?: string;
    links?: NavLink[];
    menuLabel?: string;
    groups?: NavGroup[];
};
export type NavGroup = {
    label: import('react').ReactNode;
    links: NavLink[];
};
export type NavBarProps = {
    brand?: import('react').ReactNode;
    /**
     * Makes the brand a link home.
     */
    brandHref?: string;
    /**
     * What renders the brand link. Default: linkComponent.
     */
    brandComponent?: import('react').ElementType;
    links?: NavLink[];
    /**
     * Default '#main'.
     */
    skipTo?: string;
    /**
     * Default true. False for a page that has its own.
     */
    skipLink?: boolean;
    skipLabel?: import('react').ReactNode;
    linkComponent?: import('react').ElementType;
    renderLink?: (link: NavLink, props: {
        className: string;
        href: string;
        'aria-current': string | undefined;
    }) => import('react').ReactNode;
    /**
     * Default 'ul'.
     */
    listAs?: 'ul' | 'div';
    /**
     * Render the `.kp-nav-wrap` container the narrow rule needs. Default true.
     */
    wrap?: boolean;
    /**
     * Extra classes for that wrapper.
     */
    wrapClassName?: string;
    /**
     * The nav's accessible name. Default: the dictionary's.
     */
    label?: string;
    /**
     * Render the toggle a narrow bar collapses into. Default false, so an existing nav is unchanged.
     */
    collapsible?: boolean;
    /**
     * What goes in that button. Empty draws three bars; this package ships type, not icons.
     */
    toggleIcon?: import('react').ReactNode;
    /**
     * The shrinking header [scope-48]: the wrapper sticks to the top and turns compact once the page has scrolled past `stickyAfter`. Needs `wrap`. Default false.
     */
    sticky?: boolean;
    /**
     * How far, in px, before the bar turns compact; never less than the bar's own height, which is the default.
     */
    stickyAfter?: number;
    /**
     * The `.kp-nav__search` slot: the command palette's trigger, usually a PaletteTrigger [scope-48].
     */
    search?: import('react').ReactNode;
    /**
     * The level of a mega menu's group headings. Default 2.
     */
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    classNames?: {
        brand?: string;
        list?: string;
        item?: string;
        link?: string;
        skip?: string;
        menu?: string;
        menuLink?: string;
        toggle?: string;
        search?: string;
    };
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    /**
     * Trailing slot.
     */
    children?: import('react').ReactNode;
};
declare const NavBar: import("react").ForwardRefExoticComponent<NavBarProps & import("react").HTMLAttributes<HTMLElement> & import("react").RefAttributes<HTMLElement>>;
export default NavBar;
