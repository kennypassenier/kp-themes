import { Controller } from '../controller.js';
/** The attribute that names the combobox a group is tied to. */
export declare const LINK_ATTRIBUTE = "data-kp-segmented-for";
/**
 * One group tied to one combobox. A chip pressed sets the field's values; a value the field gains or loses turns its chip on or off.
 * Values in the field that no chip stands for (typed ones) are kept as they are.
 */
export declare class SegmentedLink extends Controller {
    /** True while this link writes to the field, so its own change is not read back. */
    writing: boolean;
    constructor(/** @type {HTMLElement} */ host: HTMLElement);
    /** The combobox the group names, or null while it is not on the page. @returns {HTMLElement | null} */
    target(): HTMLElement | null;
    connect(): void;
    /** Light the chip whose words were typed, else none. @param {string} typed */
    fromTyping(typed: string): void;
    /** The values the chips stand for. @returns {Set<string>} */
    chipValues(): Set<string>;
    /** The chips pressed: the field keeps its own values and takes the chips' on top. */
    toField(): void;
    /** The field changed: the chips turn on for the values it holds. */
    fromField(): void;
}
