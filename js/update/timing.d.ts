/**
 * The idea a register's `--kp-update` names, or '' for none.
 * @param {string | null | undefined} value the computed custom property
 * @returns {string}
 */
export declare function updateIdea(value: string | null | undefined): string;
/**
 * How long an update plays and on which curve, from the theme's motion: the
 * box's resize time or the dialog's close time, whichever is longer, times
 * 1.25; the entrance's curve without its overshoot. 0 without motion. A
 * register that knows its own update time says it with `--kp-update-time`
 * (`time`, in ms, read by updateTiming()): when set it is the time, whatever
 * the dialog's is; unset, the time above.
 * @param {{ size: number, close: number, ease: string, time?: number | null }} motion what themeMotion() returns, and the register's own time
 * @returns {{ duration: number, ease: string }}
 */
export declare function updateTimingOf({ size, close, ease, time }: {
    size: number;
    close: number;
    ease: string;
    time?: number | null;
}): {
    duration: number;
    ease: string;
};
/**
 * The update timing of the theme at `scope`.
 * @param {Element} [scope]
 * @returns {{ duration: number, ease: string }}
 */
export declare function updateTiming(scope?: Element): {
    duration: number;
    ease: string;
};
/**
 * Whether an update with this idea plays anything: whenever the register
 * names one. Its timing may be 0 (reduced motion): a register that names an
 * idea there plays a still version on its own time.
 * @param {string} idea
 */
export declare const updatePlays: (idea: string) => boolean;
