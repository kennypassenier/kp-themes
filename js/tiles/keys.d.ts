import { Controller } from '../controller.js';
export type Way = 'left' | 'right' | 'up' | 'down' | 'first' | 'last';
/** @typedef {'left' | 'right' | 'up' | 'down' | 'first' | 'last'} Way */
export declare class TileBoard extends Controller {
    view: Window & typeof globalThis;
    doc: Document;
    /** The tile that holds the tab stop. @type {Element | null} */
    stop: Element | null;
    /** The stops this script set to -1, with what they had, so detach puts it back. @type {Map<HTMLElement, string | null>} */
    taken: Map<HTMLElement, string | null>;
    queued: number;
    /** The letters typed lately, and the timer that forgets them. */
    typed: string;
    forget: number;
    /** @param {HTMLElement} board @param {{ view: Window & typeof globalThis }} options */
    constructor(board: HTMLElement, options: {
        view: Window & typeof globalThis;
    });
    connect(): void;
    on(): boolean;
    /** Put back the tab stops this script changed. */
    restore(): void;
    /** One stop at 0, the rest at -1: the whole board is one place in the tab order. */
    sync(): void;
    queue(): void;
    /** @param {Event} event */
    onFocus(event: Event): void;
    /** Move the stop and the focus to a tile, and say so. @param {HTMLElement[]} tiles @param {number} from @param {number} to @param {string} key */
    go(tiles: HTMLElement[], from: number, to: number, key: string): void;
    /** With `data-kp-tiles-keys="letters"`, a letter goes to the next tile whose name starts with what was typed. @param {KeyboardEvent} event */
    onLetter(event: KeyboardEvent): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** One arrow, Home or End. @param {DOMRect[]} boxes @param {number} from @param {string} key */
    step(boxes: DOMRect[], from: number, key: string): {
        to: number;
        exit: boolean;
    };
    /** A screenful of rows: as many as stand in the view, at least one. @param {DOMRect[]} boxes @param {number} from @param {boolean} down */
    page(boxes: DOMRect[], from: number, down: boolean): {
        to: number;
        exit: boolean;
    };
    /** Up from the first row: say so, and hand the focus to the element the board names. */
    leave(): void;
}
