export { SLIDER, SLIDER_INPUT_EVENT, SLIDER_CHANGE_EVENT, SLIDER_STATES, snapSlider, sliderPercent, parseSliderText } from './slider/values.js';
export type SliderHandle = {
    element: HTMLElement;
    /**
     * one value, or two for a range
     */
    values: () => number[];
    /**
     * replace the values (no event)
     */
    set: (values: readonly number[]) => void;
    setState: (state: 'ready' | 'loading') => void;
    /**
     * the value as the box shows it
     */
    text: () => string;
};
/**
 * @typedef {object} SliderHandle
 * @property {HTMLElement} element
 * @property {() => number[]} values one value, or two for a range
 * @property {(values: readonly number[]) => void} set replace the values (no event)
 * @property {(state: 'ready' | 'loading') => void} setState
 * @property {() => string} text the value as the box shows it
 */
/** The handle of an attached slider. @param {Element} element @returns {SliderHandle | null} */
export declare function slider(element: Element): SliderHandle | null;
/**
 * The values of a slider.
 * @param {Element} element
 */
export declare function sliderValues(element: Element): number[];
/**
 * Set the values of a slider from a script, without the event.
 * @param {Element} element @param {readonly number[]} values
 */
export declare function setSliderValues(element: Element, values: readonly number[]): void;
/**
 * Put a slider in a state: `loading` shows its skeleton and switches it off.
 * @param {Element} element @param {'ready' | 'loading'} state
 */
export declare function setSliderState(element: Element, state: 'ready' | 'loading'): void;
/**
 * Wire every slider under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachSliders(root?: ParentNode): () => void;
