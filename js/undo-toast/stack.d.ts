export type UndoToast = import('../undo-toast.js').UndoToast;
export type StackEntry = {
    handle: UndoToast;
    key: string | false;
};
/** @typedef {import('../undo-toast.js').UndoToast} UndoToast */
/** @typedef {{ handle: UndoToast, key: string | false }} StackEntry */
/** The toasts still counting or committing, oldest first. @type {StackEntry[]} */
export declare const live: StackEntry[];
/** @param {string} key `Mod+Z` */
export declare const keyName: (key: string) => string;
/** @param {StackEntry} entry */
export declare function enter(entry: StackEntry): void;
/** @param {UndoToast} handle */
export declare function leaveStack(handle: UndoToast): void;
