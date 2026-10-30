export type Need = import('../auto.js').Need;
/** @typedef {import('../auto.js').Need} Need */
export declare class AutoLoader {
    root: ParentNode;
    /** @type {unknown[]} */
    detaches: unknown[];
    /** @type {{ detach: () => void } | null} */
    effects: {
        detach: () => void;
    } | null;
    /** @type {WeakSet<Element>} */
    present: WeakSet<Element>;
    detached: boolean;
    /** @type {string[]} */
    modules: string[];
    /** What the fetched modules drew while they attached. @type {WeakSet<Element>} */
    drawn: WeakSet<Element>;
    /** A late module the page carries at load is fetched at once and attached later. @type {Map<Need, Promise<any>>} */
    prefetched: Map<Need, Promise<any>>;
    /** @type {Promise<void>[]} */
    pending: Promise<void>[];
    /** @type {Promise<void>} */
    ready: Promise<void>;
    settled: () => void;
    /** @param {ParentNode} root */
    constructor(root: ParentNode);
    /** Attach what needs no markup check, then fetch what the root carries. @returns {(() => void) & { ready: Promise<void>, modules: string[] }} */
    start(): (() => void) & {
        ready: Promise<void>;
        modules: string[];
    };
    /** @param {Need} need @param {Promise<any>} loading @param {WeakSet<Element>} asked the elements it attaches against */
    attachOnce(need: Need, loading: Promise<any>, asked: WeakSet<Element>): Promise<void>;
    /** Fetch every module the root carries; a late one is fetched now and attached after the rest. */
    fetchNeeded(): void;
    /**
     * The late modules, once the others have attached: asked for against what
     * was there at the start and what those modules drew or marked, and never
     * what a framework rendered since (js/as-of.js).
     */
    attachLate(): Promise<undefined> | undefined;
    /**
     * What the modules draw now is the page's first render, not news: the
     * root settles until they have all attached and two frames are painted,
     * and js/motion.js lets nothing arrive or glide under it meanwhile
     * [fix-100]. A module fetched later than motion (the data table, three
     * thousand lines) drew its whole chrome into an eased box, and 263
     * elements arrived on the catalogue's first frame.
     */
    settle(): void;
    detach(): void;
}
