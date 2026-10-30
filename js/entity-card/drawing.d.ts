export type EntityData = import('./types.js').EntityData;
/** One draw of one card from its data; the subclasses add the slots, `set.js` runs them in order. */
export declare class EntityDrawing {
    card: HTMLElement;
    data: import("./types.js").EntityData;
    doc: Document;
    s: import("../strings/types.js").Strings;
    key: string;
    /** @type {'stack' | 'tile'} */
    kind: 'stack' | 'tile';
    /** The signature each slot was last drawn from. @type {Record<string, string>} */
    drawn: Record<string, string>;
    /** The star as it stands. */
    star: boolean;
    status: "empty" | "error" | "loading" | "ready";
    meterRows: number;
    /** The card's options, read once the card is out of its skeleton. */
    link: string | null;
    selectable: boolean;
    markKind: string;
    starOn: boolean;
    starKey: string;
    /** @param {HTMLElement} card @param {EntityData} data */
    constructor(card: HTMLElement, data: EntityData);
    /** The frame, the remembered draw and the attributes every status shows. */
    begin(): void;
    /** Read the options of a card that is not loading. */
    readOptions(): void;
    /**
     * Draw a slot only when its signature changed.
     * @param {string} name @param {unknown} signature @param {(el: HTMLElement) => void} build
     */
    slot(name: string, signature: unknown, build: (el: HTMLElement) => void): void;
    /** A skeleton keeps every row: what the card will hold is not known yet. */
    drawLoading(): void;
}
