/**
 * The element a picker's preview is shown on: `data-kp-theme-preview-target` (a selector), else the root.
 * @param {HTMLElement} picker @returns {Element | undefined} undefined = the theme root
 */
export declare function previewRoot(picker: HTMLElement): Element | undefined;
/**
 * A register that is loaded on demand has to be there before its theme is shown, or the preview is the tokens without the
 * theme's look. Only when the page uses them (a link carrying data-kp-register), and from the same place as the first one.
 * @param {Document} doc @param {string} theme @returns {Promise<void>}
 */
export declare function registerFirst(doc: Document, theme: string): Promise<void>;
