import { ProblemsEach } from './each.js';
export type Problem = import('../problems.js').Problem;
/** @typedef {import('../problems.js').Problem} Problem */
export declare class ProblemsSummary extends ProblemsEach {
    /** The one alert, made when missing or kept; its tone is the worst problem's. @param {Problem[]} list @returns {{ summary: HTMLElement, fresh: boolean }} */
    summaryShell(list: Problem[]): {
        summary: HTMLElement;
        fresh: boolean;
    };
    /** The heading and the list inside the body. @param {HTMLElement} body @param {number} count @returns {HTMLElement} the list */
    summaryList(body: HTMLElement, count: number): HTMLElement;
    /** The rows by key; the rows beyond `open` are hidden unless the alert is expanded. @param {HTMLElement} ul @param {Problem[]} list @param {number} open @param {boolean} expanded @param {string} remedyLabel */
    summaryRows(ul: HTMLElement, list: Problem[], open: number, expanded: boolean, remedyLabel: string): void;
    /** The "Show the other N" button of a folded alert, made when it is needed and taken away when it is not. @param {HTMLElement} summary @param {HTMLElement} body @param {Problem[]} list @param {string} mode @param {number} open @param {boolean} expanded */
    summaryMore(summary: HTMLElement, body: HTMLElement, list: Problem[], mode: string, open: number, expanded: boolean): void;
    /** Show the rest of a folded alert, or fold it again. @param {HTMLElement} target the one alert */
    toggleExpanded(target: HTMLElement): void;
    /** One alert holding the problems as a list. @param {Problem[]} list @param {'list' | 'fold'} mode @param {number} foldFrom @param {string} remedyLabel */
    paintSummary(list: Problem[], mode: 'list' | 'fold', foldFrom: number, remedyLabel: string): void;
}
