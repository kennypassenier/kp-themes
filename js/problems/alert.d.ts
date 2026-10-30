export type Problem = import('../problems.js').Problem;
/**
 * Make the alert element for one problem (mode `each`), or update it.
 * @param {HTMLElement | undefined} existing @param {Problem} p @param {Document} doc @param {string} remedyLabel @param {HTMLElement} container
 */
export declare function paintAlert(existing: HTMLElement | undefined, p: Problem, doc: Document, remedyLabel: string, container: HTMLElement): HTMLElement;
