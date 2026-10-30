export type WizardHandle = import('../wizard.js').WizardHandle;
export type WizardOptions = import('../wizard.js').WizardOptions;
/** @typedef {import('../wizard.js').WizardHandle} WizardHandle */
/** @typedef {import('../wizard.js').WizardOptions} WizardOptions */
/**
 * The handle for an attached wizard.
 * @param {Element} element
 * @returns {WizardHandle | null}
 */
export declare function wizard(element: Element): WizardHandle | null;
/**
 * Wire every wizard under `root` (not `root` itself) that is not wired yet.
 * @param {ParentNode} root
 * @param {WizardOptions} options
 * @returns {(() => void) & { handles: WizardHandle[] }} detach
 */
export declare function wireWizards(root: ParentNode, options: WizardOptions): (() => void) & {
    handles: WizardHandle[];
};
