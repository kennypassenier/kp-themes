import { Controller } from '../controller.js';
export declare class WeekdaysCore extends Controller {
    s: import("../strings/types.js").Strings;
    id: string;
    o: {
        month: boolean;
        locale: string;
        firstDay: number;
        narrow: boolean;
        min: number;
        showSummary: boolean;
        presets: string[];
        disabled: boolean;
    };
    label: string;
    group: HTMLDivElement;
    items: import("../segmented/constants.js").SegmentedItem[];
    lines: {
        summary: HTMLParagraphElement;
        why: HTMLParagraphElement;
        reason: HTMLParagraphElement;
    };
    quick: {
        quick: HTMLDivElement;
        buttons: Map<string, HTMLButtonElement>;
    };
    /** Whether the reader has picked, left the group or tried to submit: only then does "pick at least n" show [ux-1101, required-early]. */
    touched: boolean;
    /**
     * @param {HTMLElement} host
     * @param {{ locale?: string, weekStartsOn?: number }} [options]
     */
    constructor(host: HTMLElement, options?: {
        locale?: string;
        weekStartsOn?: number;
    });
    /** The reader has interacted: show what is missing, and go on showing it. */
    touch(): void;
    /** The picked values, in the order the chips stand. @returns {string[]} */
    picked(): string[];
    /** @returns {(number | 'last')[]} */
    values(): (number | 'last')[];
    words(): string;
    valid(): boolean;
    /** Bring the line, the error and the quick picks in step with the chips. */
    paint(): void;
}
