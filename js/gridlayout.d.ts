export { COLUMNS, COMMIT_MS, LAYOUT_EVENT, LAYOUT_COMMIT_EVENT } from './gridlayout/values.js';
export { layoutOf, applyLayout } from './gridlayout/layout.js';
export type Tile = {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
};
export type GridHandle = {
    element: HTMLElement;
    layout: () => Tile[];
    apply: (layout: readonly Tile[]) => void;
    /**
     * place tiles added after attach
     */
    refresh: () => void;
};
/** @typedef {{ id: string, x: number, y: number, w: number, h: number }} Tile */
/**
 * @typedef {object} GridHandle
 * @property {HTMLElement} element
 * @property {() => Tile[]} layout
 * @property {(layout: readonly Tile[]) => void} apply
 * @property {() => void} refresh place tiles added after attach
 */
/** The handle for an attached grid. @param {Element} element */
export declare function grid(element: Element): GridHandle | null;
/**
 * @param {ParentNode} root
 * @param {{ step?: number, rows?: number, commitMs?: number, pointer?: boolean }} [options]
 *   Defaults; each also per grid: `data-kp-step`, `data-kp-rows`, `data-kp-commit-ms`, `data-kp-pointer="false"`.
 * @returns {(() => void) & { handles: GridHandle[] }} detach
 */
export declare function attachGrids(root?: ParentNode, options?: {
    step?: number;
    rows?: number;
    commitMs?: number;
    pointer?: boolean;
}): (() => void) & {
    handles: GridHandle[];
};
