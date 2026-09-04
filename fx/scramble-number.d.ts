/** The default rattle set. Hex, because a counter that only shows decimals reads as a typo. */
export declare const SCRAMBLE_DIGITS = "0123456789ABCDEF";
/**
 * CP-E4: numbers rattle to their final value like a split-flap counter.
 * Elsewhere, and under reduced motion, it is just the value.
 *
 * `\p{Nd}` rather than `[0-9]` [KT6]: Arabic-Indic and Devanagari
 * numerals are numbers too, and a guard that only knew ASCII left them
 * standing still while the rest of the value rattled.
 *
 * @param {{
 *   value: string,
 *   when?: import('./when.js').When,
 *   digits?: string,
 *   intervalMs?: number,
 *   as?: import('react').ElementType,
 *   className?: string,
 *   style?: import('react').CSSProperties,
 * } & Record<string, unknown>} props
 */
export default function ScrambleNumber({ value, when, digits, intervalMs, as: As, className, style, ...rest }: {
    value: string;
    when?: import('./when.js').When;
    digits?: string;
    intervalMs?: number;
    as?: import('react').ElementType;
    className?: string;
    style?: import('react').CSSProperties;
} & Record<string, unknown>): import("react").JSX.Element;
