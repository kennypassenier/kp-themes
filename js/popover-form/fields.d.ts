/**
 * Every named field's value, as the form would send it; a date picker's field gives its ISO day (yyyy-mm-dd), never the
 * dd/mm/yyyy on screen, and a time field its hidden `HH:MM`.
 * @param {HTMLFormElement} form
 * @returns {Record<string, string>}
 */
export declare function valuesOf(form: HTMLFormElement): Record<string, string>;
/**
 * The first field that may not be accepted, with its words; null when every field may. `own` says the field shows its words
 * itself, so the form's problem line stays empty.
 * @param {HTMLFormElement} form
 * @returns {{ field: HTMLElement, text: string, own: boolean } | null}
 */
export declare function firstInvalid(form: HTMLFormElement): {
    field: HTMLElement;
    text: string;
    own: boolean;
} | null;
