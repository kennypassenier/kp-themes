import { BoardMoves } from './move.js';
export type BoardState = 'loading' | 'ready' | 'empty' | 'error';
/** @typedef {'loading' | 'ready' | 'empty' | 'error'} BoardState */
export declare class Board extends BoardMoves {
    tabs: HTMLDivElement;
    plate: HTMLDivElement;
    /** The lane a narrow board's switcher shows. */
    selected: string;
    /** @type {BoardState} */
    state: BoardState;
    words: string;
    /** The loading card over the lanes. @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    /** Whether the first frame has passed: a loading card arrives with motion only after it. */
    drawn: boolean;
    /** @param {HTMLElement} el @param {{ strings?: Partial<import('../strings.js').Strings> }} [options] */
    constructor(el: HTMLElement, options?: {
        strings?: Partial<import('../strings.js').Strings>;
    });
    connect(): void;
    markDrawn(): void;
    /** Lanes the page added to the board after it was attached join the track, its tabs, its group and its counts. */
    adopt(): void;
    /** Whether the board is narrow now, and whether it shows one lane under the switcher (anything but `scroll`, the default). */
    tabbed(): boolean;
    /** The narrow layout: under the switcher only the chosen lane shows (a tab panel); otherwise every lane, in the track. */
    layout(): void;
    /** One button per lane in the switcher: its name over its exact count (with the limit), on the tab's own count badge. */
    drawTabs(): void;
    markTabs(): void;
    countTabs(): void;
    focusSwitcher(): void;
    /** Show a lane of a narrow board under its switcher. @param {string} key @param {'pointer' | 'keyboard' | 'move' | 'page'} source */
    select(key: string, source: 'pointer' | 'keyboard' | 'move' | 'page'): void;
    /** A card sent to a lane that is not shown: the board shows that lane, so the card and its focus stay in sight. @param {CustomEvent} event */
    follow(event: CustomEvent): void;
    /** @param {Event} event */
    onTab(event: Event): void;
    /** ← → Home End between the tabs; the lane follows the focus. @param {KeyboardEvent} event */
    onTabKey(event: KeyboardEvent): void;
    /** While a card is dragged, holding it over a tab opens that lane, so the card can be dropped in it. @param {Event} event */
    springTab(event: Event): void;
    /** @param {BoardState} state @param {string} words */
    setState(state: BoardState, words: string): void;
    /** The package's plate over the whole board for an empty or failed board; the lanes under it are not read. */
    drawPlate(): void;
    /** The loading card over the lanes, the data table's own. */
    drawBusy(): void;
}
