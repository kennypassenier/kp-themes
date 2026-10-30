import { Controller } from '../controller.js';
/** The attribute that names the combobox a group is tied to. */
export declare const LINK_ATTRIBUTE = "data-kp-segmented-for";
/** One group tied to one combobox. Values in the field that no chip stands for (typed ones) are kept as they are. */
export declare class SegmentedLink extends Controller {
    /** True while this link writes to the field, so its own change is not read back. */
    writing: boolean;
    /** Whether the first connect is over, after which chips are replaced through the group's own call. */
    ready: boolean;
    constructor(/** @type {HTMLElement} */ host: HTMLElement);
    /** The combobox the group names, or null while it is not on the page. @returns {HTMLElement | null} */
    target(): HTMLElement | null;
    /** Whether the field holds one value (a combobox) and not a set of tags. */
    single(): boolean;
    connect(): void;
    /** The chips the field's choices ask for: the first time written straight into the group, which the group then enhances. */
    makeChips(): void;
    /** The chips or the way the field is shown changed: draw both again and bring the chips into step with the field. */
    rebuild(): void;
    /** Remember the field as the page left it, and put it back on detach. */
    keepField(): void;
    /** Leave the field out while every choice is a chip, say what it searches while it stays. */
    fitField(): void;
    /** The values the chips stand for. @returns {Set<string>} */
    chipValues(): Set<string>;
    /** The chips pressed: a tag input keeps its own values and takes the chips' on top; a combobox takes the chip chosen, or empties when none is. */
    toField(): void;
    /** The field changed: the chips turn on for the choices it holds, and off for the ones it let go. */
    fromField(): void;
    /** The chips as choices, for a field whose list does not hold them. @returns {import('./link-choices.js').Choice[]} */
    chipChoices(): import('./link-choices.js').Choice[];
}
