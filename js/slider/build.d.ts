export type SliderOptions = import('./values.js').SliderOptions;
export type Writers = ReturnType<typeof import('./values.js').writers>;
export type Strings = ReturnType<typeof import('../strings.js').getStrings>;
/**
 * The track: the rail and its fill, each input with its bubble (built for every slider and shown by `data-kp-slider-show`,
 * so the option switches at runtime without a rebuild), and the marks.
 * @param {Document} doc @param {SliderOptions} o @param {HTMLInputElement[]} inputs @param {number[]} values @param {Writers} w @param {Strings} s
 */
export declare function buildTrack(doc: Document, o: SliderOptions, inputs: HTMLInputElement[], values: number[], w: Writers, s: Strings): {
    track: HTMLElement;
    bubbles: HTMLElement[];
};
/**
 * The value boxes beside the track (a dash between a range's two), sized to the longest text they can show.
 * @param {HTMLElement} el @param {SliderOptions} o @param {HTMLInputElement[]} inputs @param {Writers} w @param {Strings} s
 */
export declare function buildFields(el: HTMLElement, o: SliderOptions, inputs: HTMLInputElement[], w: Writers, s: Strings): {
    fields: HTMLElement;
    boxes: HTMLInputElement[];
};
/** The line under the slider (an error, or the reason it is off) and the loading skeleton. @param {Document} doc @param {string} id */
export declare function buildLines(doc: Document, id: string): {
    why: HTMLElement;
    skeleton: HTMLElement;
};
