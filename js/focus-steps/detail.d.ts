export type FocusStep = import('./constants.js').FocusStep;
/** @typedef {import('./constants.js').FocusStep} FocusStep */
/**
 * Add a step's body to the step holder, after its text. A string is Markdown (nothing in it is parsed as HTML); a Node is
 * copied, so drawing the step again never moves the page's own node. A step without a body adds nothing.
 * @param {HTMLElement} holder
 * @param {FocusStep} step
 */
export declare function appendBody(holder: HTMLElement, step: FocusStep): void;
