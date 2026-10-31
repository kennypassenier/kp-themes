/**
 * The options as the page wrote them: the spec first, then the attribute, then the default.
 * @param {HTMLElement} el @param {import('./constants.js').PasskeysSpec} spec
 */
export declare function passkeyOptions(el: HTMLElement, spec: import('./constants.js').PasskeysSpec): {
    protectLast: 'refuse' | 'confirm' | 'off';
    confirm: 'dialog' | 'type-name';
    refuseLook: 'button' | 'note';
    markCurrent: boolean;
    neverUsedAfter: number;
    rename: boolean;
    missingUse: import("./constants.js").MissingUse;
};
/**
 * The order of the list: the one in use first, then the most recently used,
 * a way never used last.
 * @param {readonly import('./constants.js').PasskeyRow[]} rows
 * @returns {import('./constants.js').PasskeyRow[]}
 */
export declare function sortPasskeys(rows: readonly import('./constants.js').PasskeyRow[]): import('./constants.js').PasskeyRow[];
export type MissingUse = import('./constants.js').MissingUse;
/** @typedef {import('./constants.js').MissingUse} MissingUse */
/**
 * Whole days a way has gone unused (since it was added when never used), or
 * null when it was used within `limit` days or the flag is off. A row without
 * `lastUsedAt` counts from when it was added only when a missing use means
 * never used (`missing` is `never`, the default); an unknown use flags nothing.
 * @param {import('./constants.js').PasskeyRow} row @param {number} now @param {number} limit
 * @param {MissingUse} [missing]
 * @returns {number | null}
 */
export declare function unusedDays(row: import('./constants.js').PasskeyRow, now: number, limit: number, missing?: MissingUse): number | null;
