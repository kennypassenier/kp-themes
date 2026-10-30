export declare class AckNotes {
    gate: HTMLElement;
    before: HTMLElement;
    s: import("../strings/types.js").Strings;
    paint: () => void;
    /** The fold, made when notes arrive. @type {HTMLDetailsElement | null} */
    fold: HTMLDetailsElement | null;
    /** Whether the fold was opened once. */
    opened: boolean;
    /**
     * @param {HTMLElement} gate
     * @param {HTMLElement} before the element the fold is put in front of
     * @param {import('../strings.js').Strings} s
     * @param {() => void} paint called when the fold opens or closes
     */
    constructor(gate: HTMLElement, before: HTMLElement, s: import('../strings.js').Strings, paint: () => void);
    /** Take the fold away. */
    remove(): void;
    /** Make the fold, closed unless the gate asks for it open. */
    create(): HTMLDetailsElement;
    /** @param {string | null} markdown null or an empty text takes the notes away */
    set(markdown: string | null): void;
}
