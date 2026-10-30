/**
 * Wire every command block under `root` that is not wired yet and has a code element to lay out.
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function wireCommands(root: ParentNode): () => void;
