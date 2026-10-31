import { Controller } from '../controller.js';
/** The base of a focus-steps controller: its moves and the keyboard, touch and speech input on it. */
export declare class FocusStepsInput extends Controller {
    /** The touch that may become a swipe. @type {{ x: number, y: number, id: number } | null} */
    touch: {
        x: number;
        y: number;
        id: number;
    } | null;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** The view's state, read fresh: build() lays it on connect. */
    get state(): import("./constants.js").FocusState;
    /** On to the next step; a question is answered first: a multi pick or a written line is taken now. */
    next(): void;
    /** Back one step, within the active track when there are tracks. */
    prev(): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /**
     * ArrowUp and ArrowDown walk the answers of a question.
     * @param {KeyboardEvent} event @param {HTMLElement} onButton
     * @returns {boolean} whether the key was the answers' own
     */
    answerKey(event: KeyboardEvent, onButton: HTMLElement): boolean;
    /**
     * The tabs pattern on the lanes: ArrowUp and ArrowDown (Home, End) move the focus between them.
     * @param {KeyboardEvent} event @param {HTMLElement} onButton
     * @returns {boolean} whether the key was the lanes' own
     */
    laneKey(event: KeyboardEvent, onButton: HTMLElement): boolean;
    /**
     * What a key does to the flow: next, back, first or last step, or nothing.
     * @param {string} key @param {boolean} onButton whether the focus is on a control, where Space is the control's
     * @returns {(() => void) | null}
     */
    flowAct(key: string, onButton: boolean): (() => void) | null;
    /** A touch on the body may start a swipe. @param {PointerEvent} event */
    onDown(event: PointerEvent): void;
    /** A swipe far enough across goes on or back, mirrored right to left. @param {PointerEvent} event */
    onUp(event: PointerEvent): void;
    /** Read the step aloud, or stop reading. @param {HTMLButtonElement} button */
    speak(button: HTMLButtonElement): void;
}
