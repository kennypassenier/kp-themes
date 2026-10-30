import { Controller } from '../controller.js';
/** The controller of one `.kp-feed` host. */
export declare class FeedController extends Controller {
    /** The clock. */
    now: () => number;
    /** The zone a day is counted in. */
    zone: string;
    /** The id the rows' regions are numbered under. */
    id: string;
    /** The fixed parts of the feed. */
    parts: {
        head: HTMLElement;
        count: HTMLElement;
        fresh: HTMLElement;
        stale: HTMLElement;
        staleText: HTMLElement;
        staleAction: HTMLButtonElement;
        body: HTMLElement;
        skeleton: HTMLElement;
        list: HTMLElement;
        state: HTMLElement;
        foot: HTMLElement;
        voice: HTMLElement;
    };
    /** @type {import('./constants.js').FeedModel} */
    model: import('./constants.js').FeedModel;
    /** The rows that are open, by key. @type {Set<string>} */
    open: Set<string>;
    /** The keys the last model showed, for the announcement of new ones. @type {Set<string> | null} */
    seen: Set<string> | null;
    /** The busy card of a loading feed. @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    /** When new rows were last said. */
    lastSaid: number;
    /** The day the headings were last drawn for. */
    drawnDay: string;
    /** The moment the next row turns from an ago line into a moment. */
    nextFlip: number;
    /** What a page gets back from feedOf(). @type {import('./constants.js').FeedHandle} */
    handle: import('./constants.js').FeedHandle;
    /**
     * @param {HTMLElement} host
     * @param {{ now?: () => number, timeZone?: string }} [options] `now` so a test never reads the real clock
     */
    constructor(host: HTMLElement, options?: {
        now?: () => number;
        timeZone?: string;
    });
    connect(): void;
    /** Draw again, with the options as they stand now. */
    render(): void;
    /** A row that turned a day old, or midnight: draw again. */
    onTick(): void;
    /** Give the feed its rows, or its state. @param {import('./constants.js').FeedModel} next */
    set(next: import('./constants.js').FeedModel): void;
    /** Open exactly these rows (or every row that has lines), close the rest; fires no event. @param {readonly string[] | 'all'} keys */
    setOpen(keys: readonly string[] | 'all'): void;
    /** New rows are said once, politely, at most every ten seconds. @param {import('./constants.js').FeedRow[]} fresh */
    announce(fresh: import('./constants.js').FeedRow[]): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** Open or close one row; `one` closes the others first. @param {Element | null} li */
    toggleRow(li: Element | null): void;
    /** Show a row open or closed without drawing the feed again. @param {Element | null} li @param {boolean} on */
    paintOpen(li: Element | null, on: boolean): void;
    /** The arrow keys move between the rows' controls. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
