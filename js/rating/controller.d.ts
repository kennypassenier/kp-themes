import { Controller } from '../controller.js';
/** A star rating, to set or to read. */
export declare class RatingController extends Controller {
    el: HTMLElement;
    max: number;
    /** @type {1 | 0.5} */
    step: 1 | 0.5;
    /** @type {'input' | 'display'} */
    mode: 'input' | 'display';
    value: number;
    /** The pick held back by commit confirm, else the value. */
    draft: number;
    /** The value under the pointer, or null. @type {number | null} */
    preview: number | null;
    /** @type {string[]} */
    labels: string[];
    busy: boolean;
    flashTimer: number;
    /** What the element held before the rating drew into it. @type {ChildNode[]} */
    before: ChildNode[];
    parts: {
        row: HTMLDivElement;
        stars: HTMLSpanElement[];
        caption: HTMLSpanElement;
        actions: HTMLSpanElement;
        clear: HTMLButtonElement;
        save: HTMLButtonElement;
        drop: HTMLButtonElement;
        reason: HTMLSpanElement;
        flash: HTMLSpanElement;
        live: HTMLSpanElement;
        failure: HTMLSpanElement;
        failureText: HTMLSpanElement;
        retry: HTMLButtonElement;
        foot: HTMLSpanElement;
        field: (HTMLInputElement & {
            type: string;
            name: string;
        }) | null;
    };
    row: HTMLElement;
    stars: HTMLElement[];
    caption: HTMLElement;
    reason: HTMLElement;
    flash: HTMLElement;
    live: HTMLElement;
    actions: HTMLElement;
    /** @type {HTMLInputElement | null} */
    field: HTMLInputElement | null;
    /**
     * @param {HTMLElement} host
     * @param {import('./constants.js').RatingOptions} [options]
     */
    constructor(host: HTMLElement, options?: import('./constants.js').RatingOptions);
    /** A number attribute, or the fallback. @param {string} name @param {number} fallback */
    num(name: string, fallback: number): number;
    /** The value's snap step: a display row shows a fraction of a star as it is. */
    get valueStep(): 0.01 | 0.5 | 1;
    connect(): void;
    /** Give the element back what it held before the rating drew into it. */
    release(): void;
    /** Show the failed-read plate or the loading look, and paint. */
    syncState(): void;
    /** A change of the scale, the step or the mode draws the row again; the other options are read as they are used. @param {MutationRecord[]} records */
    onAttributes(records: MutationRecord[]): void;
    /** Undo this rating and draw it again from the element's attributes, keeping the value. */
    redraw(): void;
    /** @param {Event} event @returns {number} the star's number, 0 when none */
    starOf(event: Event): number;
    /** @param {PointerEvent} event */
    onOver(event: PointerEvent): void;
    onLeave(): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** Clear, Save and Cancel. @param {MouseEvent} event */
    onActions(event: MouseEvent): void;
}
