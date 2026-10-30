export { FACETS, FACET_EVENT } from './facets/values.js';
export { identityCells } from './facets/pattern.js';
export { getFacetValues, setFacetValues, setFacetCounts, setFacetItems } from './facets/api.js';
export type FacetItem = {
    /**
     * what the row stands for
     */
    value: string;
    label: string;
    /**
     * shown at the end of the row; null leaves its place empty
     */
    count?: number | string | null;
    /**
     * a CSS colour for the small square before the name
     */
    swatch?: string;
    /**
     * a seed (a name) for an identity pattern drawn over the swatch [kpadopt3]; '' takes it away
     */
    pattern?: string;
    /**
     * a new row is on when absent; a row that is already there keeps its state when absent
     */
    checked?: boolean;
    /**
     * cannot be turned on or off, and has no "only"
     */
    disabled?: boolean;
};
/**
 * @typedef {object} FacetItem
 * @property {string} value what the row stands for
 * @property {string} label
 * @property {number | string | null} [count] shown at the end of the row; null leaves its place empty
 * @property {string} [swatch] a CSS colour for the small square before the name
 * @property {string} [pattern] a seed (a name) for an identity pattern drawn over the swatch [kpadopt3]; '' takes it away
 * @property {boolean} [checked] a new row is on when absent; a row that is already there keeps its state when absent
 * @property {boolean} [disabled] cannot be turned on or off, and has no "only"
 */
/**
 * Wire every facet group under `root`: the checkboxes, the "only" buttons and
 * the "Everything" row. Rows written later by setFacetItems() are covered
 * because the listeners are on the group.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachFacets(root?: ParentNode): () => void;
