import { WeekdaysCore } from './core.js';
export declare class WeekdayPicker extends WeekdaysCore {
    /** What the page gets back, the same object every time. @type {import('../weekdays.js').WeekdaysHandle} */
    handle: import('../weekdays.js').WeekdaysHandle;
    /**
     * @param {HTMLElement} host
     * @param {{ locale?: string, weekStartsOn?: number }} [options]
     */
    constructor(host: HTMLElement, options?: {
        locale?: string;
        weekStartsOn?: number;
    });
    connect(): void;
    /** Keep `data-kp-track-value` in step with the days, when the page asked for it; `announce` for a person's change. @param {boolean} announce */
    track(announce: boolean): void;
    /** Replace the picked days, without the event. @param {readonly (number | string)[]} next */
    set(next: readonly (number | string)[]): void;
    /** @param {boolean} fire */
    change(fire: boolean): void;
    /** @param {Event} event */
    onChips(event: Event): void;
    /** @param {MouseEvent} event */
    onPreset(event: MouseEvent): void;
}
