import { SnoozePanel } from './panel.js';
export type SnoozeHandle = import('../snooze.js').SnoozeHandle;
export declare class SnoozePicker extends SnoozePanel {
    /** @type {SnoozeHandle} */
    handle: SnoozeHandle;
    /** @param {HTMLElement} el @param {{ now?: () => number }} [options] */
    constructor(el: HTMLElement, options?: {
        now?: () => number;
    });
    connect(): void;
    /** The last moment picked, kept across visits when the picker asks to be remembered. */
    readMemory(): void;
    offered(): import("./choices.js").SnoozeChoice[];
    /** The words on the trigger and under the bar, in step with what is snoozed. */
    paintStatus(): void;
    /** Fill the menu or the chips with what is offered now. */
    fill(): void;
    /** @param {import('./choices.js').SnoozeChoice} c */
    chip(c: import('./choices.js').SnoozeChoice): HTMLButtonElement;
    /** @param {number} ms @param {string} key */
    choose(ms: number, key: string): void;
    onApply(): void;
    /** Esc closes the panel (unless the calendar in it is open); Enter in the time applies. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {Event} event */
    onOutside(event: Event): void;
    /** @param {string} key */
    pick(key: string): void;
    /** @param {Event} event */
    onChip(event: Event): void;
    onEnd(): void;
    /** @param {number | string | Date | null} next */
    setUntil(next: number | string | Date | null): void;
    /** @param {boolean} next */
    setBusy(next: boolean): void;
}
