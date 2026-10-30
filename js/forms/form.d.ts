import { Controller } from '../controller.js';
/** The controller of one `form[data-kp-form]`. */
export declare class FormController extends Controller {
    form: HTMLFormElement;
    settings: {
        validateOn: "blur" | "input" | "submit";
        revalidateOn: "blur" | "input" | "none";
        focusSummary: boolean;
        focusFirstInvalid: boolean;
        wrapper: string;
        invalidClass: string;
        summaryHeading: string;
        summaryHeadingClass: string;
        nativeSubmit: boolean;
    };
    marks: {
        wrapper: string;
        invalidClass: string;
    };
    /** When a field is first checked: the form's `data-kp-validate-on`, else the option. @type {'blur' | 'input' | 'submit'} */
    when: 'blur' | 'input' | 'submit';
    /** When a marked field is checked again. @type {'input' | 'blur' | 'none'} */
    again: 'input' | 'blur' | 'none';
    /** Whether a failed submit focuses the summary. */
    focusOnError: boolean;
    /** The summary element, when the form has one. @type {HTMLElement | null} */
    summary: HTMLElement | null;
    /** What the page gets back from form(). @type {import('./constants.js').FormHandle} */
    handle: import('./constants.js').FormHandle;
    /**
     * @param {HTMLElement} host the form
     * @param {import('./constants.js').FormOptions} [options] the page's defaults; the form's own `data-kp-*` wins
     */
    constructor(host: HTMLElement, options?: import('./constants.js').FormOptions);
    connect(): void;
    /** `data-kp-form-native-submit` (or the option): the browser also submits a valid form [wish-1028]. */
    native(): boolean;
    /** @returns {HTMLElement[]} the fields that can be checked, submit buttons left out */
    fields(): HTMLElement[];
    /** Check one field, show or clear its message and tell the page. @param {HTMLElement} field @returns {boolean} */
    validateField(field: HTMLElement): boolean;
    /** The checkable field an event came from, or null. @param {Event} event */
    fieldOf(event: Event): (HTMLElement & Record<"checkValidity", unknown>) | null;
    /** Delegated, so a field added after attach validates too. @param {Event} event */
    onFocusOut(event: Event): void;
    /** @param {Event} event */
    onInput(event: Event): void;
    /** Show the summary of the invalid fields and move the focus. @param {HTMLElement[]} bad */
    showSummary(bad: HTMLElement[]): void;
    /** Check every field; show the summary and fire `kp-form-invalid` when one is wrong. @returns {boolean} */
    validateAll(): boolean;
    /** Show messages by field name: what a server sends back. @param {Record<string, string>} errors */
    showErrors(errors: Record<string, string>): void;
    /** Clear every message. */
    clear(): void;
    /** End the busy state. */
    done(): void;
    /** @param {SubmitEvent} event */
    onSubmit(event: SubmitEvent): void;
}
