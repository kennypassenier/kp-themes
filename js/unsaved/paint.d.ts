export type UnsavedController = import('./controller.js').UnsavedController;
export type UnsavedChange = import('./config.js').UnsavedChange;
/** @typedef {import('./controller.js').UnsavedController} UnsavedController */
/** @typedef {import('./config.js').UnsavedChange} UnsavedChange */
/**
 * Bring the whole bar in line with the changes now: states, words, buttons, menu, list, event, keeping, dock.
 * @param {UnsavedController} ctl
 */
export declare function paintBar(ctl: UnsavedController): void;
