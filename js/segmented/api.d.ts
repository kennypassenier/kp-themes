/**
 * Set a three-way group's chips without firing the event; a value in
 * neither list is let go.
 * @param {Element} group
 * @param {{ include?: Iterable<string>, exclude?: Iterable<string> }} values
 */
export declare function setSegmentedTri(group: Element, values: {
    include?: Iterable<string>;
    exclude?: Iterable<string>;
}): void;
/**
 * Set the values on without firing the event: for a page that moves the
 * group because something else moved (the address changed).
 * @param {Element} group
 * @param {Iterable<string>} values  Empty is All (multi) or nothing chosen (single).
 */
export declare function setSegmentedValues(group: Element, values: Iterable<string>): void;
/**
 * Turn every value off (back to All) and fire the event if anything was on.
 * @param {Element} group
 */
export declare function resetSegmented(group: Element): void;
/**
 * Write the numbers beside the values. `null` empties a count; a value not
 * named keeps its number. The count element is made when the item has none.
 * @param {Element} group
 * @param {Record<string, number | null | undefined>} counts
 */
export declare function setSegmentedCounts(group: Element, counts: Record<string, number | null | undefined>): void;
