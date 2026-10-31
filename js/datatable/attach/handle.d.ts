export type DataTableHandle = import('../instance.js').DataTableHandle;
export type FilterValue = import('../events.js').FilterValue;
export type State = import('../events.js').State;
export type View = import('../events.js').View;
export type DataTableControl = import('./controller.js').DataTableControl;
export declare class TableHandle {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** What a page gets back for this table. @type {DataTableHandle} */
    handle: DataTableHandle;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** @returns {DataTableHandle} */
    makeHandle(): DataTableHandle;
    /** @param {number} next */
    page(next: number): void;
    /** @param {string} next */
    query(next: string): void;
    /** @param {number | string | null} given */
    scope(given: number | string | null): void;
    /** @param {number | string | null} given */
    editFilter(given: number | string | null): void;
    /** @param {State} next */
    setState(next: State): void;
    /** @param {string | null} [reason] */
    fail(reason?: string | null): void;
    /** @param {Parameters<DataTableHandle['busy']>[0]} words */
    busy(words: Parameters<DataTableHandle['busy']>[0]): void;
    /**
     * Read the rows again. The control that held the focus keeps it [R-LIVE, J2]: the same element when it stayed, else the same
     * toggle of the row (or group) with the same key, when the consumer replaced it, even before this call, as long as nothing else
     * took the focus.
     * @param {{ keepPage?: boolean }} [options]
     */
    refresh(options?: {
        keepPage?: boolean;
    }): void;
    /** The rows as the body holds them now: held rows hidden, gone rows forgotten, new rows prepared, their built details dropped. */
    readRows(): void;
    /**
     * Give the focus back to the control that held it, or to the same toggle of its row or group.
     * @param {HTMLElement} held
     * @param {{ key: string | null, group: string | null, selector: string | null } | null} memo
     */
    focusBack(held: HTMLElement, memo: {
        key: string | null;
        group: string | null;
        selector: string | null;
    } | null): void;
    /**
     * Rows the page added, removed or held are the table's rows at once, without a call to refresh(): the count, the pager and the
     * pages follow the body [b3b4-1019; homelab gap 34, kyu gap 28]. The table's own sort and page moves put the same rows back in
     * another order, which changes nothing here.
     */
    watchRows(): void;
    /** Wire the table again after an option attribute changed, and give the page's handle the view it had. */
    wireAgain(): void;
}
