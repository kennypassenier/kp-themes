/** Every composite field the bar tracks as one value. */
export declare const WIDGET = "[data-kp-quantity], [data-kp-time], [data-kp-combobox][data-kp-tags]";
/** The events those fields fire when a person changes them (a plain combobox's choice is in `kp-combobox-change` too). */
export declare const WIDGET_EVENTS: string[];
/** Whether an element is one of the composite fields. @param {Element} el */
export declare const isWidget: (el: Element) => boolean;
/**
 * The composite field a node sits in, or null. A field marked `data-kp-untracked` (on itself or on any input inside it, the
 * way a page that keeps its own mirror opted out before) is left out.
 * @param {Element} node
 * @returns {HTMLElement | null}
 */
export declare function widgetOf(node: Element): HTMLElement | null;
/**
 * What a composite field holds, as a string: a quantity's number, a time field's `HH:MM` ('' while empty), a tag input's values
 * as a JSON list. Read from the field's own state once it is attached, else from its markup.
 * @param {HTMLElement} root
 */
export declare function readWidget(root: HTMLElement): string;
/** What a composite field's value reads as in the list (a tag input's values joined). @param {HTMLElement} root @param {string} value */
export declare function showWidget(root: HTMLElement, value: string): string;
/**
 * Put a value back into a composite field through its own setter. A tag input not attached yet has no setter, and that is said.
 * @param {HTMLElement} root @param {string} value
 */
export declare function writeWidget(root: HTMLElement, value: string): void;
