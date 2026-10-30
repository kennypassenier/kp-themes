export { TOGGLE, TOGGLE_EVENT, TOGGLE_CHANGED_EVENT, TOGGLE_LOOKS, TOGGLE_MODES, TOGGLE_REFUSED_MS, toggleKey, toggleGroup, togglePressedKeys } from './toggle/group.js';
export type PressedState = 'true' | 'false' | 'mixed';
export type ToggleOptions = {
    /**
     * how long a refusal's word stays (default 3000)
     */
    refusedMs?: number;
};
export type ToggleHandle = {
    element: HTMLElement;
    state: () => PressedState;
    /**
     * set the state without the event; a group keeps its rules
     */
    set: (state: boolean | 'mixed', options?: {
        silent?: boolean;
    }) => void;
    /**
     * the exact number beside the label, a skeleton, or none
     */
    setCount: (count: number | 'loading' | null) => void;
    /**
     * the line under the label while it is on
     */
    setHint: (text: string) => void;
    /**
     * an async answer: it went through
     */
    done: () => void;
    /**
     * an async answer: it was refused; the state goes back and the word shows
     */
    refuse: (message?: string) => void;
};
/** @typedef {'true' | 'false' | 'mixed'} PressedState */
/**
 * @typedef {object} ToggleOptions
 * @property {number} [refusedMs] how long a refusal's word stays (default 3000)
 */
/**
 * @typedef {object} ToggleHandle
 * @property {HTMLElement} element
 * @property {() => PressedState} state
 * @property {(state: boolean | 'mixed', options?: { silent?: boolean }) => void} set set the state without the event; a group keeps its rules
 * @property {(count: number | 'loading' | null) => void} setCount the exact number beside the label, a skeleton, or none
 * @property {(text: string) => void} setHint the line under the label while it is on
 * @property {() => void} done an async answer: it went through
 * @property {(message?: string) => void} refuse an async answer: it was refused; the state goes back and the word shows
 */
/**
 * The handle of an attached toggle.
 * @param {Element} el
 * @returns {ToggleHandle | null}
 */
export declare function toggle(el: Element): ToggleHandle | null;
/**
 * Give every toggle button under `root` its press, its group and its parts.
 *
 * @param {ParentNode} [root]
 * @param {ToggleOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachToggles(root?: ParentNode, options?: ToggleOptions): () => void;
