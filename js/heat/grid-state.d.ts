/** @typedef {import('./types.js').HeatDecorateInfo} HeatDecorateInfo */
export type HeatDecorateInfo = import('./types.js').HeatDecorateInfo;
/** The `decorate` each grid was given, kept for the redraws that wait for the busy card. @type {WeakMap<Element, (part: HTMLElement, info: HeatDecorateInfo) => void>} */
export declare const DECORATE: WeakMap<Element, (part: HTMLElement, info: HeatDecorateInfo) => void>;
/** The tab stop of each grid, by row and column. @type {WeakMap<Element, { r: number, c: number }>} */
export declare const STOPS: WeakMap<Element, {
    r: number;
    c: number;
}>;
/** The keys of the labels or headers that are pressed. @type {WeakMap<Element, Set<string>>} */
export declare const LIT: WeakMap<Element, Set<string>>;
