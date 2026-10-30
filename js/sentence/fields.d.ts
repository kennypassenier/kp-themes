/** A sentence form. */
export declare const SENTENCE = "[data-kp-sentence]";
/** Fired on the sentence, bubbling, after a change, once things have settled: `{ summary }`. */
export declare const SENTENCE_EVENT = "kp-sentence-change";
/** The line under each attached sentence; the setters below write it only while the sentence is attached. @type {WeakMap<Element, HTMLElement>} */
export declare const LINES: WeakMap<Element, HTMLElement>;
/** The controls a hidden phrase takes out of reach. */
export declare const CONTROLS = "input, select, textarea, button, [role=\"combobox\"]";
/** @param {Element} control @returns {string} */
export declare function nameOf(control: Element): string;
/**
 * Write the text of a computed field (`[data-kp-sentence-computed="<name>"]`); null, undefined or '' draws a dash.
 * @param {Element} element a `.kp-sentence`
 * @param {string} name the field's `data-kp-sentence-computed`
 * @param {string | number | null | undefined} text
 */
export declare function setSentenceComputed(element: Element, name: string, text: string | number | null | undefined): void;
/**
 * The sentence in words as it stands now: the text, with each field replaced by what it shows and each hidden phrase left out.
 * @param {Element} element a `.kp-sentence`
 * @returns {string}
 */
export declare function sentenceSummary(element: Element): string;
/**
 * Mark a control invalid and write the line under the sentence that names it; `why` null clears the mark.
 * @param {Element} element a `.kp-sentence`
 * @param {string} name the control's `name`
 * @param {string | null} why
 */
export declare function setSentenceInvalid(element: Element, name: string, why: string | null): void;
/**
 * Write (or clear, with null) the line under the sentence.
 * @param {Element} element a `.kp-sentence` @param {string | null} text
 */
export declare function setSentenceWhy(element: Element, text: string | null): void;
/**
 * Put a field in a state: `loading` shows its own skeleton at the width it had and switches its control off; `ready` brings it back.
 * @param {Element} field a `.kp-sentence__field`
 * @param {'loading' | 'ready'} state
 */
export declare function setSentenceFieldState(field: Element, state: 'loading' | 'ready'): void;
/** @param {Element} root @param {string} name @returns {string | null} what the control of that name holds */
export declare function valueOfControl(root: Element, name: string): string | null;
/** @param {Element} c */
export declare const isButton: (c: Element) => boolean;
/** Disable a control a hidden phrase takes out of reach, and give it back when the phrase shows. @param {HTMLElement} c @param {boolean} show */
export declare function reach(c: HTMLElement, show: boolean): void;
/** The last few words of the text right before a field. @param {Element} field @returns {string[]} */
export declare function wordsBefore(field: Element): string[];
