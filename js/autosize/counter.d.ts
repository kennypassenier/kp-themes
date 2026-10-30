/** The counter of one box. It knows what to draw and where it sits; the controller tells it when. */
export declare class CounterLine {
    area: HTMLTextAreaElement;
    frame: () => HTMLElement | null;
    number: Intl.NumberFormat;
    strings: import("../strings/types.js").Strings;
    /** @type {HTMLElement | null} */
    counter: HTMLElement | null;
    /** @type {HTMLElement | null} */
    live: HTMLElement | null;
    /** The level last announced: none, near or full. */
    announced: number;
    /**
     * @param {HTMLTextAreaElement} area
     * @param {() => HTMLElement | null} frame the busy card's frame while there is one: the counter sits after it, else after the box
     * @param {Intl.NumberFormat} number
     * @param {import('../strings.js').Strings} strings
     */
    constructor(area: HTMLTextAreaElement, frame: () => HTMLElement | null, number: Intl.NumberFormat, strings: import('../strings.js').Strings);
    /** The counter's words for a mode. @param {'chars' | 'lines' | 'both'} mode @param {{ chars: number, lines: number }} counts @param {number} max */
    words(mode: 'chars' | 'lines' | 'both', { chars, lines }: {
        chars: number;
        lines: number;
    }, max: number): string;
    /** Draw it for the box's counts, or take it away when the mode is off. @param {'off' | 'chars' | 'lines' | 'both'} mode @param {{ chars: number, lines: number }} counts */
    draw(mode: 'off' | 'chars' | 'lines' | 'both', counts: {
        chars: number;
        lines: number;
    }): void;
    /** Announced politely at 90 % and 100 % only, not on every key. @param {number} share @param {number} chars @param {number} max */
    announce(share: number, chars: number, max: number): void;
    /** Take the counter and its live line away. */
    remove(): void;
}
