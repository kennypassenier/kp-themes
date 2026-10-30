export { CONNECTION, CONNECTION_STATE_EVENT, CONNECTION_RETRY_EVENT, CONNECTION_STATES } from './connection/values.js';
export type ConnectionState = 'online' | 'offline' | 'reconnecting' | 'back' | 'refused';
export type ConnectionDetail = {
    /**
     * changes waiting to be sent
     */
    pending?: number;
    /**
     * a sentence from the app, for `refused`
     */
    why?: string;
    /**
     * the number of the try under way
     */
    attempt?: number;
};
export type ConnectionHandle = {
    element: HTMLElement;
    state: () => ConnectionState;
    set: (state: ConnectionState, detail?: ConnectionDetail) => void;
};
/**
 * @typedef {'online' | 'offline' | 'reconnecting' | 'back' | 'refused'} ConnectionState
 * @typedef {object} ConnectionDetail
 * @property {number} [pending] changes waiting to be sent
 * @property {string} [why] a sentence from the app, for `refused`
 * @property {number} [attempt] the number of the try under way
 * @typedef {object} ConnectionHandle
 * @property {HTMLElement} element
 * @property {() => ConnectionState} state
 * @property {(state: ConnectionState, detail?: ConnectionDetail) => void} set
 */
/** The handle of an attached banner. @param {Element} element @returns {ConnectionHandle | null} */
export declare const connectionOf: (element: Element) => ConnectionHandle | null;
/**
 * Report the connection from the app.
 * @param {Element} element @param {ConnectionState} state @param {ConnectionDetail} [detail]
 */
export declare function setConnection(element: Element, state: ConnectionState, detail?: ConnectionDetail): void;
/**
 * Wire every connection banner under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachConnection(root?: ParentNode): () => void;
