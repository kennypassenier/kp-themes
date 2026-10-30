export type Matcher = (optionText: string, query: string) => boolean;
export type PaletteHandle = {
    element: HTMLDialogElement;
    open: (query?: string) => void;
    close: () => void;
    /**
     * re-filter after the consumer changed the commands
     */
    refresh: () => void;
    /**
     * the commands are still arriving (the busy card over the list) or could not be read (the failed plate with Retry, `kp-palette-retry`; commands marked `data-kp-static` stay)
     */
    setState: (state: 'ready' | 'loading' | 'error', options?: {
        message?: string;
    }) => void;
};
/** @typedef {(optionText: string, query: string) => boolean} Matcher */
/**
 * @typedef {object} PaletteHandle
 * @property {HTMLDialogElement} element
 * @property {(query?: string) => void} open
 * @property {() => void} close
 * @property {() => void} refresh re-filter after the consumer changed the commands
 * @property {(state: 'ready' | 'loading' | 'error', options?: { message?: string }) => void} setState the commands are still arriving (the busy card over the list) or could not be read (the failed plate with Retry, `kp-palette-retry`; commands marked `data-kp-static` stay)
 */
export {};
