export type SwipeAction = import('./constants.js').SwipeAction;
/**
 * Show the row moved by `dx` with the action's plate behind, armed past the threshold.
 * @param {HTMLElement} row @param {number} dx @param {SwipeAction | null} action @param {boolean} armed
 */
export declare function paintPlate(row: HTMLElement, dx: number, action: SwipeAction | null, armed: boolean): void;
/** Slide the row home and take the plate away once it is there. @param {HTMLElement} row */
export declare function clearPlate(row: HTMLElement): void;
