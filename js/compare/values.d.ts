/** A compare slider. */
export declare const COMPARE = "[data-kp-compare]";
/** Fired on the slider when the divider moved by a person: `{ position }` (0 to 100). */
export declare const COMPARE_EVENT = "kp-compare-change";
/** What makes a pane live HTML: the panes stay usable and only the handle drags. */
export declare const INTERACTIVE = "a[href], button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"]), [contenteditable=\"true\"]";
/** Fired on the slider when the Retry of a failed image is pressed: `{ pane }` ('before' or 'after'). */
export declare const COMPARE_RETRY_EVENT = "kp-compare-retry";
/** The divider's ends. */
export declare const ALL_AFTER = 0;
export declare const ALL_BEFORE = 100;
/** A step of the arrow keys, with Shift, and of Page Up and Page Down. */
export declare const STEP = 1;
export declare const BIG_STEP = 10;
/** The divider starts here when the page names none. */
export declare const MIDDLE = 50;
/** A label steps aside while the divider is within this much of its side. */
export declare const LABEL_EDGE = 12;
/** One decimal of position is kept. */
export declare const TENTH = 10;
