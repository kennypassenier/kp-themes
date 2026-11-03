/** @param {{ submitKey?: string | false }} options a key spec for the adding key, or `false` for none */
export declare function configureAddRow(options: {
    submitKey?: string | false;
}): void;
/**
 * Add the line when the key asks for it. Runs in the capture phase on the row, so it comes before the drawn select's own
 * listener and the list box's Enter, which would open or choose instead. The Add button's own state is respected: a busy
 * (disabled) Add button takes no second line, as with a plain Enter.
 * @param {HTMLFormElement} row @param {KeyboardEvent} event
 * @returns {boolean} whether the key was taken
 */
export declare function addFromKey(row: HTMLFormElement, event: KeyboardEvent): boolean;
