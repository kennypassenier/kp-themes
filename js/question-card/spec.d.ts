export type QuestionSpec = import('../question-card.js').QuestionSpec;
export type QuestionAnswer = import('../question-card.js').QuestionAnswer;
/** @typedef {import('../question-card.js').QuestionSpec} QuestionSpec */
/** @typedef {import('../question-card.js').QuestionAnswer} QuestionAnswer */
/** @param {number | string | undefined} value @returns {number | null} */
export declare const toMs: (value: number | string | undefined) => number | null;
export type ResolvedQuestion = {
    /**
     * ms
     */
    deadline: number;
    /**
     * ms
     */
    asked: number;
    /**
     * ms before the end from which the card is urgent
     */
    urgentAt: number;
    answers: QuestionAnswer[];
    countdown: 'bar' | 'ring' | 'text';
    expiredMode: 'keep' | 'remove';
    /**
     * the answer that happens at zero
     */
    fallback: QuestionAnswer | undefined;
};
/**
 * @typedef {object} ResolvedQuestion
 * @property {number} deadline ms
 * @property {number} asked ms
 * @property {number} urgentAt ms before the end from which the card is urgent
 * @property {QuestionAnswer[]} answers
 * @property {'bar' | 'ring' | 'text'} countdown
 * @property {'keep' | 'remove'} expiredMode
 * @property {QuestionAnswer | undefined} fallback the answer that happens at zero
 */
/**
 * @param {QuestionSpec} spec
 * @param {() => number} now
 * @returns {ResolvedQuestion}
 */
export declare function resolveQuestion(spec: QuestionSpec, now: () => number): ResolvedQuestion;
