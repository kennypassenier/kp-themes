export type Strings = import('../../strings/types.js').Strings;
export type TableContext = import('./context.js').TableContext;
export type IdentityFields = {
    add: <T extends Element>(node: T) => T;
    added: Element[];
    id: string;
    make: (tag: string, className?: string) => HTMLElement;
    s0: Strings;
    undo: (() => void)[];
};
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the the table's id, its undo list and the arrival mark part adds to the table's context.
 *
 * @typedef {{
 *     add: <T extends Element>(node: T) => T;
 *     added: Element[];
 *     id: string;
 *     make: (tag: string, className?: string) => HTMLElement;
 *     s0: Strings;
 *     undo: (() => void)[];
 * }} IdentityFields
 */
/**
 * The table's id, its undo list and the arrival mark.
 *
 * @param {TableContext} c
 */
export declare function installIdentity(c: TableContext): void;
