export type BulletRow = import('../bullets.js').BulletRow;
export type RowContext = {
    threshold: number;
    max: number;
    bad?: number;
    format: (value: number) => string;
    /**
     * whether any row of the list has a lead, so the others keep its column
     */
    leads: boolean;
    strings: import('../strings.js').Strings;
};
/** @param {Document} doc @param {BulletRow} row @param {RowContext} ctx */
export declare function buildRow(doc: Document, row: BulletRow, ctx: RowContext): HTMLElement;
