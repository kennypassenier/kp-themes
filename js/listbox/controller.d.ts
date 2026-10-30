import { ListboxCore } from './core.js';
export declare class ListboxController extends ListboxCore {
    connect(): void;
    /** Take back what was stamped: an id the consumer did not write, an aria-selected the option did not have. */
    takeBackStamps(): void;
    /** @param {KeyboardEvent} event */
    onKeyDown(event: KeyboardEvent): void;
    /** Home and End: highlight an end of the list, when it has options. @param {KeyboardEvent} event @param {(count: number) => number} target */
    jump(event: KeyboardEvent, target: (count: number) => number): void;
    /** A letter jumps to the next option that starts with what was typed. @param {KeyboardEvent} event */
    typeahead(event: KeyboardEvent): void;
    /** The index of the enabled option under an event, or -1. @param {Event} event */
    optionAt(event: Event): number;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /**
     * Hover moves the highlight so the mouse and the keyboard cannot
     * disagree about which option Enter would take.
     *
     * @param {MouseEvent} event
     */
    onOver(event: MouseEvent): void;
}
