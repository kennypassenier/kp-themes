/** The attribute the stylesheet keys on. A contract value [TH26]. */
export declare const THEME_ATTRIBUTE = "data-theme";
/** The attribute the register keys its reveal start states on [AR34]; the same value as ROOT_ATTRIBUTE in js/effects.js. */
export declare const EFFECTS_ATTRIBUTE = "data-kp-effects";
export declare function noFlashSnippet({ key, attribute, effects }?: {
    attribute?: string | undefined;
    effects?: boolean | undefined;
    key?: string | undefined;
}): string;
/** The snippet with the defaults, for the common case. */
export declare const NO_FLASH_SNIPPET: string;
/**
 * What the snippet does, as a function: copy the stored theme onto the
 * document element. Returns the name applied, or null.
 *
 * @param {{ key?: string, attribute?: string, root?: Element }} [options]
 * @returns {string | null}
 */
export declare function applyStoredTheme({ key, attribute, root }?: {
    key?: string;
    attribute?: string;
    root?: Element;
}): string | null;
