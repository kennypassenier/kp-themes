export { CHECKLIST, CHECKLIST_EVENT, CHECKLIST_CLEAR_EVENT, CHECKLIST_UNDO_EVENT, CHECKLIST_RETRY_EVENT, CHECKLIST_RENDER_EVENT, CHECKLIST_UNDO_MS, getChecklistItems, } from './checklist/state.js';
export { setChecklistItems, setChecklistChecked, setChecklistState } from './checklist/api.js';
export type ChecklistItem = {
    id: string;
    label: string;
    /**
     * the amount or a note, after the label ("3 pieces")
     */
    detail?: string;
    /**
     * a shop or a section; items without one share a group without a heading
     */
    group?: string;
    checked?: boolean;
    /**
     * who brings it (js/claim.js, `data-kp-checklist-claim`) [kpadopt6]
     */
    claim?: import('./claim.js').ClaimInfo;
};
/**
 * @typedef {object} ChecklistItem
 * @property {string} id
 * @property {string} label
 * @property {string} [detail]  the amount or a note, after the label ("3 pieces")
 * @property {string} [group]  a shop or a section; items without one share a group without a heading
 * @property {boolean} [checked]
 * @property {import('./claim.js').ClaimInfo} [claim]  who brings it (js/claim.js, `data-kp-checklist-claim`) [kpadopt6]
 */
/**
 * Wire every checklist under `root`: the ticks, Check all, Clear checked and
 * its Undo. Items come from setChecklistItems().
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachChecklists(root?: ParentNode): () => void;
