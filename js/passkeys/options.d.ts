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
};
/**
 * The order of the list: the one in use first, then the most recently used,
 * a way never used last.
 * @param {readonly import('./constants.js').PasskeyRow[]} rows
 * @returns {import('./constants.js').PasskeyRow[]}
 */
export declare function sortPasskeys(rows: readonly import('./constants.js').PasskeyRow[]): import('./constants.js').PasskeyRow[];
/**
 * Whole days a way has gone unused (since it was added when never used), or
 * null when it was used within `limit` days or the flag is off.
 * @param {import('./constants.js').PasskeyRow} row @param {number} now @param {number} limit
 * @returns {number | null}
 */
export declare function unusedDays(row: import('./constants.js').PasskeyRow, now: number, limit: number): number | null;
