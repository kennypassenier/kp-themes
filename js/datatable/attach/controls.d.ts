export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableControls {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    search: HTMLInputElement | null;
    scopeSelect: HTMLSelectElement | null;
    densitySelect: HTMLSelectElement | null;
    status: HTMLElement | null;
    pager: HTMLElement | null;
    empty: HTMLElement | null;
    loadingSlot: HTMLElement | null;
    failedSlot: HTMLElement | null;
    actions: HTMLElement | null;
    selectAll: HTMLInputElement | null;
    size: number;
    locale: string;
    serverMode: boolean;
    externalSort: boolean;
    debounce: number;
    cycle: string;
    /** @type {'two' | 'three'} */
    cycleName: 'two' | 'three';
    multi: boolean;
    addOnClick: boolean;
    glyphs: {
        expand: string;
        collapse: string;
    };
    sizesAttribute: string | undefined;
    sizes: number[];
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
}
