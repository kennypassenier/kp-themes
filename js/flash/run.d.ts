import { FlashFaces } from './faces.js';
export type FlashOptions = import('../flash.js').FlashOptions;
/** @typedef {import('../flash.js').FlashOptions} FlashOptions */
export declare class FlashRun extends FlashFaces {
    /** The timer that takes the result away, and whether work is running. */
    timer: number;
    running: boolean;
    /**
     * @param {HTMLElement} host the button
     * @param {FlashOptions} [options]
     */
    constructor(host: HTMLElement, options?: FlashOptions);
    connect(): void;
    /**
     * @param {'rest' | 'busy' | 'success' | 'refused'} state
     * @param {Record<string, unknown>} [detail]
     */
    setState(state: 'rest' | 'busy' | 'success' | 'refused', detail?: Record<string, unknown>): void;
    /** The press starts: the old result goes, the options the page passed are stamped, and the button is busy. @param {FlashOptions} options */
    begin(options: FlashOptions): void;
    /**
     * Run `work` behind the button.
     * @param {() => Promise<import('../flash.js').FlashAnswer> | import('../flash.js').FlashAnswer} work
     * @param {FlashOptions} [options]
     * @returns {Promise<{ ok: boolean, word: string, line: string } | null>} null when the press was ignored (already busy)
     */
    run(work: () => Promise<import('../flash.js').FlashAnswer> | import('../flash.js').FlashAnswer, options?: FlashOptions): Promise<{
        ok: boolean;
        word: string;
        line: string;
    } | null>;
    /** The result on the button, the line under it, the words said, and the timer back to rest. @param {{ ok: boolean, word: string, line: string }} outcome @param {FlashOptions} options */
    showOutcome({ ok, word, line }: {
        ok: boolean;
        word: string;
        line: string;
    }, options: FlashOptions): void;
    /** Back to rest; a width the refusal grew is taken back unless the page chose one. @param {boolean} grown @param {string | null} handWidth @param {FlashOptions} options */
    backToRest(grown: boolean, handWidth: string | null, options: FlashOptions): void;
}
