import { NewPillAway } from './away.js';
export type NewPillOptions = import('../newpill.js').NewPillOptions;
/** @typedef {import('../newpill.js').NewPillOptions} NewPillOptions */
export declare class NewPill extends NewPillAway {
    /** What the page gets back, the same object every time. @type {import('../newpill.js').NewPillHandle} */
    handle: import('../newpill.js').NewPillHandle;
    /**
     * @param {HTMLElement} host the scroller
     * @param {NewPillOptions} [options]
     */
    constructor(host: HTMLElement, options?: NewPillOptions);
    connect(): void;
    openAtEnd(): void;
    /** In `tbody` mode the rows already there are known, so a sort or a filter that brings them back counts none. */
    seedKnown(): void;
    watchRows(): void;
    /** Whether a node added to the list is a new row to count. @param {MutationRecord} record @param {Node} node */
    isNewRow(record: MutationRecord, node: Node): boolean;
    /** @param {MutationRecord[]} records */
    onRows(records: MutationRecord[]): void;
    jump(): void;
    pause(): void;
    /** The reader scrolled: away from the end stops following, back to it follows again. */
    onScroll(): void;
    /** Jump back to the tail, or pause and resume with Space. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** Resume when paused or away from the end, otherwise pause. */
    toggle(): void;
    /** @param {Event} event */
    onToggle(event: Event): void;
}
