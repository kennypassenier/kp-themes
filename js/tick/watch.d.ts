import { Controller } from '../controller.js';
/** One attach call on a root (a document, a shadow root or an element), which is the controller's host, built directly. */
export declare class TickWatch extends Controller {
    scope: ParentNode;
    doc: Document;
    view: (Window & typeof globalThis) | null;
    /** @param {ParentNode} scope */
    constructor(scope: ParentNode);
    /** The numbers under the root, the root itself first when it is one. */
    ticking(): HTMLElement[];
    /** Take a number's current text as the one shown, unless it has been looked at. @param {Element} el */
    remember(el: Element): void;
    connect(): void;
    /** @param {MutationRecord[]} records @param {Window & typeof globalThis} View */
    onMutations(records: MutationRecord[], View: Window & typeof globalThis): void;
    /** A number's text changed: tick, unless it is this module's own write. @param {Element} el */
    changed(el: Element): void;
}
/**
 * Watch every number under `root` (the body of attachTicks()).
 * @param {ParentNode} root
 * @returns {() => void} detach: every running tick lands on its number
 */
export declare function watchTicks(root: ParentNode): () => void;
