export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerKeyAction = import('./units.js').SequencerKeyAction;
export type SequencerOptions = import('./units.js').SequencerOptions;
export type SequencerPlan = import('./units.js').SequencerPlan;
export type SequencerRefusal = import('./units.js').SequencerRefusal;
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./units.js').SequencerKeyAction} SequencerKeyAction */
/** @typedef {import('./units.js').SequencerOptions} SequencerOptions */
/** @typedef {import('./units.js').SequencerPlan} SequencerPlan */
/** @typedef {import('./units.js').SequencerRefusal} SequencerRefusal */
/** The ids whose lane, start, duration or partner differ between two lists. @param {readonly SequencerItem[]} before @param {readonly SequencerItem[]} after */
export declare function changedIds(before: readonly SequencerItem[], after: readonly SequencerItem[]): string[];
/**
 * Make `id` run alongside `partnerId`: it (and what runs alongside it) moves to the partner's start; the overlap rule settles the
 * rest. A partner whose chain leads back to the item is refused (`cycle`). Pure.
 * @param {readonly SequencerItem[]} items @param {string} id @param {string} partnerId @param {SequencerOptions} [options]
 * @returns {SequencerPlan}
 */
export declare function sequencerLink(items: readonly SequencerItem[], id: string, partnerId: string, options?: SequencerOptions): SequencerPlan;
/** Let `id` run on its own. Pure. @param {readonly SequencerItem[]} items @param {string} id @returns {SequencerPlan} */
export declare function sequencerUnlink(items: readonly SequencerItem[], id: string): SequencerPlan;
/**
 * What a key does to the item that is picked up. Arrows move by the step (Ctrl: ten steps), Shift+arrows resize the end,
 * Ctrl+Shift+arrows the start, Alt+Up/Down change lane, Enter or Space drops, Escape puts back. `by` of a move or resize is in
 * the unit, positive toward the end of the axis; `rtl` swaps left and right.
 * @param {{ key: string, shiftKey?: boolean, ctrlKey?: boolean, metaKey?: boolean, altKey?: boolean }} e
 * @param {{ step?: number, rtl?: boolean }} [options]
 * @returns {SequencerKeyAction | null}
 */
export declare function sequencerKey(e: {
    key: string;
    shiftKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    altKey?: boolean;
}, { step, rtl }?: {
    step?: number;
    rtl?: boolean;
}): SequencerKeyAction | null;
/**
 * The plan a key makes of the picked-up item (see sequencerKey): one step on the grid, no edge snap, refused (`edge`) when
 * nothing could change.
 * @param {readonly SequencerItem[]} items @param {string} id
 * @param {Exclude<SequencerKeyAction, { kind: 'drop' } | { kind: 'cancel' }>} action
 * @param {SequencerOptions} [options]
 * @returns {SequencerPlan}
 */
export declare function sequencerApplyKey(items: readonly SequencerItem[], id: string, action: Exclude<SequencerKeyAction, {
    kind: 'drop';
} | {
    kind: 'cancel';
}>, options?: SequencerOptions): SequencerPlan;
