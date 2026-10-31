import { Controller } from '../controller.js';
import { QuestionRun } from './run.js';
/** The fewest open questions with a default before the bar shows. */
export declare const BATCH_MIN = 2;
/** The bar of one `[data-kp-questions]` container. */
export declare class QuestionBatch extends Controller {
    /** The bar, made the first time it is needed. @type {HTMLElement | null} */
    bar: HTMLElement | null;
    /** Whether the bar is asking to confirm. */
    asking: boolean;
    /** @param {HTMLElement} host the container */
    constructor(host: HTMLElement);
    connect(): void;
    /** `off`, `on` or `confirm`, from the attribute. */
    mode(): "confirm" | "off" | "on";
    /** The least count that shows the bar. */
    least(): number;
    /**
     * The runs of the open cards that have a default answer, oldest first.
     * @returns {QuestionRun[]}
     */
    runs(): QuestionRun[];
    /** Draw the bar for the questions open now, or take it away. */
    paint(): void;
    /** @returns {HTMLElement} */
    build(): HTMLElement;
    /** The words for `n` questions, asking or not; written only when they change. @param {HTMLElement} bar @param {number} n */
    words(bar: HTMLElement, n: number): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** Answer them all, or ask first. */
    press(): void;
}
