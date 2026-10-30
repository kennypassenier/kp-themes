export type TourStep = import('../tour.js').TourStep;
/** @typedef {import('../tour.js').TourStep} TourStep */
/** The distance from the card to the window's edges, and from the card to its target, in px. */
export declare const TOUR_GUTTER = 16;
export declare const TOUR_GAP = 12;
/**
 * Whether a tour starts by itself, and at which step: `?tour` (or `?tour=3`,
 * counted from 1) always does; otherwise only a first visit by a person
 * (not a browser driven by a script).
 * @param {{ search?: string, remembered?: boolean, automated?: boolean }} context
 * @returns {number | null} the step to start on, counted from 0, or null for no tour
 */
export declare function shouldStartTour({ search, remembered, automated }: {
    search?: string;
    remembered?: boolean;
    automated?: boolean;
}): number | null;
/**
 * The steps a tour shows: those whose target `find` finds, in order. The
 * count on the card is taken from these, so it is exact.
 * @template {TourStep} S
 * @param {readonly S[]} steps
 * @param {(step: S) => unknown} find
 * @returns {S[]}
 */
export declare const tourStepsOnPage: <S extends TourStep>(steps: readonly S[], find: (step: S) => unknown) => S[];
/**
 * Where the card goes: centred on its target, kept `gutter` px inside the
 * window, and `gap` px under the target, or over it when the target's middle
 * is in the lower half of the window. Not rounded: a target at a fractional
 * position keeps the card exactly `gap` px from it.
 * @param {{ top: number, bottom: number, left: number, width: number, height: number }} target the target's box in the window
 * @param {{ width: number, height: number }} card
 * @param {{ width: number, height: number }} view
 * @param {{ gutter?: number, gap?: number }} [options]
 * @returns {{ left: number, top: number }}
 */
export declare function tourCardPlace(target: {
    top: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
}, card: {
    width: number;
    height: number;
}, view: {
    width: number;
    height: number;
}, { gutter, gap }?: {
    gutter?: number;
    gap?: number;
}): {
    left: number;
    top: number;
};
/** Is `el` laid out (not hidden, not inside something hidden)? @param {Element | null} el */
export declare const isShown: (el: Element | null) => boolean;
/** @param {TourStep} step @param {Document} doc @returns {HTMLElement | null} */
export declare function resolveTarget(step: TourStep, doc: Document): HTMLElement | null;
