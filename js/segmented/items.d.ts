/**
 * Replace the items of a group (the values can change under it). The values
 * still present stay on; the focus stays on its value.
 * @param {Element} group
 * @param {readonly import('./constants.js').SegmentedItem[]} items
 */
export declare function setSegmentedItems(group: Element, items: readonly import('./constants.js').SegmentedItem[]): void;
