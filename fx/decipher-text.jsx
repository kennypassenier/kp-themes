import { useEffect, useState } from 'react';
import { useReducedMotion } from './use-reduced-motion.js';
import { useTheme } from '../hooks/use-theme.js';

const GLYPHS = '01<>[]{}/\\|=+*#$%&?ｱｶｻﾀﾅﾊﾏﾔﾗ';

/**
 * CP-A3: heading text deciphers itself - random glyphs settle into the
 * real characters left to right, once. Plain text in every other theme
 * and under prefers-reduced-motion. Screen readers always get the real
 * text via aria-label.
 * @param {{ text: string; delay?: number }} props
 */
export default function DecipherText({ text, delay = 0 }) {
    const { theme } = useTheme();
    const reduced = useReducedMotion();
    const active = theme === 'cyberpunk';
    const [display, setDisplay] = useState(text);

    useEffect(() => {
        if (!active || reduced) {
            setDisplay(text);
            return;
        }

        let settled = 0;
        let frame = 0;
        let raf = 0;
        const start = performance.now() + delay;

        /** @param {number} now */
        const tick = (now) => {
            if (now < start) {
                raf = requestAnimationFrame(tick);
                return;
            }
            frame++;
            if (frame % 2 === 0) settled++;
            setDisplay(
                text
                    .split('')
                    .map((ch, i) => (i < settled || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
                    .join(''),
            );
            if (settled < text.length) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [text, active, delay, reduced]);

    return (
        <span aria-label={text} role="text">
            <span aria-hidden="true">{display}</span>
        </span>
    );
}
