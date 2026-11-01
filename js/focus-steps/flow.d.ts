export type FocusAnswer = import('./constants.js').FocusAnswer;
export type FocusChoice = import('./constants.js').FocusChoice;
export type FocusStep = import('./constants.js').FocusStep;
/** @typedef {import('./constants.js').FocusAnswer} FocusAnswer */
/** @typedef {import('./constants.js').FocusChoice} FocusChoice */
/** @typedef {import('./constants.js').FocusStep} FocusStep */
/**
 * Take an answer: the cancelable event first, then the record, the memory, the event and a sentence.
 * @param {HTMLElement} root @param {string | string[] | null} value @param {'tap' | 'same' | 'skip'} source @param {Record<string, unknown>} [extra]
 * @returns {boolean} whether it was taken
 */
export declare function takeAnswer(root: HTMLElement, value: string | string[] | null, source: 'tap' | 'same' | 'skip', extra?: Record<string, unknown>): boolean;
/**
 * The next button's work, also what an automatic advance does: the next step, the summary, or Done.
 * @param {HTMLElement} root
 */
export declare function goNext(root: HTMLElement): void;
/**
 * A press on an answer button, a "same" button or Not today.
 * @param {HTMLElement} root @param {HTMLElement} button
 * @returns {boolean} whether it was one of them
 */
export declare function pressAnswer(root: HTMLElement, button: HTMLElement): boolean;
/** The marks and the Next button of the question shown, without redrawing it (the focus stays where it is). @param {HTMLElement} root */
export declare function paintAnswerState(root: HTMLElement): void;
/** @param {Element} root @param {string} message */
export declare function say(root: Element, message: string): void;
