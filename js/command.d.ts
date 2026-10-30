export { COMMAND, COMMAND_SHELLS } from './command/values.js';
export { commandLines } from './command/lines.js';
/**
 * Wire every command block under `root`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachCommands(root?: ParentNode): () => void;
