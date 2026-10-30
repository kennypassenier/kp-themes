/** A snooze picker. */
export declare const SNOOZE = "[data-kp-snooze]";
/** Fired on the picker when a choice is made: `{ until, choice }`. */
export declare const SNOOZE_EVENT = "kp-snooze";
/** Fired on the picker when End snooze is pressed. */
export declare const SNOOZE_END_EVENT = "kp-snooze-end";
/** The choices a picker offers when it does not say. */
export declare const SNOOZE_CHOICES: string[];
export declare const MINUTE = 60000;
/** @param {number} n */
export declare const two: (n: number) => string;
/**
 * "09:00" as hour and minute; null when it is not a time of day.
 * @param {string | undefined} text @param {string} fallback
 */
export declare function clock(text: string | undefined, fallback: string): {
    hour: number;
    minute: number;
};
/**
 * Name a set of words a picker can choose with `data-kp-snooze-words="<name>"`: any of the dictionary's `snooze…` words. The page that uses
 * the picker as a pause says "Pause until…" and "Resume now" in its pickers and the page that uses it as a reminder keeps "Remind me later",
 * with no `setStrings()` on mount and none on unmount [wish-1120, homelab 125].
 * @param {string} name
 * @param {Partial<import('../strings.js').Strings>} words
 */
export declare function registerSnoozeWords(name: string, words: Partial<import('../strings.js').Strings>): void;
/**
 * The words one picker speaks: the dictionary's, over them the set its `data-kp-snooze-words` names, over them its own attributes
 * (`data-kp-snooze-trigger`, `-change`, `-none`, `-end`, `-apply`, `-saving`, and `-until` with `{when}` for the moment) [wish-1120, homelab 125].
 * @param {Element} el
 * @returns {import('../strings.js').Strings}
 */
export declare function snoozeWords(el: Element): import('../strings.js').Strings;
export type SnoozeChoice = {
    /**
     * `1h`, `tonight`, `last`, `pick` …
     */
    key: string;
    /**
     * the choice in words
     */
    label: string;
    /**
     * the moment it resolves to (ms); null for `pick`
     */
    at: number | null;
    /**
     * the moment in words, "Sun 18/10/2026 09:00 · in 18 h 55 min"
     */
    hint: string;
    /**
     * the moment alone, "Sun 18/10/2026 09:00" (a chip has room for no more)
     */
    moment: string;
};
export type SnoozeRules = {
    /**
     * ms
     */
    now: number;
    choices?: string[];
    /**
     * HH:MM
     */
    morning?: string;
    /**
     * HH:MM
     */
    evening?: string;
    /**
     * a length: 7d
     */
    max?: string;
    zone?: string;
    /**
     * the last custom moment, ms
     */
    last?: number | null;
    locale?: string;
    /**
     * the words (a picker's own set, see snoozeWords()); the dictionary's when absent
     */
    strings?: import('../strings.js').Strings;
};
/**
 * @typedef {object} SnoozeChoice
 * @property {string} key `1h`, `tonight`, `last`, `pick` …
 * @property {string} label the choice in words
 * @property {number | null} at the moment it resolves to (ms); null for `pick`
 * @property {string} hint the moment in words, "Sun 18/10/2026 09:00 · in 18 h 55 min"
 * @property {string} moment the moment alone, "Sun 18/10/2026 09:00" (a chip has room for no more)
 *
 * @typedef {object} SnoozeRules
 * @property {number} now ms
 * @property {string[]} [choices]
 * @property {string} [morning] HH:MM
 * @property {string} [evening] HH:MM
 * @property {string} [max] a length: 7d
 * @property {string} [zone]
 * @property {number | null} [last] the last custom moment, ms
 * @property {string} [locale]
 * @property {import('../strings.js').Strings} [strings] the words (a picker's own set, see snoozeWords()); the dictionary's when absent
 */
/**
 * The wall-clock moment `days` after today at a time of day in a zone. Pure.
 * @param {number} now @param {number} days @param {{ hour: number, minute: number }} at @param {string} zone
 * @returns {number | null}
 */
export declare function dayAt(now: number, days: number, at: {
    hour: number;
    minute: number;
}, zone: string): number | null;
/**
 * What a picker offers at a moment: each choice with the exact time it resolves to. A choice that has passed or lies
 * past `max` is left out; `pick` carries no moment. Pure, so a test or a server can ask the same.
 * @param {SnoozeRules} rules
 * @returns {SnoozeChoice[]}
 */
export declare function snoozeChoices({ now, choices, morning, evening, max, zone, last, locale, strings, }: SnoozeRules): SnoozeChoice[];
