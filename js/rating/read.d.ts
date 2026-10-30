export type Rating = import('./controller.js').RatingController;
/** @typedef {import('./controller.js').RatingController} Rating */
/** @param {Rating} m @param {string} name @returns {string | undefined} */
export declare const attr: (m: Rating, name: string) => string | undefined;
/** @param {Rating} m */
export declare const itemName: (m: Rating) => string;
/** @param {Rating} m */
export declare const disabled: (m: Rating) => boolean;
/** @param {Rating} m */
export declare const readonly: (m: Rating) => boolean;
/** @param {Rating} m */
export declare const state: (m: Rating) => string;
/** @param {Rating} m */
export declare const interactive: (m: Rating) => boolean;
/** Whether the row takes the tab stop: a read-only row does too, so its state can be reached. @param {Rating} m */
export declare const focusable: (m: Rating) => boolean;
/** @param {Rating} m */
export declare const announceLevel: (m: Rating) => string;
/** The words that go with a value. @param {Rating} m @param {number} value */
export declare function wordsOf(m: Rating, value: number): string;
