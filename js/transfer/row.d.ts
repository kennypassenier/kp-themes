import { TransferCore } from './core.js';
import { build } from './parts.js';
export type TransferSample = import('../transfer.js').TransferSample;
export type TransferState = import('../transfer.js').TransferState;
/** @typedef {import('../transfer.js').TransferSample} TransferSample */
/** @typedef {import('../transfer.js').TransferState} TransferState */
export declare class TransferRow extends TransferCore {
    connect(): void;
    /**
     * Report a transfer's progress. The first report starts it; a report whose `done` reaches `total` finishes it.
     * @param {TransferSample} sample @param {(() => number) | undefined} now
     */
    report(sample: TransferSample, now: (() => number) | undefined): void;
    /** Add a sample, keeping the window and a little more; the rate never needs older samples. @param {TransferState} st @param {number} at @param {number} done */
    push(st: TransferState, at: number, done: number): void;
    /** The transfer reached its total: painted done, announced, and left after its linger. @param {TransferState} st @param {ReturnType<typeof build>} p @param {number} at */
    finish(st: TransferState, p: ReturnType<typeof build>, at: number): void;
    /** The transfer failed: painted failed, with the app's own sentence and a Retry that runs it again. @param {TransferState} st @param {ReturnType<typeof build>} p @param {string} why */
    fail(st: TransferState, p: ReturnType<typeof build>, why: string): void;
    /** Take the transfer back to before its first report (a new run in the same row). */
    reset(): void;
}
