import { ProblemsSummary } from './summary.js';
export type Problem = import('../problems.js').Problem;
export type ProblemsOptions = import('../problems.js').ProblemsOptions;
/** @typedef {import('../problems.js').Problem} Problem */
/** @typedef {import('../problems.js').ProblemsOptions} ProblemsOptions */
export declare class ProblemsBoard extends ProblemsSummary {
    connect(): void;
    /** Remember what a page set, to paint again when an attribute changes the layout. @param {Problem[]} items @param {ProblemsOptions} options */
    track(items: Problem[], options: ProblemsOptions): void;
    /** The layout, the fold count and the remedy's word: the options win over the attributes. @param {ProblemsOptions} options */
    settings(options: ProblemsOptions): {
        mode: "each" | "fold" | "list";
        foldFrom: number;
        remedyLabel: string;
    };
    /** Stamp the layout, the fold count and the count of problems on the container. @param {string} mode @param {number} foldFrom @param {ProblemsOptions} options @param {number} count */
    stamp(mode: string, foldFrom: number, options: ProblemsOptions, count: number): void;
    /** Paint the problems in the chosen layout. @param {Problem[]} items @param {ProblemsOptions} options */
    paint(items: Problem[], options: ProblemsOptions): void;
}
