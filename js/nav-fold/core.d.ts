import { Controller } from '../controller.js';
import { FoldGroups } from './groups.js';
export declare class NavFoldCore extends Controller {
    list: HTMLElement;
    view: Window & typeof globalThis;
    doc: Document;
    /** The words this bar alone says differently, if any. */
    strings: Partial<import("../strings/types.js").Strings> | undefined;
    more: HTMLLIElement;
    wrapper: HTMLElement;
    button: HTMLButtonElement;
    menu: HTMLElement;
    label: HTMLElement;
    dot: HTMLElement;
    alertText: HTMLElement;
    groups: FoldGroups;
    /** What the menu was last drawn from, so an unchanged fit does not redraw it. */
    signature: string;
    /** The items that are folded now. @type {HTMLElement[]} */
    foldedNow: HTMLElement[];
    /** @type {ResizeObserver | null} */
    resize: ResizeObserver | null;
    /**
     * @param {HTMLElement} nav the `.kp-nav` carrying `data-kp-nav-fold`
     * @param {{ strings?: Partial<import('../strings.js').Strings> }} [options]
     */
    constructor(nav: HTMLElement, options?: {
        strings?: Partial<import('../strings.js').Strings>;
    });
    /** The dictionary this bar speaks. */
    words(): import("../strings/types.js").Strings;
    /** The label, the counter's words and the menu's name, in the bar's own words. */
    writeWords(): void;
    /** @returns {HTMLElement[]} the bar's own items, in order */
    itemsOf(): HTMLElement[];
    /** The toggle the narrow bar collapses into, when it is what the bar shows now. */
    toggled(): boolean;
    /** Per item: true when it leaves the bar, separators decided. @param {HTMLElement[]} items */
    plan(items: HTMLElement[]): boolean[];
    /** What the visible items use of the list, for a register that paints the list itself. */
    publishUsed(): void;
    /**
     * The menu's separators where the bar had one: the menu's own `.kp-menu__separator` before each group that followed a
     * folded separator. The menu draws its groups itself (and later, while it is open), so this runs after every draw.
     */
    ruleMenu(): void;
    /**
     * Mark the items that left the bar and the bar itself; the menu closes when nothing is folded any more.
     * @param {HTMLElement[]} items @param {HTMLElement[]} leaving everything that leaves, separators too @param {HTMLElement[]} folded the links among them
     */
    markItems(items: HTMLElement[], leaving: HTMLElement[], folded: HTMLElement[]): void;
    /** The More item's marks: the current page behind it, a counter behind it. @param {HTMLElement[]} folded */
    markMore(folded: HTMLElement[]): void;
    /** Draw the More menu from the groups when they changed. @param {import('../menu-button.js').MenuGroup[]} groups */
    drawMenu(groups: import('../menu-button.js').MenuGroup[]): void;
    /** Whether the folded set is another than the one last announced. @param {HTMLElement[]} items @param {HTMLElement[]} folded */
    changed(items: HTMLElement[], folded: HTMLElement[]): boolean;
    fit(): void;
}
