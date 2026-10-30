export { VIEWER, VIEWER_CLOSE_EVENT, VIEWER_STATES } from './viewer/values.js';
export type ViewerAction = {
    kind: 'open' | 'download' | 'print' | 'copy-link' | string;
    /**
     * the file's address (open, download, copy-link)
     */
    href?: string;
    /**
     * the file name a download is saved as
     */
    name?: string;
    /**
     * what a print or a custom action does
     */
    run?: () => void;
    /**
     * the button's words (default: the dictionary's for the kind)
     */
    label?: string;
    /**
     * a custom action's look
     */
    tone?: 'destructive' | 'default';
};
export type ViewerOptions = {
    title: string;
    /**
     * one line under the title: how it is shown
     */
    desc?: string;
    /**
     * kind, size and date in one line
     */
    facts?: string;
    /**
     * about 70 % of the window and 90 % high, or all of it (default wide)
     */
    size?: 'wide' | 'full';
    actions?: readonly ViewerAction[];
    /**
     * more classes on the dialog
     */
    className?: string;
    /**
     * where the focus goes back to when the native return finds nothing
     */
    opener?: Element | null;
    onClose?: () => void;
    /**
     * shortcuts that live while the viewer is open
     */
    keys?: readonly import('./shortcuts.js').Shortcut[];
    doc?: Document;
};
export type ViewerHandle = {
    dialog: HTMLDialogElement;
    /**
     * the box the content stands in
     */
    stage: HTMLElement;
    /**
     * the content slot inside the stage
     */
    content: HTMLElement;
    /**
     * the foot with the actions
     */
    foot: HTMLElement;
    setTitle: (text: string) => void;
    setDesc: (text: string) => void;
    setFacts: (text: string) => void;
    /**
     * "4 of 37", exact, announced politely
     */
    setPosition: (position: {
        index: number;
        total: number;
    } | null) => void;
    setActions: (actions: readonly ViewerAction[]) => void;
    setContent: (...nodes: Node[]) => void;
    setState: (state: 'ready' | 'loading' | 'error' | 'unsupported', detail?: {
        message?: string;
        retry?: () => void;
        title?: string;
    }) => void;
    state: () => string;
    close: () => void;
};
/**
 * @typedef {object} ViewerAction
 * @property {'open' | 'download' | 'print' | 'copy-link' | string} kind
 * @property {string} [href] the file's address (open, download, copy-link)
 * @property {string} [name] the file name a download is saved as
 * @property {() => void} [run] what a print or a custom action does
 * @property {string} [label] the button's words (default: the dictionary's for the kind)
 * @property {'destructive' | 'default'} [tone] a custom action's look
 */
/**
 * @typedef {object} ViewerOptions
 * @property {string} title
 * @property {string} [desc] one line under the title: how it is shown
 * @property {string} [facts] kind, size and date in one line
 * @property {'wide' | 'full'} [size] about 70 % of the window and 90 % high, or all of it (default wide)
 * @property {readonly ViewerAction[]} [actions]
 * @property {string} [className] more classes on the dialog
 * @property {Element | null} [opener] where the focus goes back to when the native return finds nothing
 * @property {() => void} [onClose]
 * @property {readonly import('./shortcuts.js').Shortcut[]} [keys] shortcuts that live while the viewer is open
 * @property {Document} [doc]
 */
/**
 * @typedef {object} ViewerHandle
 * @property {HTMLDialogElement} dialog
 * @property {HTMLElement} stage the box the content stands in
 * @property {HTMLElement} content the content slot inside the stage
 * @property {HTMLElement} foot the foot with the actions
 * @property {(text: string) => void} setTitle
 * @property {(text: string) => void} setDesc
 * @property {(text: string) => void} setFacts
 * @property {(position: { index: number, total: number } | null) => void} setPosition "4 of 37", exact, announced politely
 * @property {(actions: readonly ViewerAction[]) => void} setActions
 * @property {(...nodes: Node[]) => void} setContent
 * @property {(state: 'ready' | 'loading' | 'error' | 'unsupported', detail?: { message?: string, retry?: () => void, title?: string }) => void} setState
 * @property {() => string} state
 * @property {() => void} close
 */
/**
 * Open a viewer.
 * @param {ViewerOptions} options
 * @returns {ViewerHandle}
 */
export declare function openViewer(options: ViewerOptions): ViewerHandle;
