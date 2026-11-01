import { Controller } from '../controller.js';
export declare class BoardLanes extends Controller {
    strings: import("../strings/types.js").Strings;
    /** The group the lanes' lists share (`data-kp-reorder-group`). */
    group: string;
    /** The row that holds the lanes; it scrolls sideways on a narrow board. */
    track: HTMLDivElement;
    /** What is said: a count past its limit, a state. */
    live: HTMLParagraphElement;
    /** The lanes the board found, in order. @type {HTMLElement[]} */
    lanes: HTMLElement[];
    /** Which lanes were over their limit at the last count, so going over is said once. @type {Set<string>} */
    over: Set<string>;
    /** @param {HTMLElement} el @param {{ strings?: Partial<import('../strings.js').Strings> }} [options] */
    constructor(el: HTMLElement, options?: {
        strings?: Partial<import('../strings.js').Strings>;
    });
    /** The key of a lane. @param {HTMLElement} lane */
    static keyOf(lane: HTMLElement): string;
    /** The list of a lane. @param {HTMLElement} lane @returns {HTMLElement | null} */
    static listOf(lane: HTMLElement): HTMLElement | null;
    /** The lanes the page gave as children, moved into the track and dressed. */
    buildLanes(): void;
    /** One lane: the pipeline's lane parts, its head, its list in the group, its empty line. @param {HTMLElement} lane @param {number} index */
    dressLane(lane: HTMLElement, index: number): void;
    /** Every lane's count, its limit, its flag and its empty line; going over a limit is said once. */
    count(): void;
    /** A lane over its limit takes the pipeline's failing-stage look and flag, in words too. @param {HTMLElement} lane @param {boolean} over @param {number} n @param {number} limit */
    flag(lane: HTMLElement, over: boolean, n: number, limit: number): void;
    /** The tabs' counts, drawn by the controller; nothing here. */
    countTabs(): void;
}
