import { Controller } from '../controller.js';
export type SequencerModel = import('./instance.js').SequencerModel;
export type SequencerAttachOptions = import('./units.js').SequencerAttachOptions;
/** One sequencer: its model is the `sequencers` registry entry the setters read; the last plot width sits on the instance. */
export declare class SequencerControl extends Controller {
    /** The model build() lays in connect(); every part reads it. */
    c: import("./instance.js").SequencerModel;
    /** The plot width last laid out, so a resize that keeps it does nothing. */
    lastWidth: number;
    /** @param {HTMLElement} host @param {SequencerAttachOptions} [options] */
    constructor(host: HTMLElement, options?: SequencerAttachOptions);
    connect(): void;
    /** The listeners, newest last: destroy() removes click first, the wheel last, as before. */
    wire(): void;
    /** Another plot width lays the bars out again on the next frame, unless a drag is moving them. */
    watchWidth(): void;
    /** An option changed at run time: read them again and paint, unless an edit is in progress. @param {string[]} names */
    onOptions(names: string[]): void;
    /** A zoom button, a link action, or a press on the empty track that lets go of the selection. @param {Event} e */
    onClick(e: Event): void;
    /** @param {HTMLElement} zoomButton */
    pressZoom(zoomButton: HTMLElement): void;
    /** A bar that takes the focus is the selection and the tab stop. @param {FocusEvent} e */
    onFocusIn(e: FocusEvent): void;
    /** A bar picked up with the keyboard is put back when the focus leaves the sequencer. @param {FocusEvent} e */
    onFocusOut(e: FocusEvent): void;
    /** ctrl+wheel zooms around the pointer. @param {WheelEvent} e */
    onWheel(e: WheelEvent): void;
}
