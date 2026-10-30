import { Controller } from '../controller.js';
export type Run = import('../runs.js').Run;
export type RunsState = import('../runs.js').RunsState;
export type RunsOptions = import('../runs.js').RunsOptions;
export declare class RunsCore extends Controller {
    s: import("../strings/types.js").Strings;
    id: string;
    read: {
        zone: string;
        count: number;
        more: number;
        relative: boolean;
        warn: boolean;
        fixed: boolean;
        now: () => number;
    };
    parts: {
        title: HTMLParagraphElement;
        stage: HTMLDivElement;
        list: HTMLOListElement;
        note: HTMLDivElement;
        button: HTMLButtonElement;
        live: HTMLParagraphElement;
    };
    doc: Document;
    /** @type {Run[]} */
    all: Run[];
    /** @type {RunsState} */
    state: RunsState;
    /** @type {RunsOptions} */
    given: RunsOptions;
    expanded: boolean;
    /** @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    lastFirst: number;
    drawn: boolean;
    /**
     * @param {HTMLElement} host
     * @param {{ now?: () => number }} [options]
     */
    constructor(host: HTMLElement, options?: {
        now?: () => number;
    });
    /** The app gave the times (none is the empty state). @param {readonly import('../runs.js').RunInput[]} times @param {RunsOptions} options */
    takeTimes(times: readonly import('../runs.js').RunInput[], options: RunsOptions): void;
    /** @param {RunsState} next @param {RunsOptions} options */
    takeState(next: RunsState, options: RunsOptions): void;
    toggleExpanded(): void;
    /** The theme's busy card comes with the loading state and goes with it. */
    followBusy(): void;
    /** The status region says the first run only when it changes. */
    sayFirst(): void;
}
