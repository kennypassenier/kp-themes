export { configureUnsaved, UNSAVED, UNSAVED_CHANGE_EVENT, UNSAVED_SAVE_EVENT, UNSAVED_DISCARD_EVENT, UNSAVED_UNDO_EVENT, UNSAVED_LEAVE_EVENT, UNSAVED_REVERT_EVENT, } from './unsaved/config.js';
export type UnsavedConfig = import('./unsaved/config.js').UnsavedConfig;
export type UnsavedChange = import('./unsaved/config.js').UnsavedChange;
export type UnsavedHandle = import('./unsaved/config.js').UnsavedHandle;
/** @typedef {import('./unsaved/config.js').UnsavedConfig} UnsavedConfig */
/** @typedef {import('./unsaved/config.js').UnsavedChange} UnsavedChange */
/** @typedef {import('./unsaved/config.js').UnsavedHandle} UnsavedHandle */
/** The handle of an attached bar. @param {Element} element */
export declare function unsaved(element: Element): import("./unsaved/config.js").UnsavedHandle | null;
/**
 * The page's answer to Save: the changes that went through stop counting, those in `refused` (their key and the
 * reason) stay marked and the bar says why.
 * @param {Element} element @param {{ refused?: Record<string, string> }} [result]
 */
export declare function unsavedSaved(element: Element, result?: {
    refused?: Record<string, string>;
}): void;
/**
 * Take what the form holds now as the saved values: nothing counts as changed.
 * @param {Element} element
 */
export declare function markUnsavedClean(element: Element): void;
/**
 * Put every changed value back, offering Undo, as Discard does.
 * @param {Element} element
 */
export declare function discardUnsaved(element: Element): void;
/**
 * Put the bar at work (Save shows the spinner) or at rest, without the page's answer.
 * @param {Element} element @param {boolean} saving
 */
export declare function setUnsavedSaving(element: Element, saving: boolean): void;
/**
 * Wire every unsaved-changes bar under `root`.
 * @param {ParentNode} [root]
 * @param {UnsavedConfig} [options] `storage`: where this call's bars keep their changes (a browser Storage, or null for nowhere)
 * @returns {() => void} detach
 */
export declare const attachUnsaved: (root?: ParentNode, options?: UnsavedConfig) => () => void;
