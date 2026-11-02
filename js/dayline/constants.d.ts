/** A day timeline: `.kp-dayline[data-kp-dayline]`. */
export declare const DAYLINE = "[data-kp-dayline]";
/** The hour the day starts at, 0 to 23 (default 0); the day runs down to the same hour the next morning. */
export declare const START_ATTRIBUTE = "data-kp-start-hour";
/** The minutes of one step: the rows of the grid and every move (default 15). */
export declare const STEP_ATTRIBUTE = "data-kp-step";
/** How many hours the day shows from its start (default 24). */
export declare const HOURS_ATTRIBUTE = "data-kp-dayline-hours";
/** A frozen clock, `HH:MM`, for a page whose clock is not the visitor's (a demo, a test); else the `now` option or the clock. */
export declare const NOW_ATTRIBUTE = "data-kp-dayline-now";
/** An element beside the day whose item can be dropped onto an hour: its value is the item's id. */
export declare const SOURCE_ATTRIBUTE = "data-kp-dayline-source";
/** On a source: the id of the one day timeline it may be dropped on; any day timeline when absent. */
export declare const SOURCE_FOR_ATTRIBUTE = "data-kp-dayline-for";
/** Fired on the day timeline, bubbling, when a person moved an item: `{ id, start, from, source }`, times as `HH:MM`. */
export declare const DAYLINE_CHANGE_EVENT = "kp-dayline-change";
/** Fired on the day timeline, bubbling, when an item's body is pressed: `{ id, source }`. */
export declare const DAYLINE_OPEN_EVENT = "kp-dayline-open";
/** Fired on the day timeline, bubbling, when an element from beside it was dropped on an hour: `{ id, start }`. */
export declare const DAYLINE_DROP_EVENT = "kp-dayline-drop";
/** Fired on the day timeline, bubbling, when Try again is pressed on its failed plate. */
export declare const DAYLINE_RETRY_EVENT = "kp-dayline-retry";
/** The data type a source carries while it is dragged. */
export declare const DRAG_TYPE = "application/x-kp-dayline";
/** Minutes in a day. */
export declare const DAY_MINUTES = 1440;
/** The step when the markup names none or a bad one [minutes]. */
export declare const DEFAULT_STEP = 15;
/** The shortest block drawn [minutes]: a 15-minute item still has room for its words. */
export declare const MIN_DRAWN_MINUTES = 30;
/** How often the now line moves [ms]. */
export declare const NOW_TICK_MS = 60000;
/** Where the now line stands in the box after the first draw: a quarter from the top, so the next hours show. */
export declare const NOW_VIEW_SHARE = 0.25;
/** A keyboard walk is one change once the keys rest this long [ms]. */
export declare const SETTLE_MS = 700;
/** Pixels a press on the handle travels before it is a drag. */
export declare const DRAG_THRESHOLD_PX = 4;
export type DaylineItem = {
    id: string;
    label: string;
    /**
     * `HH:MM`; an item without one (or with `allDay`) stands in the all-day strip
     */
    start?: string;
    /**
     * how long it takes; its block is as long (default the step, drawn at least 30 minutes)
     */
    minutes?: number;
    /**
     * `primary` (default), `success`, `warning`, `destructive`, `info`, `muted`, or 1 to 12 (a
     * categorical colour, `--kp-cat-N`)
     */
    tone?: string | number;
    /**
     * struck through and quiet
     */
    done?: boolean;
    /**
     * cannot be moved or opened: dashed, no handle, shares the lanes so a clash shows
     */
    readonly?: boolean;
    /**
     * stands in the strip above the hours
     */
    allDay?: boolean;
};
export type Placed = {
    item: DaylineItem;
    at: number;
    minutes: number;
    row: number;
    rows: number;
    lane: number;
    lanes: number;
};
export type DaylineState = 'loading' | 'ready' | 'empty' | 'error';
/**
 * One item of the day.
 * @typedef {object} DaylineItem
 * @property {string} id
 * @property {string} label
 * @property {string} [start] `HH:MM`; an item without one (or with `allDay`) stands in the all-day strip
 * @property {number} [minutes] how long it takes; its block is as long (default the step, drawn at least 30 minutes)
 * @property {string | number} [tone] `primary` (default), `success`, `warning`, `destructive`, `info`, `muted`, or 1 to 12 (a
 *   categorical colour, `--kp-cat-N`)
 * @property {boolean} [done] struck through and quiet
 * @property {boolean} [readonly] cannot be moved or opened: dashed, no handle, shares the lanes so a clash shows
 * @property {boolean} [allDay] stands in the strip above the hours
 */
/**
 * An item placed on the grid: its first row, its rows, and its lane among the items it overlaps.
 * @typedef {{ item: DaylineItem, at: number, minutes: number, row: number, rows: number, lane: number, lanes: number }} Placed
 */
/** @typedef {'loading' | 'ready' | 'empty' | 'error'} DaylineState */
