/** One chip being renamed. */
export declare class ChipRename {
    item: HTMLElement;
    group: HTMLElement;
    previous: string;
    busy: boolean;
    field: HTMLInputElement;
    why: HTMLParagraphElement;
    onKey: (event: KeyboardEvent) => void;
    onBlur: () => void | false;
    /** @param {HTMLElement} item the chip */
    constructor(item: HTMLElement);
    /** Turn the chip into the field, its words selected. */
    start(): void;
    /** @param {KeyboardEvent} event */
    key(event: KeyboardEvent): void;
    /** Ask the page; write the new words, or say why not and keep the field. */
    save(): Promise<void>;
    /** @param {string} words */
    refuse(words: string): void;
    /** Back to the chip, the focus on it. @param {boolean} saved */
    end(saved: boolean): void;
}
