/** The trees, reorder lists and split panes this module wires. */
export declare const TREE = "[data-kp-tree]";
export declare const REORDER = "[data-kp-reorder]";
export declare const SPLIT = "[data-kp-split]";
/** Fired on a tree when a branch opens or closes: `{ item, id, expanded }`. */
export declare const TREE_EXPAND_EVENT = "kp-tree-expand";
/** Fired on a tree when an item is selected: `{ item, id }`. */
export declare const TREE_SELECT_EVENT = "kp-tree-select";
/** Fired on a reorder list when the order changed. A contract value [TH26]: `{ order, id, from, to }`. */
export declare const REORDER_EVENT = "kp-reorder";
/** Fired on a split pane when the divider moved; the detail carries the percentage. */
export declare const SPLIT_EVENT = "kp-split";
/**
 * The tree's visible items, in the order a reader meets them.
 *
 * Collapsed branches are excluded, because Down should go to the next
 * thing you can see — walking into a closed folder is the bug that makes
 * a tree feel broken rather than merely awkward.
 *
 * @param {HTMLElement} tree
 */
export declare function visibleItems(tree: HTMLElement): HTMLElement[];
export type StructureOptions = {
    typeahead: boolean;
    typeaheadMs: number;
    clickToggles: boolean;
    selectable: boolean;
    reorderPointer: boolean;
    splitStep: number;
    splitLargeStep: number;
    collapseOnDoubleClick: boolean;
};
/**
 * The defaults attachStructure() takes; each can be set per element with a data attribute.
 * @typedef {{ typeahead: boolean, typeaheadMs: number, clickToggles: boolean, selectable: boolean, reorderPointer: boolean, splitStep: number, splitLargeStep: number, collapseOnDoubleClick: boolean }} StructureOptions
 */
/** @type {StructureOptions} */
export declare const DEFAULTS: StructureOptions;
