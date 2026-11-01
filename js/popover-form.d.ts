export { POPOVER_FORM, POPOVER_FORM_PANEL, POPOVER_FORM_ACCEPT_EVENT, POPOVER_FORM_OPEN_EVENT, POPOVER_FORM_CLOSE_EVENT, } from './popover-form/constants.js';
/**
 * Wire every popover form under `root`. Idempotent.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachPopoverForms(root?: ParentNode): () => void;
/** Open a wired popover form from the page. @param {Element} wrapper */
export declare function openPopoverForm(wrapper: Element): void;
/** Close it from the page; the focus stays where it is. @param {Element} wrapper */
export declare function closePopoverForm(wrapper: Element): void;
/**
 * Write a problem on an open form (a refusal the page learns of later), or clear it with an empty text.
 * @param {Element} wrapper @param {string} text
 */
export declare function setPopoverFormProblem(wrapper: Element, text: string): void;
