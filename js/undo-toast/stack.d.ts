import { keyName } from '../key-spec.js';
export type UndoToast = import('../undo-toast.js').UndoToast;
export type StackEntry = {
    handle: UndoToast;
    key: string | false;
    focusKey: string | false;
    returnTo?: Element | null;
};
/** @typedef {import('../undo-toast.js').UndoToast} UndoToast */
/** @typedef {{ handle: UndoToast, key: string | false, focusKey: string | false, returnTo?: Element | null }} StackEntry */
/** The toasts still counting or committing, oldest first. @type {StackEntry[]} */
export declare const live: StackEntry[];
export { keyName };
/**
 * Whether a key event is the configured key (a key spec, js/key-spec.js: `Mod` is Ctrl or Command; a modifier not named must be up).
 * @param {KeyboardEvent} event @param {string} spec
 */
export declare const keyMatches: (event: KeyboardEvent, spec: string) => boolean;
/** @param {StackEntry} entry */
export declare function enter(entry: StackEntry): void;
/** @param {UndoToast} handle */
export declare function leaveStack(handle: UndoToast): void;
