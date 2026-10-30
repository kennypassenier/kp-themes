export type EntityData = import('./types.js').EntityData;
/**
 * Draw the given cards again from their last data, slot by slot as the signatures say.
 * @param {readonly HTMLElement[]} cards
 * @param {string[]} [slots] slots to draw anew whatever the signature says
 */
export declare function redraw(cards: readonly HTMLElement[], slots?: string[]): void;
/**
 * Draw one card from its data. Only what differs from the last draw is touched.
 * @param {HTMLElement} card
 * @param {EntityData} data
 */
export declare function setEntity(card: HTMLElement, data: EntityData): void;
