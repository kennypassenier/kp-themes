/**
 * Read what a person typed or pasted as a time of day.
 * @param {string} text
 * @param {{ seconds?: boolean }} [options]
 * @returns {{ value: string, converted: boolean } | null} the time as `HH:MM`, and whether it was written in 12 hours; null when it is not a time
 */
export declare function parseTimeOfDay(text: string, { seconds }?: {
    seconds?: boolean;
}): {
    value: string;
    converted: boolean;
} | null;
/** @param {string} value `HH:MM` or `HH:MM:SS` @returns {number} minutes since midnight */
export declare function timeMinutes(value: string): number;
/** @param {number} minutes @param {boolean} [seconds] */
export declare function timeText(minutes: number, seconds?: boolean): string;
/**
 * Step a time: up or down by `step` minutes, wrapping past midnight.
 * @param {string} value `HH:MM` or empty @param {number} delta steps (negative goes back) @param {number} step minutes
 * @returns {{ value: string, wrapped: boolean }}
 */
export declare function stepTime(value: string, delta: number, step: number): {
    value: string;
    wrapped: boolean;
};
/** Whether a time is inside the window; a min later than the max wraps midnight. @param {string} value @param {string | null} min @param {string | null} max */
export declare function timeInWindow(value: string, min: string | null, max: string | null): boolean;
