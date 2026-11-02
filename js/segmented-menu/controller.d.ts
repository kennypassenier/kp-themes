import { Controller } from '../controller.js';
export declare class ChipMenu extends Controller {
    /** The chip this menu belongs to: the item right before it in the group. */
    get item(): HTMLElement | null;
    /** The menu button's wrapper (the host) and its button. */
    get menu(): {
        wrapper: HTMLElement;
        button: HTMLButtonElement | null;
    };
    connect(): void;
    /** The menu button says whose menu it is, unless the page named it. */
    name(): void;
    /** The menu button is a tab stop exactly when its chip is (one stop per group, plus the menu of the chip in hand). */
    stop(): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** Turn the chip into a field, unless it already is one or cannot be renamed. */
    rename(): void;
}
