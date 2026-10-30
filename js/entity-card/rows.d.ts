import { IdentityDrawing } from './identity.js';
export type EntityData = import('./types.js').EntityData;
export declare class RowsDrawing extends IdentityDrawing {
    /** Whether the meters block carries the trend row. */
    trendOn: boolean;
    /** How many actions stand as buttons; the rest go in "More". */
    inline: number;
    /** The grid, or the card when it stands alone: the one place the columns and the fit are kept. */
    fitHost: HTMLElement;
    /** @param {HTMLElement} card @param {EntityData} data */
    constructor(card: HTMLElement, data: EntityData);
    /**
     * Whether the meters block carries the trend row: a lone refill that brings the first trend into a grid gives the cards already
     * there their row too (`auto`), and `auto` gives every card of the grid the row once one card has a trend.
     * @param {(cards: readonly HTMLElement[], slots?: string[]) => void} redraw draws other cards again
     */
    trend(redraw: (cards: readonly HTMLElement[], slots?: string[]) => void): void;
    /** 4. meters: a fixed number of rows; the number is always beside the bar. */
    meters(): void;
    /** One meter row: label, bar and number. @param {NonNullable<EntityData['meters']>[number] | undefined} m */
    meterRow(m: NonNullable<EntityData['meters']>[number] | undefined): HTMLElement;
    /** 5. actions: at most a few inline, the rest in the package's menu; a failed card puts Retry here. */
    actions(): void;
    /** The buttons of the actions row, and the "More" menu for those that did not fit. @param {HTMLElement} el */
    fillActions(el: HTMLElement): void;
    /** @param {NonNullable<EntityData['actions']>[number]} a */
    actionButton(a: NonNullable<EntityData['actions']>[number]): HTMLButtonElement;
    /** @param {HTMLElement} el @param {NonNullable<EntityData['actions']>} rest */
    moreMenu(el: HTMLElement, rest: NonNullable<EntityData['actions']>): void;
}
