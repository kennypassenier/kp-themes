/**
 * Wire every focus-steps view under `root`: its buttons, keys, swipe, Read
 * aloud, and the screen kept on until the detach.
 * @param {ParentNode} [scope]
 * @returns {() => void} detach
 */
export declare function attachFocusSteps(scope?: ParentNode): () => void;
