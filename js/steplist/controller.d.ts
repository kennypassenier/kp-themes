import { Controller } from '../controller.js';
/** Follows one `.kp-steplist`, so a framework or a hand-written `setAttribute` is followed too. */
export declare class StepListController extends Controller {
    connect(): void;
    /** @param {MutationRecord[]} records */
    onChange(records: MutationRecord[]): void;
}
