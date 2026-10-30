export type Memory = import('../remember.js').Memory;
export type Remembered = import('../remember.js').Remembered;
/** @typedef {import('../remember.js').Memory} Memory */
/** @typedef {import('../remember.js').Remembered} Remembered */
/**
 * The groups of one side navigation, each with the id its state is kept
 * under: its own `data-kp-remember`, else the words in its toggle, else its
 * place in the panel. Exported so the module writes the same ids the
 * painter reads.
 *
 * @param {Element} panel
 * @returns {{ group: Element, toggle: Element | null, id: string }[]}
 */
export declare function sidenavGroups(panel: Element): {
    group: Element;
    toggle: Element | null;
    id: string;
}[];
/**
 * A tree item's id, the same rule js/structure.js uses for its handle.
 *
 * @param {Element} item
 * @returns {string}
 */
export declare function treeItemId(item: Element): string;
/**
 * A column's id: the field it names, else the words in its header. An
 * index would have been shorter and wrong — the data table inserts columns
 * of controls of its own, so the third column in the markup is not the
 * third column the module counts.
 *
 * @param {Element} header
 * @returns {string}
 */
export declare function columnId(header: Element): string;
/** @param {Element} element @param {Memory} memory */
export declare function paintDisclosure(element: Element, memory: Memory): void;
/**
 * Put what was remembered back on the element, as markup, and hand the
 * caller the memory to go on writing to. Null when the element asked for
 * no memory or its name was taken.
 *
 * @param {Element} element
 * @param {Remembered} component
 * @param {{ storage?: Storage | null }} [options]
 * @returns {Memory | null}
 */
export declare function paintRemembered(element: Element, component: Remembered, options?: {
    storage?: Storage | null;
}): Memory | null;
/**
 * Paint every remembering element under `root`, before anything attaches
 * and before the first frame. Idempotent: each module paints its own
 * element again when it attaches, so a component rendered later is
 * restored too.
 *
 * @param {ParentNode} [root]
 */
export declare function restoreRemembered(root?: ParentNode): void;
