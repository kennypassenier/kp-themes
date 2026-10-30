import { Controller } from '../controller.js';
export type RangeValue = {
    /**
     * the preset's key, or null for a custom window
     */
    preset: string | null;
    /**
     * ms
     */
    start: number;
    /**
     * ms
     */
    end: number;
};
export declare class RangeCore extends Controller {
    s: import("../strings/types.js").Strings;
    doc: Document;
    id: string;
    /** @type {() => number} */
    now: () => number;
    zone: string;
    presets: string[];
    withCustom: boolean;
    disabled: boolean;
    future: boolean;
    maxDays: number;
    bar: HTMLElement;
    group: HTMLElement;
    line: HTMLParagraphElement;
    /** The Custom… button; null in a presets-only picker. @type {HTMLButtonElement | null} */
    custom: HTMLButtonElement | null;
    /** @type {RangeValue} */
    value: RangeValue;
    /**
     * @param {HTMLElement} el
     * @param {Record<string, unknown>} [options]
     */
    constructor(el: HTMLElement, options?: Record<string, unknown>);
    /** The line under the control: the window's name and its two moments. */
    describe(): string;
    /** Set the window: a preset's key (the span counts back from now) or a custom start and end. @param {RangeValue} next @param {boolean} fire */
    set(next: RangeValue, fire: boolean): void;
    /** What `kp-range-change` carries: the key or null, the two moments as ISO strings and the line. */
    detail(): {
        preset: string | null;
        start: string;
        end: string;
        label: string;
    };
}
