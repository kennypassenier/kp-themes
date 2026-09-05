/** The attribute the stylesheet keys on. A contract value [TH26]. */
export declare const THEME_ATTRIBUTE = "data-theme";
/**
 * The snippet to inline inside <script> in <head>, before the stylesheet
 * link. Plain ES5, no imports, no dependency on this package being loaded.
 *
 * @param {{ key?: string, attribute?: string }} [options]
 * @returns {string}
 */
export declare function noFlashSnippet({ key, attribute }?: {
    key?: string;
    attribute?: string;
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
