/** Fired on the palette when a command is chosen. A contract value [TH26]. */
export declare const RUN_EVENT = "kp-palette-run";
/**
 * Attach every palette and shortcut sheet under `root`.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachPalettes(root?: ParentNode): () => void;
