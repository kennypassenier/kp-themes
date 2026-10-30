/** The most rows a list shows at once; the rest wait for more words (homelab's tested value). */
export declare const INTENT_MAX_SHOWN = 40;
/** What a typed word found in the label adds to an item's score. */
export declare const LABEL_WEIGHT = 4;
/** What a typed word found only in the hint or the hidden words adds. */
export declare const HINT_WEIGHT = 1;
/** What an exact word adds on top of a label hit. */
export declare const EXACT_BONUS = 1;
/** What the first typed word starting the label's first word adds on top of a label hit. */
export declare const FIRST_WORD_BONUS = 2;
/** What a command about the open subject adds. */
export declare const CONTEXT_BONUS = 3;
/** What a command run last adds when nothing is typed. */
export declare const RECENT_BONUS = 2;
/** The shortest typed word that may be one letter off (so "read" does not find "Report"). */
export declare const TYPO_MIN_LENGTH = 4;
/** A word of a text: letters, digits, dots and hyphens. */
export declare const WORD: RegExp;
