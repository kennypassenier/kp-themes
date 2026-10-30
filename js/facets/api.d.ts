/**
 * The values that are on.
 * @param {Element} group
 * @returns {string[]}
 */
export declare function getFacetValues(group: Element): string[];
/**
 * Turn exactly these values on (every other off); `null` turns all on. The
 * event is not fired: the page that calls this knows.
 *
 * @param {Element} group
 * @param {string[] | null} values
 */
export declare function setFacetValues(group: Element, values: string[] | null): void;
/**
 * Write the counts. `counts` maps a value to its count; a value not in it
 * keeps its count. `all` is the "Everything" row's (the sum of the numbers
 * when absent). The group stops being busy.
 *
 * @param {Element} group
 * @param {Record<string, number | string | null>} counts
 * @param {{ all?: number | string | null }} [options]
 */
export declare function setFacetCounts(group: Element, counts: Record<string, number | string | null>, { all }?: {
    all?: number | string | null;
}): void;
/**
 * Make the rows these items, in this order, changing what is there in place.
 *
 * @param {Element} group
 * @param {import('../facets.js').FacetItem[]} items
 */
export declare function setFacetItems(group: Element, items: import('../facets.js').FacetItem[]): void;
