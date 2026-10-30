export type TickParse = import('../tick.js').TickParse;
/** The state of one number: its frame, the text last written, the value shown, and the end of a tick that is running. */
export declare class Ticker {
    el: Element;
    /** The animation frame of the running tick, or 0. */
    frame: number;
    /** The text this module last wrote, to tell its own writes from anyone else's. */
    written: string;
    /** The number shown now (mid-tick, the value in between), or null. @type {number | null} */
    shown: number | null;
    /** Lands the running tick at once; undefined when none is running. @type {(() => void) | undefined} */
    pending: (() => void) | undefined;
    /** @param {Element} el */
    constructor(el: Element);
    /** Take the number the element shows as the one shown, and mark it done. */
    adopt(): void;
    /** Land a tick that is running; the number ends on its target. */
    stop(): void;
    /** @param {string} value */
    write(value: string): void;
    /** End on the written text exactly and say so. @param {string} target @param {TickParse | null} parsed */
    land(target: string, parsed: TickParse | null): void;
    /** How long a tick takes: the call's, else the element's `--kp-tick`, else the default. @param {Window | null} view @param {number | undefined} duration */
    lengthOf(view: Window | null, duration: number | undefined): number;
    /**
     * Count the element from the number it shows to the number in `text`, and end on
     * `text` exactly. Without a number in either, `text` is written at once.
     * @param {string} [text]
     * @param {{ from?: number, duration?: number }} [options]
     */
    tickTo(text?: string, { from, duration }?: {
        from?: number;
        duration?: number;
    }): void;
    /**
     * The running tick: a frame at a time along an ease-out curve, landing on the target.
     * @param {Window} view
     * @param {{ target: string, parsed: TickParse, start: number, ms: number }} tick
     */
    run(view: Window, { target, parsed, start, ms }: {
        target: string;
        parsed: TickParse;
        start: number;
        ms: number;
    }): void;
}
/** The ticker of an element, if it has one. @param {Element} el */
export declare const knownTicker: (el: Element) => Ticker | undefined;
/** The ticker of an element, made when it has none. @param {Element} el @returns {Ticker} */
export declare function tickerOf(el: Element): Ticker;
/**
 * Count `el` from the number it shows to the number in `text`, and end on
 * `text` exactly. Without a number in either, `text` is written at once.
 * @param {Element} el
 * @param {string} [text]  the new text; left out, the element's own text is the target (it was just written)
 * @param {{ from?: number, duration?: number }} [options]  `from` the number to start at (default the one last shown)
 */
export declare function tickTo(el: Element, text?: string, options?: {
    from?: number;
    duration?: number;
}): void;
