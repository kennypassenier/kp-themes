export type RowContext = {
    options: ReturnType<typeof import('./options.js').passkeyOptions>;
    now: number;
    /**
     * whether this is the only way in left
     */
    last: boolean;
};
/**
 * One row of the list.
 * @param {Document} doc
 * @param {import('./controller.js').PasskeysController} c the list: what is busy, being renamed or refused
 * @param {import('./constants.js').PasskeyRow} row
 * @param {RowContext} context
 */
export declare function rowItem(doc: Document, c: import('./controller.js').PasskeysController, row: import('./constants.js').PasskeyRow, context: RowContext): HTMLElement;
