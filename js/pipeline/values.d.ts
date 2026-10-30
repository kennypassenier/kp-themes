/** A board: `section.kp-pipeline[data-kp-pipeline]`. */
export declare const PIPELINE = "[data-kp-pipeline]";
/** Fired on the board, bubbling, when a card is opened: `{ id, card, source: 'pointer' | 'keyboard' }`. */
export declare const PIPELINE_OPEN_EVENT = "kp-pipeline-open";
/** Fired on the board, bubbling, when Try again is pressed. */
export declare const PIPELINE_RETRY_EVENT = "kp-pipeline-retry";
/** Fired on the board, bubbling, when a lane shows more or fewer: `{ lane, open }`. */
export declare const PIPELINE_MORE_EVENT = "kp-pipeline-more";
/** How many placeholder cards a loading lane shows: a lane on the board, and the closed lane under it. */
export declare const GHOST_CARDS = 2;
export declare const GHOST_CARDS_CLOSED = 3;
/** The share of a lane is whole percent of this. */
export declare const PERCENT = 100;
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {Document} doc @param {K} tag @param {string} [className] @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className?: string, text?: string) => HTMLElementTagNameMap[K];
