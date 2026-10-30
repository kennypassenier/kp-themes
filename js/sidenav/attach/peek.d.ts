export type SidenavContext = import('./context.js').SidenavContext;
export type PeekFields = {
    onPeekEnter: () => void;
    onPeekFocusIn: () => void;
    onPeekFocusOut: (event: FocusEvent) => void;
    onPeekLeave: () => void;
    peekTimer: number;
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the peek: the panel shown from its edge part adds to the table's context.
 *
 * @typedef {{
 *     onPeekEnter: () => void;
 *     onPeekFocusIn: () => void;
 *     onPeekFocusOut: (event: FocusEvent) => void;
 *     onPeekLeave: () => void;
 *     peekTimer: number;
 * }} PeekFields
 */
/**
 * The peek: the panel shown from its edge.
 *
 * @param {SidenavContext} c
 */
export declare function installPeek(c: SidenavContext): void;
