import { Controller } from '../controller.js';
import { arrival } from './arrive.js';
export type SizeOptions = import('./fold-size.js').SizeOptions;
/** One box that eases its height: the state of its glide sits on the instance. */
export declare class BoxSize extends Controller {
    /** Which arrivals play when no `data-kp-arrive` says otherwise. */
    fallback: "all" | "new" | "none";
    /** The attributes that carry a row's stable id, the page's own first. */
    keys: string[];
    /** The height the box was last seen to settle at. */
    last: number;
    /** The glide running now. @type {Animation | null} */
    running: Animation | null;
    /** When the box last left its size to a fold it follows. */
    followedAt: number;
    /** Whether a change now is still the box's first render. @type {() => boolean} */
    fresh: () => boolean;
    /** Watches the box and its children. @type {ResizeObserver | null} */
    sizes: ResizeObserver | null;
    /** @param {HTMLElement} box @param {SizeOptions} [options] */
    constructor(box: HTMLElement, options?: SizeOptions);
    connect(): void;
    /** The glide stops and the box loses the style a glide gave it; motion watches one box fewer. */
    release(): void;
    /** Watch the box and each of its children as they are now. */
    watch(): void;
    /** @param {ResizeObserverEntry[]} entries */
    onResize(entries: ResizeObserverEntry[]): void;
    /**
     * During a glide a child may change size only because the box's height
     * moves (a stretched or squeezed item): the size the content asks for is
     * the same, so the glide goes on. Restarting it there started it again
     * from where it stood on every frame, and the box crept towards its size
     * for seconds. The effect is lifted off the box for one read, which
     * leaves its timing alone.
     * @returns {boolean} whether the content asks for the height already gliding to
     */
    asksTheSame(): boolean;
    /** Something in the box changed size: glide from the height on screen to the one it settles at. */
    settle(): void;
    /**
     * Whether the box takes `to` without a glide of its own: a theme switch, a first render, no change, an
     * empty end, or a fold in it that the box follows frame by frame.
     * @param {number} from @param {number} to
     */
    holds(from: number, to: number): boolean;
    /** @param {number} from @param {number} to @param {number} size @param {string} ease */
    glideTo(from: number, to: number, size: number, ease: string): void;
    /**
     * Which arrivals play for a change under `target`. A live view that
     * redraws its rows marks the box `data-kp-arrive="none"`, or every
     * refresh replays every arrival (the homelab dashboard's live repaint,
     * 2026-10-04); with `data-kp-arrive="new"` a redrawn row stays still and
     * only a row with a key not seen a moment ago arrives [port spec G].
     * A first render arrives as nothing: it is the page, not news.
     * @param {Node} target
     */
    modeOf(target: Node): string;
    /** What changed in the box arrives the theme's way; then the box settles. @param {MutationRecord[]} records */
    onChange(records: MutationRecord[]): void;
    /**
     * Only what changed over the whole batch arrives: an element hidden and
     * shown again in one task was never gone (the data table hides every row
     * and shows its page again on each render, and every shown row of every
     * group replayed its arrival when one group folded), and an element
     * taken out and put back is moved, not new (a sort appends its rows
     * again). Kenny, 2026-10-05.
     * @param {MutationRecord[]} records @param {ReturnType<typeof arrival> | null} motion
     */
    arriveAll(records: MutationRecord[], motion: ReturnType<typeof arrival> | null): void;
}
/**
 * Ease `box` to its new height whenever what is in it changes size, in both
 * directions; a change during a glide continues from where the box is.
 * @param {HTMLElement} box
 * @param {SizeOptions} [options]
 * @returns {() => void}
 */
export declare function easeSize(box: HTMLElement, { arrive: fallback, arriveKeys }?: SizeOptions): () => void;
