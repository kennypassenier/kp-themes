export { STEP_EVENT, BEFORE_STEP_EVENT, FINISH_EVENT } from './wizard/values.js';
export { wizard } from './wizard/attach.js';
export type WizardHandle = {
    element: HTMLElement;
    step: () => number;
    /**
     * resolves to whether the wizard moved
     */
    goTo: (index: number) => Promise<boolean>;
    next: () => Promise<boolean>;
    back: () => Promise<boolean>;
};
export type WizardOptions = {
    /**
     * whether Next waits for the step's fields to validate (default true)
     */
    validate?: boolean;
    /**
     * whether the focus moves into the new step (default true)
     */
    focusStep?: boolean;
    /**
     * whether a completed step's label can be pressed to go back (default false)
     */
    navigableLabels?: boolean;
    /**
     * holds or refuses a step change
     */
    beforeStep?: (from: number, to: number) => boolean | Promise<boolean>;
};
/**
 * @typedef {object} WizardHandle
 * @property {HTMLElement} element
 * @property {() => number} step
 * @property {(index: number) => Promise<boolean>} goTo resolves to whether the wizard moved
 * @property {() => Promise<boolean>} next
 * @property {() => Promise<boolean>} back
 */
/**
 * @typedef {object} WizardOptions
 * @property {boolean} [validate] whether Next waits for the step's fields to validate (default true)
 * @property {boolean} [focusStep] whether the focus moves into the new step (default true)
 * @property {boolean} [navigableLabels] whether a completed step's label can be pressed to go back (default false)
 * @property {(from: number, to: number) => boolean | Promise<boolean>} [beforeStep] holds or refuses a step change
 */
/**
 * @param {ParentNode} root
 * @param {WizardOptions} [options]
 *   Defaults; each also per wizard: `data-kp-validate="false"`, `data-kp-focus-step="false"`, `data-kp-navigable`.
 * @returns {(() => void) & { handles: WizardHandle[] }} detach
 */
export declare function attachWizards(root?: ParentNode, options?: WizardOptions): (() => void) & {
    handles: WizardHandle[];
};
