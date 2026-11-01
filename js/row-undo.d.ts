export { ROW_DELETE, ROW_DELETE_EVENT, ROW_COMMIT_EVENT, ROW_UNDO_EVENT } from './row-undo/constants.js';
export { deleteRowWithUndo } from './row-undo/delete.js';
/**
 * Delete rows with Undo under `root`: one delegated listener. Idempotent per root.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachRowUndo(root?: ParentNode): () => void;
