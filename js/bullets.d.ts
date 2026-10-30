export { BULLETS, BULLETS_PICK_EVENT, BULLETS_RETRY_EVENT } from './bullets/values.js';
export { bulletTone } from './bullets/tone.js';
export type BulletRow = {
    key: string;
    label: string;
    detail?: string;
    /**
     * null: nothing to measure
     */
    value: number | null;
    /**
     * the figure as written, in place of format(value)
     */
    figure?: string;
    /**
     * a name (an identity mark is made) or a node
     */
    lead?: string | Node;
    /**
     * the row is a link
     */
    href?: string;
    /**
     * the row is a button
     */
    pick?: boolean;
};
export type BulletsSpec = {
    rows?: BulletRow[];
    threshold: number;
    /**
     * where the bar ends (default twice the threshold)
     */
    max?: number;
    /**
     * at or past this the row is destructive (default none)
     */
    bad?: number;
    format?: (value: number) => string;
    /**
     * default 'worst'
     */
    sort?: 'worst' | 'none';
    state?: 'ready' | 'loading' | 'empty' | 'error';
    /**
     * the sentence of a failed list
     */
    message?: string;
    /**
     * false leaves Retry out of a failed list (a read the page cannot repeat)
     */
    retry?: boolean;
    emptyTitle?: string;
    emptyText?: string;
    /**
     * how many waiting rows (default: the rows shown last, else 3)
     */
    loadingRows?: number;
    /**
     * what the busy card says
     */
    loadingWords?: string;
};
/**
 * @typedef {object} BulletRow
 * @property {string} key
 * @property {string} label
 * @property {string} [detail]
 * @property {number | null} value      null: nothing to measure
 * @property {string} [figure]          the figure as written, in place of format(value)
 * @property {string | Node} [lead]     a name (an identity mark is made) or a node
 * @property {string} [href]            the row is a link
 * @property {boolean} [pick]           the row is a button
 */
/**
 * @typedef {object} BulletsSpec
 * @property {BulletRow[]} [rows]
 * @property {number} threshold
 * @property {number} [max]             where the bar ends (default twice the threshold)
 * @property {number} [bad]             at or past this the row is destructive (default none)
 * @property {(value: number) => string} [format]
 * @property {'worst' | 'none'} [sort]  default 'worst'
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]
 * @property {string} [message]         the sentence of a failed list
 * @property {boolean} [retry]          false leaves Retry out of a failed list (a read the page cannot repeat)
 * @property {string} [emptyTitle]
 * @property {string} [emptyText]
 * @property {number} [loadingRows]     how many waiting rows (default: the rows shown last, else 3)
 * @property {string} [loadingWords]    what the busy card says
 */
/**
 * Draw (or redraw) a bullet list.
 * @param {HTMLElement} el the root, a `.kp-bullets`
 * @param {BulletsSpec} spec
 */
export declare function setBullets(el: HTMLElement, spec: BulletsSpec): void;
/**
 * Fill every `[data-kp-bullets]` under `root` that carries its spec as JSON
 * in the attribute (a page that draws with setBullets() needs nothing).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachBullets(root?: ParentNode): () => void;
