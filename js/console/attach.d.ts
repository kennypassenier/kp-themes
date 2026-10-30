export type ConsoleRun = import('./types.js').ConsoleRun;
/** @typedef {import('./types.js').ConsoleRun} ConsoleRun */
/**
 * Wire every console under `root`.
 * @param {ParentNode} [root]
 * @param {{ run?: ConsoleRun, complete?: (prefix: string) => string[] | Promise<string[]> }} [options]
 * @returns {() => void} detach
 */
export declare function attachConsoles(root?: ParentNode, options?: {
    run?: ConsoleRun;
    complete?: (prefix: string) => string[] | Promise<string[]>;
}): () => void;
