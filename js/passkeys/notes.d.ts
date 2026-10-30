/**
 * The note that fills the list's footprint when it is empty or failed.
 * @param {Document} doc
 * @param {import('./constants.js').PasskeysSpec} spec
 * @param {boolean} failed
 * @param {number} height the loaded height to keep, 0 for none
 */
export declare function stateNote(doc: Document, spec: import('./constants.js').PasskeysSpec, failed: boolean, height: number): HTMLElement;
/** The waiting rows of a loading list, hidden from assistive technology (the busy card speaks). @param {Document} doc @param {number} count */
export declare function waitingList(doc: Document, count: number): HTMLElement;
/** The hidden line that says what just happened, then forgets it. @param {Document} doc @param {import('./controller.js').PasskeysController} c */
export declare function announcer(doc: Document, c: import('./controller.js').PasskeysController): HTMLElement;
/** The warning above the list when the page is not served over https. @param {Document} doc @param {import('./constants.js').PasskeysSpec} spec */
export declare function insecureNote(doc: Document, spec: import('./constants.js').PasskeysSpec): HTMLElement[];
