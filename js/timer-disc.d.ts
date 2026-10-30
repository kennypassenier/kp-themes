export { TIMER_DISC, TIMER_DISC_LEFT } from './timer-disc/values.js';
export { discShare } from './timer-disc/share.js';
/** The clock of an attached visual timer, to drive it from a script. @param {Element} el */
export declare const timerDiscOf: (el: Element) => import("./countdown/constants.js").CountdownClock | null;
/**
 * Wire every visual timer under `root`.
 * @param {ParentNode} [root]
 * @param {{ now?: () => number, wall?: () => number }} [options] `now` is the clock's (performance.now), `wall` the device's
 *   date and time (Date.now), which an `until` option is counted against
 * @returns {() => void} detach
 */
export declare function attachTimerDiscs(root?: ParentNode, options?: {
    now?: () => number;
    wall?: () => number;
}): () => void;
