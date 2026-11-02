export type DropHost = {
    host: HTMLElement;
    grid: HTMLElement;
    marker: HTMLElement;
    rowsTotal: () => number;
    clockOfRow: (row: number) => string;
    strings: () => import('../strings.js').Strings;
};
/** Make every source in the document that may land here draggable. @param {HTMLElement} host */
export declare function markSources(host: HTMLElement): void;
/**
 * Wire the drops of one day timeline; returns what undoes it.
 * @param {DropHost} d
 * @returns {() => void}
 */
export declare function wireDrop(d: DropHost): () => void;
