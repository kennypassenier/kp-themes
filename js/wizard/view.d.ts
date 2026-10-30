import { Controller } from '../controller.js';
export type WizardOptions = import('../wizard.js').WizardOptions;
export type WizardHandle = import('../wizard.js').WizardHandle;
export type WizardSnapshot = {
    hidden: (boolean | 'until-found')[];
    tabindex: (string | null)[];
    labelState: (string | null)[];
    labelCurrent: (string | null)[];
    labelTab: (string | null)[];
    back: boolean;
    next: string;
    status: string;
};
/** The drawing of one wizard: its parts, its options and the step it is on. */
export declare class WizardView extends Controller {
    /** @type {HTMLElement[]} */
    steps: HTMLElement[];
    /** @type {HTMLElement[]} */
    labels: HTMLElement[];
    /** @type {HTMLButtonElement | null} */
    back: HTMLButtonElement | null;
    /** @type {HTMLButtonElement | null} */
    next: HTMLButtonElement | null;
    /** @type {HTMLElement | null} */
    status: HTMLElement | null;
    /** Whether Next on a step waits for the step's fields to validate. */
    gate: boolean;
    /** Whether the focus moves into the new step. */
    moveFocus: boolean;
    /** Whether a completed step's label can be pressed to go back. */
    navigable: boolean;
    /** The step shown now. */
    at: number;
    /** What attach changes, so detach can put it back. @type {WizardSnapshot | null} */
    before: WizardSnapshot | null;
    /** The handle a page gets back, made once the wizard is wired. @type {WizardHandle | null} */
    api: WizardHandle | null;
    /**
     * @param {HTMLElement} host
     * @param {WizardOptions} [options] defaults; each also per wizard: `data-kp-validate="false"`, `data-kp-focus-step="false"`, `data-kp-navigable`
     */
    constructor(host: HTMLElement, options?: WizardOptions);
    /** @param {WizardHandle} api */
    setHandle(api: WizardHandle): void;
    /** The handle a page gets back for this wizard (the same object each time). @returns {WizardHandle} */
    handle(): WizardHandle;
    /** Find the parts, read the options and start where the markup says, so a server can render step 3. */
    collect(): void;
    /** What the markup had before attach changed it. @returns {WizardSnapshot} */
    snapshot(): WizardSnapshot;
    /** Make `to` the current step and draw it, announcing the change. @param {number} to */
    moveTo(to: number): void;
    /**
     * Draw the current step; announce it (focus and event) unless rendering silently.
     * @param {{ announce?: boolean, previous?: number }} [how]
     */
    show({ announce, previous }?: {
        announce?: boolean;
        previous?: number;
    }): void;
    showLabels(): void;
    showButtons(): void;
    /** Put the steps, labels and buttons back as the snapshot had them. */
    restore(): void;
}
