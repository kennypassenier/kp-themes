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
     * What stays under the list, in `.kp-sidenav__footer` — an account row, or the rail's own SidenavSlimToggle. Omit for no footer.
     */
    footer?: import('react').ReactNode;
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
     * Become the `over` panel while the box it lives in is this wide or narrower: `true` for the package's 40rem step, or a length. Its toggles are shown only then, its slim toggles only above it [scope-80].
     */
    overBelow?: boolean | string;
    /**
     * Widen while the pointer is over it.
     */
    expandOnHover?: boolean;
    /**
     * One nested list open at a time.
     */
    accordion?: boolean;
    /**
     * Dim the page behind it in `over`; `false` for no scrim; `'static'` keeps the scrim and refuses a click on it with the theme's cue (the panel does not close, `onSidenavPrevented` fires).
     */
    backdrop?: boolean | 'static';
    backdropClass?: string;
    closeOnEsc?: boolean;
    lockScroll?: boolean;
    focusTrap?: boolean;
    /**
     * What `push` moves over.
     */
    contentSelector?: string;
    /**
     * The content keeps the panel's width whether it is open or not (push and over): the gutter the panel opens into.
     */
    reserve?: boolean;
    /**
     * Which opener an `over` or `push` panel shows: the fixed launcher, the edge tab or both. Left out, it is `tab` (the edge tab; a page with no tab for the panel keeps the launcher). `side` and the collapsed rail ignore it.
     */
    opener?: 'launcher' | 'tab' | 'both';
    /**
     * A key chord that toggles it from anywhere but a text field, e.g. `Control+b` (`Mod` is Meta on a Mac).
     */
    shortcut?: string;
    /**
     * A selector, inside the panel, for where the focus lands on opening; used in every mode.
     */
    initialFocus?: string;
    /**
     * Milliseconds the pointer rests before an `expandOnHover` rail widens. Left out, the module waits 150.
     */
    hoverDelay?: number;
    /**
     * Collapse the rail to its icons while its box is this wide or narrower: `true` for the 40rem step, or a length.
     */
    slimBelow?: boolean | string;
    /**
     * In the collapsed rail each item shows its label as a tooltip. Default on.
     */
    railTips?: boolean;
    /**
     * In the collapsed rail a group's submenu floats beside it. Default on.
     */
    flyout?: boolean;
    /**
     * A closed panel leaves the tab order and the accessibility tree. Default on.
     */
    inert?: boolean;
    /**
     * `onSidenavToggle` and `onSidenavSlim` fire before the change and `preventDefault()` refuses it (`onSidenavPrevented` then fires).
     */
    cancelable?: boolean;
    /**
     * A click on the backdrop closes it. Default on.
     */
    closeOnBackdrop?: boolean;
    /**
     * A handle on the content-facing edge makes the width the reader's; kept with `remember`.
     */
    resizable?: boolean;
    /**
     * The narrowest width the handle allows, a length. Default 12rem.
     */
    minWidth?: string;
    /**
     * The widest width the handle allows, a length. Default 32rem.
     */
    maxWidth?: string;
    /**
     * The panel's look: `floating` detaches it from the window's edge, `inset` makes the content a rounded card beside it.
     */
    variant?: 'floating' | 'inset';
    /**
     * Row height and panel padding.
     */
    density?: 'compact' | 'default' | 'comfortable';
    /**
     * The panel opened or closed (before, with `cancelable`).
     */
    onSidenavToggle?: (event: CustomEvent<{
        open: boolean;
        reason: string;
    }>) => void;
    /**
     * The rail collapsed or expanded (before, with `cancelable`).
     */
    onSidenavSlim?: (event: CustomEvent<{
        collapsed: boolean;
        reason: string;
    }>) => void;
    /**
     * The mode or the room it takes changed.
     */
    onSidenavMode?: (event: CustomEvent<{
        mode: 'over' | 'side' | 'push';
        offset: unknown;
        reason: string;
    }>) => void;
    /**
     * A change was refused (by a listener or a static backdrop); `detail.reason` says who asked.
     */
    onSidenavPrevented?: (event: CustomEvent<{
        kind: string;
        reason: string;
        source: string;
    }>) => void;
    /**
     * A name, so what the reader folded, opened or collapsed survives a reload. Writes `data-kp-remember`; the key is composed from it [js/remember.js].
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
export type SidenavSlimToggleProps = {
    /**
     * The `id` of the rail this collapses and expands.
     */
    controls: string;
    className?: string;
    /**
     * The consumer's own word or glyph [KT5]. A glyph alone, marked aria-hidden, takes its accessible name from js/strings.js and the name follows the state.
     */
    children?: import('react').ReactNode;
};
export declare const SidenavSlimToggle: import("react").ForwardRefExoticComponent<SidenavSlimToggleProps & import("react").ButtonHTMLAttributes<HTMLButtonElement> & import("react").RefAttributes<HTMLButtonElement>>;
