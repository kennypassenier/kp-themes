export { SENTENCE, SENTENCE_EVENT, setSentenceComputed, sentenceSummary, setSentenceInvalid, setSentenceWhy, setSentenceFieldState, } from './sentence/fields.js';
export type SentenceHandle = {
    element: HTMLElement;
    /**
     * the line under the sentence
     */
    line: HTMLElement;
    /**
     * the sentence in words
     */
    summary: () => string;
    /**
     * show and hide the phrases, work the computed fields out again and place the fields
     */
    refresh: () => void;
    /**
     * set (or with null, drop) the function behind a computed field
     */
    compute: (name: string, fn: ComputedFn | null) => void;
};
export type ComputedFn = (values: Record<string, string | null>, element: Element) => string | number | null | undefined;
/**
 * @typedef {object} SentenceHandle
 * @property {HTMLElement} element
 * @property {HTMLElement} line the line under the sentence
 * @property {() => string} summary the sentence in words
 * @property {() => void} refresh show and hide the phrases, work the computed fields out again and place the fields
 * @property {(name: string, fn: ComputedFn | null) => void} compute set (or with null, drop) the function behind a computed field
 */
/**
 * @callback ComputedFn
 * @param {Record<string, string | null>} values the value of every named control
 * @param {Element} element the sentence
 * @returns {string | number | null | undefined}
 */
/** The handle of an attached sentence. @param {Element} element @returns {SentenceHandle | null} */
export declare function sentence(element: Element): SentenceHandle | null;
/**
 * Wire every sentence form under `root`.
 * @param {ParentNode} [root]
 * @param {{ computed?: Record<string, ComputedFn> }} [options] the functions behind the computed fields, by `data-kp-sentence-computed`
 * @returns {() => void} detach
 */
export declare function attachSentences(root?: ParentNode, { computed }?: {
    computed?: Record<string, ComputedFn>;
}): () => void;
