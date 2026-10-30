export type UsualHandle = import('./types.js').UsualHandle;
/** @typedef {import('./types.js').UsualHandle} UsualHandle */
/**
 * Wire every picker with `data-kp-usual` under `root`. The combobox it stands on is attached here (a box with the usual is
 * skipped by `attachComboboxes` until this has made it ready).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachUsualPickers(root?: ParentNode): () => void;
/**
 * The handle of an attached picker.
 * @param {Element} element
 * @returns {UsualHandle | null}
 */
export declare function usualPicker(element: Element): UsualHandle | null;
/**
 * Hand a picker its band: values (in order), or `{ value, uses }` which `data-kp-usual-source="counts"` ranks by uses.
 * @param {Element} element
 * @param {readonly (string | { value: string, uses?: number })[]} values
 */
export declare function setUsual(element: Element, values: readonly (string | {
    value: string;
    uses?: number;
})[]): void;
/**
 * The state of a picker: `loading` (the busy card in the place of the list, the input waiting), `empty`, `error` (Retry fires
 * `kp-usual-retry`; the last good list stays), `ready`.
 * @param {Element} element
 * @param {'ready' | 'loading' | 'empty' | 'error'} state
 */
export declare function setUsualState(element: Element, state: 'ready' | 'loading' | 'empty' | 'error'): void;
/**
 * The values marked "Not today".
 * @param {Element} element
 * @returns {string[]}
 */
export declare function usualNotToday(element: Element): string[];
