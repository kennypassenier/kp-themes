export type SidenavContext = import('./context.js').SidenavContext;
export type ShiftFields = {
    offsetContent: (open: boolean) => {
        property: null;
        value: string;
    } | {
        property: string;
        value: string;
    };
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the shifts the content aside and applies the opener part adds to the table's context.
 *
 * @typedef {{
 *     offsetContent: (open: boolean) => { property: null; value: string; } | { property: string; value: string; };
 * }} ShiftFields
 */
/**
 * Shifts the content aside and applies the opener.
 *
 * @param {SidenavContext} c
 */
export declare function installShift(c: SidenavContext): void;
