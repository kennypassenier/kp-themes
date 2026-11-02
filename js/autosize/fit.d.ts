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
export type FitJob = {
    area: HTMLTextAreaElement;
    options: import('./constants.js').FitOptions;
    /**
     * the computed values that decide how the text wraps
     */
    wrap: Record<string, string>;
    lh: number;
    chrome: number;
    border: number;
    width: number;
};
/**
 * @typedef {object} FitJob
 * @property {HTMLTextAreaElement} area
 * @property {import('./constants.js').FitOptions} options
 * @property {Record<string, string>} wrap the computed values that decide how the text wraps
 * @property {number} lh
 * @property {number} chrome
 * @property {number} border
 * @property {number} width
 */
/**
 * Step 1 of a fit: read the box (its style and width). Reads only, so a form of many boxes reads them all before any write.
 * @param {HTMLTextAreaElement} area @param {import('./constants.js').FitOptions} [options] @returns {FitJob}
 */
export declare function readFit(area: HTMLTextAreaElement, options?: import('./constants.js').FitOptions): FitJob;
/** Step 2: give the hidden twin the box's text and width. Writes only the twin, which nothing on the page depends on. @param {FitJob} job */
export declare function stageFit({ area, wrap, width }: FitJob): void;
/**
 * Step 3: read the twin's height and work out the box's.
 * @param {FitJob} job
 * @returns {{ height: number, scrolls: boolean, capped: boolean, lines: number, lineHeight: number, width: number }}
 */
export declare function finishFit({ area, options, lh, chrome, border, width }: FitJob): {
    height: number;
    scrolls: boolean;
    capped: boolean;
    lines: number;
    lineHeight: number;
    width: number;
};
/**
 * The height a box needs for its text, between the least and the most lines. Measured on a twin, so it is exact and the page
 * does not move.
 *
 * @param {HTMLTextAreaElement} area
 * @param {import('./constants.js').FitOptions} [options]
 * @returns {{ height: number, scrolls: boolean, capped: boolean, lines: number, lineHeight: number, width: number }}
 */
export declare function fitTextarea(area: HTMLTextAreaElement, options?: import('./constants.js').FitOptions): {
    height: number;
    scrolls: boolean;
    capped: boolean;
    lines: number;
    lineHeight: number;
    width: number;
};
/** Whether this browser sizes a field to its content itself. */
export declare function cssAutosizeSupported(): boolean;
