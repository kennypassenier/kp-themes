/**
 * What a line holds, by field name (several values of one name as a list).
 * @param {FormData} data
 * @returns {Record<string, string | string[]>}
 */
export declare function valuesOf(data: FormData): Record<string, string | string[]>;
/** The line under the row that says why, made when the markup left it out. @param {HTMLFormElement} row @returns {HTMLElement} */
export declare function refusalOf(row: HTMLFormElement): HTMLElement;
/** Say why, or nothing. @param {HTMLFormElement} row @param {string} words */
export declare function sayRefusal(row: HTMLFormElement, words: string): void;
/**
 * A valid line: ask the page (`kp-addrow-add`, cancelable, with `waitUntil(promise)`), then empty the row or say why not.
 * A promise that resolves to words or `false`, or to `{ errors: { name: message } }`, refuses the line; one that rejects
 * refuses it with its message. No promise: the line is added at once.
 * @param {HTMLFormElement} row @param {FormData} data
 */
export declare function addLine(row: HTMLFormElement, data: FormData): Promise<void>;
