/** Fired when the colour changes. A contract value [TH26]. */
export declare const COLOR_EVENT = "kp-color-change";
/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachColorPickers(root?: ParentNode): () => void;
