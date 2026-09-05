export type NavLink = {
    href: string;
    label: import('react').ReactNode;
    current?: boolean | 'page' | 'location' | 'step' | 'true';
    icon?: import('react').ReactNode;
    disabled?: boolean;
    className?: string;
    target?: string;
    rel?: string;
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
     * The nav's accessible name. Default: the dictionary's.
     */
    label?: string;
    classNames?: {
        brand?: string;
        list?: string;
        item?: string;
        link?: string;
        skip?: string;
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
