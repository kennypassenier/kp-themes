import { ListPlate } from './intent-plate.js';
export type IntentMode = import('./intent-dom.js').IntentMode;
export type Ranked = import('./intent-rank.js').Ranked;
/**
 * The intent matcher's side of one palette: score every command, hide what does not answer, put the best answer first in its
 * group, mark the matched words, keep the status line exact, and stand an empty or failed plate in the list's footprint. The
 * commands stay the consumer's markup; this only hides, moves and marks them, and gives all of it back on destroy().
 */
export declare class IntentFilter {
    dialog: HTMLDialogElement;
    list: HTMLElement;
    status: HTMLElement | null;
    doc: Document;
    /** Where each command stood in the markup, so the order comes back when nothing is typed. @type {WeakMap<Element, number>} */
    origin: WeakMap<Element, number>;
    /** @type {WeakMap<Element, number>} */
    groupOrigin: WeakMap<Element, number>;
    /** @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    /** @type {'ready' | 'loading' | 'error'} */
    state: 'ready' | 'loading' | 'error';
    /** @type {{ message?: string }} */
    stateOptions: {
        message?: string;
    };
    plate: ListPlate;
    /** @param {HTMLDialogElement} dialog @param {HTMLElement} list @param {HTMLElement | null} status */
    constructor(dialog: HTMLDialogElement, list: HTMLElement, status: HTMLElement | null);
    /** @returns {IntentMode} */
    mode(): IntentMode;
    /** @param {HTMLElement[]} options */
    assignOrigins(options: HTMLElement[]): void;
    recentKey(): string;
    /** The values chosen last, newest first. @returns {string[]} */
    readRecent(): string[];
    /**
     * Filter, rank and mark for `rawQuery`.
     * @param {string} rawQuery
     * @returns {number} how many commands are shown
     */
    run(rawQuery: string): number;
    /**
     * Which are shown: the answers, up to the cap when a query (or a start set) narrows them; the shown ones marked.
     * @param {Ranked[]} items @param {string[]} want @param {IntentMode} mode @param {boolean} capped
     * @returns {number} how many are shown
     */
    show(items: Ranked[], want: string[], mode: IntentMode, capped: boolean): number;
    /** The status line is exact; a cap says so. @param {number} shown @param {number} total */
    writeStatus(shown: number, total: number): void;
    /**
     * A failed list stands the failed plate above the commands that stay; a query that found nothing, with `data-kp-nomatch="plate"`,
     * the empty plate that says what to try.
     * @param {string} rawQuery @param {string[]} want @param {IntentMode} mode @param {HTMLElement[]} options @param {number} shown
     */
    plateFor(rawQuery: string, want: string[], mode: IntentMode, options: HTMLElement[], shown: number): void;
    /** @param {'ready' | 'loading' | 'error'} next @param {{ message?: string }} [options] */
    setState(next: 'ready' | 'loading' | 'error', options?: {
        message?: string;
    }): void;
    /** Remember a chosen value, when the palette keeps `data-kp-recent` of them. @param {string} value */
    remember(value: string): void;
    /** Give everything back: the busy card, the plate, the marks, the label wraps and the markup's own order. */
    destroy(): void;
    /** @param {HTMLElement[]} options */
    restoreOrder(options: HTMLElement[]): void;
}
/**
 * The intent filter of one palette.
 * @param {HTMLDialogElement} dialog
 * @param {HTMLElement} list
 * @param {HTMLElement | null} status
 */
export declare function createIntentFilter(dialog: HTMLDialogElement, list: HTMLElement, status: HTMLElement | null): IntentFilter;
