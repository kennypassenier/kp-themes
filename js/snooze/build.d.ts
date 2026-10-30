export type Words = ReturnType<typeof import('./choices.js').snoozeWords>;
/**
 * The bar and the status line. The trigger is a button with a menu, or one row of chips; both end in the same list of choices.
 * @param {Document} doc @param {Words} s @param {string} id @param {boolean} chips
 */
export declare function buildBar(doc: Document, s: Words, id: string, chips: boolean): {
    bar: HTMLElement;
    status: HTMLElement;
    end: HTMLButtonElement;
    trigger: HTMLElement;
    wrapper: null;
    row: HTMLElement;
} | {
    bar: HTMLElement;
    status: HTMLElement;
    end: HTMLButtonElement;
    trigger: HTMLButtonElement;
    wrapper: HTMLElement;
    row: null;
};
/** The pick panel: a date (the package's date picker) and a time, an error line, Cancel and Apply. @param {Document} doc @param {Words} s @param {string} id */
export declare function buildPanel(doc: Document, s: Words, id: string): {
    panel: HTMLElement;
    picker: HTMLElement;
    date: HTMLInputElement;
    time: HTMLInputElement;
    error: HTMLElement;
    cancel: HTMLButtonElement;
    apply: HTMLButtonElement;
};
