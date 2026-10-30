import { Controller } from '../controller.js';
export type AgoContext = import('../freshness.js').AgoContext;
/** @typedef {import('../freshness.js').AgoContext} AgoContext */
export declare class AgoWatch extends Controller {
    scope: ParentNode;
    doc: Document;
    view: (Window & typeof globalThis) | null;
    /** What tells this call's lines from another call's. */
    token: {};
    /** @type {AgoContext} */
    ctx: AgoContext;
    /**
     * @param {ParentNode} scope the scope the call was given (a document, a shadow root or an element), which is this controller's host
     * @param {{ timeZone?: string, now?: () => number, strings?: Partial<import('../freshness.js').Strings> }} [options]
     */
    constructor(scope: ParentNode, options?: {
        timeZone?: string;
        now?: () => number;
        strings?: Partial<import('../freshness.js').Strings>;
    });
    connect(): void;
    /** The lines in a scope, the scope itself first when it is one. @param {ParentNode} scope @returns {HTMLElement[]} */
    linesIn(scope: ParentNode): HTMLElement[];
    /** Lines that arrived or changed are adopted; lines that left are dropped. @param {MutationRecord[]} records @param {Window & typeof globalThis} view */
    onMutations(records: MutationRecord[], view: Window & typeof globalThis): void;
    /** Lines that left the page stop ticking. */
    dropGone(): void;
    /** The face changed: measure every width again and repaint this call's lines. */
    remeasure(): void;
}
