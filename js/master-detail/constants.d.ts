/** A list-and-detail layout. */
export declare const MASTER_DETAIL = "[data-kp-master-detail]";
/** Fired when the selection moves. */
export declare const PANE_SELECT_EVENT = "kp-pane-select";
/** Fired when the detail is opened. */
export declare const PANE_OPEN_EVENT = "kp-pane-open";
/** Fired when the folded detail, or the aside, is closed. */
export declare const PANE_CLOSE_EVENT = "kp-pane-close";
/** Fired when Retry is pressed in an errored detail. */
export declare const PANE_RETRY_EVENT = "kp-pane-retry";
/** The default widths of the list and the detail, and of the aside. */
export declare const PANE_WIDTHS = "17rem 1fr";
export declare const PANE_ASIDE_WIDTH = "24rem";
/** The layout's width the panes fold below, and the one the aside folds below. */
export declare const PANE_FOLD_AT = "48rem";
export declare const PANE_ASIDE_FOLD_AT = "90rem";
/** The list column's width when `data-kp-pane-widths` names none. */
export declare const DEFAULT_LIST_WIDTH = "17rem";
/** An item of the list. */
export declare const ITEM = "[data-kp-pane-key]";
/** What the detail's own components mark a failure with (a failed plate on screen). */
export declare const OWN_FAILURE = ":is([data-kp-state='error'], .kp-stateplate--error)";
export type PaneState = 'empty' | 'loading' | 'error' | 'ready';
export type PaneStateOptions = {
    /**
     * the plate's first line
     */
    title?: string;
    /**
     * its sentence
     */
    text?: string;
    /**
     * what the busy card says (default `paneLoading`)
     */
    words?: string;
    /**
     * an action under an empty plate
     */
    actionLabel?: string;
    onAction?: (event: MouseEvent) => void;
};
export type MasterDetailHandle = {
    element: HTMLElement;
    /**
     * the selected key
     */
    key: () => string | null;
    select: (key: string | null, how?: {
        focus?: boolean;
    }) => void;
    /**
     * select and, folded, show the detail
     */
    open: (key: string, how?: {
        focus?: boolean;
    }) => void;
    /**
     * show the list again (folded)
     */
    close: () => void;
    /**
     * whether the panes are folded now
     */
    narrow: () => boolean;
    setState: (state: PaneState, options?: PaneStateOptions) => void;
};
/**
 * @typedef {'empty' | 'loading' | 'error' | 'ready'} PaneState
 * @typedef {object} PaneStateOptions
 * @property {string} [title] the plate's first line
 * @property {string} [text] its sentence
 * @property {string} [words] what the busy card says (default `paneLoading`)
 * @property {string} [actionLabel] an action under an empty plate
 * @property {(event: MouseEvent) => void} [onAction]
 * @typedef {object} MasterDetailHandle
 * @property {HTMLElement} element
 * @property {() => string | null} key the selected key
 * @property {(key: string | null, how?: { focus?: boolean }) => void} select
 * @property {(key: string, how?: { focus?: boolean }) => void} open select and, folded, show the detail
 * @property {() => void} close show the list again (folded)
 * @property {() => boolean} narrow whether the panes are folded now
 * @property {(state: PaneState, options?: PaneStateOptions) => void} setState
 */
