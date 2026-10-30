/**
 * The entrance's curve without its overshoot: a size goes to its new value
 * and stops there (Kenny, 2026-10-04: pastel's and synthwave's cards "grow
 * too much and shrink again at the end, it should just grow to the correct
 * size"). A cubic-bezier's y values are held between 0 and 1.
 * @param {string} ease
 */
export declare function withoutOvershoot(ease: string): string;
/**
 * The curve a size change runs on: the entrance's, without overshoot, or,
 * where the theme asks for it (`--kp-size-steps: line`, terminal), one step
 * per line of text the box gains or loses.
 * @param {HTMLElement} box @param {string} ease @param {number} change in px
 * @param {boolean} [plain] the entrance's curve alone, without the theme's size character (the accordion, approved as it is)
 */
export declare function sizeEase(box: HTMLElement, ease: string, change: number, plain?: boolean): string;
/**
 * How long a stepped size motion takes in the theme `box` wears: a theme
 * that counts its time in steps (`--kp-size-step`, the ms of one step:
 * nostromo's 80 ms frame, terminal's 136 ms line) moves a box, a fold and
 * an unfold one step per that time, so the steps keep the theme's own clock
 * instead of dividing the size time among them (a fold of 400 ms in four
 * steps ran 100 ms a step, off nostromo's 80 ms frame). Any other curve, or
 * a theme without the knob, keeps `duration`.
 * @param {Element} box @param {string} easing @param {number} duration
 * @returns {number}
 */
export declare function steppedDuration(box: Element, easing: string, duration: number): number;
/**
 * A wait before a stepped fold, put on the theme's step clock
 * (`--kp-size-step`): a whole number of steps.
 * @param {Element} box @param {string} easing @param {number} ms
 */
export declare function onStepClock(box: Element, easing: string, ms: number): number;
/**
 * A timing function turned around: the curve that plays a motion backwards
 * as `direction: reverse` would, so a close, a shrink or a fold that runs
 * on it is its opening frame for frame in the other order. A cubic-bezier
 * is rotated half a turn (an ease-out becomes an ease-in, an overshoot past
 * the end becomes one before the start), steps that jump at the end jump at
 * the start, a `linear()` list runs from its other end; `linear` and the
 * symmetric curves stay themselves.
 * @param {string} ease a CSS easing function
 * @returns {string}
 */
export declare function reversedEase(ease: string): string;
/**
 * A box's layout height to the fraction: its border box as drawn when that
 * is the layout height rounded (a fold of 75.5 px glided to 76 and then
 * clicked half a pixel back, in formal), and `offsetHeight` when a
 * transform scales what is drawn (an entrance that zooms the box).
 * @param {HTMLElement} el
 */
export declare function layoutHeight(el: HTMLElement): number;
/**
 * The size motion of the theme `box` wears, for a box this module does not
 * glide itself (the tiles of a set, js/tiles.js): the duration and the curve
 * a change of `change` px runs on, with the theme's own size character
 * (`--kp-size-ease`, `--kp-size-steps`). A duration of 0 means: take the
 * new size at once (reduced motion, a theme without an entrance, or a theme
 * switch in progress).
 * @param {HTMLElement} box @param {number} change in px
 * @returns {{ duration: number, easing: string }}
 */
export declare function sizeMotion(box: HTMLElement, change: number): {
    duration: number;
    easing: string;
};
