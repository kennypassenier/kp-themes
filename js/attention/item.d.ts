export type AttentionItem = import('../attention.js').AttentionItem;
/**
 * Write `item` into `el`, touching only what changed.
 * @param {HTMLElement} el @param {AttentionItem} item
 */
export declare function paintItem(el: HTMLElement, item: AttentionItem): void;
