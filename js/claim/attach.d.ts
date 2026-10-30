/**
 * Wire every claim checklist under `root`: the buttons, the menu, the chips, the keys. Items come from the checklist's
 * setChecklistItems() with a `claim` on each; the viewer from setClaimViewer().
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachClaims(root?: ParentNode): () => void;
