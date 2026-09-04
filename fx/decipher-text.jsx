import { useEffect, useState } from 'react';
import { useReducedMotion } from './use-reduced-motion.js';
import { useTheme } from '../hooks/use-theme.js';
import { effectActive } from './when.js';

/** The default glyph set: ASCII noise plus half-width katakana. A default, not a decision. */
export const DECIPHER_GLYPHS = '01<>[]{}/\\|=+*#$%&?ｱｶｻﾀﾅﾊﾏﾔﾗ';

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
export default function DecipherText({
    text,
    delay = 0,
    when = 'cyberpunk',
    glyphs = DECIPHER_GLYPHS,
    charsPerSecond = 30,
    direction = 'ltr',
    preserve = /\s/,
    as: As = 'span',
    className,
    style,
    ...rest
}) {
    const { theme } = useTheme();
    const reduced = useReducedMotion();
    const active = effectActive(when, theme);
    const [display, setDisplay] = useState(text);

    useEffect(() => {
        if (!active || reduced) {
            setDisplay(text);
            return;
        }

        // The order the characters settle in, decided once: left to
        // right, right to left, or shuffled.
        const order = text.split('').map((_, i) => i);
        if (direction === 'rtl') order.reverse();
        if (direction === 'random') {
            for (let i = order.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [order[i], order[j]] = [order[j] ?? 0, order[i] ?? 0];
            }
        }
        const rank = new Map(order.map((index, position) => [index, position]));

        let raf = 0;
        const start = performance.now() + delay;
        const msPerChar = 1000 / Math.max(1, charsPerSecond);

        /** @param {number} now */
        const tick = (now) => {
            if (now < start) {
                raf = requestAnimationFrame(tick);
                return;
            }
            // Time-based rather than frame-based, so it reads the same on
            // every screen.
            const settled = Math.floor((now - start) / msPerChar);
            setDisplay(
                text
                    .split('')
                    .map((ch, i) => ((rank.get(i) ?? 0) < settled || preserve.test(ch) ? ch : glyphs[Math.floor(Math.random() * glyphs.length)]))
                    .join(''),
            );
            if (settled < text.length) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [text, active, delay, reduced, glyphs, charsPerSecond, direction, preserve]);

    return (
        <As aria-label={text} className={className} style={style} {...rest}>
            <span aria-hidden="true">{display}</span>
        </As>
    );
}
