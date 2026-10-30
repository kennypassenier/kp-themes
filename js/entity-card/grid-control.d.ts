import { Controller } from '../controller.js';
export declare class EntityGridControl extends Controller {
    /** The width the cards were last fitted for. */
    lastWidth: number;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** The least card width the grid asks for. */
    applyMin(): void;
    /** A narrow grid puts every action in "More". */
    fold(): void;
    /** A new width: forget what fitted before and draw the flags and actions again. */
    refit(): void;
    /** An option changed: every card is drawn again from its last data. */
    onOption(): void;
}
