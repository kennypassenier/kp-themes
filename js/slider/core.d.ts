import { Controller } from '../controller.js';
export type SliderHandle = import('../slider.js').SliderHandle;
export declare class SliderCore extends Controller {
    s: import("../strings/types.js").Strings;
    doc: Document;
    id: string;
    o: {
        authored: HTMLInputElement[];
        isRange: boolean;
        min: number;
        max: number;
        step: number;
        gap: number;
        unit: string;
        format: string;
        typed: boolean;
        show: string;
        commitOnInput: boolean;
        vertical: boolean;
        locale: string;
        label: string;
        name: string;
        disabledByPage: boolean;
        digits: number;
        initial: number[];
        defaults: number[];
        ticks: string;
    };
    w: {
        text: (v: number) => string;
        plain: (v: number) => string;
    };
    /** The page's inputs, or new ones: two for a range. @type {HTMLInputElement[]} */
    inputs: HTMLInputElement[];
    values: number[];
    /** @type {HTMLElement[]} */
    bubbles: HTMLElement[];
    /** @type {HTMLInputElement[]} */
    boxes: HTMLInputElement[];
    pressed: boolean;
    why: HTMLElement;
    skeleton: HTMLElement;
    /** @type {SliderHandle} */
    handle: SliderHandle;
    /** @param {HTMLElement} el */
    constructor(el: HTMLElement);
    fullText(): string;
    /** The field boxes, the fill, the bubbles and the unit text, in step with the values. */
    paint(): void;
    /** The value that is allowed for a thumb: snapped, and a range's thumbs kept the gap apart. @param {number} thumb @param {number} want */
    allowed(thumb: number, want: number): number;
    /** @param {number} thumb */
    detailOf(thumb: number): {
        values: number[];
        value: number;
        thumb: string;
        text: string;
    };
    /** @param {string} type @param {number} thumb */
    emit(type: string, thumb: number): void;
    /** @param {number} thumb @param {boolean} commit */
    announce(thumb: number, commit: boolean): void;
    clearWhy(): void;
    /** @param {number} thumb @param {number} want @param {boolean} commit */
    move(thumb: number, want: number, commit: boolean): void;
    /** `loading` shows the skeleton and switches the slider off. @param {'ready' | 'loading'} state */
    setState(state: 'ready' | 'loading'): void;
    /** Replace the values from a script, without the event. @param {readonly number[]} next */
    setValues(next: readonly number[]): void;
}
