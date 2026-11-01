export type SelectionBar = import('./controller.js').SelectionBar;
/** @typedef {import('./controller.js').SelectionBar} SelectionBar */
/**
 * Publish `--kp-selection-lift` on the root: the distance from the window's foot to the top of the bar's panel while a
 * floating-bottom bar shows a selection or a running action, and 0px otherwise. Follows the panel's size and the window's.
 * @param {SelectionBar} bar
 */
export declare function publishLift(bar: SelectionBar): void;
