export type Strings = import('../../strings/types.js').Strings;
export type TableContext = import('./context.js').TableContext;
export type BusyFields = {
    busySeconds: () => number;
    busyWas: string | null;
    densityWas: string | null;
    drawOverlay: (s: Strings) => void;
    emptyHidden: boolean | 'until-found';
    emptyWasHidden: boolean | 'until-found';
    overlayUnwatch: (() => void) | null;
    showEmpty: (hide: boolean) => void;
    stopBusyClock: () => void;
    total: number;
};
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the the loading overlay, the busy clock and the empty state part adds to the table's context.
 *
 * @typedef {{
 *     busySeconds: () => number;
 *     busyWas: string | null;
 *     densityWas: string | null;
 *     drawOverlay: (s: Strings) => void;
 *     emptyHidden: boolean | 'until-found';
 *     emptyWasHidden: boolean | 'until-found';
 *     overlayUnwatch: (() => void) | null;
 *     showEmpty: (hide: boolean) => void;
 *     stopBusyClock: () => void;
 *     total: number;
 * }} BusyFields
 */
/**
 * The loading overlay, the busy clock and the empty state.
 *
 * @param {TableContext} c
 */
export declare function installBusy(c: TableContext): void;
