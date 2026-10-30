export type FocusState = import('./constants.js').FocusState;
export type Progress = import('./constants.js').Progress;
/** @typedef {import('./constants.js').FocusState} FocusState */
/** @typedef {import('./constants.js').Progress} Progress */
/** The key the progress is remembered under, or null. @param {Element} root */
export declare const memoryOf: (root: Element) => import("../remember.js").Memory | null;
/** Write where the person is, after every answer and every move. @param {Element} root */
export declare function remember(root: Element): void;
/** Put the stored answers and place back, every track included. @param {HTMLElement} root @param {Progress} stored */
export declare function applyProgress(root: HTMLElement, stored: Progress): void;
/** @param {HTMLElement} root */
export declare function startResume(root: HTMLElement): void;
