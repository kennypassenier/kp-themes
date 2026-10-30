export type TableContext = import('./context.js').TableContext;
export type RenderFields = {
    clearButton: HTMLButtonElement;
    pillsList: HTMLElement;
    render: () => void;
};
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the renders the rows, the pager and the filter pills area part adds to the table's context.
 *
 * @typedef {{
 *     clearButton: HTMLButtonElement;
 *     pillsList: HTMLElement;
 *     render: () => void;
 * }} RenderFields
 */
/**
 * Renders the rows, the pager and the filter pills area.
 *
 * @param {TableContext} c
 */
export declare function installRender(c: TableContext): void;
