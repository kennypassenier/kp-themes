/** The default glyph set: ASCII noise plus half-width katakana. A default, not a decision. */
export declare const DECIPHER_GLYPHS = "01<>[]{}/\\|=+*#$%&?\uFF71\uFF76\uFF7B\uFF80\uFF85\uFF8A\uFF8F\uFF94\uFF97";
/**
 * CP-A3: heading text deciphers itself — random glyphs settle into the
 * real characters, once. Plain text under prefers-reduced-motion and
 * wherever `when` says no. Screen readers always get the real text.
 *
 * Every number in here was a literal until 3.0.0 [KT6]: the glyph set,
 * the settle rate (which was also frame-rate dependent — twice as fast
 * on a 120 Hz screen), the direction, and the theme it was allowed in.
 *
 * @param {{
 *   text: string,
 *   delay?: number,
 *   when?: import('./when.js').When,
 *   glyphs?: string,
 *   charsPerSecond?: number,
 *   direction?: 'ltr' | 'rtl' | 'random',
 *   preserve?: RegExp,
 *   as?: import('react').ElementType,
 *   className?: string,
 *   style?: import('react').CSSProperties,
 * } & Record<string, unknown>} props
 */
export default function DecipherText({ text, delay, when, glyphs, charsPerSecond, direction, preserve, as: As, className, style, ...rest }: {
    text: string;
    delay?: number;
    when?: import('./when.js').When;
    glyphs?: string;
    charsPerSecond?: number;
    direction?: 'ltr' | 'rtl' | 'random';
    preserve?: RegExp;
    as?: import('react').ElementType;
    className?: string;
    style?: import('react').CSSProperties;
} & Record<string, unknown>): import("react").JSX.Element;
