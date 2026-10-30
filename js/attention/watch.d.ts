import { Controller } from '../controller.js';
/** One attach call on a root (a document, a shadow root or an element), which is the controller's host, built directly. */
export declare class AttentionWatch extends Controller {
    scope: ParentNode;
    view: (Window & typeof globalThis) | null;
    /** The watcher of each band. @type {Map<Element, MutationObserver>} */
    watchers: Map<Element, MutationObserver>;
    /** @param {ParentNode} scope */
    constructor(scope: ParentNode);
    /** The bands in a scope, the scope itself first when it is one. @param {ParentNode} scope @returns {Element[]} */
    bandsIn(scope: ParentNode): Element[];
    connect(): void;
    /** Sort a band now and whenever its items arrive or change severity. @param {Element} band */
    watch(band: Element): void;
    /** @param {MutationRecord[]} records @param {Window & typeof globalThis} view */
    onLater(records: MutationRecord[], view: Window & typeof globalThis): void;
    /** Let go of the bands that left the page. */
    letGo(): void;
}
/**
 * Keep every attention band under `root` worst first (the body of attachAttention()).
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function watchAttention(root: ParentNode): () => void;
