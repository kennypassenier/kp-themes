export type ViewerAction = import('../viewer.js').ViewerAction;
export type Strings = import('../strings.js').Strings;
/** A link that opens the file in a new tab, or saves it. @param {Document} doc @param {ViewerAction} action @param {string} cls */
export declare function fileLink(doc: Document, action: ViewerAction, cls: string): HTMLAnchorElement;
/**
 * Draw the foot.
 * @param {Document} doc @param {HTMLElement} foot @param {readonly ViewerAction[]} actions @param {Strings} strings
 */
export declare function drawActions(doc: Document, foot: HTMLElement, actions: readonly ViewerAction[], strings: Strings): void;
