import { MasterDetailBase } from './base.js';
/**
 * The controller of one `[data-kp-master-detail]` layout that has a detail pane and a window, and a list pane, or, without one, an
 * aside: the detail + aside variant [homelab gap 73], where the detail always shows and only the aside folds.
 */
export declare class MasterDetailController extends MasterDetailBase {
    connect(): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** The arrow keys, Home and End move the selection; Enter and Space open; Esc closes the aside or the folded detail. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** A key on a list item: move, jump, or open. @param {KeyboardEvent} event @param {HTMLElement} item */
    onItemKey(event: KeyboardEvent, item: HTMLElement): void;
    onPop(): void;
    onSize(): void;
}
