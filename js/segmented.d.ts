export { SEGMENTED, SEGMENTED_EVENT, SEGMENTED_ITEM, THUMB_ATTRIBUTE, GLIDE_ATTRIBUTE, TRI_ATTRIBUTE, TRI_STATES, OVERFLOW_ATTRIBUTE, MORE_ATTRIBUTE, } from './segmented/constants.js';
export { itemsOf, valueOf, getSegmentedValues, getSegmentedTri } from './segmented/read.js';
export { layout } from './segmented/plate.js';
export { setSegmentedTri, setSegmentedValues, resetSegmented, setSegmentedCounts } from './segmented/api.js';
export { setSegmentedItems } from './segmented/items.js';
export { attachSegmented } from './segmented/root.js';
export type SegmentedItem = import('./segmented/constants.js').SegmentedItem;
export type TriValues = import('./segmented/constants.js').TriValues;
/** @typedef {import('./segmented/constants.js').SegmentedItem} SegmentedItem */
/** @typedef {import('./segmented/constants.js').TriValues} TriValues */
