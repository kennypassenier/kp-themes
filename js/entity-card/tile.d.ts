export type EntityData = import('./types.js').EntityData;
/** @typedef {import('./types.js').EntityData} EntityData */
/**
 * The trend row: the label, a 24-hour line drawn with the KPI tile's drawSparkline, and the current value, on the meters' own columns.
 * Fewer than two readings keep the row and say so in the same box.
 * @param {Document} doc
 * @param {import('../strings.js').Strings} s
 * @param {EntityData} data
 * @param {string} status
 */
export declare function trendRow(doc: Document, s: import('../strings.js').Strings, data: EntityData, status: string): HTMLElement;
/**
 * Draw an app or link tile: the identity row (mark, the name as the card's one link, the star), the state as a dot and a word, the
 * description and the lines. A tile has no actions row.
 * @param {{ card: HTMLElement, data: EntityData, doc: Document, s: import('../strings.js').Strings, slot: (name: string, signature: unknown, build: (el: HTMLElement) => void) => void,
 *   status: string, key: string, link: string | null, selectable: boolean, markKind: string, starOn: boolean, starKey: string, star: boolean }} c
 */
export declare function drawTile({ card, data, doc, s, slot, status, key, link, selectable, markKind, starOn, starKey, star }: {
    card: HTMLElement;
    data: EntityData;
    doc: Document;
    s: import('../strings.js').Strings;
    slot: (name: string, signature: unknown, build: (el: HTMLElement) => void) => void;
    status: string;
    key: string;
    link: string | null;
    selectable: boolean;
    markKind: string;
    starOn: boolean;
    starKey: string;
    star: boolean;
}): void;
