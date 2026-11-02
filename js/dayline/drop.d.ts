export type DropHost = {
    host: HTMLElement;
    grid: HTMLElement;
    scroll: HTMLElement;
    marker: HTMLElement;
    rowsTotal: () => number;
    holdMs: () => number;
    clockOfRow: (row: number) => string;
    strings: () => import('../strings.js').Strings;
    say: (text: string) => void;
};
/**
 * Wire the drops of one day timeline; returns what undoes it.
 * @param {DropHost} d
 * @returns {() => void}
 */
export declare function wireDrop(d: DropHost): () => void;
