/**
 * What the toast does, from its options and the defaults the page declared.
 * @param {import('../undo-toast.js').UndoToastOptions} options
 */
export declare function readSettings(options: import('../undo-toast.js').UndoToastOptions): {
    region: HTMLElement | null;
    ms: number;
    mode: string;
    clock: string;
    key: string | false;
    leaves: string;
    max: number;
    seconds: number;
};
/**
 * The content: the clock, the words (and for a screen reader the sentence once), no markup to keep in step.
 * @param {Document} doc @param {string} text @param {ReturnType<typeof readSettings>} settings
 * @returns {{ body: HTMLElement, ring: HTMLElement | null, secs: HTMLElement | null, words: HTMLElement, said: HTMLElement }}
 */
export declare function buildBody(doc: Document, text: string, { ms, clock, seconds }: ReturnType<typeof readSettings>): {
    body: HTMLElement;
    ring: HTMLElement | null;
    secs: HTMLElement | null;
    words: HTMLElement;
    said: HTMLElement;
};
