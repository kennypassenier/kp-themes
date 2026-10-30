export { UNDO_TOAST, UNDO_TOAST_EVENT, UNDO_RESTORED_MS, UNDO_MAX } from './undo-toast/values.js';
export type UndoToastOptions = {
    /**
     * runs when the window closes (mode `defer`); a rejection is a failure
     */
    commit?: () => unknown | Promise<unknown>;
    /**
     * runs on Undo
     */
    undo?: () => unknown;
    /**
     * runs when a commit failed (default `undo`)
     */
    restore?: () => unknown;
    /**
     * the window; 0 commits at once
     */
    ms?: number;
    mode?: 'defer' | 'revert';
    clock?: 'ring' | 'bar' | 'text' | 'none';
    /**
     * `Mod+Z`
     */
    key?: string | false;
    leave?: 'carry' | 'commit' | 'cancel';
    max?: number;
    /**
     * the toast's line when the commit fails, instead of "Not done: why"
     */
    failed?: string;
    /**
     * the toast's line after Undo, instead of "Restored"
     */
    restored?: string;
    region?: HTMLElement | null;
};
export type UndoToast = {
    toast: HTMLElement & {
        dismiss: () => void;
    };
    state: () => 'counting' | 'committing' | 'failed' | 'undone' | 'done';
    /**
     * undo now
     */
    undo: () => void;
    /**
     * commit now
     */
    accept: () => Promise<void>;
    /**
     * settles with how it ended
     */
    done: Promise<'committed' | 'undone' | 'failed' | 'left'>;
};
/**
 * @typedef {object} UndoToastOptions
 * @property {() => unknown | Promise<unknown>} [commit] runs when the window closes (mode `defer`); a rejection is a failure
 * @property {() => unknown} [undo] runs on Undo
 * @property {() => unknown} [restore] runs when a commit failed (default `undo`)
 * @property {number} [ms] the window; 0 commits at once
 * @property {'defer' | 'revert'} [mode]
 * @property {'ring' | 'bar' | 'text' | 'none'} [clock]
 * @property {string | false} [key] `Mod+Z`
 * @property {'carry' | 'commit' | 'cancel'} [leave]
 * @property {number} [max]
 * @property {string} [failed] the toast's line when the commit fails, instead of "Not done: why"
 * @property {string} [restored] the toast's line after Undo, instead of "Restored"
 * @property {HTMLElement | null} [region]
 */
/**
 * @typedef {object} UndoToast
 * @property {HTMLElement & { dismiss: () => void }} toast
 * @property {() => 'counting' | 'committing' | 'failed' | 'undone' | 'done'} state
 * @property {() => void} undo undo now
 * @property {() => Promise<void>} accept commit now
 * @property {Promise<'committed' | 'undone' | 'failed' | 'left'>} done settles with how it ended
 */
/**
 * Show a toast with Undo and a clock.
 * @param {string} text what happened: "3 schedules deleted"
 * @param {UndoToastOptions} [options]
 * @returns {UndoToast}
 */
export declare function undoToast(text: string, options?: UndoToastOptions): UndoToast;
