export type HeatSpec = import('./types.js').HeatSpec;
/** @typedef {import('./types.js').HeatSpec} HeatSpec */
/**
 * The package's state plate over the grid's whole footprint, with a Retry on a failure [state-plates-1019]. A grid told the same state
 * again keeps its plate.
 * @param {HTMLElement} el @param {HeatSpec} spec @param {'empty' | 'error'} state
 */
export declare function drawStatePlate(el: HTMLElement, spec: HeatSpec, state: 'empty' | 'error'): void;
/**
 * The axis row: the column names, every `every`th of the unmarked ones, the last always.
 * @param {Document} doc @param {readonly { key: string, label: string, minor?: boolean }[]} columns
 * @param {{ every: number, picked: string | null, loading: boolean }} options
 */
export declare function drawAxis(doc: Document, columns: readonly {
    key: string;
    label: string;
    minor?: boolean;
}[], { every, picked, loading }: {
    every: number;
    picked: string | null;
    loading: boolean;
}): HTMLElement;
/**
 * What a loading heat grid's busy card covers: the rows' cells and, below them, whatever the held footprint (js/footprint.js) adds,
 * down to the host's content edge, so the card fills the footprint the grid held and not only the few skeleton rows
 * [hlcomp-1019 heat-busy]. The axis and the names stay beside it.
 * @param {HTMLElement} el
 */
export declare function heatArea(el: HTMLElement): {
    top: number;
    left: number;
    bottom: number;
    right: number;
}[];
