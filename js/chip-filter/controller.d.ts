import { Controller } from '../controller.js';
export declare class ChipFilter extends Controller {
    /** The column's number in the table, once the table is attached; -1 before. */
    at: number;
    /** The values the chips were last made from (auto chips), to know when to make them again. */
    made: string;
    /** The frame a recount waits for. */
    frame: number;
    /** @param {HTMLElement} host the chip group */
    constructor(host: HTMLElement);
    connect(): void;
    /** The table's wrapper, or null while it is not on the page. @returns {HTMLElement | null} */
    wrap(): HTMLElement | null;
    /** Find the table, its column and its rows, once; then count and paint. */
    link(): void;
    /** Count again on the next frame: a burst of row changes is counted once. */
    soon(): void;
    /** One value per row the table holds (a held-out, detail, group or loading row is none). @returns {string[]} */
    rowValues(): string[];
    /** The All item's value: the one the page wrote, else none. */
    allValue(): string;
    /** Make the chips again (auto) or give the page's chips an All item, then write every count. */
    recount(): void;
    /** Whether the chips are made from the column (the page asked, or wrote none). */
    auto(): boolean;
    /** @param {string[]} values */
    makeChips(values: string[]): void;
    /** A page's own chips without an All item get one, first. */
    ensureAll(): void;
    /** A press: the chips on become the column's filter; All (or nothing) lifts it. */
    toTable(): void;
    /** The table's filter on the column, whoever set it, lights the chips (no event). */
    fromTable(): void;
}
