export type EffectsContext = import('../effects.js').EffectsContext;
export declare class PointerLight {
    ctx: import("../effects.js").EffectsContext;
    view: Window;
    /** The elements this theme lights. @type {HTMLElement[]} */
    lit: HTMLElement[];
    /** Where the pointer is, or null when the light is out. @type {{ x: number, y: number } | null} */
    at: {
        x: number;
        y: number;
    } | null;
    /** The frame that rebuilds the list after a theme change, and the frame that paints, or 0. */
    recollect: number;
    queued: number;
    /** @param {EffectsContext} ctx @param {Window} view */
    constructor(ctx: EffectsContext, view: Window);
    /** Wire the ways out and the theme watch, and build the list. @param {(undo: () => void) => void} own */
    connect(own: (undo: () => void) => void): this;
    /**
     * Which elements this theme lights is the theme's own answer, read from the cascade rather than hard-coded here: a
     * register that never declares `--kp-light: pointer` gets an empty list and the frame does nothing at all.
     */
    collect(): void;
    paint(): void;
    /** @param {HTMLElement} el @param {{ x: number, y: number }} here */
    paintOne(el: HTMLElement, here: {
        x: number;
        y: number;
    }): void;
    /** Paint in the next frame, once however often it is asked. */
    schedule(): void;
    onTheme(): void;
    away(): void;
    /** The pointer moved: light from where it is, or go out for a touch. @param {PointerEvent | MouseEvent} event */
    put(event: PointerEvent | MouseEvent): void;
}
