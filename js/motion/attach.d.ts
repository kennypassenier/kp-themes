import { Controller } from '../controller.js';
export type SizeOptions = import('./fold-size.js').SizeOptions;
/**
 * The motion of one root: the detach of every element it wired sits on the
 * instance, and the elements that leave the page are let go a microtask later.
 */
export declare class MotionRoot extends Controller {
    /** The boxes the page asks to ease beside the package's own. */
    sizeSelector: string;
    /** What each box gets when it is eased. @type {SizeOptions} */
    sizeOptions: SizeOptions;
    /** The detach of each element wired here. @type {Map<Element, () => void>} */
    detaches: Map<Element, () => void>;
    /** Whether a sweep of the elements that left is queued. */
    sweeping: boolean;
    /** @param {HTMLElement} root (a Document passes too) @param {SizeOptions & { size?: string }} [options] */
    constructor(root: HTMLElement, options?: SizeOptions & {
        size?: string;
    });
    connect(): void;
    /** @param {Element} el @param {() => void} detach */
    keep(el: Element, detach: () => void): void;
    /** Wire what is under `scope`, `scope` itself included. @param {ParentNode} scope */
    scan(scope: ParentNode): void;
    /** What is added is wired; what is removed is let go a microtask later, unless it came back. @param {MutationRecord[]} records */
    onChange(records: MutationRecord[]): void;
    /** Let go of every wired element no longer in the page. */
    sweep(): void;
    /** Let go of every element this root wired. */
    letGoAll(): void;
}
/**
 * Give every dialog its leaving motion and every box above its easing, under
 * `root` and in whatever is added to it later. A box, dialog or disclosure
 * that leaves the page is let go (its observers disconnected) a microtask
 * after it left, so a page that rebuilds itself on every navigation does not
 * keep the old boxes' watchers alive; one moved within the page stays.
 *
 * @param {ParentNode} [root]
 * @param {SizeOptions & { size?: string }} [options] `size`: more boxes to ease, as a selector, beside the package's own and `[data-kp-size-motion]` (a consumer's cards and panels, without marking each one); `arrive` and `arriveKeys` as for easeSize()
 * @returns {() => void} detach
 */
export declare function attachMotion(root?: ParentNode, { size, arrive, arriveKeys }?: SizeOptions & {
    size?: string;
}): () => void;
