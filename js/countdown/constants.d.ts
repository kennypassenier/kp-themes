/** A countdown: the length, or only the moment it counts down to (the documented `-until` markup). */
export declare const COUNTDOWN = "[data-kp-countdown], [data-kp-countdown-until]";
/** Fired on the timer when it starts, pauses, resets or gains time: `{ state, remaining, total }` (ms). */
export declare const COUNTDOWN_EVENT = "kp-countdown-change";
/** Fired on the timer when its time is up: `{ total }` (ms). */
export declare const COUNTDOWN_END_EVENT = "kp-countdown-end";
/** How much "a minute more" adds, in seconds, when the timer does not say (`data-kp-countdown-step`). */
export declare const COUNTDOWN_STEP = 60;
/** Milliseconds in a second and in a minute. */
export declare const SECOND_MS = 1000;
export declare const MINUTE_MS = 60000;
/** Seconds in a minute, an hour and a day. */
export declare const MINUTE_S = 60;
export declare const HOUR_S = 3600;
export declare const DAY_S = 86400;
/** Milliseconds an hour holds: a timer from this length on shows hours. */
export declare const HOUR_MS = 3600000;
/** Hours in a day. */
export declare const DAY_HOURS = 24;
/** A value of this many digits or more is epoch milliseconds, not a clock time. */
export declare const EPOCH_MS_DIGITS = 10;
/** Slack added to the end timer so it fires just after the end moment, never just before [ms]. */
export declare const END_SLACK_MS = 5;
/** Taken off the seconds before rounding up, so a float error never adds a second. */
export declare const ROUND_EPSILON = 1e-9;
/** The attributes the countdown reads again when they change (js/live-options.js). */
export declare const WATCHED_ATTRIBUTES: string[];
export type UntilZone = string | number | null;
export type CountdownState = 'idle' | 'running' | 'paused' | 'ended';
export type CountdownClock = {
    state: () => CountdownState;
    /**
     * ms left
     */
    remaining: () => number;
    /**
     * ms the timer was set to, with every minute added
     */
    total: () => number;
    /**
     * from idle or paused; nothing when running or ended
     */
    start: () => void;
    pause: () => void;
    /**
     * back to idle and full, at `seconds` when given
     */
    reset: (seconds?: number) => void;
    /**
     * more time; an ended timer starts again with it
     */
    add: (seconds: number) => void;
    /**
     * stop every timer it holds (detach)
     */
    stop: () => void;
};
/**
 * A zone a moment is read and written in: an IANA name ("Europe/Brussels"), a fixed offset in minutes (the "+02:00" of a
 * date and time), or null for the device's own clock.
 * @typedef {string | number | null} UntilZone
 */
/**
 * @typedef {'idle' | 'running' | 'paused' | 'ended'} CountdownState
 * @typedef {object} CountdownClock
 * @property {() => CountdownState} state
 * @property {() => number} remaining  ms left
 * @property {() => number} total      ms the timer was set to, with every minute added
 * @property {() => void} start        from idle or paused; nothing when running or ended
 * @property {() => void} pause
 * @property {(seconds?: number) => void} reset  back to idle and full, at `seconds` when given
 * @property {(seconds: number) => void} add     more time; an ended timer starts again with it
 * @property {() => void} stop          stop every timer it holds (detach)
 */
