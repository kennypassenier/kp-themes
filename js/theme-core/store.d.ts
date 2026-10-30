export type ThemeName = import('./values.js').ThemeName;
/** @typedef {import('./values.js').ThemeName} ThemeName */
/**
 * Remember the choice. Returns false when storage refused — private mode,
 * blocked storage, a full quota. The caller shows that; it is not swallowed
 * [AR6], because in a server-rendered dashboard a preference that silently
 * fails to save is indistinguishable from a broken picker.
 *
 * @param {string} theme
 * @param {{ key?: string, storage?: Storage }} [options]
 * @returns {boolean} whether the choice will survive a reload
 */
export declare function storeTheme(theme: string, { key, storage }?: {
    key?: string;
    storage?: Storage;
}): boolean;
/**
 * @param {{ key?: string, storage?: Storage }} [options]
 * @returns {ThemeName | null} the stored choice, or null if there is none or storage is unreadable
 */
export declare function storedTheme({ key, storage }?: {
    key?: string;
    storage?: Storage;
}): ThemeName | null;
