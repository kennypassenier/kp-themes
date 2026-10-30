export type AcceptInput = {
    /**
     * the amount the quantity stands at (NaN while the text is not a number)
     */
    amount: number;
    /**
     * the amount written in the page's language ("2,5")
     */
    amountText: string;
    /**
     * the unit that goes with the amount ("boxes"; "box" for exactly 1)
     */
    unit: string;
    /**
     * the unit's plural, used in the words that name no amount ("boxes")
     */
    unitMany: string;
    /**
     * what the button does ("Add"); the dictionary's when absent
     */
    verb?: string;
    /**
     * the least amount that makes sense; absent: anything above zero
     */
    minimum?: number;
    strings?: Partial<import('./strings.js').Strings>;
};
export type AcceptState = {
    /**
     * whether the amount makes sense, so the button may be pressed
     */
    valid: boolean;
    /**
     * the button's words
     */
    label: string;
    /**
     * why the button is off; empty while it is on
     */
    reason: string;
};
/**
 * @typedef {object} AcceptInput
 * @property {number} amount  the amount the quantity stands at (NaN while the text is not a number)
 * @property {string} amountText  the amount written in the page's language ("2,5")
 * @property {string} unit  the unit that goes with the amount ("boxes"; "box" for exactly 1)
 * @property {string} unitMany  the unit's plural, used in the words that name no amount ("boxes")
 * @property {string} [verb]  what the button does ("Add"); the dictionary's when absent
 * @property {number} [minimum]  the least amount that makes sense; absent: anything above zero
 * @property {Partial<import('./strings.js').Strings>} [strings]
 */
/**
 * @typedef {object} AcceptState
 * @property {boolean} valid  whether the amount makes sense, so the button may be pressed
 * @property {string} label  the button's words
 * @property {string} reason  why the button is off; empty while it is on
 */
/**
 * Whether an amount makes sense: a number, above zero, and not under the page's own minimum.
 * @param {number} amount @param {number | undefined} minimum
 */
export declare function amountMakesSense(amount: number, minimum: number | undefined): boolean;
/**
 * The button's words and state for an amount: "Add 3 boxes" while it makes sense, "Add boxes" with a reason while it does not.
 * @param {AcceptInput} input
 * @returns {AcceptState}
 */
export declare function acceptState({ amount, amountText, unit, unitMany, verb, minimum, strings }: AcceptInput): AcceptState;
