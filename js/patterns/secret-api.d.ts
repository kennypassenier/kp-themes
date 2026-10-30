/** @type {WeakMap<Element, { reveal: (reason?: string) => void, hide: (reason?: string) => void }>} */
export declare const secrets: WeakMap<Element, {
    reveal: (reason?: string) => void;
    hide: (reason?: string) => void;
}>;
/**
 * Show a secret field's value, as Reveal does; no-op on a disabled field.
 * @param {Element} field
 */
export declare function revealSecret(field: Element): void;
/**
 * Hide a secret field's value again and take it out of the page.
 * @param {Element} field
 */
export declare function hideSecret(field: Element): void;
/** @type {WeakMap<Element, HTMLInputElement>} */
export declare const secretInputs: WeakMap<Element, HTMLInputElement>;
/**
 * What has been typed into a secret input field (empty for a field that is not one).
 * @param {Element} field
 */
export declare function secretInputValue(field: Element): string;
/**
 * Put a value into a secret input field, or empty it with an empty string; the field hides it again.
 * @param {Element} field @param {string} value
 */
export declare function setSecretInputValue(field: Element, value: string): void;
