export type CapturedRequest = import('../request-inspector.js').CapturedRequest;
export type InspectorOptions = import('../request-inspector.js').InspectorOptions;
/** @typedef {import('../request-inspector.js').CapturedRequest} CapturedRequest */
/** @typedef {import('../request-inspector.js').InspectorOptions} InspectorOptions */
/** The inspectors this module looks after. */
export declare const REQUESTS = "[data-kp-requests]";
/** The header names masked unless the page says otherwise. */
export declare const SECRET_HEADERS: readonly string[];
/** What a masked value is drawn as. */
export declare const MASK = "********";
/** How many requests show before "Show older". */
export declare const REQUESTS_MAX = 20;
/** Fired on the element after a copy: `{ what: 'curl' | 'json' | 'body', masked }`. */
export declare const REQUESTS_COPY_EVENT = "kp-requests-copy";
/** Fired when the empty list's Send test is pressed. */
export declare const REQUESTS_TEST_EVENT = "kp-requests-test";
/** Fired when the failed list's Retry is pressed. */
export declare const REQUESTS_RETRY_EVENT = "kp-requests-retry";
/** How long "Copied" stays [ms]. */
export declare const REQUESTS_COPIED_MS = 1500;
export type Memory = {
    list: CapturedRequest[];
    filter: string;
    shown: number;
    /**
     * keys the reader opened
     */
    opened: Set<string>;
    /**
     * keys the reader closed
     */
    closed: Set<string>;
    options: InspectorOptions;
    /**
     * what the page passed to attachRequestInspectors()
     */
    given: InspectorOptions;
};
/**
 * @typedef {object} Memory
 * @property {CapturedRequest[]} list
 * @property {string} filter
 * @property {number} shown
 * @property {Set<string>} opened keys the reader opened
 * @property {Set<string>} closed keys the reader closed
 * @property {InspectorOptions} options
 * @property {InspectorOptions} given what the page passed to attachRequestInspectors()
 */
/** The request each drawn item shows. @type {WeakMap<Element, CapturedRequest>} */
export declare const ITEM_REQUEST: WeakMap<Element, CapturedRequest>;
/** @param {Document} doc @param {string} className @param {string} [tag] */
export declare const make: (doc: Document, className: string, tag?: string) => HTMLElement;
/** @param {CapturedRequest['headers']} headers @returns {[string, string][]} */
export declare const pairsOf: (headers: CapturedRequest['headers']) => [string, string][];
/** @param {number | undefined} status @returns {'success' | 'info' | 'warning' | 'error' | 'none'} */
export declare function toneOf(status: number | undefined): 'success' | 'info' | 'warning' | 'error' | 'none';
/** @param {number | undefined} status */
export declare const classOf: (status: number | undefined) => string;
/** @param {string | number | undefined} at @returns {number} */
export declare const msOf: (at: string | number | undefined) => number;
/** @param {string} text */
export declare const quote: (text: string) => string;
/**
 * A request as a curl command.
 * @param {CapturedRequest} request
 * @param {{ mask?: boolean, secretHeaders?: readonly string[], origin?: string }} [options] `mask` draws the secret headers as ********
 * @returns {string}
 */
export declare function toCurl(request: CapturedRequest, { mask, secretHeaders, origin }?: {
    mask?: boolean;
    secretHeaders?: readonly string[];
    origin?: string;
}): string;
/**
 * A request as JSON, with the secret headers masked unless asked.
 * @param {CapturedRequest} request
 * @param {{ mask?: boolean, secretHeaders?: readonly string[] }} [options]
 */
export declare function toJson(request: CapturedRequest, { mask, secretHeaders }?: {
    mask?: boolean;
    secretHeaders?: readonly string[];
}): string;
/** @param {HTMLElement} el @returns {InspectorOptions} */
export declare function readOptions(el: HTMLElement): InspectorOptions;
/** A path that may break after its slashes and query marks. @param {Document} doc @param {string} path */
export declare function pathNodes(doc: Document, path: string): Node[];
/** @param {CapturedRequest} request @param {number} index */
export declare const keyOf: (request: CapturedRequest, index: number) => string;
