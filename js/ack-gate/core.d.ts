import { Controller } from '../controller.js';
import { AckNotes } from './notes.js';
export declare class AckCore extends Controller {
    doc: Document;
    s: import("../strings/types.js").Strings;
    id: string;
    ui: {
        side: HTMLElement;
        anchor: HTMLAnchorElement | null;
        tick: HTMLLabelElement;
        box: HTMLInputElement;
        words: HTMLElement;
        live: HTMLElement;
        problem: HTMLElement;
        problemText: HTMLElement;
        retry: HTMLButtonElement;
        frame: HTMLElement;
    };
    locked: boolean;
    startedAt: number;
    linkOpened: boolean;
    /** What the gate last decided: the browser flips the box before its change event, so the box cannot say what changed. */
    ticked: boolean;
    /** The busy card over the gate while the notes are looked up: the card a loading data table lays over its rows [wish-1120]. @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    /** @type {number | undefined} */
    sayTimer: number | undefined;
    /** @type {number | undefined} */
    waitTimer: number | undefined;
    /** The handle a page gets, made when the gate is wired. @type {import('../ack-gate.js').AckHandle | null} */
    handle: import('../ack-gate.js').AckHandle | null;
    notes: AckNotes;
    /** @param {HTMLElement} gate */
    constructor(gate: HTMLElement);
    key(): string;
    labelText(): string;
    mode(): "all" | "each";
    minMs(): number;
    /** Why the tick cannot be set now, or ''. */
    tickBlock(): string;
    /** The reason a control gives while it is off. */
    reasonFor(): string;
    /** Say what changed in the live region, after a short pause. @param {string} text */
    say(text: string): void;
    /** The loading state's busy card, laid over the gate and taken off the way the theme's busy table's card leaves. @param {string | null} state */
    paintBusy(state: string | null): void;
    /** Take the busy card off at once. */
    dropBusy(): void;
    /** Remember what the tick was set to; true when that is a change. @param {boolean} checked */
    flip(checked: boolean): boolean;
    /** An empty gate hides itself and remembers that it did. @param {string | null} state */
    paintEmpty(state: string | null): void;
    paint(): void;
    /** Keep the alert's height through a state that stands in for its words. */
    keepHeight(): void;
}
