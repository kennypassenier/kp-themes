export type AvailabilityAnswer = import('./types.js').AvailabilityAnswer;
/** @typedef {import('./types.js').AvailabilityAnswer} AvailabilityAnswer */
/**
 * Wire every availability grid under `root`: presses, painting, keys, the switch, Choose.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachAvailability(root?: ParentNode): () => void;
