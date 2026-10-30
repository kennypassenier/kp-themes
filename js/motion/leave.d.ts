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
export type RepaintNode = {
    getAttribute: (name: string) => string | null;
    tagName: string;
    className: string;
    id?: string;
    nodeType: number;
    matches?: (selector: string) => boolean;
    querySelector?: (selector: string) => unknown;
};
/**
 * @typedef {{ getAttribute: (name: string) => string | null, tagName: string, className: string, id?: string, nodeType: number, matches?: (selector: string) => boolean, querySelector?: (selector: string) => unknown }} RepaintNode
 */
/**
 * The added elements of one batch of changes that only repaint what was
 * there [port spec G; the homelab dashboard's `repaints()`, moved here]:
 * an element is a repaint when its parent lost, in the same batch, an
 * element with its key (the first of `keys` it carries) or, with no key,
 * one more element of its tag and class than it already took back. An
 * element added where a loading skeleton left (`.kp-skeleton`,
 * `[data-kp-skeleton]`) is not news either: it is the data the skeleton
 * waited for. Everything else is new content.
 *
 * Measured by the dashboard (8 quiet seconds per page): without this, a
 * live refresh that redrew its rows replayed the arrival on 158 cells of
 * one page, 112 on another and 72 on a third, though nothing new had come.
 *
 * @param {Iterable<{ type: string, target: unknown, addedNodes: ArrayLike<any>, removedNodes: ArrayLike<any> }>} records
 * @param {{ keys?: readonly string[] }} [options]
 * @returns {Set<any>} the added elements that are repaints
 */
export declare function repaintedIn(records: Iterable<{
    type: string;
    target: unknown;
    addedNodes: ArrayLike<any>;
    removedNodes: ArrayLike<any>;
}>, { keys }?: {
    keys?: readonly string[];
}): Set<any>;
