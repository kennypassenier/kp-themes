export type SidenavContext = import('./context.js').SidenavContext;
export type BackdropFields = {
    dropBackdrop: () => void;
    onTrap: (event: KeyboardEvent) => void;
    raiseBackdrop: () => void;
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the the backdrop and the focus trap of an open panel part adds to the table's context.
 *
 * @typedef {{
 *     dropBackdrop: () => void;
 *     onTrap: (event: KeyboardEvent) => void;
 *     raiseBackdrop: () => void;
 * }} BackdropFields
 */
/**
 * The backdrop and the focus trap of an open panel.
 *
 * @param {SidenavContext} c
 */
export declare function installBackdrop(c: SidenavContext): void;
