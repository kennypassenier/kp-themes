export { TOOLBAR, TOOLBAR_REMOVE_EVENT, TOOLBAR_CLEAR_EVENT } from './toolbar/values.js';
export { toolbarSearch, setToolbarActive } from './toolbar/active.js';
export type ToolbarFilter = {
    id?: string;
    label: string;
};
export type ToolbarDecorateInfo = {
    kind: 'tag-remove' | 'clear-all';
    host: HTMLElement;
    key?: string;
    value?: string;
    label?: string;
};
/** The tag a filter that is on is drawn as: `id` names it to the page (the label when absent). @typedef {{ id?: string, label: string }} ToolbarFilter */
/**
 * What `decorate` is told about the control it is handed: `kind` is `tag-remove` (a tag's cross; `value` is the filter's id) or
 * `clear-all`; `host` is the toolbar and `key` its `data-kp-key`.
 * @typedef {{ kind: 'tag-remove' | 'clear-all', host: HTMLElement, key?: string, value?: string, label?: string }} ToolbarDecorateInfo
 */
/**
 * Wire every `[data-kp-toolbar]` under `root`: Escape in the search, the
 * search key, and the active row's two buttons. The active row is hidden when
 * it holds no tag.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachToolbars(root?: ParentNode): () => void;
