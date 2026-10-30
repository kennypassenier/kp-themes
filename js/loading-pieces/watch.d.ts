import { Controller } from '../controller.js';
/** One attach call on a root (a document, a shadow root or an element), which is the controller's host, built directly. */
export declare class LoadingPiecesWatch extends Controller {
    scope: ParentNode;
    /** The parts that wear pieces now. @type {Set<Element>} */
    dressed: Set<Element>;
    /** The parts to look at again at the next frame. @type {Set<Element>} */
    waiting: Set<Element>;
    /** The animation frame of the next flush, or 0. */
    frame: number;
    /** Whether the next flush looks at every part under the root. */
    everything: boolean;
    /** Watches the size of the dressed parts, where the engine can. @type {ResizeObserver | null} */
    sizes: ResizeObserver | null;
    /** @param {ParentNode} scope */
    constructor(scope: ParentNode);
    connect(): void;
    schedule(): void;
    /** @param {Element} el */
    queue(el: Element): void;
    /** Look at the queued parts, or at every part when the theme changed. */
    flush(): void;
    /** Dress one part, or let it go when it left the page or stopped waiting. @param {Element} el */
    refresh(el: Element): void;
    /** @param {Element} el */
    release(el: Element): void;
    undressAll(): void;
    /** @param {MutationRecord[]} records */
    onMutations(records: MutationRecord[]): void;
    /** @param {MutationRecord} r */
    onAttribute(r: MutationRecord): void;
    /** @param {MutationRecord} r */
    onChildren(r: MutationRecord): void;
}
/**
 * Watch `root` for parts that wait and give each the pieces its theme
 * names (the body of attachLoadingPieces()).
 * @param {ParentNode} root
 * @returns {() => void} detach: every piece goes, the parts are as they came
 */
export declare function watchPieces(root: ParentNode): () => void;
