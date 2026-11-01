/**
 * Next on the active track: the step is passed, the track goes on to its next, or is finished. A step that waits is not passed.
 * @param {HTMLElement} root
 */
export declare function trackNext(root: HTMLElement): void;
/** Back on the active track: from the finished plate the last step again, else the step before, to be done again. @param {HTMLElement} root */
export declare function trackPrev(root: HTMLElement): boolean;
/**
 * A script goes to a step: its track becomes the active one, at that step.
 * @param {HTMLElement} root @param {number} index
 * @returns {boolean} whether it moved
 */
export declare function trackGo(root: HTMLElement, index: number): boolean;
