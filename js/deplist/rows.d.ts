import { DeplistCore } from './core.js';
export type DeplistSettings = import('./core.js').DeplistSettings;
/** @typedef {import('./core.js').DeplistSettings} DeplistSettings */
export declare class DeplistRows extends DeplistCore {
    /**
     * A thing's name with its identity mark, a link when the list has a template.
     * @param {string} name
     * @param {boolean} [needed]
     */
    nameNode(name: string, needed?: boolean): HTMLElement;
    /**
     * The badge beside a needed thing: its state in words and a tone.
     * @param {import('../deplist.js').DepItem} item
     */
    stateBadge(item: import('../deplist.js').DepItem): HTMLElement;
    /**
     * One row: the number, the thing that needs, the arrow, the thing needed, its state, and the sentence a screen reader hears.
     * @param {import('../deplist.js').DepItem} item
     * @param {number | null} no
     * @param {DeplistSettings} o
     */
    rowFor(item: import('../deplist.js').DepItem, no: number | null, o: DeplistSettings): HTMLElement;
    /** The placeholder rows of the loading state. */
    ghostRows(): void;
    /** One destructive row naming each thing of a cycle. @param {string[]} cycle */
    cycleRow(cycle: string[]): HTMLElement;
    /** A heading row over a group of rows. @param {string} key */
    groupHeading(key: string): HTMLElement;
    /**
     * The rows in the order they stand: sorted by the grouped name when the list is grouped.
     * @param {import('../deplist.js').DepRow[]} rows
     * @param {string} group
     */
    groupedRows(rows: import('../deplist.js').DepRow[], group: string): import("../deplist.js").DepRow[];
}
