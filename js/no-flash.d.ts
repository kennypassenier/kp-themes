/** The attribute the stylesheet keys on. A contract value [TH26]. */
export declare const THEME_ATTRIBUTE = "data-theme";
/** The attribute the register keys its reveal start states on [AR34]; the same value as ROOT_ATTRIBUTE in js/effects.js. */
export declare const EFFECTS_ATTRIBUTE = "data-kp-effects";
/** The attribute the snippet writes when this path already played its page headline this session [title-1270]. */
export declare const EFFECTS_REPEAT_ATTRIBUTE = "data-kp-effects-repeat";
/**
 * Where a register is served from, as a pattern with `{theme}` in it
 * [scope-50]. The same default as REGISTER_PATTERN in js/lazy-register.js,
 * kept as a literal here because this file's import closure is vendored
 * as it is (gates/check-closure.mjs).
 */
export declare const REGISTER_PATTERN_DEFAULT = "/css/{theme}-register.css";
/**
 * The snippet to inline inside <script> in <head>, before the stylesheet link. Plain ES5, no imports, no dependency on this package
 * being loaded.
 * @param {{ key?: string, attribute?: string, effects?: boolean, repeat?: boolean, register?: boolean | { pattern?: string, fallback?: string } }} [options]
 *   effects: also arm the reveals before first paint. repeat (default true, only with `effects`): also write
 *   `data-kp-effects-repeat` on a path whose headline already played this session, so a repeat view shows its page title at rest from
 *   the first frame; `false` leaves the title hidden until the module decides, as before [title-1270].
 *   register: also write the active theme's register link, for a page that
 *   loads registers lazily (js/lazy-register.js). The snippet then goes
 *   BELOW the css/themes.css link, not above it — see README.md, "Per
 *   theme". Default false: the snippet is byte-for-byte what it was.
 * @returns {string}
 */
export declare function noFlashSnippet({ key, attribute, effects, repeat, register }?: {
    key?: string;
    attribute?: string;
    effects?: boolean;
    repeat?: boolean;
    register?: boolean | {
        pattern?: string;
        fallback?: string;
    };
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
