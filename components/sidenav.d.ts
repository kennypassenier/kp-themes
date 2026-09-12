export type SidenavItem = {
    /**
     * What the reader sees.
     */
    label: import('react').ReactNode;
    href?: string;
    /**
     * Renders `aria-current="page"`.
     */
    current?: boolean;
    /**
     * Shown in the slim state, where the label is not.
     */
    icon?: import('react').ReactNode;
    /**
     * A nested list, which the module makes collapsible.
     */
    children?: SidenavItem[];
};
export type SidenavProps = {
    /**
     * The list. Omit and pass children to build it by hand.
     */
    items?: SidenavItem[];
    /**
     * The heading above the list. Omit for no header.
     */
    title?: import('react').ReactNode;
    /**
     * How it sits beside the content. Default: the module's 'side'.
     */
    mode?: 'over' | 'side' | 'push';
    /**
     * Default: the module's own.
     */
    position?: 'fixed' | 'absolute';
    /**
     * Which edge it lives on. Default: the module's own.
     */
    side?: 'start' | 'end';
    /**
     * Open on first render. The module owns it afterwards.
     */
    defaultOpen?: boolean;
    /**
     * Offer the narrow state at all.
     */
    slim?: boolean;
    /**
     * Start narrow.
     */
    slimCollapsed?: boolean;
    /**
     * Widen while the pointer is over it.
     */
    expandOnHover?: boolean;
    /**
     * One nested list open at a time.
     */
    accordion?: boolean;
    /**
     * Dim the page behind it in `over`.
     */
    backdrop?: boolean;
    backdropClass?: string;
    closeOnEsc?: boolean;
    lockScroll?: boolean;
    focusTrap?: boolean;
    /**
     * What `push` moves over.
     */
    contentSelector?: string;
    /**
     * A storage key, so the narrow state survives a reload.
     */
    remember?: string;
    /**
     * What renders a link [TH62]. Default 'a'.
     */
    linkComponent?: import('react').ElementType;
    /**
     * The accessible name of the navigation landmark.
     */
    label?: string;
    /**
     * Hand the rendered markup to js/sidenav.js on mount. Default true.
     */
    autoAttach?: boolean;
    className?: string;
    style?: import('react').CSSProperties;
    children?: import('react').ReactNode;
};
declare const Sidenav: import("react").ForwardRefExoticComponent<SidenavProps & import("react").HTMLAttributes<HTMLElement> & import("react").RefAttributes<HTMLElement>>;
export default Sidenav;
export type SidenavToggleProps = {
    /**
     * The `id` of the navigation this opens.
     */
    controls: string;
    className?: string;
    /**
     * The consumer's own word for it [KT5].
     */
    children?: import('react').ReactNode;
};
export declare const SidenavToggle: import("react").ForwardRefExoticComponent<SidenavToggleProps & import("react").ButtonHTMLAttributes<HTMLButtonElement> & import("react").RefAttributes<HTMLButtonElement>>;
