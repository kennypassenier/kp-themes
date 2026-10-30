/** The number of chips made from the field's most used choices, or `all`; absent: the chips the page wrote. */
export declare const TOP_ATTRIBUTE = "data-kp-segmented-top";
/** `auto` (default): the field is left out while every choice is a chip; `always`: the field stays. */
export declare const FIELD_ATTRIBUTE = "data-kp-segmented-field";
/** On an option: how often it is chosen, for the order of the chips (absent: 0, so the list's own order decides). */
export declare const USES_ATTRIBUTE = "data-kp-uses";
export type Choice = {
    value: string;
    label: string;
    uses: number;
};
/** @typedef {{ value: string, label: string, uses: number }} Choice */
/**
 * Each value once, the first one winning: a list that is closing is drawn twice for a moment (the motion layer leaves a copy of it), and its options
 * must not become two chips.
 * @param {readonly Choice[]} choices
 * @returns {Choice[]}
 */
export declare function uniqueChoices(choices: readonly Choice[]): Choice[];
/**
 * The choices of a field, in the order of its list.
 * @param {Element} combobox
 * @returns {Choice[]}
 */
export declare function choicesOf(combobox: Element): Choice[];
/**
 * How many chips `data-kp-segmented-top` asks for.
 * @param {string | null} raw  the attribute's text
 * @param {number} total  how many choices the field has
 * @returns {number | null}  null when the page wrote the chips itself
 * @throws {RangeError} when the text is neither `all` nor a whole number above zero
 */
export declare function chipCount(raw: string | null, total: number): number | null;
/**
 * The `count` most used choices, most used first; equal uses keep the order of the list. Every choice is a chip: the list's own order.
 * @param {readonly Choice[]} choices @param {number} count
 * @returns {Choice[]}
 */
export declare function mostUsed(choices: readonly Choice[], count: number): Choice[];
/**
 * The choice that some typed text names: by its label, or by its value, in any case.
 * @param {readonly Choice[]} choices @param {string} text
 * @returns {Choice | null}
 */
export declare function choiceNamed(choices: readonly Choice[], text: string): Choice | null;
/**
 * Whether the field is still needed: it is while some choice has no chip, or when the page asked for it always.
 * @param {readonly Choice[]} choices @param {ReadonlySet<string>} chipValues @param {string | null} mode  `data-kp-segmented-field`
 */
export declare function fieldNeeded(choices: readonly Choice[], chipValues: ReadonlySet<string>, mode: string | null): boolean;
