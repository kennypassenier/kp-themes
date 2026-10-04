/** Any box a consumer wants eased, beside the components below. */
export declare const SIZE_ATTRIBUTE = "data-kp-size-motion";
/** The boxes that ease to a new size. */
export declare const SIZE_SELECTOR: string;
/** The disclosures that unfold and fold back. */
export declare const FOLD_SELECTOR = ".kp-accordion__item";
/**
 * The theme's motion, read from its dialog entrance: a dialog drawn for an
 * instant out of sight, in the theme `scope` wears.
 *
 * @param {Element} [scope] where the theme is read (its closest `[data-theme]` applies)
 * @returns {{ open: number, ease: string, close: number, size: number }} milliseconds, and the entrance's curve
 */
export declare function themeMotion(scope?: Element): {
    open: number;
    ease: string;
    close: number;
    size: number;
};
/**
 * Close a dialog the way it opened, backwards, then close it for real. With
 * no entrance to reverse (reduced motion, a theme without one) it closes at
 * once.
 *
 * @param {HTMLDialogElement} dialog
 * @param {string} [returnValue]
 * @returns {Promise<void>} settled once the dialog is closed
 */
export declare function closeDialog(dialog: HTMLDialogElement, returnValue?: string): Promise<void>;
/**
 * The entrance's curve without its overshoot: a size goes to its new value
 * and stops there (Kenny, 2026-10-04: pastel's and synthwave's cards "grow
 * too much and shrink again at the end, it should just grow to the correct
 * size"). A cubic-bezier's y values are held between 0 and 1.
 * @param {string} ease
 */
export declare function withoutOvershoot(ease: string): string;
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
/**
 * Ease `box` to its new height whenever what is in it changes size, in both
 * directions; a change during a glide continues from where the box is.
 * @param {HTMLElement} box
 * @returns {() => void}
 */
export declare function easeSize(box: HTMLElement): () => void;
/**
 * Give every dialog its leaving motion and every box above its easing, under
 * `root` and in whatever is added to it later.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachMotion(root?: ParentNode): () => void;
