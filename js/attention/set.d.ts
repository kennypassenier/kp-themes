export type AttentionItem = import('../attention.js').AttentionItem;
/**
 * Put a band's items in severity order in the DOM (a stable sort: two
 * problems of one severity keep the order the page gave them).
 * @param {Element} band
 */
export declare function sortAttention(band: Element): void;
/**
 * Set a band's problems, by key [port spec F]. An item whose key is on the
 * band already stays the same element and only what changed in it is
 * rewritten (an alert is not inserted again, so it is not announced again,
 * and focus on its fix stays); a new key makes a new item (`role="alert"`
 * for a critical one, `role="status"` otherwise); a key no longer given
 * leaves the theme's way (`leave()` from js/motion.js, at once under
 * reduced motion). The band ends worst first, in the given order within a
 * severity, and only items out of place are moved.
 *
 * @param {Element} band a `.kp-attention`
 * @param {AttentionItem[]} items
 */
export declare function setAttention(band: Element, items: AttentionItem[]): void;
