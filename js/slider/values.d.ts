export type Strings = ReturnType<typeof import('../strings.js').getStrings>;
/** @typedef {ReturnType<typeof import('../strings.js').getStrings>} Strings */
/** A slider. */
export declare const SLIDER = "[data-kp-slider]";
/** Fired on the slider on every move by a person: `{ values, value, thumb, text }`. */
export declare const SLIDER_INPUT_EVENT = "kp-slider-input";
/** Fired on the slider when a value is committed (on release, or at once with `data-kp-commit="input"`). */
export declare const SLIDER_CHANGE_EVENT = "kp-slider-change";
/** The states a slider can be in. */
export declare const SLIDER_STATES: readonly ['ready', 'loading'];
/** @param {number} n */
export declare const decimalsOf: (n: number) => number;
/**
 * A value snapped to the step from the minimum, clamped, and without floating-point dust. Pure.
 * @param {number} value @param {number} min @param {number} max @param {number} step
 */
export declare function snapSlider(value: number, min: number, max: number, step: number): number;
/**
 * Where a value stands along the track, 0 to 100. Pure.
 * @param {number} value @param {number} min @param {number} max
 */
export declare function sliderPercent(value: number, min: number, max: number): number;
/**
 * A number typed in the box: the unit and spaces dropped, a comma read as the decimal; NaN when it is not a number. Pure.
 * @param {string} text @param {string} [unit]
 */
export declare function parseSliderText(text: string, unit?: string): number;
/** Where the number shows: `data-kp-slider-value`, else the field. @param {HTMLElement} el */
export declare const showOf: (el: HTMLElement) => string;
/**
 * The slider's options, read once from the markup and the inputs the page wrote.
 * @param {HTMLElement} el @param {Strings} s
 */
export declare function readOptions(el: HTMLElement, s: Strings): {
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
export type SliderOptions = ReturnType<typeof readOptions>;
/** @typedef {ReturnType<typeof readOptions>} SliderOptions */
/**
 * How a value is written: `text` for the readout, the bubble and `aria-valuetext`; `plain`, the number alone, for the box
 * (the unit stands beside it).
 * @param {SliderOptions} o @param {Strings} s
 */
export declare function writers(o: SliderOptions, s: Strings): {
    text: (v: number) => string;
    plain: (v: number) => string;
};
/** The values a slider starts with: the markup's, else the page's inputs, else the default places. @param {SliderOptions} o @param {number} count */
export declare function startValues(o: SliderOptions, count: number): number[];
