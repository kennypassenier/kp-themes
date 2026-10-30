export type ResolvedQuestion = import('./spec.js').ResolvedQuestion;
export type CardParts = {
    card: HTMLElement;
    /**
     * the time left, in words
     */
    left: HTMLElement;
    /**
     * by answer value
     */
    buttons: Map<string, HTMLButtonElement>;
    outcome: HTMLElement;
    dismiss: HTMLButtonElement;
    /**
     * a hidden status that speaks
     */
    voice: HTMLElement;
};
/**
 * Build a question card.
 * @param {Document} doc
 * @param {import('../question-card.js').QuestionSpec} spec
 * @param {ResolvedQuestion} q
 * @returns {CardParts}
 */
export declare function buildCard(doc: Document, spec: import('../question-card.js').QuestionSpec, q: ResolvedQuestion): CardParts;
