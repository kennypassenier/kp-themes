export type UnsavedController = import('./controller.js').UnsavedController;
export type UnsavedChange = import('./config.js').UnsavedChange;
/** @typedef {import('./controller.js').UnsavedController} UnsavedController */
/** @typedef {import('./config.js').UnsavedChange} UnsavedChange */
/** Close the list and take the visitor to the changed row. @param {UnsavedController} ctl @param {UnsavedChange} ch */
export declare function jumpTo(ctl: UnsavedController, ch: UnsavedChange): void;
/** Put one change back, unless the page cancels it. @param {UnsavedController} ctl @param {UnsavedChange} ch */
export declare function revertOne(ctl: UnsavedController, ch: UnsavedChange): void;
/**
 * Put every changed value back and offer Undo.
 * @param {UnsavedController} ctl
 */
export declare function discardChanges(ctl: UnsavedController): void;
/** The toast that puts the discarded values back. @param {UnsavedController} ctl @param {number} count */
export declare function offerUndo(ctl: UnsavedController, count: number): void;
/**
 * Ask the page to save; if it does not cancel, the bar goes to work.
 * @param {UnsavedController} ctl
 */
export declare function saveChanges(ctl: UnsavedController): void;
/** @param {UnsavedController} ctl */
export declare function clearProblem(ctl: UnsavedController): void;
/** @param {UnsavedController} ctl @param {Record<string, string>} refused */
export declare function showProblem(ctl: UnsavedController, refused: Record<string, string>): void;
/** The page's answer to Save. @param {UnsavedController} ctl @param {{ refused?: Record<string, string> }} [result] */
export declare function applySaved(ctl: UnsavedController, result?: {
    refused?: Record<string, string>;
}): void;
/**
 * Take what the form holds now as the saved values.
 * @param {UnsavedController} ctl
 */
export declare function markAllClean(ctl: UnsavedController): void;
/** @param {UnsavedController} ctl @param {boolean} next */
export declare function setSaving(ctl: UnsavedController, next: boolean): void;
