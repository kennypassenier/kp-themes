/** The global key the first booted runtime sets. */
export declare const BOOT_MARKER: unique symbol;
/** The fix the error names. */
export declare const BOOT_FIX = "load either dist/kp-themes.min.js or dist/js/auto.js, not both";
/**
 * Name an entry the way a person loads it: its path and which build it is.
 * @param {string} url the module's own `import.meta.url`
 * @returns {string}
 */
export declare function describeEntry(url: string): string;
/**
 * Claim the boot for this copy. Returns true when this copy is the first and may boot; otherwise logs one error
 * naming both entries and returns false.
 *
 * @param {string} entry this copy's `import.meta.url`
 * @param {Record<symbol, unknown>} [scope] where the marker lives, `globalThis` unless a test passes its own
 * @returns {boolean}
 */
export declare function claimBoot(entry: string, scope?: Record<symbol, unknown>): boolean;
