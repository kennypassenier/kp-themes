export { NOTICES, NOTICE_FIX_EVENT, NOTICE_READ_EVENT, NOTICES_READ_ALL_EVENT, NOTICES_SOURCE_EVENT, NOTICES_RETRY_EVENT, NOTICES_END_QUIET_EVENT, NOTICES_INBOX_EVENT, NOTICE_SEVERITIES, } from './notices/events.js';
export type Notice = {
    /**
     * stable id: the same key is the same row on every refresh
     */
    key: string;
    severity: 'critical' | 'warning' | 'info';
    /**
     * what happened, in one line
     */
    title: string;
    /**
     * when, ms since the epoch
     */
    since: number;
    /**
     * what it affects
     */
    consequence?: string;
    /**
     * what to do
     */
    remedy?: string;
    /**
     * the action that fixes it
     */
    fix?: {
        label: string;
    };
    read?: boolean;
    /**
     * the source it came from (a key of `sources`)
     */
    source?: string;
};
export type NoticeSource = {
    key: string;
    label: string;
    muted?: boolean;
};
export type NoticesModel = {
    state?: 'ready' | 'loading' | 'empty' | 'error';
    items?: Notice[];
    sources?: NoticeSource[];
    /**
     * ISO or epoch ms
     */
    quietUntil?: number | string | null;
    /**
     * why it could not be read
     */
    error?: string;
};
export type NoticesHandle = {
    element: HTMLElement;
    set: (model: NoticesModel) => void;
    /**
     * the number the counter shows
     */
    count: () => number;
    /**
     * open the panel
     */
    open: () => void;
};
/**
 * @typedef {object} Notice
 * @property {string} key stable id: the same key is the same row on every refresh
 * @property {'critical' | 'warning' | 'info'} severity
 * @property {string} title what happened, in one line
 * @property {number} since when, ms since the epoch
 * @property {string} [consequence] what it affects
 * @property {string} [remedy] what to do
 * @property {{ label: string }} [fix] the action that fixes it
 * @property {boolean} [read]
 * @property {string} [source] the source it came from (a key of `sources`)
 * @typedef {object} NoticeSource
 * @property {string} key @property {string} label @property {boolean} [muted]
 * @typedef {object} NoticesModel
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]
 * @property {Notice[]} [items]
 * @property {NoticeSource[]} [sources]
 * @property {number | string | null} [quietUntil] ISO or epoch ms
 * @property {string} [error] why it could not be read
 * @typedef {object} NoticesHandle
 * @property {HTMLElement} element
 * @property {(model: NoticesModel) => void} set
 * @property {() => number} count the number the counter shows
 * @property {() => void} open open the panel
 */
/** The handle of an attached centre. @param {Element} element @returns {NoticesHandle | null} */
export declare const noticesOf: (element: Element) => NoticesHandle | null;
/**
 * Give a centre its notices.
 * @param {Element} element @param {NoticesModel} model
 */
export declare function setNotices(element: Element, model: NoticesModel): void;
/**
 * Wire every notification centre under `root`, and the "since" times in it.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachNotices(root?: ParentNode): () => void;
