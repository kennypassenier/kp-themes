import { Controller } from '../controller.js';
/** One attach call on a scope. Not keyed on the scope: several calls on one root each work, as they did before. */
export declare class ScopeWatch extends Controller {
    scope: ParentNode;
    doc: Document;
    view: (Window & typeof globalThis) | null;
    /**
     * @param {ParentNode} scope
     * @param {Record<string, unknown>} [options]
     */
    constructor(scope: ParentNode, options?: Record<string, unknown>);
}
/**
 * Run one attach call: build the watch, connect it, hand back its detach. A connect that throws is undone and the error goes on.
 * @template {ScopeWatch} W
 * @param {new (scope: ParentNode, options?: any) => W} Watch
 * @param {ParentNode} scope
 * @param {Record<string, unknown>} [options]
 * @returns {() => void} detach
 */
export declare function attachScope<W extends ScopeWatch>(Watch: new (scope: ParentNode, options?: any) => W, scope: ParentNode, options?: Record<string, unknown>): () => void;
