/** The lists this module looks after. */
export declare const CHECKLIST = "[data-kp-checklist]";
/** Fired on a tick: `{ id, checked, items }`. */
export declare const CHECKLIST_EVENT = "kp-checklist-change";
/** Fired on Clear checked: `{ removed, items }`. */
export declare const CHECKLIST_CLEAR_EVENT = "kp-checklist-clear";
/** Fired on Undo: `{ restored, items }`. */
export declare const CHECKLIST_UNDO_EVENT = "kp-checklist-undo";
/** Fired on the list, bubbling, when the Retry of its failed state is pressed [r6r8-1019]. */
export declare const CHECKLIST_RETRY_EVENT = "kp-checklist-retry";
/** Fired on the list (not bubbling) after every draw, so a part that adds to the rows can draw its cells [kpadopt6]. */
export declare const CHECKLIST_RENDER_EVENT = "kp-checklist-render";
/** How long Undo is offered after a clear, unless the list says otherwise [ms]. */
export declare const CHECKLIST_UNDO_MS = 6000;
export type ChecklistItem = import('../checklist.js').ChecklistItem;
export type Undo = {
    removed: ChecklistItem[];
    at: Map<string, number>;
    timer: ReturnType<typeof setTimeout>;
};
/** @typedef {import('../checklist.js').ChecklistItem} ChecklistItem */
/** @typedef {{ removed: ChecklistItem[], at: Map<string, number>, timer: ReturnType<typeof setTimeout> }} Undo */
/** Per list: the items in their own order (the order they were given in). @type {WeakMap<Element, ChecklistItem[]>} */
export declare const ITEMS: WeakMap<Element, ChecklistItem[]>;
/** Per list: the Undo on offer. @type {WeakMap<Element, Undo>} */
export declare const UNDO: WeakMap<Element, Undo>;
/** Per empty line: the plate drawn in it (its kind and words), so a draw that changes nothing leaves it alone. @type {WeakMap<Element, string>} */
export declare const PLATE: WeakMap<Element, string>;
/** Per list: the busy card while loading. @type {WeakMap<Element, import('../busy-card.js').BusyCard>} */
export declare const BUSY: WeakMap<Element, import('../busy-card.js').BusyCard>;
/** The next id number. */
export declare const nextSerial: () => number;
/** Whether ticked items sink to the end of their group (`data-kp-checklist-sink`, on by default). @param {Element} list */
export declare const sinks: (list: Element) => boolean;
/** @param {Element} list @returns {ChecklistItem[]} */
export declare function getChecklistItems(list: Element): ChecklistItem[];
