import { Controller } from '../controller.js';
/** One fold: whether it is folding shut and the glide it plays sit on the instance. */
export declare class FoldControl extends Controller {
    /** The details element this fold moves. */
    details: HTMLDetailsElement;
    /** Its summary: the height it folds shut to. */
    summary: HTMLElement;
    /** The glide running now. @type {Animation | null} */
    running: Animation | null;
    /** Whether the glide running now folds it shut. */
    folding: boolean;
    /** Whether a change now is still the fold's first render. @type {() => boolean} */
    fresh: () => boolean;
    /** Watches `open` set from outside. @type {MutationObserver | null} */
    watcher: MutationObserver | null;
    /** @param {HTMLElement} host a `<details>` with a summary @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** The glide stops and the fold loses what a glide gave it; motion watches one fold fewer. */
    release(): void;
    /** The height of the fold shut: its summary and its borders. */
    shutHeight(): number;
    /** `open` set by the fold itself, which the watcher does not answer. @param {boolean} value */
    setOpen(value: boolean): void;
    /**
     * Glide open or shut from the height the fold stands at now. While it
     * folds shut it carries `data-kp-folding`, so what counts only what is
     * shown (a tile set, js/tiles.js) lets it go at the start of the fold
     * rather than at its end.
     * @param {boolean} opening @param {number} from @param {number} size @param {string} ease
     */
    move(opening: boolean, from: number, size: number, ease: string): void;
    /** The glide that owned the fold played out: a fold shut lets go of `open` now. */
    landed(): void;
    /** A press on the summary glides instead of jumping. @param {Event} event */
    onClick(event: Event): void;
    /** `open` changed from outside: glide from where the fold stands. @param {MutationRecord[]} records */
    onOpenSet(records: MutationRecord[]): void;
}
/**
 * Unfold a `<details>` from its summary's height to its open height, and
 * fold it back before `open` goes away.
 * @param {HTMLDetailsElement} details
 * @returns {() => void}
 */
export declare function attachFold(details: HTMLDetailsElement): () => void;
