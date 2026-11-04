export type FixedKey = 'palette' | 'sheet';
export type KeySpec = import('../key-spec.js').KeySpec;
/** @param {FixedKey} which @param {KeySpec} spec the key the control resolved; empty when it is off */
export declare function announceFixedKey(which: FixedKey, spec: KeySpec): void;
/** Forget what a control announced (it was removed), so the default stands again. @param {FixedKey} which */
export declare function forgetFixedKey(which: FixedKey): void;
/** The key as the sheet's key cap spells it (`Mod K`, `?`), or null when it is off. @param {FixedKey} which @returns {string | null} */
export declare function fixedKeyText(which: FixedKey): string | null;
/** Whether a normalized key id (`mod+k`) is one of the two keys. @param {string} id */
export declare function isReserved(id: string): boolean;
