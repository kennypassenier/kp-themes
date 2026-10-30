/**
 * Wire every quote card and quote list under `root`.
 * @param {ParentNode} [root]
 * @param {import('./constants.js').QuoteOptions} [options] defaults; each card's own `data-kp-quote-*` wins
 * @returns {() => void} detach
 */
export declare function attachQuotes(root?: ParentNode, options?: import('./constants.js').QuoteOptions): () => void;
/**
 * Write a quote's words and options from a script. The card is attached if it is not yet.
 * @param {HTMLElement} el a `figure.kp-quote`
 * @param {import('./constants.js').QuoteSpec} spec
 */
export declare function setQuote(el: HTMLElement, spec: import('./constants.js').QuoteSpec): void;
/**
 * The state of a quote card: `loading` (the card's busy card over a quote-shaped stage), `empty`, `error` (with Retry,
 * `kp-quote-retry`), `ready`.
 * @param {HTMLElement} el
 * @param {'ready' | 'loading' | 'empty' | 'error'} state
 * @param {{ title?: string, text?: string, words?: string }} [words] the words of the state, instead of the dictionary's
 */
export declare function setQuoteState(el: HTMLElement, state: 'ready' | 'loading' | 'empty' | 'error', words?: {
    title?: string;
    text?: string;
    words?: string;
}): void;
/**
 * The handle of an attached quote card.
 * @param {Element} element
 * @returns {import('./constants.js').QuoteHandle | null}
 */
export declare function quote(element: Element): import('./constants.js').QuoteHandle | null;
