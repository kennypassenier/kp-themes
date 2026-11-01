/**
 * Whether the theme lets a part that a script is about to remove or hide
 * (a state's layer, an empty state, a file row, a tree's children) leave
 * first, as leave() plays it: a theme says so with `--kp-leave-state:
 * leave`, and the others keep taking such a part out at once.
 * @param {Element} el
 * @returns {boolean}
 */
export declare function leavesState(el: Element): boolean;
/**
 * Let `el` leave the theme's way, then take it out [scope-142; Kenny,
 * 2026-10-04: "die grow/shrink bewegingen moeten ook zijn als er opeens
 * nieuwe elementen bijkomen of weggaan"]: it plays its arrival backwards
 * while it folds shut, so what is under it closes up instead of jumping,
 * and the box around it shrinks with it. Under reduced motion, or in a theme
 * with no arrival, it goes at once.
 *
 * Elements told to leave in the same task leave one by one, bottom first.
 *
 * @param {HTMLElement} el
 * @param {{ hide?: boolean }} [options] `hide: true` sets `hidden` instead of removing it
 * @returns {Promise<void>} settled once it is gone
 */
export declare function leave(el: HTMLElement, { hide }?: {
    hide?: boolean;
}): Promise<void>;
export type Leaving = {
    el: HTMLElement;
    hide: boolean;
    resolve: () => void;
};
