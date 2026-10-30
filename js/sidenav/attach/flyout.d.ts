export type SidenavContext = import('./context.js').SidenavContext;
export type FlyoutFields = {
    flyIn: (category: Element, arg1?: {
        refocus?: boolean | undefined;
    }) => void;
    flyOut: (category: Element, arg1?: {
        focusFirst?: boolean | undefined;
    }) => void;
    flyTimers: Map<Element, number>;
    onFlyFocusOut: (event: FocusEvent) => void;
    onFlyOut: (event: PointerEvent) => void;
    onFlyOver: (event: PointerEvent) => void;
    syncRail: () => void;
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the fly-out of a rail item: opening, closing and its timers part adds to the table's context.
 *
 * @typedef {{
 *     flyIn: (category: Element, arg1?: { refocus?: boolean | undefined; }) => void;
 *     flyOut: (category: Element, arg1?: { focusFirst?: boolean | undefined; }) => void;
 *     flyTimers: Map<Element, number>;
 *     onFlyFocusOut: (event: FocusEvent) => void;
 *     onFlyOut: (event: PointerEvent) => void;
 *     onFlyOver: (event: PointerEvent) => void;
 *     syncRail: () => void;
 * }} FlyoutFields
 */
/**
 * The fly-out of a rail item: opening, closing and its timers.
 *
 * @param {SidenavContext} c
 */
export declare function installFlyout(c: SidenavContext): void;
