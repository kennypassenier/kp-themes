/** The digits of one countdown. */
export declare class Digits {
    cells: HTMLElement;
    /** The text drawn now. */
    shown: string;
    /** @param {HTMLElement} cells the element that holds the cells */
    constructor(cells: HTMLElement);
    /** Draw a text. @param {string} text */
    paint(text: string): void;
}
