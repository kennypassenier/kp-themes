import { RefreshBase } from './base.js';
/** The controller of one `[data-kp-refresh]` control. */
export declare class RefreshController extends RefreshBase {
    connect(): void;
    /** Listen to the chooser, the custom form, the buttons, the R key and the tab's visibility. */
    wireEvents(): void;
    /** The chooser picked a value: "other" opens the custom form. @param {CustomEvent} event */
    onPicked(event: CustomEvent): void;
    /** @param {SubmitEvent} event */
    onCustomSubmit(event: SubmitEvent): void;
    /** Escape closes the custom form and gives the focus back to the chooser. @param {KeyboardEvent} event */
    onCustomKey(event: KeyboardEvent): void;
    /** The refresh key (default R, `data-kp-refresh-key`) refreshes now, except inside a field. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** Hidden: stop. Visible again: refresh once if one was due, else wait out the rest. */
    onVisible(): void;
    /**
     * The options are read again when their attribute changes [live-options-1019]: the look redraws the chooser (segments or a
     * menu), the choices and the freshness line follow their attributes, and a new `data-kp-refresh` sets the interval.
     * @param {string[]} names
     */
    onOptions(names: string[]): void;
    /** The bar is narrow or not at the control's width now [ux-1101 round 2]: the attribute follows, the chooser turns into segments
     * (or back into the look it names) and the current choice is brought into view. */
    fitNarrow(): void;
}
