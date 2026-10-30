export { INTENT_MAX_SHOWN } from './intent/values.js';
export { intentTokens, intentWords, queryWords } from './intent/tokens.js';
export { startsWord, matchIntent } from './intent/match.js';
export { intentScore, intentRanges } from './intent/score.js';
export { rankCommands, noMatchText } from './intent/rank.js';
export type IntentOptions = {
    foldDiacritics?: boolean;
    splitHyphen?: boolean;
    typo?: 0 | 1 | boolean;
};
export type IntentItem = {
    /**
     * the words that are shown
     */
    label: string;
    /**
     * more words that are shown (a description); they weigh 1
     */
    hint?: string;
    /**
     * words that are never shown (synonyms); they weigh 1
     */
    words?: string;
};
export type IntentCommand = {
    id: string;
    /**
     * the section it is listed under
     */
    group?: string;
    label: string;
    hint?: string;
    words?: string;
    /**
     * the subject it is about, so the open subject's commands come first
     */
    context?: string;
    /**
     * shown before anything is typed
     */
    featured?: boolean;
};
export type RankOptions = {
    /**
     * the subject that is open now: its commands rank higher (+3) and show first
     */
    context?: string | null;
    /**
     * the most rows shown (default 40)
     */
    maxShown?: number;
    /**
     * the sections in the order they are shown (default: the order they first appear)
     */
    groupOrder?: readonly string[];
    /**
     * the ids of the commands run last, newest first: shown first when nothing is typed
     */
    recent?: readonly string[];
    foldDiacritics?: boolean;
    splitHyphen?: boolean;
    typo?: 0 | 1 | boolean;
};
/** @typedef {{ foldDiacritics?: boolean, splitHyphen?: boolean, typo?: 0 | 1 | boolean }} IntentOptions */
/**
 * @typedef {object} IntentItem
 * @property {string} label the words that are shown
 * @property {string} [hint] more words that are shown (a description); they weigh 1
 * @property {string} [words] words that are never shown (synonyms); they weigh 1
 */
/**
 * @typedef {object} IntentCommand
 * @property {string} id
 * @property {string} [group] the section it is listed under
 * @property {string} label
 * @property {string} [hint]
 * @property {string} [words]
 * @property {string} [context] the subject it is about, so the open subject's commands come first
 * @property {boolean} [featured] shown before anything is typed
 */
/**
 * @typedef {object} RankOptions
 * @property {string | null} [context] the subject that is open now: its commands rank higher (+3) and show first
 * @property {number} [maxShown] the most rows shown (default 40)
 * @property {readonly string[]} [groupOrder] the sections in the order they are shown (default: the order they first appear)
 * @property {readonly string[]} [recent] the ids of the commands run last, newest first: shown first when nothing is typed
 * @property {boolean} [foldDiacritics]
 * @property {boolean} [splitHyphen]
 * @property {0 | 1 | boolean} [typo]
 */
