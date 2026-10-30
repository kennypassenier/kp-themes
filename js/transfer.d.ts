export { TRANSFER, TRANSFER_DONE_EVENT, TRANSFER_RETRY_EVENT, TRANSFER_LEAVE_EVENT } from './transfer/values.js';
export { transferRate, transferEta } from './transfer/math.js';
export type TransferSample = {
    /**
     * bytes so far
     */
    done?: number;
    /**
     * bytes in all; left out when unknown
     */
    total?: number;
    /**
     * the moment of this report, ms since the epoch (default: now)
     */
    at?: number;
    /**
     * the file's name
     */
    name?: string;
    /**
     * why it failed (the app's own sentence); ends the transfer
     */
    failed?: string;
};
export type TransferState = {
    samples: {
        t: number;
        done: number;
    }[];
    /**
     * the first report
     */
    start: number;
    /**
     * when `done` last grew
     */
    lastMove: number;
    lastDone: number;
    total: number | null;
    phase: 'running' | 'done' | 'failed';
    /**
     * the highest announced step, 0 to 4
     */
    announced: number;
    now: () => number;
    leaveTimer: number;
};
/**
 * One report from the app.
 * @typedef {object} TransferSample
 * @property {number} [done] bytes so far
 * @property {number} [total] bytes in all; left out when unknown
 * @property {number} [at] the moment of this report, ms since the epoch (default: now)
 * @property {string} [name] the file's name
 * @property {string} [failed] why it failed (the app's own sentence); ends the transfer
 */
/**
 * @typedef {object} TransferState
 * @property {{ t: number, done: number }[]} samples
 * @property {number} start the first report
 * @property {number} lastMove when `done` last grew
 * @property {number} lastDone
 * @property {number | null} total
 * @property {'running' | 'done' | 'failed'} phase
 * @property {number} announced the highest announced step, 0 to 4
 * @property {() => number} now
 * @property {number} leaveTimer
 */
/**
 * Report a transfer's progress. The first report starts it; a report whose `done` reaches `total` finishes it.
 * @param {HTMLElement} row a `[data-kp-transfer]`
 * @param {TransferSample} sample
 * @param {{ now?: () => number }} [options] a clock for the stall check (default: the real one)
 */
export declare function setTransfer(row: HTMLElement, sample: TransferSample, { now }?: {
    now?: () => number;
}): void;
/**
 * Take a transfer back to before its first report (a new run in the same row).
 * @param {HTMLElement} row
 */
export declare function resetTransfer(row: HTMLElement): void;
/**
 * Prepare every transfer row under `root` (its parts and ARIA), waiting for the app's first report.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachTransfers(root?: ParentNode): () => void;
