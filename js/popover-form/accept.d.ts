/** The form's problem line, made after the fields when the markup left it out. @param {HTMLFormElement} form */
export declare function problemLine(form: HTMLFormElement): HTMLElement;
/**
 * Write the form's problem, or clear it with an empty text; the field it is about is marked invalid and described by it.
 * @param {HTMLFormElement} form @param {string} text @param {Element | null} [field]
 */
export declare function writeProblem(form: HTMLFormElement, text: string, field?: Element | null): void;
/**
 * Accept the form: refused by the browser, it says why and stays open; else the page hears it. Resolves true when the form
 * may close, false when it stays open (refused, cancelled, or the page's answer failed).
 * @param {HTMLElement} wrapper @param {HTMLFormElement} form @param {HTMLElement} opener
 * @returns {Promise<boolean>}
 */
export declare function acceptForm(wrapper: HTMLElement, form: HTMLFormElement, opener: HTMLElement): Promise<boolean>;
