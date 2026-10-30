export { CARD_STATE, CARD_STATES, CARD_STATE_EVENT, CARD_RETRY_EVENT } from './card-state/values.js';
export { setCardState } from './card-state/sync.js';
export type CardState = 'loading' | 'empty' | 'error' | 'ready';
export type CardStateOptions = {
    /**
     * what the loading card says under its spinner (default `cardLoading`, or the card's `data-kp-loading-words`)
     */
    words?: string;
    /**
     * the empty or error note's first line, in bold: "No appointments yet", "Could not list the files"
     */
    title?: string;
    /**
     * its sentence: why, or what fills it
     */
    text?: string;
    /**
     * a button or link under an empty note ("Add an appointment"), or several (an array, or a fragment): they lie on the plate's own action row; an error note always has Try again
     */
    action?: Node | readonly Node[] | null;
    /**
     * false leaves Try again out of an error note (a read the page cannot repeat)
     */
    retry?: boolean;
    /**
     * a picture over the note's title, empty or error: a node (an inline SVG, an icon) or a glyph; aria-hidden either way
     */
    art?: Node | string | null;
};
/**
 * @typedef {'loading' | 'empty' | 'error' | 'ready'} CardState
 * @typedef {object} CardStateOptions
 * @property {string} [words] what the loading card says under its spinner (default `cardLoading`, or the card's `data-kp-loading-words`)
 * @property {string} [title] the empty or error note's first line, in bold: "No appointments yet", "Could not list the files"
 * @property {string} [text] its sentence: why, or what fills it
 * @property {Node | readonly Node[] | null} [action] a button or link under an empty note ("Add an appointment"), or several (an array, or a fragment): they lie on the plate's own action row; an error note always has Try again
 * @property {boolean} [retry] false leaves Try again out of an error note (a read the page cannot repeat)
 * @property {Node | string | null} [art] a picture over the note's title, empty or error: a node (an inline SVG, an icon) or a glyph; aria-hidden either way
 */
/**
 * Sync every card with a `data-kp-state` under `root`, follow the attribute
 * later, and turn a press on Try again into `kp-card-retry`. A card rendered
 * after this ran is attached by calling it on that subtree.
 * @param {ParentNode} [root]
 * @returns {() => void} detach: stops following; a loading card's busy card is taken out
 */
export declare function attachCardStates(root?: ParentNode): () => void;
