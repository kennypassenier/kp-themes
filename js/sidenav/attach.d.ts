/**
 * Wire every `.kp-sidenav` under `root`.
 *
 * @param {ParentNode} root
 * @param {{ strings?: Partial<import('../strings.js').Strings>, ownedBy?: string, store?: Storage | null }} [options]
 * @returns {() => void} detach
 */
export declare function attachSidenavs(root?: ParentNode, { strings, ownedBy, store }?: {
    strings?: Partial<import('../strings.js').Strings>;
    ownedBy?: string;
    store?: Storage | null;
}): () => void;
