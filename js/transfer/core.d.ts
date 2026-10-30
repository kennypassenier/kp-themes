import { Controller } from '../controller.js';
export type TransferState = import('../transfer.js').TransferState;
export type Parts = ReturnType<typeof import('./parts.js').build>;
export declare class TransferCore extends Controller {
    /** The transfer's state; null until its first report, and again after a reset. @type {TransferState | null} */
    st: TransferState | null;
    /**
     * @param {HTMLElement} row
     * @param {{ prepare?: boolean }} [options] `prepare`: made by attachTransfers, so the row is zeroed and waits for the first report
     */
    constructor(row: HTMLElement, options?: {
        prepare?: boolean;
    });
    /** Start a transfer's state at its first report. @param {number} at @param {(() => number) | undefined} now */
    begin(at: number, now: (() => number) | undefined): import("../transfer.js").TransferState;
    /** Forget the transfer: the next report starts a new one. */
    forget(): void;
    /**
     * The numbers a paint is drawn from.
     * @param {TransferState} st
     */
    measure(st: TransferState): {
        now: number;
        last: {
            t: number;
            done: number;
        } | undefined;
        done: number;
        total: number | null;
        known: boolean;
        stalledFor: number;
        stalled: boolean;
        rate: number | null;
        measured: number;
        percent: number | null;
    };
    /**
     * The bar: ARIA is the source. A transfer of unknown size has no share to fill, and a bar that sweeps or restarts reads
     * as stuck or hectic (kpadopt5-ops rounds 1 and 2). `data-kp-transfer-unknown` makes the bar one full band of stripes that
     * drifts at an even pace, a loop that is the same picture every period so nothing restarts; the words beside it say the
     * size is unknown and the bytes so far count up. When the size turns out the band settles into the normal bar, which
     * shrinks from full to the real share instead of jumping.
     * @param {Parts} p @param {ReturnType<TransferCore['measure']>} v
     */
    paintBar(p: Parts, v: ReturnType<TransferCore['measure']>): void;
    /** The reading: "1.2 GB of 4.1 GB · 29 %". @param {TransferState} st @param {ReturnType<TransferCore['measure']>} v @returns {string} */
    readingText(st: TransferState, v: ReturnType<TransferCore['measure']>): string;
    /** The speed and the time left of a transfer that is still going. @param {ReturnType<TransferCore['measure']>} v @returns {{ rateText: string, etaText: string }} */
    runningTexts(v: ReturnType<TransferCore['measure']>): {
        rateText: string;
        etaText: string;
    };
    /** The speed and the time left, by phase: the average and the duration when done, nothing when failed. @param {TransferState} st @param {ReturnType<TransferCore['measure']>} v @returns {{ rateText: string, etaText: string }} */
    rateTexts(st: TransferState, v: ReturnType<TransferCore['measure']>): {
        rateText: string;
        etaText: string;
    };
    /** A screen reader hears 25, 50, 75 and 100 %, never every second. @param {TransferState} st @param {Parts} p @param {number | null} percent */
    announce(st: TransferState, p: Parts, percent: number | null): void;
    /** @param {TransferState} st @param {Parts} p */
    paint(st: TransferState, p: Parts): void;
}
