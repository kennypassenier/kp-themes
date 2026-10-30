/** An activity feed. */
export declare const FEED = "[data-kp-feed]";
/** Fired on the host, bubbling, when Retry is pressed on the failed plate or "Read it again" on a stale feed. */
export declare const FEED_RETRY_EVENT = "kp-feed-retry";
/** Fired on the host, bubbling, when "Load earlier" (or its Try again) is pressed. The page answers with `earlier: 'loading'` and then the rows. */
export declare const FEED_EARLIER_EVENT = "kp-feed-earlier";
/** Fired on the host, bubbling, when a row opens or closes: `{ key, open }`. */
export declare const FEED_OPEN_EVENT = "kp-feed-open";
/** The states a row can be in. */
export declare const FEED_ROW_STATES: readonly ['ok', 'failed', 'warn', 'running', 'info'];
/** The states the feed can be in. */
export declare const FEED_STATES: readonly ['ready', 'loading', 'empty', 'error'];
/** The states of the "Load earlier" foot. */
export declare const FEED_EARLIER: readonly ['more', 'loading', 'error', 'end'];
/** The zone a day is counted in, whatever the reader's (rule 52); the same as js/freshness.js. */
export declare const FEED_TIME_ZONE = "Europe/Brussels";
/** Rows younger than this show the ago line (time `auto` and `clock`) [ms]. */
export declare const FEED_RELATIVE_MS: number;
/** How often the day headings and the ago-or-moment choice are looked at again [ms]. */
export declare const FEED_TICK_MS = 30000;
/** New rows are said at most this often [ms]. */
export declare const ANNOUNCE_GAP_MS = 10000;
/** One hour in milliseconds, for finding yesterday. */
export declare const HOUR_MS = 3600000;
/** Hours back that are tried to land on yesterday's calendar day, whatever the clock change (a day is 23, 24 or 25 hours long). */
export declare const YESTERDAY_PROBES_H: number[];
/** The heading level of a day heading when `data-kp-feed-level` says nothing usable; and the levels that exist. */
export declare const DEFAULT_DAY_LEVEL = 3;
export declare const MIN_DAY_LEVEL = 1;
export declare const MAX_DAY_LEVEL = 6;
/** The skeleton's geometry: days, rows per day. */
export declare const SKELETON_DAYS = 2;
export declare const SKELETON_ROWS = 4;
/** The characters of a clock time `HH:mm` start at this index in `dd/mm/yyyy HH:mm`; the date is the first ten. */
export declare const MOMENT_CLOCK_AT = 11;
export declare const MOMENT_DATE_LENGTH = 10;
/** The attributes that are options, by the short name the module reads them under; a change of one redraws the feed. */
export declare const OPTION_ATTRIBUTES: {
    readonly group: 'data-kp-feed-group';
    readonly summary: 'data-kp-feed-summary';
    readonly unit: 'data-kp-feed-unit';
    readonly time: 'data-kp-feed-time';
    readonly actor: 'data-kp-feed-actor';
    readonly expand: 'data-kp-feed-expand';
    readonly rail: 'data-kp-feed-rail';
    readonly head: 'data-kp-feed-head';
    readonly max: 'data-kp-feed-max';
    readonly level: 'data-kp-feed-level';
};
/** The option attribute names, for the observer's filter. */
export declare const OPTIONS: ("data-kp-feed-actor" | "data-kp-feed-expand" | "data-kp-feed-group" | "data-kp-feed-head" | "data-kp-feed-level" | "data-kp-feed-max" | "data-kp-feed-rail" | "data-kp-feed-summary" | "data-kp-feed-time" | "data-kp-feed-unit")[];
export type FeedRowState = 'ok' | 'failed' | 'warn' | 'running' | 'info';
export type FeedActor = {
    /**
     * who or what started it ("Claude", "Kenny", "nightly round")
     */
    name: string;
    /**
     * `person` and `agent` get a round chip; anything else (a schedule, the system) a square one
     */
    kind?: string;
};
export type FeedRow = {
    /**
     * stable id: the same key is the same row on every refresh
     */
    key: string;
    /**
     * what happened, in one line
     */
    title: string;
    /**
     * when, ms since the epoch
     */
    at: number;
    /**
     * its outcome; a row without one has an empty mark
     */
    state?: FeedRowState;
    actor?: FeedActor;
    /**
     * the muted line under the title
     */
    detail?: string;
    /**
     * where the title goes
     */
    href?: string;
    /**
     * lines that open under the row (a log excerpt); the title becomes the disclosure button
     */
    more?: string[];
};
export type FeedStale = {
    /**
     * why the refresh failed, in plain words
     */
    reason: string;
    /**
     * when the rows on screen were read
     */
    since?: number;
};
export type FeedModel = {
    state?: 'ready' | 'loading' | 'empty' | 'error';
    rows?: FeedRow[];
    /**
     * how many rows there are in all (exact); default the number given
     */
    total?: number;
    /**
     * the "Load earlier" foot
     */
    earlier?: 'more' | 'loading' | 'error' | 'end';
    /**
     * when the feed was read last, for the freshness line
     */
    updatedAt?: number;
    stale?: FeedStale | null;
    /**
     * why it could not be read (the failed plate's sentence)
     */
    error?: string;
    /**
     * why there is nothing (the empty plate's sentence)
     */
    emptyText?: string;
};
export type FeedHandle = {
    element: HTMLElement;
    set: (model: FeedModel) => void;
    /**
     * the keys of the rows that are open
     */
    openKeys: () => string[];
    /**
     * open exactly these rows (or every row that has lines), close the rest; fires no event
     */
    setOpen: (keys: readonly string[] | 'all') => void;
    /**
     * draw again, with the options as they stand now
     */
    render: () => void;
};
/**
 * @typedef {'ok' | 'failed' | 'warn' | 'running' | 'info'} FeedRowState
 * @typedef {object} FeedActor
 * @property {string} name who or what started it ("Claude", "Kenny", "nightly round")
 * @property {string} [kind] `person` and `agent` get a round chip; anything else (a schedule, the system) a square one
 * @typedef {object} FeedRow
 * @property {string} key stable id: the same key is the same row on every refresh
 * @property {string} title what happened, in one line
 * @property {number} at when, ms since the epoch
 * @property {FeedRowState} [state] its outcome; a row without one has an empty mark
 * @property {FeedActor} [actor]
 * @property {string} [detail] the muted line under the title
 * @property {string} [href] where the title goes
 * @property {string[]} [more] lines that open under the row (a log excerpt); the title becomes the disclosure button
 * @typedef {object} FeedStale
 * @property {string} reason why the refresh failed, in plain words
 * @property {number} [since] when the rows on screen were read
 * @typedef {object} FeedModel
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]
 * @property {FeedRow[]} [rows]
 * @property {number} [total] how many rows there are in all (exact); default the number given
 * @property {'more' | 'loading' | 'error' | 'end'} [earlier] the "Load earlier" foot
 * @property {number} [updatedAt] when the feed was read last, for the freshness line
 * @property {FeedStale | null} [stale]
 * @property {string} [error] why it could not be read (the failed plate's sentence)
 * @property {string} [emptyText] why there is nothing (the empty plate's sentence)
 * @typedef {object} FeedHandle
 * @property {HTMLElement} element
 * @property {(model: FeedModel) => void} set
 * @property {() => string[]} openKeys the keys of the rows that are open
 * @property {(keys: readonly string[] | 'all') => void} setOpen open exactly these rows (or every row that has lines), close the rest; fires no event
 * @property {() => void} render draw again, with the options as they stand now
 */
