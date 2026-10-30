export type FocusAnswer = import('./constants.js').FocusAnswer;
/** @typedef {import('./constants.js').FocusAnswer} FocusAnswer */
/** The question over a step when the person stopped here before: carry on or start again [gaps-time-1019: cook mode too]. */
export declare function buildResumeAsk(): HTMLElement;
/** The words of the empty plate's action, or none: `data-kp-focus-steps-empty-action` [gaps-time-1019]. @param {Element} root */
export declare const emptyAction: (root: Element) => string;
/** @param {Element} root @param {string} name @param {string} [fallback] */
export declare const opt: (root: Element, name: string, fallback?: string) => string | undefined;
/** Whether this view is asking questions: its mode, or any step that carries an answer. @param {Element} root */
export declare function answering(root: Element): boolean;
/** @param {Element} root */
export declare const summaryOn: (root: Element) => boolean;
/** The last index a person can stand on: the last step, or the summary after it. @param {Element} root */
export declare const lastIndex: (root: Element) => number;
/** @param {Element} root */
export declare const onSummary: (root: Element) => boolean;
/** The words of a value in a step's choices. @param {FocusAnswer} answer @param {string | string[] | null | undefined} value */
export declare function wordsOf(answer: FocusAnswer, value: string | string[] | null | undefined): string;
/** What has been answered on the step now, in the answer's own shape. @param {Element} root @param {FocusAnswer} answer */
export declare function currentValue(root: Element, answer: FocusAnswer): string | string[] | null;
/** Whether Next may be pressed on a question: it is answered, or has something ready to be. @param {Element} root @param {FocusAnswer} answer */
export declare function answerReady(root: Element, answer: FocusAnswer): boolean;
