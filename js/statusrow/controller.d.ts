import { Controller } from '../controller.js';
export declare class StatusList extends Controller {
    connect(): void;
    /** Resume or Pause on a calm row; Retry on a failed one. @param {Event} event */
    press(event: Event): void;
    rows(): HTMLElement[];
    /** @param {HTMLElement | undefined} stop */
    rove(stop: HTMLElement | undefined): void;
    focusedRow(): HTMLElement | undefined;
    /**
     * The keys of a calm list: one tab stop on the rows, ArrowUp and ArrowDown between them, `r` resumes the focused paused row
     * (on the `?` sheet; no digit keys, which need Shift on AZERTY).
     */
    wireCalmKeys(): void;
    /** @param {KeyboardEvent} event */
    walk(event: KeyboardEvent): void;
}
