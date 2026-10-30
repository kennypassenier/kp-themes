import { ScopeWatch } from './scope.js';
export declare class KpiStrips extends ScopeWatch {
    /** The strips already observed for their size. @type {Set<HTMLElement>} */
    watched: Set<HTMLElement>;
    /** @type {ResizeObserver | null} */
    sizes: ResizeObserver | null;
    /**
     * @param {ParentNode} scope
     * @param {Record<string, unknown>} [options]
     */
    constructor(scope: ParentNode, options?: Record<string, unknown>);
    connect(): void;
    /** Put every strip under the scope on its column count, and start watching the ones not watched yet. */
    scan(): void;
}
