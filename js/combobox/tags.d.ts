import { ComboboxBase } from './core.js';
export declare class ComboboxTags extends ComboboxBase {
    /** A tag list written `hidden` is hidden while it holds no tag. */
    showTags(): void;
    /** @param {string} value @param {string} label */
    tagElement(value: string, label: string): HTMLElement;
    /** @param {string} value @param {string} label */
    addTag(value: string, label: string): void;
    /** @param {HTMLElement} option */
    take(option: HTMLElement): void;
    /**
     * Typed text ends a tag [scope-60]. Before this, Enter with nothing highlighted had nothing to take, so a tag input
     * filtered and removed but never added from the keyboard. Text naming an option takes it; other text becomes its own tag
     * where the box allows new values.
     * @returns {boolean} whether a tag was added
     */
    addTyped(): boolean;
    /** @param {string} value */
    removeValue(value: string): void;
    /** Replace the held values (a combobox takes the first). @param {readonly string[]} values */
    setValues(values: readonly string[]): void;
}
