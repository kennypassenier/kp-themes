import { Controller } from '../controller.js';
export declare class TransferGroup extends Controller {
    /** A hidden box the width of the fold, measured and taken out again. */
    probe: HTMLDivElement;
    /** @param {HTMLElement} group */
    constructor(group: HTMLElement);
    connect(): void;
    /** Measure the fold width and the group's own, and mark the group narrow when it is below it (`data-kp-fold-at`, 46rem). */
    fit(): void;
}
