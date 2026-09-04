/** Fired when the step changes. A contract value [TH26]. */
export declare const STEP_EVENT = "kp-wizard-step";
/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachWizards(root?: ParentNode): () => void;
