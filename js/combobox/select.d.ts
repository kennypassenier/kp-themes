export type SelectHandle = import('./types.js').SelectHandle;
/** @typedef {import('./types.js').SelectHandle} SelectHandle */
/**
 * Whether a select gets the drawn list: a single select that is the
 * package's field (`.kp-field__input`) or asks for it (`data-kp-select`),
 * unless it opts out with `data-kp-select="native"`.
 *
 * @param {Element} element
 * @returns {element is HTMLSelectElement}
 */
export declare function drawsSelect(element: Element): element is HTMLSelectElement;
/** The handle for an attached drawn select. @param {Element} element */
export declare function drawnSelect(element: Element): import("./types.js").SelectHandle | null;
/**
 * Lay a drawn list over one select. Returns its detach.
 *
 * @param {HTMLSelectElement} select
 * @param {{ loop?: boolean, typeaheadMs?: number }} [options]
 * @returns {(() => void) & { handle: SelectHandle }}
 */
export declare function attachSelect(select: HTMLSelectElement, { loop, typeaheadMs }?: {
    loop?: boolean;
    typeaheadMs?: number;
}): (() => void) & {
    handle: SelectHandle;
};
/**
 * Lay a drawn list over every select under `root` that `drawsSelect` accepts:
 * each single `select.kp-field__input` and each `select[data-kp-select]`, but
 * never one marked `data-kp-select="native"` and never a multiple select
 * [scope-54; the default since Kenny's form of 2026-09-13].
 *
 * @param {ParentNode} [root]
 * @param {{ loop?: boolean, typeaheadMs?: number }} [options] Defaults; per select `data-kp-loop`.
 * @returns {(() => void) & { handles: SelectHandle[] }} detach
 */
export declare function attachSelects(root?: ParentNode, options?: {
    loop?: boolean;
    typeaheadMs?: number;
}): (() => void) & {
    handles: SelectHandle[];
};
