export type SwipeAction = import('./constants.js').SwipeAction;
export type Gesture = {
    row: HTMLElement;
    pointer: number;
    x0: number;
    y0: number;
    dx: number;
    locked: boolean;
    armed: boolean;
    action: SwipeAction | null;
};
/** @typedef {import('./constants.js').SwipeAction} SwipeAction */
/**
 * @typedef {object} Gesture
 * @property {HTMLElement} row
 * @property {number} pointer
 * @property {number} x0
 * @property {number} y0
 * @property {number} dx
 * @property {boolean} locked
 * @property {boolean} armed
 * @property {SwipeAction | null} action
 */
/** The side a move shows: toward the row's end reveals the start action, and the other way round; a right-to-left row flips. @param {HTMLElement} row @param {number} dx */
export declare const sideOf: (row: HTMLElement, dx: number) => "end" | "start";
/** @param {PointerEvent} e @param {HTMLElement} row @returns {Gesture} */
export declare const begin: (e: PointerEvent, row: HTMLElement) => Gesture;
/**
 * A move of the pointer: false when the press turned out to be a scroll (the gesture ends), else true.
 * @param {Gesture} g @param {PointerEvent} e @param {(side: 'start' | 'end') => SwipeAction | null} actionOf
 */
export declare function moveTo(g: Gesture, e: PointerEvent, actionOf: (side: 'start' | 'end') => SwipeAction | null): boolean;
/** The lift: the row slides home (at once under reduced motion); returns the action to run, or null. @param {Gesture} g @param {boolean} lifted a pointerup, not a cancel */
export declare function finish(g: Gesture, lifted: boolean): import("./constants.js").SwipeAction | null;
