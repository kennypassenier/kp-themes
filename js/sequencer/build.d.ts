export type SequencerModel = import('./instance.js').SequencerModel;
export type Strings = import('./units.js').Strings;
/** Build the parts once. @param {HTMLElement} el @param {Strings} strings @returns {SequencerModel} */
export declare function build(el: HTMLElement, strings: Strings): SequencerModel;
