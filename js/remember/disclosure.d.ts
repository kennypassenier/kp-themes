import { Controller } from '../controller.js';
export type Memory = import('../remember.js').Memory;
/** @typedef {import('../remember.js').Memory} Memory */
/** The attribute that holds a disclosure's memory still: while it is on the element or an ancestor, the memory is neither painted nor written. */
export declare const REMEMBER_HOLD_ATTRIBUTE = "data-kp-remember-hold";
/** One remembering disclosure: its memory, painted at once unless held, and written on every toggle. */
declare class RememberedDisclosure extends Controller {
    details: HTMLDetailsElement;
    memory: import("../remember.js").Memory;
    /** @param {HTMLDetailsElement} details @param {Memory} memory */
    constructor(details: HTMLDetailsElement, memory: Memory);
    connect(): void;
    /** A hold that went: paint what was stored back. */
    repaint(): void;
}
/** Every remembering disclosure under a root, now and later. */
export declare class RememberWatch {
    root: ParentNode;
    /** @type {Map<HTMLDetailsElement, RememberedDisclosure>} */
    wired: Map<HTMLDetailsElement, RememberedDisclosure>;
    sweeping: boolean;
    /** @type {MutationObserver | null} */
    later: MutationObserver | null;
    /** @param {ParentNode} root */
    constructor(root: ParentNode);
    /** Wire what is there, then watch for more when the root is in a window. */
    start(): void;
    stop(): void;
    /** @param {ParentNode} scope */
    wire(scope: ParentNode): void;
    /** @param {MutationRecord[]} records @param {Window & typeof globalThis} view */
    onRecords(records: MutationRecord[], view: Window & typeof globalThis): void;
    /** Let go of the disclosures that left the page. */
    sweep(): void;
}
export {};
