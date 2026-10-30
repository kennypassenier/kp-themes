import { RunsCore } from './core.js';
export declare class RunsRows extends RunsCore {
    /** The marks of a run: the clock turning before it, and the app's own conflict. @param {import('./core.js').Run} run @param {number | undefined} before */
    marksOf(run: import('./core.js').Run, before: number | undefined): string[];
    /** One row. @param {import('./core.js').Run} run @param {number} index @param {number | undefined} before */
    row(run: import('./core.js').Run, index: number, before: number | undefined): HTMLLIElement;
    /** The placeholder rows of the loading state. */
    waitRows(): HTMLLIElement[];
    draw(): void;
}
