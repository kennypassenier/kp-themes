/** The attribute that names the leader. */
export declare const WHEEL_FOLLOWS = "data-kp-wheel-follows";
/**
 * Listen, on the follower's document, for its leader's spin.
 * @param {HTMLElement} follower
 * @returns {() => void} stop listening
 */
export declare function followLeader(follower: HTMLElement): () => void;
