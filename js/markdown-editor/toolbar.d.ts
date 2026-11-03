/** The tools, in order: the dictionary word of each (its key, for three of them, is in js/markdown-editor/constants.js). */
export declare const TOOLS: readonly [{
    readonly id: 'bold';
    readonly word: 'mdBold';
}, {
    readonly id: 'italic';
    readonly word: 'mdItalic';
}, {
    readonly id: 'heading';
    readonly word: 'mdHeading';
}, {
    readonly id: 'list';
    readonly word: 'mdList';
}, {
    readonly id: 'task';
    readonly word: 'mdChecklist';
}, {
    readonly id: 'link';
    readonly word: 'mdLink';
}];
/**
 * The toolbar for a text area.
 * @param {HTMLTextAreaElement} area @param {import('../strings.js').Strings} strings
 * @returns {HTMLElement}
 */
export declare function buildToolbar(area: HTMLTextAreaElement, strings: import('../strings.js').Strings): HTMLElement;
/**
 * ← → Home End move the one tab stop along the toolbar (mirrored right to left).
 * @param {HTMLElement} bar @param {KeyboardEvent} event
 */
export declare function walkToolbar(bar: HTMLElement, event: KeyboardEvent): void;
