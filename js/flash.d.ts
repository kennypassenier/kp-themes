export { FLASH_BUTTON, FLASH_EVENT, FLASH_RELOAD_EVENT, FLASH_MS, FLASH_ERROR_MS } from './flash/values.js';
export type FlashAnswer = string | void | {
    word?: string;
    line?: string;
} | {
    error: string;
    remedy?: string;
    word?: string;
};
export type FlashOptions = {
    flashMs?: number;
    errorMs?: number;
    busyLabel?: string;
    width?: 'keep' | 'grow';
    refusal?: 'line' | 'button' | 'toast';
};
export type Wired = {
    stack: HTMLElement;
    rest: HTMLElement;
    busy: HTMLElement;
    result: HTMLElement;
    status: HTMLElement;
    line: HTMLElement;
    ownLine: boolean;
    timer: number;
    running: boolean;
    off: () => void;
};
/**
 * What the work may answer: nothing or a word for a success, or a refusal.
 * @typedef {string | void | { word?: string, line?: string } | { error: string, remedy?: string, word?: string }} FlashAnswer
 */
/**
 * @typedef {object} FlashOptions
 * @property {number} [flashMs]
 * @property {number} [errorMs]
 * @property {string} [busyLabel]
 * @property {'keep' | 'grow'} [width]
 * @property {'line' | 'button' | 'toast'} [refusal]
 */
/** @typedef {{ stack: HTMLElement, rest: HTMLElement, busy: HTMLElement, result: HTMLElement, status: HTMLElement, line: HTMLElement, ownLine: boolean, timer: number, running: boolean, off: () => void }} Wired */
/**
 * Run `work` behind a button: busy while it runs, then its result for a moment.
 *
 * @param {HTMLElement} button
 * @param {() => Promise<FlashAnswer> | FlashAnswer} work
 * @param {FlashOptions} [options]
 * @returns {Promise<{ ok: boolean, word: string, line: string } | null>} null when the press was ignored (already busy)
 */
export declare function runFlashButton(button: HTMLElement, work: () => Promise<FlashAnswer> | FlashAnswer, options?: FlashOptions): Promise<{
    ok: boolean;
    word: string;
    line: string;
} | null>;
/**
 * Wire every flash button under `root`.
 *
 * @param {ParentNode} [root]
 * @param {FlashOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachFlashButtons(root?: ParentNode, options?: FlashOptions): () => void;
