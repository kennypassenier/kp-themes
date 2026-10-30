export type Arriving = {
    el: HTMLElement;
    plays: Animation[];
    total: number;
    lag: number;
};
/** @typedef {{ el: HTMLElement, plays: Animation[], total: number, lag: number }} Arriving */
/** A delay the Web Animations API accepts: a finite number of ms, else 0 (an infinite exit has no end to count back from). @param {number} ms */
export declare const finiteMs: (ms: number) => number;
/**
 * Several elements that arrive at once come one by one, the highest first:
 * the row of leaves leaveInTurn() plays (the lowest first, each starting
 * when the one before is `--kp-leave-stagger` through its exit) turned
 * around as a whole, so frame t of the arrivals is frame (S - t) of that
 * row of leaves, S being when its last leave ends (Kenny, 2026-10-05:
 * "showing should also be the reverse of removing").
 * A theme that says `--kp-arrive-turn: siblings` (cyberpunk) takes turns only
 * among elements that share a parent: a layer arriving over a table does not
 * wait for an unrelated part that was drawn in the same task (the review
 * stage's mirrored controls held the busy layer back one stagger, 240 ms,
 * against a leave that went at once). Every other theme keeps one row.
 * @param {Arriving[]} items
 */
export declare function arriveInTurn(items: Arriving[]): void;
/**
 * The gap after one of `count` elements arriving or leaving in turn: its own
 * `gap` when the whole row's gaps fit in IN_TURN_MS (or in that one gap, so
 * a pair is never hurried), else the row's share of that budget. Arrivals
 * and leaves both take it, so a row's arrival stays its leave turned around.
 * @param {number} gap ms @param {number} count
 */
export declare function inTurnGap(gap: number, count: number): number;
/**
 * When an animation with `timing` (and its active phase ending at `end`)
 * is `share` of the way through, as partway() polls it: its progress at or
 * past `share`, its first iteration over, or itself over.
 * @param {EffectTiming} timing @param {number} end @param {number} share
 * @returns {number} ms from its start
 */
export declare function reaches(timing: EffectTiming, end: number, share: number): number;
