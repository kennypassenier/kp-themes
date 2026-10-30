/** The clock of an attached countdown, to drive it from a script. @param {Element} el @returns {import('./constants.js').CountdownClock | null} */
export declare const countdownOf: (el: Element) => import('./constants.js').CountdownClock | null;
/**
 * Wire every countdown under `root`.
 * @param {ParentNode} [root]
 * @param {{ now?: () => number, wall?: () => number }} [options] `now` is the clock's (performance.now), `wall` the device's
 *   date and time (Date.now), which an `until` option is counted against
 * @returns {() => void} detach
 */
export declare const attachCountdowns: (root?: ParentNode, options?: {
    now?: () => number;
    wall?: () => number;
}) => () => void;
