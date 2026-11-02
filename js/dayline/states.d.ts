export type StateParts = {
    host: HTMLElement;
    /**
     * the positioned box the card and the plate stand in
     */
    frame: HTMLElement;
    /**
     * the hours, under the card or the plate
     */
    scroll: HTMLElement;
    plate: HTMLElement;
    state: import('./constants.js').DaylineState;
    /**
     * the plate's heading, when the page gave one
     */
    words: string;
    /**
     * the plate's sentence, when the page gave one
     */
    text: string;
    /**
     * whether the day has been drawn once (a first loading card is the page, not news)
     */
    drawn: boolean;
    busy: import('../busy-card.js').BusyCard | null;
};
/**
 * What the states draw on.
 * @typedef {object} StateParts
 * @property {HTMLElement} host
 * @property {HTMLElement} frame the positioned box the card and the plate stand in
 * @property {HTMLElement} scroll the hours, under the card or the plate
 * @property {HTMLElement} plate
 * @property {import('./constants.js').DaylineState} state
 * @property {string} words the plate's heading, when the page gave one
 * @property {string} text the plate's sentence, when the page gave one
 * @property {boolean} drawn whether the day has been drawn once (a first loading card is the page, not news)
 * @property {import('../busy-card.js').BusyCard | null} busy
 */
/** The plate for an empty or failed day, or none. @param {StateParts} c @param {boolean} empty whether a ready day holds nothing @param {import('../strings.js').Strings} s */
export declare function drawPlate(c: StateParts, empty: boolean, s: import('../strings.js').Strings): void;
/** The loading card over the hours, the data table's own; it leaves the theme's way. @param {StateParts} c @param {import('../strings.js').Strings} s */
export declare function drawBusy(c: StateParts, s: import('../strings.js').Strings): void;
