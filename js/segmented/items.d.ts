/**
 * One button for an item spec.
 * @param {import('./constants.js').SegmentedItem} spec
 * @param {{ multi: boolean, tri: boolean, kept: Map<string, 'any' | 'include' | 'exclude'> }} look
 */
export declare function buildItem(spec: import('./constants.js').SegmentedItem, { multi, tri, kept }: {
    multi: boolean;
    tri: boolean;
    kept: Map<string, 'any' | 'include' | 'exclude'>;
}): HTMLButtonElement;
/**
 * Replace the items of a group (the values can change under it). The values
 * still present stay on; the focus stays on its value.
 * @param {Element} group
 * @param {readonly import('./constants.js').SegmentedItem[]} items
 */
export declare function setSegmentedItems(group: Element, items: readonly import('./constants.js').SegmentedItem[]): void;
