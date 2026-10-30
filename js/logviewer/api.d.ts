export type LogLine = import('./types.js').LogLine;
export type LogViewerSpec = import('./types.js').LogViewerSpec;
/** @typedef {import('./types.js').LogLine} LogLine */
/** @typedef {import('./types.js').LogViewerSpec} LogViewerSpec */
/**
 * Add lines to the buffer. A line whose `id` is already kept is skipped, so a poll that returns overlapping windows can be
 * handed over whole. The oldest lines past the cap are dropped and counted.
 *
 * @param {Element} el
 * @param {LogLine[]} lines
 * @returns {number} how many lines were new
 */
export declare function appendLogLines(el: Element, lines: LogLine[]): number;
/**
 * The lines the buffer holds now, oldest first.
 * @param {Element} el
 * @returns {LogLine[]}
 */
export declare function logViewerLines(el: Element): LogLine[];
/**
 * The text of the lines shown (or of every kept line), one per row, as Copy and Download hand it over.
 * @param {Element} el
 * @param {{ all?: boolean }} [options]
 */
export declare function logViewerText(el: Element, options?: {
    all?: boolean;
}): string;
/**
 * Empty the buffer. The dropped count starts again from zero.
 * @param {Element} el
 */
export declare function clearLogViewer(el: Element): void;
/**
 * Find a text in the log, as the search box does.
 * @param {Element} el
 * @param {string} text  empty clears the find
 * @returns {number} how many matches
 */
export declare function searchLogViewer(el: Element, text: string): number;
/**
 * Go to the next or the previous match; the log scrolls to it (and stops following the tail).
 * @param {Element} el
 * @param {1 | -1} [delta]
 * @returns {number} the match now current, counted from 1, or 0 when there is none
 */
export declare function stepLogMatch(el: Element, delta?: 1 | -1): number;
/**
 * Set the viewer's options and state, or replace its lines.
 * @param {Element} el
 * @param {LogViewerSpec} spec
 */
export declare function setLogViewer(el: Element, spec: LogViewerSpec): void;
/** Draw again when an option moved. @param {HTMLElement} root */
export declare function syncOptions(root: HTMLElement): void;
