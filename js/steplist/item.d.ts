export type StepState = import('../steplist.js').StepState;
/** One step of a list, and the state it was last synced to, to tell a change from a first sync. */
export declare class StepItem {
    item: Element;
    /** @type {StepState | undefined} */
    state: StepState | undefined;
    /** @param {Element} item */
    constructor(item: Element);
    /**
     * Bring the item's mark, spoken state and `aria-current` in step with its
     * `data-state`, and announce a change.
     *
     * @param {{ announce?: boolean }} [options]
     * @returns {StepState}
     */
    sync({ announce }?: {
        announce?: boolean;
    }): StepState;
    /** The mark, with the theme's spinner on the running step. @param {StepState} state */
    drawMark(state: StepState): void;
    /** The state's word, visually hidden, after the title. @param {StepState} state */
    speak(state: StepState): void;
    /** @param {Element} list @param {StepState} state @param {StepState} previous */
    announce(list: Element, state: StepState, previous: StepState): void;
}
/**
 * Sync an item (see StepItem.sync()).
 * @param {Element} item
 * @param {{ announce?: boolean }} [options]
 * @returns {StepState}
 */
export declare function syncItem(item: Element, options?: {
    announce?: boolean;
}): StepState;
