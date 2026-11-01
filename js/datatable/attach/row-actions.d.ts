export type DataTableControl = import('./controller.js').DataTableControl;
export declare class TableRowActions {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** The groups already folded, so a redraw never folds one twice. @type {WeakSet<Element>} */
    done: WeakSet<Element>;
    /** What each moved action was before: class, role and tabindex. @type {WeakMap<HTMLElement, { className: string, role: string | null, tabindex: string | null, destructive: boolean }>} */
    memory: WeakMap<HTMLElement, {
        className: string;
        role: string | null;
        tabindex: string | null;
        destructive: boolean;
    }>;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** Whether the table asked for the menu form. */
    get wanted(): boolean;
    /** Fold the actions of every row that has not been folded yet; rows the page adds later are folded when they are first drawn. */
    sync(): void;
    /** The one that stays: the page's mark, else the first that is not destructive, else the first. @param {HTMLElement[]} items */
    primaryOf(items: HTMLElement[]): HTMLElement;
    /** @param {HTMLElement} group */
    fold(group: HTMLElement): void;
    /** The menu button with its menu; every action moves in as an entry. @param {HTMLElement[]} rest */
    buildMenu(rest: HTMLElement[]): HTMLElement;
    /** One action becomes a menu entry; what it was is kept so the detach can give it back. @param {HTMLElement} item @param {HTMLElement} menu */
    toEntry(item: HTMLElement, menu: HTMLElement): void;
    /** Put every action back in its group, in its own order, as the page wrote it. @param {HTMLElement} group @param {HTMLElement} wrapper @param {HTMLElement[]} rest @param {HTMLElement} primary */
    unfold(group: HTMLElement, wrapper: HTMLElement, rest: HTMLElement[], primary: HTMLElement): void;
}
