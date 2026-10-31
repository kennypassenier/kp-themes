export type EffectsContext = import('../effects.js').EffectsContext;
export declare class PressBus {
    ctx: import("../effects.js").EffectsContext;
    /** The elements this bus has written to, so it can take it all back [KT6]. @type {Set<HTMLElement>} */
    marked: Set<HTMLElement>;
    /** The held presses and the timer that lets each go. @type {Map<HTMLElement, number>} */
    holding: Map<HTMLElement, number>;
    /** @param {EffectsContext} ctx */
    constructor(ctx: EffectsContext);
    /** The theme answers per press, not once: a page can change theme after the bus is armed. */
    asked(): any;
    /** @param {(undo: () => void) => void} own */
    connect(own: (undo: () => void) => void): void;
    /** Remove every mark and every hold this bus wrote [KT6]. */
    takeBack(): void;
    /**
     * `--kp-press: hold`: a press a stylesheet plays as an animation on `:active` is cut where the finger lifts, so a quick tap
     * shows part of it. The press is marked for the time the animation takes (`--kp-press-hold`, else PRESS_HOLD_MS) and the
     * register keys the same animation on the mark as well as on `:active`.
     * @param {Event} event
     */
    hold(event: Event): void;
    /** A theme that letters its buttons gets each one's width. @param {HTMLElement} el */
    letter(el: HTMLElement): void;
    /** @param {Event} event */
    onDown(event: Event): void;
    /**
     * A key press has no point: the stylesheet's own default takes over again, which puts the stain in the middle of the
     * button. It has a size all the same, so a theme that letters it gets it.
     * @param {Event} event
     */
    onKey(event: Event): void;
}
