/** Fired when a tile moves or resizes. A contract value [TH26]: the detail is the whole layout. */
export declare const LAYOUT_EVENT = "kp-grid-layout";
/** Columns when the grid does not say. An operational knob. */
export declare const COLUMNS = 6;
/**
 * @param {HTMLElement} grid
 * @returns {{ id: string, x: number, y: number, w: number, h: number }[]}
 */
export declare function layoutOf(grid: HTMLElement): {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
}[];
/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachGrids(root?: ParentNode): () => void;
