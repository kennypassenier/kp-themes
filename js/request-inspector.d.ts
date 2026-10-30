export { REQUESTS, SECRET_HEADERS, MASK, REQUESTS_MAX, REQUESTS_COPY_EVENT, REQUESTS_TEST_EVENT, REQUESTS_RETRY_EVENT, REQUESTS_COPIED_MS, toneOf, toCurl, toJson, } from './request-inspector/format.js';
export { setRequests, setRequestsState } from './request-inspector/api.js';
export type CapturedRequest = {
    /**
     * the moment: ISO text or milliseconds
     */
    at?: string | number;
    method: string;
    path: string;
    status?: number;
    headers?: Record<string, string> | [string, string][];
    body?: string;
    /**
     * only the start of the body was kept
     */
    truncated?: boolean;
    /**
     * the size of the whole body
     */
    bodyBytes?: number;
    binary?: boolean;
    /**
     * `test` marks a request the page sent itself
     */
    source?: string;
    /**
     * the full address, for curl (otherwise `origin` + path)
     */
    url?: string;
};
export type InspectorOptions = {
    secretHeaders?: readonly string[];
    secretsInCopy?: 'masked' | 'masked-only' | 'real';
    open?: 'failed' | 'first' | 'none';
    max?: number;
    copyAs?: readonly ('curl' | 'json' | 'body')[];
    /**
     * put before a path that is not a full address
     */
    origin?: string;
};
/**
 * @typedef {object} CapturedRequest
 * @property {string | number} [at] the moment: ISO text or milliseconds
 * @property {string} method
 * @property {string} path
 * @property {number} [status]
 * @property {Record<string, string> | [string, string][]} [headers]
 * @property {string} [body]
 * @property {boolean} [truncated] only the start of the body was kept
 * @property {number} [bodyBytes] the size of the whole body
 * @property {boolean} [binary]
 * @property {string} [source] `test` marks a request the page sent itself
 * @property {string} [url] the full address, for curl (otherwise `origin` + path)
 */
/**
 * @typedef {object} InspectorOptions
 * @property {readonly string[]} [secretHeaders]
 * @property {'masked' | 'masked-only' | 'real'} [secretsInCopy]
 * @property {'failed' | 'first' | 'none'} [open]
 * @property {number} [max]
 * @property {readonly ('curl' | 'json' | 'body')[]} [copyAs]
 * @property {string} [origin] put before a path that is not a full address
 */
/**
 * Give every `[data-kp-requests]` under `root` its card, filter and list.
 * @param {ParentNode} [root]
 * @param {InspectorOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachRequestInspectors(root?: ParentNode, options?: InspectorOptions): () => void;
