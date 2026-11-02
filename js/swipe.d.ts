export { SWIPE, SWIPE_EVENT } from './swipe/constants.js';
/**
 * Wire every swiping list under `root` (the root itself included). Idempotent.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachSwipes(root?: ParentNode): () => void;
