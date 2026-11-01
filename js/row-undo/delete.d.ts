/**
 * Delete a row with Undo. Returns the toast's handle, or null when the page cancelled `kp-row-delete`.
 * @param {HTMLElement} row
 * @param {{ name?: string, control?: HTMLElement | null, ms?: number }} [options]
 * @returns {import('../undo-toast.js').UndoToast | null}
 */
export declare function deleteRowWithUndo(row: HTMLElement, { name, control, ms }?: {
    name?: string;
    control?: HTMLElement | null;
    ms?: number;
}): import('../undo-toast.js').UndoToast | null;
