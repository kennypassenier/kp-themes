/**
 * Put the mark on: the theme's timing as inline custom properties, an
 * inline host as an inline-block (a transform and an overlay need a box),
 * the attribute last. No reflow of its own: a mark that was on came off
 * before the batch read the host's style, so setting it again starts the
 * keyframes again.
 * @param {HTMLElement} host
 * @param {string} idea
 * @param {{ duration: number, ease: string }} timing
 * @param {{ inline?: boolean }} [options] whether the host is laid out inline now
 * @returns {Record<string, string>} the inline values update() replaced, to put back
 */
export declare function markUpdating(host: HTMLElement, idea: string, timing: {
    duration: number;
    ease: string;
}, { inline }?: {
    inline?: boolean;
}): Record<string, string>;
/**
 * Take the mark off and put back what markUpdating() replaced.
 * @param {HTMLElement} host
 * @param {Record<string, string>} before
 */
export declare function unmarkUpdating(host: HTMLElement, before: Record<string, string>): void;
