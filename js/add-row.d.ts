export { configureAddRow } from './add-row/keys.js';
export { ADD_ROW, ADD_ROW_FOR, ADD_ROW_COLUMN, ADD_ROW_SUBMIT_COLUMN, ADD_ROW_LABELS, ADD_ROW_NAME, ADD_ROW_SUBMIT_KEY_ATTRIBUTE, ADD_ROW_SUBMIT_KEY, ADD_EVENT, ADDED_EVENT, STACKED } from './add-row/constants.js';
export { valuesOf, sayRefusal } from './add-row/submit.js';
export { columnNumber } from './add-row/layout.js';
/**
 * Wire every add row under `root`. Its form is the kit form: attach the forms too (js/auto.js does both).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachAddRows(root?: ParentNode): () => void;
