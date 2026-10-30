/** @param {Element} el */
export declare const isRow: (el: Element) => boolean;
/** A row of a table body that counts as one: not a detail, group, held or divider row. @param {Element} el */
export declare const isTableRow: (el: Element) => boolean;
/** The key a row is known by when a sort or filter brings it back, or `''`. @param {Element} row */
export declare const rowKeyOf: (row: Element) => string;
