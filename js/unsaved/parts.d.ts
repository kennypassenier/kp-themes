/**
 * Everything one bar is made of, and the elements that go next to it (the problem line, the live region).
 * @param {Document} doc @param {import('../strings.js').Strings} s @param {string} id
 */
export declare function buildParts(doc: Document, s: import('../strings.js').Strings, id: string): {
    bar: HTMLElement;
    none: HTMLElement;
    chip: HTMLButtonElement;
    discard: HTMLButtonElement;
    save: HTMLButtonElement;
    more: HTMLElement;
    moreButton: HTMLButtonElement;
    panel: HTMLElement;
    headTitle: HTMLElement;
    first: HTMLButtonElement;
    list: HTMLElement;
    problem: HTMLElement;
    live: HTMLElement;
};
/**
 * The Save button's content: its words, and the spinner layer while the page saves.
 * @param {Document} doc @param {HTMLElement} save @param {string} label @param {boolean} saving
 */
export declare function paintSaveButton(doc: Document, save: HTMLElement, label: string, saving: boolean): void;
/**
 * One line of the list: the row's name (a jump), `was → now`, and its own Revert.
 * @param {Document} doc @param {import('../strings.js').Strings} s @param {import('./config.js').UnsavedChange} ch
 * @param {(ch: import('./config.js').UnsavedChange) => void} onJump @param {(ch: import('./config.js').UnsavedChange) => void} onRevert
 */
export declare function buildEntry(doc: Document, s: import('../strings.js').Strings, ch: import('./config.js').UnsavedChange, onJump: (ch: import('./config.js').UnsavedChange) => void, onRevert: (ch: import('./config.js').UnsavedChange) => void): HTMLElement;
/**
 * The alert the bar shows when the page refused some changes.
 * @param {Document} doc @param {import('../strings.js').Strings} s @param {Record<string, string>} refused
 * @param {number} savedCount how many changes were sent @param {() => void} onDismiss
 */
export declare function buildAlert(doc: Document, s: import('../strings.js').Strings, refused: Record<string, string>, savedCount: number, onDismiss: () => void): HTMLElement;
