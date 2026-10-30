/** @param {string} value @param {number} fallback */
export declare const px: (value: string, fallback?: number) => number;
/**
 * The line height in px of a box: its computed value, else 1.2 times its font size (`normal`). Pure over a computed style.
 * @param {CSSStyleDeclaration} cs
 */
export declare function lineHeightOf(cs: CSSStyleDeclaration): number;
/** The padding and border, top and bottom, in px. @param {CSSStyleDeclaration} cs */
export declare function chromeOf(cs: CSSStyleDeclaration): number;
/** Take a box's measuring twin away. @param {HTMLTextAreaElement} area */
export declare function dropTwin(area: HTMLTextAreaElement): void;
/**
 * The height a box needs for its text, between the least and the most lines. Measured on a twin, so it is exact and the page
 * does not move.
 *
 * @param {HTMLTextAreaElement} area
 * @param {import('./constants.js').FitOptions} [options]
 * @returns {{ height: number, scrolls: boolean, capped: boolean, lines: number, lineHeight: number }}
 */
export declare function fitTextarea(area: HTMLTextAreaElement, { minRows, maxRows, maxPx, keepPx, apply }?: import('./constants.js').FitOptions): {
    height: number;
    scrolls: boolean;
    capped: boolean;
    lines: number;
    lineHeight: number;
};
/** Whether this browser sizes a field to its content itself. */
export declare function cssAutosizeSupported(): boolean;
