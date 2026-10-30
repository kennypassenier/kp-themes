export type TableContext = import('./context.js').TableContext;
export type ChromeFields = {
    ensureTopBar: () => HTMLElement;
    putUnder: (line: HTMLElement) => void;
    scrollBox: HTMLElement | null;
    tableBlock: Element;
    themeBox: (box: Element | null) => void;
    topBar: HTMLElement | null;
};
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the the chrome around the table: the scroll box, the top and bottom bars part adds to the table's context.
 *
 * @typedef {{
 *     ensureTopBar: () => HTMLElement;
 *     putUnder: (line: HTMLElement) => void;
 *     scrollBox: HTMLElement | null;
 *     tableBlock: Element;
 *     themeBox: (box: Element | null) => void;
 *     topBar: HTMLElement | null;
 * }} ChromeFields
 */
/**
 * The chrome around the table: the scroll box, the top and bottom bars.
 *
 * @param {TableContext} c
 */
export declare function installChrome(c: TableContext): void;
