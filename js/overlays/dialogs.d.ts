export { openAtTop, openDialog } from './dialog-open.js';
/**
 * Wire `[data-kp-dialog="<id>"]` buttons to the dialog with that id.
 *
 * showModal() by default: the modal form is the one that traps focus and
 * makes the rest of the page inert. `data-kp-dialog-mode="non-modal"` on
 * the trigger opens with show() instead, for a palette-like panel that
 * must not inert the page. A drawer marked `data-kp-drawer-mode="beside"`
 * opens beside the list (openDialog(), js/overlays/dialog-open.js), and a
 * dialog marked `data-kp-dialog-guard` asks before a changed form closes
 * (js/overlays/dialog-guard.js, started here) [uxdialogs1101].
 *
 * @param {ParentNode} root
 * @param {{ modal?: boolean }} [options] the default mode when a trigger says nothing
 * @returns {() => void} detach
 */
export declare function attachDialogs(root?: ParentNode, { modal }?: {
    modal?: boolean;
}): () => void;
/** The close label a consumer's markup can use: `data-kp-dialog-close` with the dictionary's word. */
export declare const closeLabel: () => string;
