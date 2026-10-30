export type UptimePeriod = import('./types.js').UptimePeriod;
export type UptimeSpec = import('./types.js').UptimeSpec;
/** @typedef {import('./types.js').UptimePeriod} UptimePeriod */
/** @typedef {import('./types.js').UptimeSpec} UptimeSpec */
/**
 * Wire every strip under `root`: draw the waiting state of a strip not yet given its periods, follow its width, and
 * take its keys and presses.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachUptimes(root?: ParentNode): () => void;
