/** A board: `section.kp-board[data-kp-board]`. */
export declare const BOARD = "[data-kp-board]";
/** A lane of a board, a direct child the page gives: `[data-kp-board-lane="<key>"]`. */
export declare const LANE = "[data-kp-board-lane]";
/** Fired on the board, bubbling, when Try again is pressed on its failed plate. */
export declare const BOARD_RETRY_EVENT = "kp-board-retry";
/** Fired on the board, bubbling, when a narrow board's switcher shows another lane: `{ lane, source }`. */
export declare const BOARD_LANE_EVENT = "kp-board-lane";
/** What a "Move to" entry of a card's menu reports as its value, before the lane's key [uxtouch1101]. */
export declare const MOVE_PREFIX = "kp-board-move:";
/** Under this many rem of its own width a board is narrow: one lane under a switcher (default), or the lanes scroll sideways. */
export declare const NARROW_REM = 40;
/** The root font size when the document gives none it can read [px]. */
export declare const FALLBACK_REM_PX = 16;
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {Document} doc @param {K} tag @param {string} [className] @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className?: string, text?: string) => HTMLElementTagNameMap[K];
/** The items of a lane's list: its children that carry `data-kp-item`. @param {HTMLElement} list */
export declare const itemsOf: (list: HTMLElement) => Element[];
/** A lane's limit: `data-kp-board-limit`, 0 when it has none. @param {HTMLElement} lane */
export declare const limitOf: (lane: HTMLElement) => number;
