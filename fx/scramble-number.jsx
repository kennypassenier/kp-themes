import { useEffect, useState } from 'react';
import { useReducedMotion } from './use-reduced-motion.js';
import { useTheme } from '../hooks/use-theme.js';

const DIGITS = '0123456789ABCDEF';

/**
 * CP-E4: numbers rattle to their final value like a split-flap/hex
 * counter. Elsewhere (and under reduced motion) it is just the value.
 * @param {{ value: string }} props
 */
export default function ScrambleNumber({ value }) {
    const { theme } = useTheme();
    const reduced = useReducedMotion();
    const active = theme === 'cyberpunk';
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
                    .map((ch, i) => (i < settled || !/[0-9]/.test(ch) ? ch : DIGITS[Math.floor(Math.random() * DIGITS.length)]))
                    .join(''),
            );
            if (settled >= value.length) clearInterval(timer);
        }, 40);
        return () => clearInterval(timer);
    }, [value, active, reduced]);

    return (
        <span aria-label={value} role="text">
            <span aria-hidden="true">{display}</span>
        </span>
    );
}
