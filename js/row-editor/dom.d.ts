/** @param {string | null} value @param {number} fallback */
export declare const whole: (value: string | null, fallback: number) => number;
/** The add button and the status line the markup left out. @param {HTMLElement} host */
export declare function ensureAddAndStatus(host: HTMLElement): void;
/** The head row: one label per column, from the `data-label` of the sample row's cells. @param {Document} doc @param {Element[]} labels @returns {HTMLElement | null} */
export declare function buildHead(doc: Document, labels: Element[]): HTMLElement | null;
/** Give `{n}` in a new row's attributes and text its number. @param {Element} row @param {number} n */
export declare function numberRow(row: Element, n: number): void;
/** Each row's remove button (made when missing), named and disabled at the fewest. @param {HTMLElement[]} rows @param {ReturnType<typeof import('../strings.js').getStrings>} s @param {string} unit @param {boolean} atMin */
export declare function writeRemoveButtons(rows: HTMLElement[], s: ReturnType<typeof import('../strings.js').getStrings>, unit: string, atMin: boolean): void;
/** The add button's words (unless the page wrote its own) and its disabled state at the most. @param {Element | null} add @param {ReturnType<typeof import('../strings.js').getStrings>} s @param {string} unit @param {boolean} atMax */
export declare function writeAddButton(add: Element | null, s: ReturnType<typeof import('../strings.js').getStrings>, unit: string, atMax: boolean): void;
/** Say something to a screen reader, in the live line the host holds. @param {HTMLElement} host @param {string} words */
export declare function announce(host: HTMLElement, words: string): void;
/** Fire the add/remove event and the change event. @param {HTMLElement} host @param {string} type @param {HTMLElement} row @param {number} index @param {HTMLElement[]} rows */
export declare function emitRows(host: HTMLElement, type: string, row: HTMLElement, index: number, rows: HTMLElement[]): void;
