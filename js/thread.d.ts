export { THREAD, THREAD_RETRY_EVENT, THREAD_ADD_EVENT, THREAD_ACTION_EVENT, THREAD_FOLD_EVENT, THREAD_TIME_ZONE, threadOptions, dayLabel, groupMessages } from './thread/options.js';
export type ThreadAttachment = {
    name: string;
    /**
     * bytes
     */
    size?: number;
    href?: string;
};
export type ThreadMessage = {
    key: string;
    dir: 'in' | 'out' | 'system';
    /**
     * ms
     */
    at: number;
    text: string;
    /**
     * who wrote it (the mark and the header); `out` says "You" without it
     */
    sender?: string;
    /**
     * the sender's photo
     */
    src?: string;
    attachments?: ThreadAttachment[];
    status?: 'sent' | 'sending' | 'failed';
    /**
     * why a failed message was not sent
     */
    error?: string;
};
export type ThreadSpec = {
    messages?: ThreadMessage[];
    state?: 'ready' | 'loading' | 'empty' | 'error';
    /**
     * the sentence of a failed thread
     */
    message?: string;
    /**
     * false leaves Retry out of a failed thread
     */
    retry?: boolean;
    emptyTitle?: string;
    emptyText?: string;
    /**
     * false leaves the Add button out of the empty thread
     */
    add?: boolean;
    order?: 'oldest' | 'newest';
    fold?: 'newest' | 'full' | number;
    foldLines?: number;
    /**
     * minutes
     */
    group?: number;
    days?: boolean;
    avatar?: 'in' | 'both' | 'none';
    bubble?: 'tinted' | 'plain' | 'filled';
    actions?: {
        id: string;
        label: string;
    }[];
    loadingWords?: string;
    /**
     * the thread's name for a screen reader
     */
    label?: string;
};
/**
 * @typedef {object} ThreadAttachment
 * @property {string} name
 * @property {number} [size] bytes
 * @property {string} [href]
 * @typedef {object} ThreadMessage
 * @property {string} key
 * @property {'in' | 'out' | 'system'} dir
 * @property {number} at ms
 * @property {string} text
 * @property {string} [sender] who wrote it (the mark and the header); `out` says "You" without it
 * @property {string} [src] the sender's photo
 * @property {ThreadAttachment[]} [attachments]
 * @property {'sent' | 'sending' | 'failed'} [status]
 * @property {string} [error] why a failed message was not sent
 * @typedef {object} ThreadSpec
 * @property {ThreadMessage[]} [messages]
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]
 * @property {string} [message] the sentence of a failed thread
 * @property {boolean} [retry] false leaves Retry out of a failed thread
 * @property {string} [emptyTitle]
 * @property {string} [emptyText]
 * @property {boolean} [add] false leaves the Add button out of the empty thread
 * @property {'oldest' | 'newest'} [order]
 * @property {'newest' | 'full' | number} [fold]
 * @property {number} [foldLines]
 * @property {number} [group] minutes
 * @property {boolean} [days]
 * @property {'in' | 'both' | 'none'} [avatar]
 * @property {'tinted' | 'plain' | 'filled'} [bubble]
 * @property {{ id: string, label: string }[]} [actions]
 * @property {string} [loadingWords]
 * @property {string} [label] the thread's name for a screen reader
 */
/**
 * Draw (or redraw) a thread.
 * @param {HTMLElement} el the root, a `.kp-thread`
 * @param {ThreadSpec} spec
 */
export declare function setThread(el: HTMLElement, spec: ThreadSpec): void;
/**
 * Fill every `[data-kp-thread]` under `root` that carries its spec as JSON in
 * the attribute (a page that draws with setThread() needs nothing).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachThreads(root?: ParentNode): () => void;
