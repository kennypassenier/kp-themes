export type FocusAnswer = import('./constants.js').FocusAnswer;
export type FocusChoice = import('./constants.js').FocusChoice;
export type FocusStep = import('./constants.js').FocusStep;
/** @typedef {import('./constants.js').FocusAnswer} FocusAnswer */
/** @typedef {import('./constants.js').FocusChoice} FocusChoice */
/** @typedef {import('./constants.js').FocusStep} FocusStep */
/**
 * Draw one question's answers under its text.
 * @param {HTMLElement} root @param {HTMLElement} holder @param {FocusStep} step @param {HTMLElement} text
 */
export declare function buildAnswer(root: HTMLElement, holder: HTMLElement, step: FocusStep, text: HTMLElement): void;
/** The summary after the last question: each question and what was answered. @param {HTMLElement} root @param {HTMLElement} holder */
export declare function buildSummary(root: HTMLElement, holder: HTMLElement): void;
