import { Controller } from '../controller.js';
export declare class PickerPreview extends Controller {
    /** The element wearing a preview now (undefined: the theme root). @type {Element | undefined} */
    shownOn: Element | undefined;
    /** Whether this picker has a preview on. */
    showing: boolean;
    leaveTimer: number;
    /** Counts the asks, so an answer that arrives after a newer ask (or after the preview ended) does nothing. */
    ask: number;
    /**
     * @param {HTMLElement} host the picker
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** Whether previews are on: the `preview` option, else the picker's `data-kp-theme-preview="hover"`. */
    wantsPreview(): {};
    /** @param {string | null} theme */
    say(theme: string | null): void;
    /** End the preview and say so. */
    stopPreview(): void;
    /** A choice ends the look: a preview on a sample element is taken off it, one on the root is made real by applyTheme itself. */
    settlePreview(): void;
    /** Go back after a short wait, so crossing the gap between two buttons is not a leave. */
    leaveSoon(): void;
    /** Show a theme once its register is there. @param {string} theme */
    startPreview(theme: string): Promise<void>;
    /** The option button an event happened on, if it is one of this picker's. @param {Event} event @returns {HTMLElement | null} */
    optionOf(event: Event): HTMLElement | null;
}
