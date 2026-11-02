import { WHEEL_FOLLOWS_REASON, WHEEL_LOCKED } from './state.js';
export { WHEEL_FOLLOWS_REASON, WHEEL_LOCKED };
/** The attribute that names the leader. */
export declare const WHEEL_FOLLOWS = "data-kp-wheel-follows";
/** How the follower starts: `press` (default), `auto` or `together`. */
export declare const WHEEL_FOLLOWS_START = "data-kp-wheel-follows-start";
/** The id of the leader's choice, written on the follower once the leader has settled. */
export declare const WHEEL_LEADER_WON = "data-kp-wheel-leader-won";
/** Fired on the follower when its leader has settled. */
export declare const WHEEL_LEADER_RESULT_EVENT = "kp-wheel-leader-result";
/** The start modes, the default first. */
export declare const WHEEL_FOLLOW_STARTS: readonly ['press', 'auto', 'together'];
export type WheelFollowStart = (typeof WHEEL_FOLLOW_STARTS)[number];
/** @param {HTMLElement} follower @returns {WheelFollowStart} */
export declare function followStart(follower: HTMLElement): WheelFollowStart;
/** Lock or unlock the follower from its leader's state, and draw it. @param {HTMLElement} follower */
export declare function syncFollower(follower: HTMLElement): void;
/**
 * Follow the leader the follower names: the leader's spin, result and new choices, and the follower's own attributes.
 * @param {HTMLElement} follower
 * @returns {() => void} stop following
 */
export declare function followLeader(follower: HTMLElement): () => void;
