export type Rating = import('./controller.js').RatingController;
export type RatingSource = import('./constants.js').RatingSource;
/** @typedef {import('./controller.js').RatingController} Rating */
/** @typedef {import('./constants.js').RatingSource} RatingSource */
/** Say something through the polite live region. @param {Rating} m @param {string} text */
export declare function say(m: Rating, text: string): void;
/** Tell the person something under the row, for a while. @param {Rating} m @param {string} text */
export declare function tell(m: Rating, text: string): void;
/**
 * A person changed the rating. The event can be refused; `wait()` hands over a save.
 * @param {Rating} m @param {number} next @param {RatingSource} source
 */
export declare function commit(m: Rating, next: number, source: RatingSource): void;
/** A star's value from a pointer: a half where the step is a half. @param {Rating} m @param {number} n @param {PointerEvent | MouseEvent} event */
export declare function valueAt(m: Rating, n: number, event: PointerEvent | MouseEvent): number;
/** @param {Rating} m @param {number} value @param {RatingSource} source */
export declare function choose(m: Rating, value: number, source: RatingSource): void;
/** @param {Rating} m */
export declare function focusStar(m: Rating): void;
