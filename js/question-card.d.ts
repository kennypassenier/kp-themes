export { QUESTIONS, QUESTION_ANSWER_EVENT, QUESTION_EXPIRE_EVENT, QUESTION_DISMISS_EVENT, QUESTION_URGENT_AT } from './question-card/values.js';
export type QuestionAnswer = {
    value: string;
    label: string;
    /**
     * what this answer sets in motion
     */
    consequence?: string;
    /**
     * what the card says once it is chosen and sent
     */
    outcome?: string;
    /**
     * a destructive answer is drawn as one
     */
    tone?: 'destructive' | 'primary' | '';
};
export type QuestionSpec = {
    id: string;
    question: string;
    text?: string;
    /**
     * ISO or epoch ms
     */
    deadline: number | string;
    asked?: number | string;
    /**
     * default: Allow and Stop
     */
    answers?: QuestionAnswer[];
    defaultAnswer?: string;
    urgentAt?: number;
    expired?: 'keep' | 'remove';
    countdown?: 'bar' | 'ring' | 'text';
};
export type QuestionHandle = {
    element: HTMLElement;
    id: string;
    state: () => string;
    /**
     * choose an answer as if the person had
     */
    answer: (value: string) => void;
    dismiss: () => void;
};
/**
 * @typedef {object} QuestionAnswer
 * @property {string} value
 * @property {string} label
 * @property {string} [consequence] what this answer sets in motion
 * @property {string} [outcome] what the card says once it is chosen and sent
 * @property {'destructive' | 'primary' | ''} [tone] a destructive answer is drawn as one
 * @typedef {object} QuestionSpec
 * @property {string} id
 * @property {string} question
 * @property {string} [text]
 * @property {number | string} deadline ISO or epoch ms
 * @property {number | string} [asked]
 * @property {QuestionAnswer[]} [answers] default: Allow and Stop
 * @property {string} [defaultAnswer]
 * @property {number} [urgentAt]
 * @property {'keep' | 'remove'} [expired]
 * @property {'bar' | 'ring' | 'text'} [countdown]
 * @typedef {object} QuestionHandle
 * @property {HTMLElement} element
 * @property {string} id
 * @property {() => string} state
 * @property {(value: string) => void} answer choose an answer as if the person had
 * @property {() => void} dismiss
 */
/**
 * The handle of a card.
 * @param {Element} element
 * @returns {(QuestionHandle & { stop: () => void }) | null}
 */
export declare function questionOf(element: Element): (QuestionHandle & {
    stop: () => void;
}) | null;
/**
 * Ask a question: put a card in `container` (oldest first).
 * @param {HTMLElement} container a `[data-kp-questions]` (or any element)
 * @param {QuestionSpec} spec
 * @param {{ now?: () => number, frozen?: boolean }} [options] `now` is the clock; `frozen` stops the countdown's motion and its tick (a still demonstration)
 * @returns {QuestionHandle}
 */
export declare function askQuestion(container: HTMLElement, spec: QuestionSpec, { now, frozen }?: {
    now?: () => number;
    frozen?: boolean;
}): QuestionHandle;
/**
 * Make every `[data-kp-questions]` container a labelled region; the cards are made with askQuestion().
 * @param {ParentNode} [root]
 * @returns {() => void} detach: stops every card's clock
 */
export declare function attachQuestions(root?: ParentNode): () => void;
