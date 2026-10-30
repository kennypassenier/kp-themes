import { Controller } from '../controller.js';
/** The controller of one `[data-kp-dated]` picker. */
export declare class DatedController extends Controller {
    strings: import("../strings/types.js").Strings;
    settings: {
        id: string;
        name: string;
        mode: 'radio' | 'combobox' | 'auto';
        inlineMax: number;
        latestOn: boolean;
        order: 'newest' | 'oldest' | 'given';
        column: boolean;
        preselect: boolean;
        zone: string;
        now: () => number;
        label: string;
        rowsWanted: number;
    };
    stage: HTMLDivElement;
    body: HTMLDivElement;
    note: HTMLDivElement;
    live: HTMLParagraphElement;
    /** @type {import('./constants.js').DatedOption[]} */
    shown: import('./constants.js').DatedOption[];
    /** @type {string | null} */
    chosen: string | null;
    /** The value to choose when the options arrive. @type {string | undefined} */
    pendingValue: string | undefined;
    /** @type {import('./constants.js').DatedState} */
    state: import('./constants.js').DatedState;
    /** @type {import('./constants.js').DatedStateOptions} */
    given: import('./constants.js').DatedStateOptions;
    /** @type {'radio' | 'combobox'} */
    kind: 'radio' | 'combobox';
    /** @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    drawn: boolean;
    /** @type {(() => void) | null} */
    detachCombobox: (() => void) | null;
    /** The height the picker had with its options, kept while a state stands in for them. */
    kept: number;
    /** Set while a script's choice goes through the combobox's handle, so the listener does not act twice. */
    suppress: boolean;
    typed: string;
    typedAt: number;
    /** What a page gets back from datedOptions(). @type {import('./constants.js').DatedHandle} */
    handle: import('./constants.js').DatedHandle;
    /**
     * @param {HTMLElement} host
     * @param {{ now?: () => number }} [options] `now` so a test never reads the real clock
     */
    constructor(host: HTMLElement, options?: {
        now?: () => number;
    });
    connect(): void;
    /** Take away what the picker drew and marked. */
    undoDom(): void;
    /** Give the picker its options (none: the empty state), and optionally the value to choose. @param {readonly import('./constants.js').DatedOption[]} options @param {string | null} [value] */
    setOptions(options: readonly import('./constants.js').DatedOption[], value?: string | null): void;
    /** @param {import('./constants.js').DatedState} next @param {import('./constants.js').DatedStateOptions} [options] */
    setState(next: import('./constants.js').DatedState, options?: import('./constants.js').DatedStateOptions): void;
    /** Draw the options or the placeholder rows for the picker's kind and state. */
    draw(): void;
    /** Bring the picker in step with its state: the kept height, the drawing, the note and the busy card. */
    sync(): void;
    /** Choose a value; `fire` is a person's choice (event and announcement), else a script's. @param {string | null} value @param {boolean} fire */
    choose(value: string | null, fire: boolean): void;
    /** Write the choice into the hidden value and, for a script's choice, through the combobox's handle. @param {boolean} fire */
    chooseInCombobox(fire: boolean): void;
    /** @param {Event} event */
    onChange(event: Event): void;
    /** @param {Event} event */
    onCombobox(event: Event): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** Type a few letters on the radio rows: the first option whose name starts with them is chosen. @param {KeyboardEvent} event */
    onType(event: KeyboardEvent): void;
}
