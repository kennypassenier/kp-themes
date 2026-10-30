export { TOUR_GUTTER, TOUR_GAP, shouldStartTour, tourStepsOnPage, tourCardPlace } from './tour/place.js';
export { tourMemoryKey, tourRemembered, forgetTour } from './tour/memory.js';
export type Strings = import('./strings.js').Strings;
export type TourStep = {
    target: string | (() => Element | null);
    title: string;
    text: string;
};
export type TourDecorateInfo = {
    kind: 'tour-next' | 'tour-back' | 'tour-skip';
    host: HTMLElement;
    key?: string;
    index?: number;
    label?: string;
    value?: string;
};
export type TourOptions = {
    /**
     * the step to open on, counted from 0 among the steps that are on the page
     */
    start?: number;
    /**
     * the name a finished or skipped tour is remembered under (js/remember.js, component `tour`)
     */
    remember?: string;
    /**
     * called with the card's buttons each time a tour builds them [R-DRIVE]
     */
    decorate?: (part: HTMLElement, info: TourDecorateInfo) => void;
    /**
     * where the focus goes when the tour ends; the focused element when it started, by default
     */
    returnFocus?: HTMLElement | null;
    /**
     * called once when it ends: `true` when Done was pressed on the last step
     */
    onEnd?: (finished: boolean) => void;
    /**
     * any of the dictionary's `tour…` words, for this tour only
     */
    strings?: Partial<Strings>;
};
export type TourHandle = {
    end: () => void;
    goto: (i: number) => void;
};
/** @typedef {import('./strings.js').Strings} Strings */
/**
 * One step of a tour: the part of the page it is about (a selector, whose
 * first shown match is taken, or a function), and what the card says.
 * @typedef {object} TourStep
 * @property {string | (() => Element | null)} target
 * @property {string} title
 * @property {string} text
 */
/**
 * What `decorate` is told about the control it is handed: the same shape every kp module's `decorate` takes.
 * `kind` is `tour-next`, `tour-back` or `tour-skip`; `host` is the tour's card.
 * @typedef {{ kind: 'tour-next' | 'tour-back' | 'tour-skip', host: HTMLElement, key?: string, index?: number, label?: string, value?: string }} TourDecorateInfo
 */
/**
 * @typedef {object} TourOptions
 * @property {number} [start] the step to open on, counted from 0 among the steps that are on the page
 * @property {string} [remember] the name a finished or skipped tour is remembered under (js/remember.js, component `tour`)
 * @property {(part: HTMLElement, info: TourDecorateInfo) => void} [decorate] called with the card's buttons each time a tour builds them [R-DRIVE]
 * @property {HTMLElement | null} [returnFocus] where the focus goes when the tour ends; the focused element when it started, by default
 * @property {(finished: boolean) => void} [onEnd] called once when it ends: `true` when Done was pressed on the last step
 * @property {Partial<Strings>} [strings] any of the dictionary's `tour…` words, for this tour only
 */
/** What startTour hands back: end it, or go to a step (counted from 0 among the steps on the page). @typedef {{ end: () => void, goto: (i: number) => void }} TourHandle */
/**
 * Walk the reader over the page, one card per step, beside its target.
 * Steps whose target is not on the page are left out before counting, so the
 * count is exact. The card is a non-modal dialog: the page stays usable. Esc
 * or Skip ends it, the focus goes back where it was, and a tour that ended
 * is remembered (`remember`), if the browser lets it.
 * @param {TourStep[]} steps
 * @param {TourOptions} [options]
 * @returns {TourHandle | null} null when no step has a target on the page
 */
export declare function startTour(steps: TourStep[], { start, remember, decorate, returnFocus, onEnd, strings: own }?: TourOptions): TourHandle | null;
