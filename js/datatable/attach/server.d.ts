export type DataAnswer = import('../events.js').DataAnswer;
export type DataRequest = import('../events.js').DataRequest;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').DataAnswer} DataAnswer */
/** @typedef {import('../events.js').DataRequest} DataRequest */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableServer {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    sent: number;
    latest: number;
    /** @type {AbortController | null} */
    controller: AbortController | null;
    pending: number;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** @param {HTMLTableRowElement | Record<string, unknown>} item */
    rowFrom(item: HTMLTableRowElement | Record<string, unknown>): HTMLTableRowElement;
    /** @param {DataAnswer} answer */
    applyAnswer(answer: DataAnswer): void;
    /**
     * What the table asks the server for: its view now.
     * @param {number} id @param {AbortSignal} signal
     * @returns {DataRequest}
     */
    requestFor(id: number, signal: AbortSignal): DataRequest;
    /** Ask the server for the view: by `kp-datatable-request` and the `load` option; only the newest answer counts. */
    request(): void;
}
