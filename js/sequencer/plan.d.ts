export type SequencerEdit = import('./units.js').SequencerEdit;
export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerOptions = import('./units.js').SequencerOptions;
export type SequencerOverlap = import('./units.js').SequencerOverlap;
export type SequencerPlan = import('./units.js').SequencerPlan;
export type SequencerRefusal = import('./units.js').SequencerRefusal;
/** @typedef {import('./units.js').SequencerEdit} SequencerEdit */
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./units.js').SequencerOptions} SequencerOptions */
/** @typedef {import('./units.js').SequencerOverlap} SequencerOverlap */
/** @typedef {import('./units.js').SequencerPlan} SequencerPlan */
/** @typedef {import('./units.js').SequencerRefusal} SequencerRefusal */
/**
 * Clean what a page gave: strings for ids, numbers for times, a `with` that names another item (a dangling one, one that names
 * itself and a cycle are dropped).
 * @param {readonly Partial<SequencerItem>[]} raw
 * @returns {SequencerItem[]}
 */
export declare function sequencerClean(raw: readonly Partial<SequencerItem>[]): SequencerItem[];
/**
 * The ids linked to `id`, itself included: everything its `with` chains connect to it, in both directions.
 * @param {readonly SequencerItem[]} items @param {string} id
 * @returns {Set<string>}
 */
export declare function sequencerGroup(items: readonly SequencerItem[], id: string): Set<string>;
/** `id` and every item whose `with` chain leads to it. @param {readonly SequencerItem[]} items @param {string} id */
export declare function followersOf(items: readonly SequencerItem[], id: string): Set<string>;
/** @param {SequencerItem} a @param {SequencerItem} b */
export declare const overlaps: (a: SequencerItem, b: SequencerItem) => boolean;
/**
 * Settle the items the edit moved against the rule: refuse an overlap, or push what is in the way later. Mutates `list`.
 * @param {SequencerItem[]} list @param {Iterable<string>} movedIds @param {SequencerOverlap} policy
 * @returns {{ ok: true, pushed: string[] } | { ok: false, reason: SequencerRefusal, blocker: string | null }}
 */
export declare function settle(list: SequencerItem[], movedIds: Iterable<string>, policy: SequencerOverlap): {
    ok: true;
    pushed: string[];
} | {
    ok: false;
    reason: SequencerRefusal;
    blocker: string | null;
};
/**
 * Plan an edit: where the items end up when `edit` is applied, or why it cannot be. Pure: `items` is never changed.
 * Move: the item and everything linked to it move by the same amount (the item alone changes lane). Resize end: the item's
 * duration. Resize start: the start of the item and of everything linked to it moves, their ends stay. Every value snaps to
 * `step` and to other items' edges within `reach`; nothing starts before 0; the overlap rule settles the rest.
 * @param {readonly SequencerItem[]} items
 * @param {SequencerEdit} edit
 * @param {SequencerOptions} [options]
 * @returns {SequencerPlan}
 */
export declare function sequencerPlan(items: readonly SequencerItem[], edit: SequencerEdit, options?: SequencerOptions): SequencerPlan;
