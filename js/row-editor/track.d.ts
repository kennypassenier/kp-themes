/**
 * Keep a row editor's tracked value, when the page asked for it with `data-kp-track-value`.
 * @param {import('../row-editor.js').RowEditor} editor
 * @returns {() => void} detach
 */
export declare function trackRows(editor: import('../row-editor.js').RowEditor): () => void;
