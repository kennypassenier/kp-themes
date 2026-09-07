/**
 * The glyph set, re-exported from the module for a consumer that read it
 * from here. The block glyphs are gone (AR40).
 */
export declare const DECIPHER_GLYPHS = "01<>/\\|=+*#%@&$?!ZXKQ";
/**
 * Deciphers `text` into place — a thin wrapper around js/effects.js
 * since 5.0.0 [AR45]: one decipher engine, one DI5 table, one suite for
 * both channels. The element it renders carries
 * `data-kp-reveal="headline"` and `data-kp-reveal-every="load"`, so the
 * module runs it on every mount (a component that mounts is a page
 * asking) and the theme decides the look: a theme whose register
 * declares no `--kp-reveal-headline` shows the text and nothing else.
 *
 * Deprecated in favour of the attribute on your own element plus
 * `attachEffects()` (MIGRATION.md); kept so the JobTracker call sites
 * keep working. `delay`, `direction`, `preserve` and `glyphs` of the 4.x
 * engine are gone: timing is the theme's (`--kp-decipher-*`), the order
 * is left to right.
 *
 * @param {{
 *   text: string,
 *   when?: string | string[] | boolean | ((theme: string) => boolean),
 *   charsPerSecond?: number,
 *   as?: any,
 *   className?: string,
 *   style?: import('react').CSSProperties,
 * } & Record<string, any>} props
 */
export default function DecipherText({ text, when, charsPerSecond, as: As, className, style, ...rest }: {
    text: string;
    when?: string | string[] | boolean | ((theme: string) => boolean);
    charsPerSecond?: number;
    as?: any;
    className?: string;
    style?: import('react').CSSProperties;
} & Record<string, any>): import("react").JSX.Element;
