export type EffectsContext = import('../effects.js').EffectsContext;
export declare class ArrivalRun {
    ctx: import("../effects.js").EffectsContext;
    body: HTMLElement;
    routine: any;
    card: boolean;
    theme: any;
    said: {
        line: string;
        progress: string;
        ready: string;
    };
    /** The POST lines of a theme whose own boot is one [S49, A11], or null. @type {string[] | null} */
    lines: string[] | null;
    total: number;
    rate: number;
    overlay: any;
    line: any;
    skip: any;
    skipLabel: string;
    bar: any;
    ended: boolean;
    removed: boolean;
    pct: number;
    shown: number;
    /** @param {EffectsContext} ctx @param {HTMLElement} body */
    constructor(ctx: EffectsContext, body: HTMLElement);
    /** Put the overlay up and run it. @param {(undo: () => void) => void} own registers the take-down with the attach */
    play(own: (undo: () => void) => void): void;
    build(): void;
    /**
     * Skip ends it, and so does a click anywhere on the overlay (CP1, Kenny 2026-09-09): an overlay that covers the whole
     * viewport and answers one 90-pixel button is indistinguishable from a page that has stopped working. A theme that wants
     * the old behaviour sets `--kp-arrival-dismiss: skip-only`.
     */
    wireEnds(): void;
    /** @param {() => void} fn @param {number} ms */
    paced(fn: () => void, ms: number): void;
    /** The overlay's CSS animations at the same rate, read after a style flush so an animation a class has just started is in the list. */
    pace(): void;
    /** The headlines held for this overlay start once it has gone [scope-86]: on its own end, on Skip, on a click and at detach. */
    release(): void;
    remove(): void;
    end(): void;
    /** The percentage mode: a line counting up to 100%. */
    step(): void;
    /**
     * The lines mode [S49, A11]: a theme whose own boot is a POST shows its lines one after another, cumulatively, rather than a
     * percentage. The words are the dictionary's (KT5), and a `{count}` counts up to the theme's declared total the way a
     * memory test does.
     */
    lineStep(): void;
}
