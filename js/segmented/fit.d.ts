/** The look: `flow` (default, the chips wrap as they come) or `tracks`. */
export declare const FIT_ATTRIBUTE = "data-kp-segmented-fit";
/** The width under which a group on tracks that needs more than one row folds into a menu; a CSS length in px, rem or em, or `none`. */
export declare const FOLD_AT_ATTRIBUTE = "data-kp-segmented-fold-at";
/** Written on a group while it is folded into its menu. */
export declare const FOLDED_ATTRIBUTE = "data-kp-segmented-folded";
/** The fold width when the attribute names none: a phone or a narrow column. */
export declare const FOLD_AT_DEFAULT = "30rem";
/** @param {Element} group */
export declare const fitsTracks: (group: Element) => boolean;
/**
 * A CSS length as px: `px`, `rem` and `em` are read; `none` (or anything else) is 0, never fold.
 * @param {HTMLElement} group @param {string} text
 */
export declare function lengthPx(group: HTMLElement, text: string): number;
/**
 * Balanced tracks: as many as fit, then evened out over the rows they make, so the last row is never one chip under a full one
 * (7 chips that fit 6 across lie as 4 + 3). Pure.
 * @param {number} count chips @param {number} track one chip's width @param {number} room the group's width @param {number} gap
 * @returns {{ cols: number, rows: number }}
 */
export declare function balanceTracks(count: number, track: number, room: number, gap: number): {
    cols: number;
    rows: number;
};
/**
 * Lay a chip group on its tracks, and fold or unfold it, for the width it has now. Called when the group's size, its items or
 * its fit attributes change. A group that is not on tracks is put back in the flow look.
 * @param {HTMLElement} group
 */
export declare function fitGroup(group: HTMLElement): void;
