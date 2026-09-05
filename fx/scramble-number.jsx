import { useEffect, useState } from 'react';
import { useReducedMotion } from './use-reduced-motion.js';
import { useTheme } from '../hooks/use-theme.js';
import { effectActive } from './when.js';

/** The default rattle set. Hex, because a counter that only shows decimals reads as a typo. */
export const SCRAMBLE_DIGITS = '0123456789ABCDEF';

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
export default function ScrambleNumber({
    value,
    when = 'cyberpunk',
    digits = SCRAMBLE_DIGITS,
    intervalMs = 40,
    as: As = 'span',
    className,
    style,
    ...rest
}) {
    const { theme } = useTheme();
    const reduced = useReducedMotion();
    const active = effectActive(when, theme);
    const [display, setDisplay] = useState(value);

    useEffect(() => {
        if (!active || reduced) {
            setDisplay(value);
            return;
        }
        let settled = 0;
        const timer = setInterval(() => {
            settled++;
            setDisplay(
                value
                    .split('')
                    .map((ch, i) => (i < settled || !/\p{Nd}/u.test(ch) ? ch : digits[Math.floor(Math.random() * digits.length)]))
                    .join(''),
            );
            if (settled >= value.length) clearInterval(timer);
        }, intervalMs);
        return () => clearInterval(timer);
    }, [value, active, reduced, digits, intervalMs]);

    return (
        <As aria-label={value} className={className} style={style} {...rest}>
            <span aria-hidden="true">{display}</span>
        </As>
    );
}
