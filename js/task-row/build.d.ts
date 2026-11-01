/** Fired on the row, bubbling, when its box is ticked or unticked: `{ key, done }`. */
export declare const TASK_TOGGLE_EVENT = "kp-task-toggle";
/** Fired on the row, bubbling, when its title is pressed: `{ key, source }`. */
export declare const TASK_OPEN_EVENT = "kp-task-open";
export type TaskFact = import('./facts.js').TaskFact;
export type MenuGroup = import('../menu-button.js').MenuGroup;
export type TaskRowSpec = {
    /**
     * the task's id: `data-kp-row-key` (row picking) and `data-kp-item` (a reorder list)
     */
    key: string;
    title: string;
    done?: boolean;
    /**
     * high and medium draw an edge in the warning or destructive colour
     */
    priority?: 'high' | 'medium' | 'low' | 'none';
    /**
     * the line under the title
     */
    facts?: (TaskFact | string | Node)[];
    /**
     * the page's icon buttons, each in a fixed column (a timer), before the menu
     */
    actions?: HTMLElement[];
    /**
     * the ⋯ menu's entries; the row's context menu (right click, long press) shows the same
     */
    menu?: MenuGroup[];
    /**
     * a drag handle in the first column (the row is then an item of a reorder list); default true
     */
    handle?: boolean;
};
/**
 * Draw a task row. Its events bubble from the row: `kp-task-toggle` `{ key, done }` when the box is ticked or unticked,
 * `kp-task-open` `{ key, source }` when the title is pressed; a pick in its ⋯ menu or its context menu is the menu button's
 * `kp-menu-select` `{ item, value }`.
 * @param {Document} doc
 * @param {TaskRowSpec} spec
 * @param {{ tag?: 'li' | 'div', strings?: Partial<import('../strings.js').Strings> }} [options]
 * @returns {HTMLElement}
 */
export declare function buildTaskRow(doc: Document, spec: TaskRowSpec, { tag, strings }?: {
    tag?: 'li' | 'div';
    strings?: Partial<import('../strings.js').Strings>;
}): HTMLElement;
