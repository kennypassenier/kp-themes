/** "3 operations". @param {number} n @param {{ one: string, many: string }} unit */
export declare const counted: (n: number, unit: {
    one: string;
    many: string;
}) => string;
/** The word that says a row's outcome besides its colour. @param {import('./constants.js').FeedRowState | undefined} state */
export declare function stateWord(state: import('./constants.js').FeedRowState | undefined): string;
/**
 * The word for a day: Today, Yesterday, or its weekday.
 * @param {import('./controller.js').FeedController} c @param {number} ms @param {string} key
 */
export declare function dayWord(c: import('./controller.js').FeedController, ms: number, key: string): string;
