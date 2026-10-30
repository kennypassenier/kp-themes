export type Entrance = {
    target: Element;
    keyframes: Keyframe[];
    easing: string;
    pseudoElement: string | null;
    line: Line;
};
/**
 * One CSS animation of a dialog's entrance, kept for its close: its
 * keyframes (the custom properties of a register's animation included, see
 * keyframesOf()), where it plays, its curve, and its own time and wait
 * (`line`).
 * @typedef {{ target: Element, keyframes: Keyframe[], easing: string, pseudoElement: string | null, line: Line }} Entrance
 */
/** @type {WeakMap<HTMLDialogElement, Entrance[]>} */
export declare const entrances: WeakMap<HTMLDialogElement, Entrance[]>;
/** @type {WeakSet<HTMLDialogElement>} */
export declare const closing: WeakSet<HTMLDialogElement>;
export declare const nativeClose: ((returnValue?: string) => void) | null;
/**
 * `read`, the keyframes `getKeyframes()` reports (every ordinary property,
 * the implicit first and last frame filled in, each frame on the animation's
 * curve), with the custom properties that `own` (a copy of the same effect)
 * keeps and `read` does not. Chromium's `getKeyframes()` leaves the custom
 * properties of a register's animation out, even a whole frame that holds
 * nothing else, and an `Element.animate()` fed with it plays nothing for a
 * `--x` (package finding of 2026-10-08). A frame `read` has gets the custom
 * properties it lacks; a frame it lacks (same offset) is added, on the curve
 * and the composite `own` gives it. When `own` has no custom property, `read`
 * is returned as it is. Pure.
 * @param {Keyframe[]} read
 * @param {Keyframe[]} own
 * @returns {Keyframe[]}
 */
export declare function withCustomProperties(read: Keyframe[], own: Keyframe[]): Keyframe[];
/**
 * The keyframes to play `effect` again with `Element.animate()`: what
 * `getKeyframes()` reports, plus the custom properties it may leave out
 * (withCustomProperties()). An engine without the copy constructor gets what
 * `getKeyframes()` reports.
 * @param {KeyframeEffect} effect
 * @returns {Keyframe[]}
 */
export declare function keyframesOf(effect: KeyframeEffect): Keyframe[];
export type Line = {
    delay: number;
    duration: number;
    end: number;
};
/**
 * The lines of a part that closes as its open played backwards, line by line
 * (`--kp-lines: keep`): the part takes `total` ms from its first line's start
 * to its last line's end, each line keeps its own share of that time and its
 * own wait, and the whole is turned round, so the line that came in last
 * goes first. Pure: the lines as the register's entrance plays them in, the
 * timing of each in the close and in the opening out. Where the part's
 * entrance is as long as `total` the scale is 1 and every wait is the one the
 * register wrote.
 * @param {readonly Line[]} lines
 * @param {number} total the time the part's close (and its open) takes
 * @returns {{ duration: number, openDelay: number, closeDelay: number }[]}
 */
export declare function turnLines(lines: readonly Line[], total: number): {
    duration: number;
    openDelay: number;
    closeDelay: number;
}[];
/**
 * turnLines() for a dialog's kept entrances. The shade behind it
 * (`::backdrop`) is no line of the dialog: it belongs to the whole part and
 * takes the whole `total`, as it does without `--kp-lines: keep`, and it
 * neither lengthens the span the lines are scaled by nor is scaled with them.
 * @param {readonly { pseudoElement: string | null, line: Line }[]} kept
 * @param {number} total
 * @returns {{ duration: number, openDelay: number, closeDelay: number }[]}
 */
export declare function turnEntrances(kept: readonly {
    pseudoElement: string | null;
    line: Line;
}[], total: number): {
    duration: number;
    openDelay: number;
    closeDelay: number;
}[];
/**
 * Whether the register of `el` keeps every line of a part with its own time
 * and wait (`--kp-lines: keep`) instead of one time for the whole part.
 * Formal rules a card's frame first and then its lines top down, so its
 * leave, arrival, close and open each play every line's wait. Without the
 * token nothing here is read and every part plays as one.
 * @param {Element} el
 * @returns {boolean}
 */
export declare const keepsLines: (el: Element) => boolean;
/**
 * Keep the entrance the dialog just started, so its close can play it
 * backwards: a finished entrance with `fill: backwards` is gone from the
 * element by the time the dialog closes.
 * @param {HTMLDialogElement} dialog
 */
export declare function rememberEntrance(dialog: HTMLDialogElement): void;
/**
 * The CSS animations that make up the dialog's entrance: its own and those
 * of what is in it (grotesk rules the title in under its ::before), each
 * kept on its own element. A motion that never ends is no entrance (the
 * caret terminal blinks on a ghost button's ::after): it is left alone, so
 * it neither moves to the dialog nor stops.
 * @param {HTMLDialogElement} dialog
 * @returns {CSSAnimation[]}
 */
export declare function entranceOf(dialog: HTMLDialogElement): CSSAnimation[];
