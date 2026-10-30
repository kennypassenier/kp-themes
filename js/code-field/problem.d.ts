import { CodeFieldCore } from './core.js';
export type CodeFieldProblem = {
    line: number | null;
    column: number | null;
    message: string;
};
/** @typedef {{ line: number | null, column: number | null, message: string }} CodeFieldProblem */
export declare class CodeFieldProblems extends CodeFieldCore {
    /** @type {CodeFieldProblem | null} */
    problem: CodeFieldProblem | null;
    field: Element | null;
    /** The slot of a `.kp-field` that takes the sentence, when it has one. @type {HTMLElement | null} */
    holder: HTMLElement | null;
    /** @param {HTMLElement} host a `textarea[data-kp-code-field]` */
    constructor(host: HTMLElement);
    /** The sentence that names the problem, with the line and column it has. */
    sentence(): string;
    /** Whether the problem is another than `before`. @param {CodeFieldProblem | null} before */
    changed(before: CodeFieldProblem | null): boolean;
    /** Mark the problem the page found; `null` takes it back. @param {number | null} line @param {number | null} [column] @param {string} [message] */
    setError(line: number | null, column?: number | null, message?: string): void;
    /** Ask the page to check the text; it answers through `event.detail.error`. */
    check(): void;
}
