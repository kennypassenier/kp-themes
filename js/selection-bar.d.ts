export { SELECTION, SELECTION_EVENT, SELECTION_CLEAR_EVENT, SELECTION_MATCHING_EVENT, SELECTION_ACTION_EVENT, SELECTION_NAMES, SELECTION_SAY_MS, } from './selection-bar/model.js';
export { setSelection, getSelection, setSelectionBusy, setSelectionProgress, setSelectionResult, setSelectionRules } from './selection-bar/api.js';
export type SelectionItem = {
    key: string;
    label: string;
};
export type SelectionOptions = {
    placement?: 'sticky-top' | 'inline' | 'floating-bottom';
    names?: 'names' | 'count';
    maxNames?: number;
    matching?: number;
};
/** @typedef {{ key: string, label: string }} SelectionItem */
/**
 * @typedef {object} SelectionOptions
 * @property {'sticky-top' | 'inline' | 'floating-bottom'} [placement]
 * @property {'names' | 'count'} [names]
 * @property {number} [maxNames]
 * @property {number} [matching]
 */
/**
 * Give every selection bar under `root` its parts and its source.
 * @param {ParentNode} [root]
 * @param {SelectionOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachSelectionBars(root?: ParentNode, options?: SelectionOptions): () => void;
