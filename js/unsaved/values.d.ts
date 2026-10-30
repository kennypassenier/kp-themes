export type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
/** What a control holds, as a string; a radio group by its checked value. @param {Field} c */
export declare function readValue(c: Field): string;
/**
 * What the markup says a control holds (`value`, `checked`, `selected` as written): the saved state, which a browser's own
 * restoring of a reloaded form does not touch.
 * @param {Field} c
 */
export declare function readDefault(c: Field): string;
/** Put a value back into a control. @param {Field} c @param {string} value */
export declare function writeValue(c: Field, value: string): void;
/** Tell the page and the tracker that a control was changed by a script. @param {Element} c */
export declare function fire(c: Element): void;
