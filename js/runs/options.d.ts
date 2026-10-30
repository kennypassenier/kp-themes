/**
 * @param {HTMLElement} el
 * @param {(() => number) | undefined} nowOption the clock the page passed to attachRuns()
 */
export declare function readRunsOptions(el: HTMLElement, nowOption: (() => number) | undefined): {
    zone: string;
    count: number;
    more: number;
    relative: boolean;
    warn: boolean;
    /** Whether the clock stands still, so the words need no refresh. */
    fixed: boolean;
    now: () => number;
};
