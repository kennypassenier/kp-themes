export type SequencerAttachOptions = import('./units.js').SequencerAttachOptions;
/** @typedef {import('./units.js').SequencerAttachOptions} SequencerAttachOptions */
/**
 * Attach every `[data-kp-sequencer]` under `root` (below it: the root itself is not one of them). Returns a detach.
 * @param {ParentNode} [root]
 * @param {SequencerAttachOptions} [options]
 * @returns {() => void}
 */
export declare function attachSequencers(root?: ParentNode, options?: SequencerAttachOptions): () => void;
