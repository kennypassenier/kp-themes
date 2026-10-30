export type MenuGroup = import('../menu-button.js').MenuGroup;
export type MenuItem = import('../menu-button.js').MenuItem;
/** @typedef {import('../menu-button.js').MenuGroup} MenuGroup */
/** @typedef {import('../menu-button.js').MenuItem} MenuItem */
export declare class FoldGroups {
    words: () => import('../strings.js').Strings;
    /** The real link behind each entry, by the entry's value. @type {HTMLElement[]} */
    sources: HTMLElement[];
    /** The menu's groups that follow a folded separator. @type {Set<MenuGroup>} */
    ruled: Set<MenuGroup>;
    /** Their places among the groups the menu draws (menu-button.js leaves out an empty group). @type {number[]} */
    ruledAt: number[];
    /** @type {MenuGroup[]} */
    groups: MenuGroup[];
    /** The open group of plain links, while the folded items are plain links. @type {MenuItem[] | null} */
    plain: MenuItem[] | null;
    /** A folded separator was seen: the next group stands below a rule. */
    rule: boolean;
    s: import("../strings/types.js").Strings;
    /** @param {() => import('../strings.js').Strings} words the dictionary this bar speaks */
    constructor(words: () => import('../strings.js').Strings);
    /**
     * The menu's groups for the folded items; `sources` keeps the real link behind each entry.
     * @param {HTMLElement[]} folded
     * @returns {MenuGroup[]}
     */
    build(folded: HTMLElement[]): MenuGroup[];
    /** One folded item: a plain link joins the open group, an item with a panel is a group of its own. @param {HTMLElement} li */
    take(li: HTMLElement): void;
    /** @param {HTMLElement} el @returns {MenuItem} */
    entry(el: HTMLElement): MenuItem;
    /** @param {MenuGroup} group */
    open(group: MenuGroup): void;
}
