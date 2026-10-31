export type Strings = import('../../strings/types.js').Strings;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableIdentity {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    id: string;
    /** Everything this attach put into the page, taken out again by detach. @type {Element[]} */
    added: Element[];
    /** @type {(() => void)[]} */
    undo: (() => void)[];
    s0: import("../../strings/types.js").Strings;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** @template {Element} T @param {T} node @returns {T} */
    add<T extends Element>(node: T): T;
    /** @param {string} tag @param {string} [className] */
    make(tag: string, className?: string): HTMLElement;
}
