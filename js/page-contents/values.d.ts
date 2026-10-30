/** The lists this module looks after. */
export declare const CONTENTS = "[data-kp-contents]";
/** Fired on the list, bubbling, when the current entry changes: `{ id, label, previous }`. */
export declare const CONTENTS_EVENT = "kp-contents-change";
/** The offset line, in px from the top of the window, when `data-kp-contents-offset` does not say. */
export declare const DEFAULT_OFFSET_PX = 80;
/** The fewest entries that earn a list, when `data-kp-contents-min` does not say. */
export declare const DEFAULT_MIN_ENTRIES = 2;
/** The headings that count, when `data-kp-contents-headings` does not say. */
export declare const DEFAULT_HEADINGS = "h2";
/** How many bars the loading state draws. */
export declare const WAIT_BARS = 3;
/** How close to the foot of a box counts as its foot, in px. */
export declare const END_SLACK_PX = 2;
/** The part of a pane's height a section's top may sit below the box's top edge, at most (offset is capped at a quarter). */
export declare const PANE_OFFSET_FRACTION = 4;
/** The attributes of the list whose change redraws it. */
export declare const OPTION_ATTRIBUTES: string[];
/** The attributes of the page whose change redraws the list. */
export declare const PAGE_ATTRIBUTES: string[];
