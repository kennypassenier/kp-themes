import { Controller } from '../controller.js';
import { getStrings } from '../strings.js';
import { threadOptions } from './options.js';
export type ThreadSpec = import('../thread.js').ThreadSpec;
export type Strings = ReturnType<typeof getStrings>;
export declare class ThreadView extends Controller {
    /** @type {ThreadSpec} */
    spec: ThreadSpec;
    /** The tallest the thread has been, so a state in its place keeps its room [px]. */
    height: number;
    /** @type {import('../busy-card.js').BusyCard | null} */
    card: import('../busy-card.js').BusyCard | null;
    /** Whether anything was drawn yet: the first busy card arrives without its entrance. */
    drawn: boolean;
    /** A spec that waits for the busy card to close. @type {ThreadSpec | null} */
    pending: ThreadSpec | null;
    /** The keys the reader opened whole. @type {Set<string>} */
    expanded: Set<string>;
    /** @type {ResizeObserver | null} */
    watcher: ResizeObserver | null;
    /** The width the folds were last measured at [px]. */
    width: number;
    /** @param {HTMLElement} el */
    constructor(el: HTMLElement);
    scrollToNewest(smooth?: boolean): void;
    /** Draw now, or, while the busy card is up, once it has closed (a later spec wins). @param {ThreadSpec} spec */
    drawAfterCard(spec: ThreadSpec): void;
    /** Two skeleton bubbles under the theme's busy card, at the height the thread had. @param {ThreadSpec} spec */
    drawLoading(spec: ThreadSpec): void;
    /** @param {'in' | 'out'} dir */
    waitItem(dir: 'in' | 'out'): HTMLElement;
    draw(): void;
    /** The empty or failed note, at the height the thread had. @param {boolean} failed @param {boolean} refocus */
    drawNote(failed: boolean, refocus: boolean): void;
    /** The messages in their days, the scroll kept where the reader left it unless they were at the newest. */
    drawMessages(): void;
    /** The list: a divider per day (when asked), then each run of messages. @param {ReturnType<typeof threadOptions>} options @param {string} locale */
    listOf(options: ReturnType<typeof threadOptions>, locale: string): HTMLElement;
    /** Wrapping changes with the width: the lines a message has, and so its fold, are measured again. */
    watchWidth(): void;
    /** Measure every foldable body and show or hide its Show all: a message with no more lines than its limit is shown whole. */
    fitFolds(): void;
    /** @param {HTMLElement} item @param {string} key */
    applyFold(item: HTMLElement, key: string): void;
}
