import { OPTION_ATTRIBUTES } from './constants.js';
/** One option attribute's text, or ''. @param {HTMLElement} el @param {keyof typeof OPTION_ATTRIBUTES} name */
export declare const optionAttr: (el: HTMLElement, name: keyof typeof OPTION_ATTRIBUTES) => string;
/**
 * The Brussels calendar day of a moment as a sortable key, `2026-10-19`.
 * @param {number} ms @param {string} zone
 */
export declare const dayKey: (ms: number, zone: string) => string;
/**
 * The options of a feed as its attributes say now.
 * @param {HTMLElement} el
 */
export declare function feedOptions(el: HTMLElement): {
    group: string;
    time: string;
    actor: string;
    expand: string;
    unit: {
        one: string;
        many: string;
    };
    level: number;
};
