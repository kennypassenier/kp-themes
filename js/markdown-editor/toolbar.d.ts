/** The tools, in order: the dictionary word of each, its key with Mod (none for three), and its picture. */
export declare const TOOLS: readonly [{
    readonly id: 'bold';
    readonly word: 'mdBold';
    readonly key: 'B';
}, {
    readonly id: 'italic';
    readonly word: 'mdItalic';
    readonly key: 'I';
}, {
    readonly id: 'heading';
    readonly word: 'mdHeading';
    readonly key: '';
}, {
    readonly id: 'list';
    readonly word: 'mdList';
    readonly key: '';
}, {
    readonly id: 'task';
    readonly word: 'mdChecklist';
    readonly key: '';
}, {
    readonly id: 'link';
    readonly word: 'mdLink';
    readonly key: 'K';
}];
/** The words a person reads for the modifier key. */
export declare const modName: () => "Ctrl" | "⌘";
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
