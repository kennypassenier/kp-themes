export type TransferCore = import('./core.js').TransferCore;
/** @typedef {import('./core.js').TransferCore} TransferCore */
/** The transfers that are running now. @type {Set<TransferCore>} */
export declare const live: Set<TransferCore>;
/** Keep a transfer live: it is painted every tick until it ends. @param {TransferCore} row */
export declare function watch(row: TransferCore): void;
