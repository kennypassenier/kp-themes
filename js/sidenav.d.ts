export declare const SIDENAV_TOGGLE_EVENT = "kp-sidenav-toggle";
export declare const SIDENAV_SLIM_EVENT = "kp-sidenav-slim";
export declare const SIDENAV_MODE_EVENT = "kp-sidenav-mode";
/** The mark a consumer puts on a toggler they wire themselves [AR29]. */
export declare const SIDENAV_OWNED = "[data-kp-sidenav-owner]";
/**
 * Every option, written out.
 *
 * Built by joining a prefix to a name at first, which worked and hid the
 * whole surface: no gate could enumerate the options, and the
 * documentation site's extractor found one attribute whose name was the
 * bare prefix. An option nobody can list is an option nobody can
 * document [AR21].
 */
export declare const OPTIONS: {
    mode: string;
    position: string;
    side: string;
    open: string;
    slim: string;
    slimCollapsed: string;
    expandOnHover: string;
    accordion: string;
    backdrop: string;
    backdropClass: string;
    closeOnEsc: string;
    lockScroll: string;
    focusTrap: string;
    content: string;
    remember: string;
    toggle: string;
    slimHide: string;
    slimShow: string;
    expanded: string;
};
export type Sidenav = {
    element: HTMLElement;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setMode: (mode: 'over' | 'side' | 'push') => void;
    setSlim: (collapsed?: boolean) => void;
    isOpen: () => boolean;
    destroy: () => void;
};
/**
 * @typedef {object} Sidenav
 * @property {HTMLElement} element
 * @property {() => void} open
 * @property {() => void} close
 * @property {() => void} toggle
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
export declare function sidenavOf(element: Element | null): Sidenav | undefined;
/**
 * Wire every `.kp-sidenav` under `root`.
 *
 * @param {ParentNode} root
 * @param {{ strings?: Partial<import('./strings.js').Strings>, ownedBy?: string, store?: Storage | null }} [options]
 * @returns {() => void} detach
 */
export declare function attachSidenavs(root?: ParentNode, { strings, ownedBy, store }?: {
    strings?: Partial<import('./strings.js').Strings>;
    ownedBy?: string;
    store?: Storage | null;
}): () => void;
