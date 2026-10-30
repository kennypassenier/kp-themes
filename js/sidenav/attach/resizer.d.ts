export type SidenavContext = import('./context.js').SidenavContext;
export type ResizerFields = {
    grip: HTMLElement | null;
    held: number | null;
    heldTransition: string;
    wroteWidth: boolean;
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the resize grip: drag, keys and reset part adds to the table's context.
 *
 * @typedef {{
 *     grip: HTMLElement | null;
 *     held: number | null;
 *     heldTransition: string;
 *     wroteWidth: boolean;
 * }} ResizerFields
 */
/**
 * The resize grip: drag, keys and reset.
 *
 * @param {SidenavContext} c
 */
export declare function installResizer(c: SidenavContext): void;
