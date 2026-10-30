export type WheelItem = import('../wheel.js').WheelItem;
export type WheelState = import('./state.js').WheelState;
/** @typedef {import('../wheel.js').WheelItem} WheelItem */
/** @typedef {import('./state.js').WheelState} WheelState */
/** Lay the parts once. @param {HTMLElement} root */
export declare function build(root: HTMLElement): void;
/**
 * Draw the disc from the weights shown now. `measure` fits the labels to
 * their room exactly (else by an estimate, for the frames of a glide).
 * @param {HTMLElement} root @param {boolean} measure
 */
export declare function drawDisc(root: HTMLElement, measure: boolean): void;
/** The words under the wheel and the Spin button's state. @param {HTMLElement} root */
export declare function paint(root: HTMLElement): void;
