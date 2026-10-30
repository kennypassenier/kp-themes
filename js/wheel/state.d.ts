export type WheelItem = import('../wheel.js').WheelItem;
/** @typedef {import('../wheel.js').WheelItem} WheelItem */
export declare const WHEEL = "[data-kp-wheel]";
export declare const WHEEL_SPIN_EVENT = "kp-wheel-spin";
export declare const WHEEL_RESULT_EVENT = "kp-wheel-result";
export type WheelState = {
    items: WheelItem[];
    /**
     * the weights drawn now (they glide to the items' weights)
     */
    shown: Map<string, number>;
    /**
     * the ids drawn, in order (a leaving one stays until it has shrunk)
     */
    order: string[];
    /**
     * the disc's turn, degrees
     */
    angle: number;
    spinning: boolean;
    /**
     * the id the wheel chose last
     */
    last: string | null;
    /**
     * the frame of a glide
     */
    glide: number;
    busy: import('../busy-card.js').BusyCard | null;
};
export declare const SVG = "http://www.w3.org/2000/svg";
/** The disc's radius, the labels' room and the hub's, in the SVG's units. */
export declare const R = 96;
export declare const LABEL_IN = 34;
export declare const LABEL_OUT = 84;
/** Whole turns a spin makes, drawn between these (data-kp-wheel-turns-min / -max). */
export declare const DEFAULT_TURNS_MIN = 3;
export declare const DEFAULT_TURNS_MAX = 6;
/** @param {WheelItem} item */
export declare const weightOf: (item: WheelItem) => number;
/**
 * Draw an outcome by the weights. `avoid` (an id) is left out while there is
 * another choice. Pure but for `random`.
 * @param {readonly WheelItem[]} items
 * @param {{ random?: () => number, avoid?: string | null }} [options]
 * @returns {number} the index drawn, -1 when there is none
 */
export declare function pickWeighted(items: readonly WheelItem[], { random, avoid }?: {
    random?: () => number;
    avoid?: string | null;
}): number;
/**
 * Each segment's start and end, in degrees clockwise from the top, by weight.
 * @param {readonly number[]} weights
 * @returns {[number, number][]}
 */
export declare function wheelAngles(weights: readonly number[]): [number, number][];
/** @param {number} deg @param {number} r */
export declare const point: (deg: number, r: number) => string;
/** @param {string} name @param {Record<string, string>} [attrs] */
export declare const svg: (name: string, attrs?: Record<string, string>) => SVGElement;
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {Element} root @returns {WheelState} */
export declare const stateOf: (root: Element) => WheelState;
/** @param {Element} root @param {string} name */
export declare const part: (root: Element, name: string) => HTMLElement;
