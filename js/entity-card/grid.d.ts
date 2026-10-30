export type EntityData = import('./types.js').EntityData;
export type EntityEmptyOptions = import('./types.js').EntityEmptyOptions;
/** @typedef {import('./types.js').EntityData} EntityData */
/** @typedef {import('./types.js').EntityEmptyOptions} EntityEmptyOptions */
/**
 * Draw a grid's cards from a list; a card whose key is already there changes in place, a gone key leaves, order follows the list.
 * @param {HTMLElement} grid
 * @param {readonly EntityData[]} list
 * @param {EntityEmptyOptions} [empty] how the plate reads when the list is empty (see `setEntityGridState`)
 */
export declare function setEntityGrid(grid: HTMLElement, list: readonly EntityData[], empty?: EntityEmptyOptions): void;
/**
 * Put the whole grid in a state: `loading` (skeleton cards, as many as `options.count` or the cards it had, 6 at first, and the
 * busy card over them), `empty` ("No stacks yet" with its action) or `error` (the failed plate with Retry); a tile grid says "apps".
 * @param {HTMLElement} grid
 * @param {'loading' | 'empty' | 'error'} state
 * @param {{ count?: number, words?: string } & EntityEmptyOptions} [options] `words` is the busy card's line. The empty plate's action: `action: 'none'`
 * (or `data-kp-entity-empty-action="none"` on the grid) leaves it out, `actionLabel` words it, and `onAction` runs instead of the
 * `kp-entity-new` event
 */
export declare function setEntityGridState(grid: HTMLElement, state: 'loading' | 'empty' | 'error', options?: {
    count?: number;
    words?: string;
} & EntityEmptyOptions): void;
/**
 * Give every grid its options (the least card width) and keep the cards in step with them: a changed attribute draws every card again.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachEntityCards(root?: ParentNode): () => void;
