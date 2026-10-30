/** The ancestors of `host` that clip it sideways (overflow-x other than visible), nearest first. @param {HTMLElement} host */
export declare function scrollersAround(host: HTMLElement): HTMLElement[];
/**
 * The span of `host`'s width (left to right, in viewport pixels) that no ancestor's sideways scrolling hides.
 * @param {HTMLElement} host @param {number} left @param {number} right
 */
export declare function seenAcross(host: HTMLElement, left: number, right: number): {
    left: number;
    right: number;
};
