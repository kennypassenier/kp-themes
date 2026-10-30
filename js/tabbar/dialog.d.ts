export type TabbarController = import('./controller.js').TabbarController;
/** @typedef {import('./controller.js').TabbarController} TabbarController */
export declare class TabbarDialog {
    bar: import("./controller.js").TabbarController;
    tab: HTMLElement;
    dialog: HTMLDialogElement;
    /** Whether it was this script that marked the tab current, so it takes back only that. */
    marked: boolean;
    /**
     * @param {TabbarController} bar the bar this tab belongs to
     * @param {HTMLElement} tab the tab that opens the dialog
     * @param {HTMLDialogElement} dialog
     */
    constructor(bar: TabbarController, tab: HTMLElement, dialog: HTMLDialogElement);
    connect(): void;
    /** Take the marks this tab and its dialog got off again. */
    release(): void;
    /** The tab says whether the dialog is open, and reads as current while the dialog holds the current page. */
    sync(): void;
    /** @param {MouseEvent} event */
    onPress(event: MouseEvent): void;
}
