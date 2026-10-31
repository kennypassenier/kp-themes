import { Controller } from '../controller.js';
/** One command block. */
export declare class CommandBlock extends Controller {
    /** @type {HTMLElement | null} */
    head: HTMLElement | null;
    /** @type {HTMLElement | null} */
    where: HTMLElement | null;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /**
     * The masked secrets [kyu gap 15]: drawn masked, Copy given the real command, and a Show button unless
     * `data-kp-command-secret-reveal="off"`.
     * @param {Element} code @param {import('./secret.js').CommandSecret[]} secrets @param {HTMLElement} head
     */
    secrets(code: Element, secrets: import('./secret.js').CommandSecret[], head: HTMLElement): void;
    /**
     * What detach puts back: the head and note gone, the block's own classes, text and attributes as they were.
     * @param {HTMLElement} pre @param {Element} code
     * @returns {() => void}
     */
    restorer(pre: HTMLElement, code: Element): () => void;
    /**
     * A long line stays one line and the code scrolls sideways inside its block, a focusable region so a keyboard can scroll it too.
     * @param {HTMLElement} pre @param {string} nameId
     */
    scrollable(pre: HTMLElement, nameId: string): void;
}
