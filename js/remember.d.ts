export { REMEMBER_ATTRIBUTE, REMEMBER_CLASH_EVENT, REMEMBER_PREFIX, configureRemember, rememberedName, forgetClaims, memoryFor, forgetRememberedExcept, } from './remember/store.js';
export { sidenavGroups, treeItemId, columnId, paintRemembered, restoreRemembered } from './remember/painters.js';
export { REMEMBER_HOLD_ATTRIBUTE } from './remember/disclosure.js';
export type Remembered = 'sidenav' | 'disclosure' | 'tree' | 'split' | 'datatable' | 'tour' | 'refresh' | 'notices' | 'claim' | 'availability' | 'time' | 'console' | 'focus-steps' | 'picker' | 'alert';
export type Memory = {
    /**
     * the name the element gave itself
     */
    name: string;
    /**
     * the composed storage key, so a consumer can read or clear it themselves [KT6]
     */
    key: (slot: string) => string;
    read: <T>(slot: string, fallback: T) => T;
    /**
     * whether it will survive a reload
     */
    write: (slot: string, value: unknown) => boolean;
    forget: (slot: string) => void;
};
export type RememberConfig = {
    prefix?: string;
    storage?: Storage | null;
};
/**
 * The kinds of state this package remembers.
 *
 * @typedef {'sidenav' | 'disclosure' | 'tree' | 'split' | 'datatable' | 'tour' | 'refresh' | 'notices' | 'claim' | 'availability' | 'time' | 'console' | 'focus-steps' | 'picker' | 'alert'} Remembered
 */
/**
 * A memory for one element.
 *
 * @typedef {object} Memory
 * @property {string} name the name the element gave itself
 * @property {(slot: string) => string} key the composed storage key, so a consumer can read or clear it themselves [KT6]
 * @property {<T>(slot: string, fallback: T) => T} read
 * @property {(slot: string, value: unknown) => boolean} write whether it will survive a reload
 * @property {(slot: string) => void} forget
 */
/** @typedef {{ prefix?: string, storage?: Storage | null }} RememberConfig */
/**
 * Wire the disclosures that remember — a `<details data-kp-remember>`, the
 * accordion's own element. Every other component writes its state from its
 * own module; a `<details>` has no module, so this is it.
 *
 * A disclosure added under `root` later is wired as it arrives, and its
 * memory painted in the same step, before the browser paints it, so a page
 * that rebuilds its groups on every refresh shows each one as it was left,
 * with no frame of its markup default (port spec J3). One that leaves the
 * page is let go.
 *
 * `data-kp-remember-hold` on the element or an ancestor holds the memory
 * still: the page sets `open` itself (every group open while a search runs)
 * and nothing is painted over it or written from it. When the hold goes,
 * the stored state is painted back.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachRemembered(root?: ParentNode): () => void;
