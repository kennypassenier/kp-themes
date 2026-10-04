/** The band, and the severities it orders by, worst first. */
export declare const ATTENTION = ".kp-attention";
export declare const SEVERITIES: readonly ['critical', 'warning', 'info'];
/**
 * Put a band's items in severity order in the DOM (a stable sort: two
 * problems of one severity keep the order the page gave them).
 * @param {Element} band
 */
export declare function sortAttention(band: Element): void;
/**
 * Keep every attention band under `root` worst first, now and whenever an
 * item arrives or changes severity. The band hides itself in CSS when it
 * holds nothing.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachAttention(root?: ParentNode): () => void;
