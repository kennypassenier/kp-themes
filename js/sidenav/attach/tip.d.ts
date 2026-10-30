export type SidenavContext = import('./context.js').SidenavContext;
export type TipFields = {
    floatBeside: (box: HTMLElement, item: Element, align: 'start' | 'centre') => void;
    floated: Map<HTMLElement, {
        added: boolean;
    }>;
    hideTip: () => void;
    onTipFocus: (event: FocusEvent) => void;
    onTipOut: (event: PointerEvent) => void;
    onTipOver: (event: PointerEvent) => void;
    show: (box: HTMLElement, then: (() => void)) => void;
    submenuOf: (category: Element) => HTMLElement | null;
    tip: HTMLElement | null;
    tipTimer: number;
    toggleOf: (category: Element) => HTMLElement | null;
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the tip beside a rail item and the floating submenu part adds to the table's context.
 *
 * @typedef {{
 *     floatBeside: (box: HTMLElement, item: Element, align: 'start' | 'centre') => void;
 *     floated: Map<HTMLElement, { added: boolean; }>;
 *     hideTip: () => void;
 *     onTipFocus: (event: FocusEvent) => void;
 *     onTipOut: (event: PointerEvent) => void;
 *     onTipOver: (event: PointerEvent) => void;
 *     show: (box: HTMLElement, then: (() => void)) => void;
 *     submenuOf: (category: Element) => HTMLElement | null;
 *     tip: HTMLElement | null;
 *     tipTimer: number;
 *     toggleOf: (category: Element) => HTMLElement | null;
 * }} TipFields
 */
/**
 * The tip beside a rail item and the floating submenu.
 *
 * @param {SidenavContext} c
 */
export declare function installTip(c: SidenavContext): void;
