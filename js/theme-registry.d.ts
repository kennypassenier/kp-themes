export type ThemeName = 'formal' | 'light' | 'dark' | 'cyberpunk' | 'pastel' | 'terminal' | 'topo' | 'high-contrast' | 'sepia' | 'blueprint' | 'solstice';
export type ThemeRecord = {
    name: ThemeName;
    label: string;
    dark: boolean;
};
/**
 * Every theme name there is [KT4].
 *
 * A union rather than `string`, so a typo is a compile error for a
 * consumer instead of a silent fallback to `formal` at runtime. It is
 * generated for the same reason the list below is: two consumers were
 * measured on 2026-09-04 carrying a hand-kept copy of which themes
 * exist, and both had it wrong.
 *
 * @typedef {'formal' | 'light' | 'dark' | 'cyberpunk' | 'pastel' | 'terminal' | 'topo' | 'high-contrast' | 'sepia' | 'blueprint' | 'solstice'} ThemeName
 */
/** @typedef {{name: ThemeName, label: string, dark: boolean}} ThemeRecord */
/** @type {readonly ThemeRecord[]} */
export declare const THEMES: readonly ThemeRecord[];
/**
 * The theme a visitor gets before choosing, and the answer to any
 * unknown value.
 *
 * @type {ThemeName}
 */
export declare const DEFAULT_THEME: ThemeName;
/** The localStorage key. Contract value: consumers read it too [TH26]. */
export declare const STORAGE_KEY = "theme";
