export type Strings = import('../strings.js').Strings;
export type MenuItem = {
    /**
     * what the action is called
     */
    label: string;
    /**
     * what it does, in one line
     */
    hint?: string;
    /**
     * a link rather than a button
     */
    href?: string;
    /**
     * with `href`: the file name to save under
     */
    download?: string;
    /**
     * why it cannot be used now; the entry stays, keeps its hint, and says this under it
     */
    disabled?: string | null;
    /**
     * a destructive action, in the destructive colour
     */
    danger?: boolean;
    /**
     * more attributes for the entry (`null` removes one)
     */
    attrs?: Record<string, string | null>;
    /**
     * what `kp-menu-select` reports (`data-kp-value`); the label when absent
     */
    value?: string;
};
export type MenuGroup = {
    /**
     * its heading
     */
    group: string;
    items: MenuItem[];
};
export type MenuDecorateInfo = {
    kind: 'menu-button' | 'menu-item';
    host: HTMLElement;
    key?: string;
    index?: number;
    label?: string;
    value?: string;
};
export type MenuButtonOptions = {
    /**
     * Called with the button and every entry the menu builds,
     * each time it builds one, so the consumer can mark them [R-DRIVE].
     */
    decorate?: (part: HTMLElement, info: MenuDecorateInfo) => void;
    /**
     * any of the dictionary's `menu…` words, for these menus only
     */
    strings?: Partial<Strings>;
};
export type MenuState = {
    wrapper: HTMLElement;
    button: HTMLElement;
    menu: HTMLElement;
    decorate: ((part: HTMLElement, info: MenuDecorateInfo) => void) | undefined;
    strings: Partial<Strings> | undefined;
    /**
     * what the menu shows now, as `menuSignature` writes it
     */
    drawn: string;
    /**
     * a fill that waits for the menu to close
     */
    pending: MenuGroup[] | 'loading' | null;
    /**
     * takes a menu raised over a clipping container out of the top layer again
     */
    lower?: (() => void) | null;
    open: boolean;
    empty: boolean;
    /**
     * what an open menu listens to, undone when it closes
     */
    off: (() => void)[];
    /**
     * the frame that places an open menu again after a resize, or 0
     */
    placing: number;
};
export type Edges = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};
export type Covered = Edges;
/** @typedef {import('../strings.js').Strings} Strings */
/**
 * One entry of a menu.
 * @typedef {object} MenuItem
 * @property {string} label what the action is called
 * @property {string} [hint] what it does, in one line
 * @property {string} [href] a link rather than a button
 * @property {string} [download] with `href`: the file name to save under
 * @property {string | null} [disabled] why it cannot be used now; the entry stays, keeps its hint, and says this under it
 * @property {boolean} [danger] a destructive action, in the destructive colour
 * @property {Record<string, string | null>} [attrs] more attributes for the entry (`null` removes one)
 * @property {string} [value] what `kp-menu-select` reports (`data-kp-value`); the label when absent
 */
/**
 * A group of entries under its heading. A nameless group, or a menu of one
 * entry, has no heading.
 * @typedef {object} MenuGroup
 * @property {string} group its heading
 * @property {MenuItem[]} items
 */
/**
 * What `decorate` is told about the control it is handed: the same shape every kp module's `decorate` takes.
 * `kind` is `menu-button` (the button that opens the menu) or `menu-item` (an entry; `index` counts from 0 across
 * the groups, `label` is its label, `value` its `data-kp-value`). `host` is the wrapper and `key` its `data-kp-key`.
 * @typedef {{ kind: 'menu-button' | 'menu-item', host: HTMLElement, key?: string, index?: number, label?: string, value?: string }} MenuDecorateInfo
 */
/**
 * @typedef {object} MenuButtonOptions
 * @property {(part: HTMLElement, info: MenuDecorateInfo) => void} [decorate]  Called with the button and every entry the menu builds,
 *   each time it builds one, so the consumer can mark them [R-DRIVE].
 * @property {Partial<Strings>} [strings]  any of the dictionary's `menu…` words, for these menus only
 */
/**
 * @typedef {object} MenuState
 * @property {HTMLElement} wrapper
 * @property {HTMLElement} button
 * @property {HTMLElement} menu
 * @property {((part: HTMLElement, info: MenuDecorateInfo) => void) | undefined} decorate
 * @property {Partial<Strings> | undefined} strings
 * @property {string} drawn what the menu shows now, as `menuSignature` writes it
 * @property {MenuGroup[] | 'loading' | null} pending a fill that waits for the menu to close
 * @property {(() => void) | null} [lower] takes a menu raised over a clipping container out of the top layer again
 * @property {boolean} open
 * @property {boolean} empty
 * @property {(() => void)[]} off what an open menu listens to, undone when it closes
 * @property {number} placing the frame that places an open menu again after a resize, or 0
 */
/** @typedef {{ left: number, top: number, right: number, bottom: number }} Edges */
/** How far in from each screen edge the page has something stuck: coveredEdges(). @typedef {Edges} Covered */
export {};
