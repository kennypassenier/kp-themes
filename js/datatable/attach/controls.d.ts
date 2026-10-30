export type TableContext = import('./context.js').TableContext;
export type ControlsFields = {
    actions: HTMLElement | null;
    addOnClick: boolean;
    cycleName: 'two' | 'three';
    debounce: number;
    densitySelect: HTMLSelectElement | null;
    empty: HTMLElement | null;
    externalSort: boolean;
    failedSlot: HTMLElement | null;
    glyphs: {
        expand: string;
        collapse: string;
    };
    loadingSlot: HTMLElement | null;
    locale: string;
    multi: boolean;
    pager: HTMLElement | null;
    scopeSelect: HTMLSelectElement | null;
    search: HTMLInputElement | null;
    selectAll: HTMLInputElement | null;
    serverMode: boolean;
    size: number;
    sizes: number[];
    status: HTMLElement | null;
};
/** @typedef {import('./context.js').TableContext} TableContext */
/**
 * What the finds the controls around the table and reads its options part adds to the table's context.
 *
 * @typedef {{
 *     actions: HTMLElement | null;
 *     addOnClick: boolean;
 *     cycleName: 'two' | 'three';
 *     debounce: number;
 *     densitySelect: HTMLSelectElement | null;
 *     empty: HTMLElement | null;
 *     externalSort: boolean;
 *     failedSlot: HTMLElement | null;
 *     glyphs: { expand: string; collapse: string; };
 *     loadingSlot: HTMLElement | null;
 *     locale: string;
 *     multi: boolean;
 *     pager: HTMLElement | null;
 *     scopeSelect: HTMLSelectElement | null;
 *     search: HTMLInputElement | null;
 *     selectAll: HTMLInputElement | null;
 *     serverMode: boolean;
 *     size: number;
 *     sizes: number[];
 *     status: HTMLElement | null;
 * }} ControlsFields
 */
/**
 * Finds the controls around the table and reads its options.
 *
 * @param {TableContext} c
 */
export declare function installControls(c: TableContext): void;
