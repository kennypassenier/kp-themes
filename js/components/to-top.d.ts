/** Fired on the control when it appears or goes away: `{ shown }`. */
export declare const TO_TOP_EVENT = "kp-to-top";
/** The attribute that marks a back-to-top control [feat-page-1]. */
export declare const TO_TOP = "[data-kp-to-top]";
/**
 * Wire every back-to-top control under `root` [feat-page-1].
 *
 * Two halves, and the second is the one usually missing: it takes the
 * reader back, and it takes the FOCUS back. A control that only scrolls
 * leaves a keyboard user at the bottom of the document with the view at
 * the top, which is worse than not moving at all.
 *
 * Where the focus lands is `data-kp-to-top-target`, a selector, and it
 * falls back to the document's own body — the top of the page, which is
 * what the control is named after. It is NOT the skip link's target: on a
 * page with anything tall above the content, focusing that landmark
 * scrolls straight back down to it and undoes the journey. Scrolling is
 * left to the browser: `scrollTo` follows the root's own scroll-behaviour,
 * which is the knob feat-layout-2 already put there and which a reader who
 * asked for less motion has already overruled.
 *
 * @param {ParentNode} root
 * @param {{ strings?: Partial<import('../strings.js').Strings>, after?: number }} [options]
 * @returns {() => void} detach
 */
export declare function attachToTop(root?: ParentNode, { strings, after }?: {
    strings?: Partial<import('../strings.js').Strings>;
    after?: number;
}): () => void;
