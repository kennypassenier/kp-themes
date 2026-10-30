export { TREE_EXPAND_EVENT, TREE_SELECT_EVENT, REORDER_EVENT, SPLIT_EVENT, visibleItems } from './structure/shared.js';
export type TreeHandle = {
    element: HTMLElement;
    expand: (id: string, expanded?: boolean) => void;
    expandAll: () => void;
    collapseAll: () => void;
    focusItem: (id: string) => void;
    select: (id: string | null) => void;
    selected: () => string | null;
};
export type ReorderHandle = {
    element: HTMLElement;
    order: () => string[];
    setOrder: (order: readonly string[]) => void;
};
export type SplitHandle = {
    element: HTMLElement;
    value: () => number;
    setValue: (value: number) => void;
};
/**
 * @typedef {object} TreeHandle
 * @property {HTMLElement} element
 * @property {(id: string, expanded?: boolean) => void} expand
 * @property {() => void} expandAll
 * @property {() => void} collapseAll
 * @property {(id: string) => void} focusItem
 * @property {(id: string | null) => void} select
 * @property {() => string | null} selected
 */
/**
 * @typedef {object} ReorderHandle
 * @property {HTMLElement} element
 * @property {() => string[]} order
 * @property {(order: readonly string[]) => void} setOrder
 */
/**
 * @typedef {object} SplitHandle
 * @property {HTMLElement} element
 * @property {() => number} value
 * @property {(value: number) => void} setValue
 */
/** The handle for an attached tree, reorder list or split pane. @param {Element} element @returns {TreeHandle | ReorderHandle | SplitHandle | null} */
export declare function structure(element: Element): TreeHandle | ReorderHandle | SplitHandle | null;
/**
 * @param {ParentNode} root
 * @param {{ typeahead?: boolean, typeaheadMs?: number, clickToggles?: boolean, selectable?: boolean, reorderPointer?: boolean, splitStep?: number, splitLargeStep?: number, collapseOnDoubleClick?: boolean }} [options]
 *   Defaults; per element as data-attributes: `data-kp-typeahead="false"`, `data-kp-click="select"`, `data-kp-selectable`, `data-kp-pointer="false"`, `data-kp-step`, `data-kp-large-step`, `data-kp-orientation="horizontal"`, `data-kp-collapse`.
 * @returns {(() => void) & { handles: (TreeHandle | ReorderHandle | SplitHandle)[] }} detach
 */
export declare function attachStructure(root?: ParentNode, options?: {
    typeahead?: boolean;
    typeaheadMs?: number;
    clickToggles?: boolean;
    selectable?: boolean;
    reorderPointer?: boolean;
    splitStep?: number;
    splitLargeStep?: number;
    collapseOnDoubleClick?: boolean;
}): (() => void) & {
    handles: (TreeHandle | ReorderHandle | SplitHandle)[];
};
