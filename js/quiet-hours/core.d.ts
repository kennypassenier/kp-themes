import { Controller } from '../controller.js';
export type QuietValue = import('./values.js').QuietValue;
export declare class QuietCore extends Controller {
    s: import("../strings/types.js").Strings;
    id: string;
    parts: {
        onLabel: HTMLLabelElement;
        onInput: HTMLInputElement;
        onWords: HTMLElement;
        body: HTMLElement;
        fromBox: HTMLElement;
        toBox: HTMLElement;
        dayBox: HTMLElement;
        through: HTMLElement;
        problem: HTMLElement;
        summary: HTMLElement;
        reason: HTMLElement;
        wait: HTMLElement;
    };
    /** @type {QuietValue} */
    value: QuietValue;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** The severities the page names (`key` or `key=Words`), or the four. */
    severities(): {
        key: string;
        label: string;
    }[];
    checks(): HTMLInputElement[];
    drawSeverities(): void;
    valid(): boolean;
    paint(): void;
    /** A person changed something: the value follows, the control repaints and the page hears. @param {Partial<QuietValue>} patch */
    change(patch: Partial<QuietValue>): void;
    emit(): void;
    /** The page set the value (or the first one): the fields follow, the control repaints. @param {QuietValue} next @param {boolean} fire */
    write(next: QuietValue, fire: boolean): void;
}
