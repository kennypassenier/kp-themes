/** The scrollers this module looks after. */
export declare const FOLLOW = "[data-kp-follow]";
/** Fired on the scroller when following starts or stops, or the count changes: `{ following, paused, unseen }`. */
export declare const FOLLOW_EVENT = "kp-follow-change";
/** Fired on the scroller when the pill is pressed: `{ unseen }`. */
export declare const NEWPILL_JUMP_EVENT = "kp-newpill-jump";
/** px from the end that still count as following. */
export declare const FOLLOW_THRESHOLD = 24;
/** How often a screen reader hears the count [ms]. */
export declare const NEWPILL_SAY_MS = 10000;
/** The longest the pill's leaving animation may take before it is taken out anyway [ms]. */
export declare const LEAVE_FALLBACK_MS = 700;
/** The columns the "new since" divider of a table spans: more than any table has. */
export declare const DIVIDER_COLSPAN = 99;
/** On the scroller: the key that jumps back and follows again (a key spec, js/key-spec.js, or a named key such as `End`; `none` for no key). */
export declare const NEWPILL_FOLLOW_KEY_ATTRIBUTE = "data-kp-follow-key";
/** The key that jumps back to the end and follows again when the scroller names none. */
export declare const NEWPILL_FOLLOW_KEY = "End";
/** The same key for a scroller that follows its head (`data-kp-follow="head"`). */
export declare const NEWPILL_FOLLOW_HEAD_KEY = "Home";
