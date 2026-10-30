/** The line height of the box in px. @param {import('./controller.js').JsonFieldController} c */
export declare function lineHeight(c: import('./controller.js').JsonFieldController): number;
/**
 * The height of each line: one line height, or with wrapping what the line wraps to, measured in the box's own mirror.
 * @param {import('./controller.js').JsonFieldController} c
 * @param {string[]} lines
 * @returns {number[]}
 */
export declare function lineHeights(c: import('./controller.js').JsonFieldController, lines: string[]): number[];
/** Rows of the gutter: one number per line; with wrapping, as tall as the line wraps. @param {import('./controller.js').JsonFieldController} c */
export declare function drawGutter(c: import('./controller.js').JsonFieldController): void;
/**
 * The box grows with its text up to JSON_MAX_ROWS lines, then scrolls inside itself (wheel, keys and scrollbar). Its height
 * comes from the lines it holds and the mirror, never from a measuring twin in the page's body: a twin there is hidden by
 * a host that shows only part of the page (the review dialog), measures 0 and left the box at its least height with
 * `overflow: hidden`, so Long could not be scrolled [kpadopt5-r3].
 * @param {import('./controller.js').JsonFieldController} c
 */
export declare function grow(c: import('./controller.js').JsonFieldController): void;
