export type SelectionItem = import('./model.js').SelectionItem;
/**
 * Feed the bar by hand, for a list that has no boxes to read (a board, a server's selection). The bar then ignores the boxes.
 * @param {HTMLElement} bar
 * @param {readonly (string | SelectionItem)[]} items the keys, or keys with the names to show
 * @param {{ matching?: number }} [options] `matching`: how many rows match in all, for the offer beyond these
 */
export declare function setSelection(bar: HTMLElement, items: readonly (string | SelectionItem)[], options?: {
    matching?: number;
}): void;
/**
 * What the bar holds now.
 * @param {HTMLElement} bar
 * @returns {{ keys: string[], items: SelectionItem[], count: number, matching: boolean }}
 */
export declare function getSelection(bar: HTMLElement): {
    keys: string[];
    items: SelectionItem[];
    count: number;
    matching: boolean;
};
/**
 * Say an action is running ("Backing up 3…"), or that it is done (no words). The buttons stop answering, the count gives way to the words in its own room.
 * @param {HTMLElement} bar
 * @param {string | null} [words] `null` or an empty string ends it
 */
export declare function setSelectionBusy(bar: HTMLElement, words?: string | null): void;
/**
 * Say how far a running action is, between its start and its end: "3 of 7 done" beside the busy words [wish-1120, homelab 112].
 * Call it after setSelectionBusy(); on a bar that is not busy it starts the busy state with the package's own words. The end is
 * still setSelectionBusy(bar, '') or setSelectionResult(), which take the progress away. A screen reader hears every quarter
 * (and the last) from the polite region, not every row. `done` is clamped to 0..`total`.
 * @param {HTMLElement} bar
 * @param {{ done: number, total: number }} progress
 */
export declare function setSelectionProgress(bar: HTMLElement, progress: {
    done: number;
    total: number;
}): void;
/**
 * Say how an action ended when some rows refused it: "2 done, 1 refused: why", with a mark on each refused row.
 * @param {HTMLElement} bar
 * @param {{ done: number, refused: readonly { key: string, reason: string }[] }} result
 */
export declare function setSelectionResult(bar: HTMLElement, result: {
    done: number;
    refused: readonly {
        key: string;
        reason: string;
    }[];
}): void;
/**
 * Turn an action off, with the reason, for a selection it does not fit: the function answers the reason ("2 of 3 can be updated") or an empty string.
 * @param {HTMLElement} bar
 * @param {Record<string, (items: SelectionItem[]) => string | null>} rules by the action's id (`data-kp-selection-action`)
 */
export declare function setSelectionRules(bar: HTMLElement, rules: Record<string, (items: SelectionItem[]) => string | null>): void;
