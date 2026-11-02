export { CHIP_FILTER, FILTER_FOR, FILTER_COLUMN, FILTER_CHIPS, FILTER_COUNTS } from './chip-filter/constants.js';
export { countValues, chipValues, chipCounts } from './chip-filter/counts.js';
/**
 * Tie every chip filter under `root` to its table. Wire the chips' own group with attachSegmented first (js/auto.js does both).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachChipFilters(root?: ParentNode): () => void;
