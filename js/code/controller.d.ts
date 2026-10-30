import { Controller } from '../controller.js';
export type CodeSpec = import('./constants.js').CodeSpec;
/** @typedef {import('./constants.js').CodeSpec} CodeSpec */
/** A code block. It lives as long as its element: drawn by `update()`, never detached. */
export declare class CodeBlock extends Controller {
    /** What the page last drew into the block. @type {CodeSpec} */
    spec: CodeSpec;
    /** Whether `update()` has run once; the first call sets what the reader's choices start from. */
    started: boolean;
    /** Wrapped, the JSON layout and the fold: kept across calls unless the spec names them again. */
    wrap: boolean;
    /** @type {'pretty' | 'raw'} */
    layout: 'pretty' | 'raw';
    folded: boolean;
    /** The text as shown, which Copy copies. */
    shown: string;
    lines: number;
    /** The busy card laid over a loading block. @type {import('../busy-card.js').BusyCard | null} */
    card: import('../busy-card.js').BusyCard | null;
    drawn: boolean;
    /** The spec waiting for the busy card to close. @type {CodeSpec | null} */
    pending: CodeSpec | null;
    /** @type {HTMLElement | null} */
    head: HTMLElement | null;
    /** The timer that puts the Copy word back. */
    revert: number;
    /** Whether the block is a table cell, as the first call said. */
    cell: boolean;
    /** The tool rows whose segmented control is attached. @type {WeakSet<HTMLElement>} */
    segmentedTools: WeakSet<HTMLElement>;
    /** @param {HTMLElement} host the root, a `.kp-code` */
    constructor(host: HTMLElement);
    connect(): void;
    /**
     * Draw (or redraw) the block. The reader's Wrap, layout and fold are kept across calls unless the spec names them again.
     * @param {CodeSpec} given
     */
    update(given: CodeSpec): void;
    /** Take the spec; the first call also sets where the reader's choices start. @param {CodeSpec} spec @param {boolean} cell */
    remember(spec: CodeSpec, cell: boolean): void;
    /** The head, then the body. */
    draw(): void;
    /** Let the busy card close, then draw, unless a newer spec came in meanwhile. @param {CodeSpec} spec */
    drawAfterCard(spec: CodeSpec): void;
}
