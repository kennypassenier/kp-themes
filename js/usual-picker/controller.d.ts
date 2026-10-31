import { combobox } from '../combobox.js';
import { memoryFor } from '../remember.js';
import { UsualPickerInput } from './input.js';
export type UsualModel = import('./types.js').UsualModel;
export type ComboboxHandle = ReturnType<typeof combobox>;
/** One usual picker; its model stays the `models` registry entry that usualPicker() and the setters read. */
export declare class UsualPickerControl extends UsualPickerInput {
    connect(): void;
    /** The listeners, the Alt U entry and the option watch, set up so that destroy() removes them in the old order. */
    wire(): void;
    /** The picker's parts leave, and the box is a plain combobox again. */
    release(): void;
    /** Extend the combobox: which rows show, the tail and headings, the status line and the rows the picker answers itself. @param {ReturnType<typeof memoryFor> | null} memory */
    extend(memory: ReturnType<typeof memoryFor> | null): void;
    /** The status line: a name typed that is already picked, or how many usual and other choices there are. @param {string} query */
    statusOf(query: string): string | null;
    /**
     * A row the picker answers itself: More, Add, a near name's question; a pinned row only marks where the pick came from.
     * @param {HTMLElement} option @param {ReturnType<typeof memoryFor> | null} memory
     * @returns {boolean} whether the picker took the row
     */
    choose(option: HTMLElement, memory: ReturnType<typeof memoryFor> | null): boolean;
}
