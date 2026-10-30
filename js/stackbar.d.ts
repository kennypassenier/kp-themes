export { STACKBAR, STACKBAR_PICK_EVENT, STACKBAR_RETRY_EVENT } from './stackbar/values.js';
export { shareText, stackbarParts } from './stackbar/math.js';
export type StackbarPart = {
    /**
     * stable id (default the label)
     */
    key?: string;
    label: string;
    /**
     * in the unit of `total`
     */
    value: number;
    /**
     * the hover card's text, in place of label, value and share
     */
    tip?: string;
    /**
     * a part that needs attention takes the status colour
     */
    tone?: 'warning' | 'destructive';
};
export type StackbarSpec = {
    parts?: StackbarPart[];
    /**
     * the whole; without it, the sum of the parts
     */
    total?: number;
    /**
     * a line over the bar
     */
    title?: string;
    /**
     * the words at the head's end (default: the sum of the format over the whole)
     */
    summary?: string;
    /**
     * how a value reads (default: the number in the page's language)
     */
    format?: (value: number) => string;
    /**
     * the free row's label (default the dictionary's `stackbarRest`)
     */
    restLabel?: string;
    /**
     * parts under this share are merged into "Other" (default 0, none)
     */
    other?: number;
    /**
     * ticks across the bar at a share of the whole
     */
    marks?: {
        at: number;
        label?: string;
    }[];
    /**
     * default true
     */
    legend?: boolean;
    state?: 'ready' | 'loading' | 'empty' | 'error';
    /**
     * the sentence of an empty or failed bar
     */
    message?: string;
    /**
     * false leaves Retry out of a failed bar (a read the page cannot repeat)
     */
    retry?: boolean;
    /**
     * the bar's accessible name (default: every part in order)
     */
    label?: string;
    /**
     * keys of the parts the page has pressed; given (even empty), the parts are toggle buttons with `aria-pressed`
     */
    picked?: string[];
};
/**
 * @typedef {object} StackbarPart
 * @property {string} [key]    stable id (default the label)
 * @property {string} label
 * @property {number} value    in the unit of `total`
 * @property {string} [tip]    the hover card's text, in place of label, value and share
 * @property {'warning' | 'destructive'} [tone]  a part that needs attention takes the status colour
 */
/**
 * @typedef {object} StackbarSpec
 * @property {StackbarPart[]} [parts]
 * @property {number} [total]       the whole; without it, the sum of the parts
 * @property {string} [title]       a line over the bar
 * @property {string} [summary]     the words at the head's end (default: the sum of the format over the whole)
 * @property {(value: number) => string} [format]  how a value reads (default: the number in the page's language)
 * @property {string} [restLabel]   the free row's label (default the dictionary's `stackbarRest`)
 * @property {number} [other]       parts under this share are merged into "Other" (default 0, none)
 * @property {{ at: number, label?: string }[]} [marks]  ticks across the bar at a share of the whole
 * @property {boolean} [legend]     default true
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]
 * @property {string} [message]     the sentence of an empty or failed bar
 * @property {boolean} [retry]      false leaves Retry out of a failed bar (a read the page cannot repeat)
 * @property {string} [label]       the bar's accessible name (default: every part in order)
 * @property {string[]} [picked]    keys of the parts the page has pressed; given (even empty), the parts are toggle buttons with `aria-pressed`
 */
/**
 * Draw (or redraw) a share bar. Calling it again with new numbers keeps the
 * focus on the part it was on, by key.
 * @param {HTMLElement} el the root, a `.kp-stackbar`
 * @param {StackbarSpec} spec
 */
export declare function setStackbar(el: HTMLElement, spec: StackbarSpec): void;
/**
 * Fill every `[data-kp-stackbar]` under `root` that carries its spec as JSON
 * in `data-kp-stackbar` (a page that draws with setStackbar() needs nothing).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachStackbars(root?: ParentNode): () => void;
