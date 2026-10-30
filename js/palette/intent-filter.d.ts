/**
 * The intent matcher's side of one palette: score every command, hide what does not answer, put the best answer first
 * in its group, mark the matched words, keep the status line exact, and stand an empty or failed plate in the list's
 * footprint. The commands stay the consumer's markup; this only hides, moves and marks them, and gives all of it back
 * on destroy().
 *
 * @param {HTMLDialogElement} dialog
 * @param {HTMLElement} list
 * @param {HTMLElement | null} status
 */
export declare function createIntentFilter(dialog: HTMLDialogElement, list: HTMLElement, status: HTMLElement | null): {
    run: (rawQuery: string) => number;
    /** @param {'ready' | 'loading' | 'error'} next @param {{ message?: string }} [options] */
    setState(next: 'ready' | 'loading' | 'error', options?: {
        message?: string;
    }): void;
    /** @param {string} value */
    remember(value: string): void;
    destroy(): void;
};
