import { useEffect, useRef } from 'react';
import { useTheme } from '../hooks/use-theme.js';

const GLYPHS = '01ｱｲｳｶｷｸｻｼｽﾀﾁﾂﾅﾆﾇﾊﾋﾌ';

/**
 * CP-D4: falling-glyph rain. Deliberately used in exactly two places
 * in kp-soft (the puzzle "solved" moment and error pages) - anywhere
 * else it turns into cliche. Renders nothing outside cyberpunk or under
 * reduced motion.
 * @param {{ className?: string }} props
 */
export default function DigitalRain({ className = '' }) {
    const { theme } = useTheme();
    /** @type {import('react').RefObject<HTMLCanvasElement | null>} */
    const ref = useRef(null);
    const active = theme === 'cyberpunk';

    useEffect(() => {
        const canvas = ref.current;
        if (!active || !canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const fontSize = 13;
        const columns = Math.ceil(width / fontSize);
        const drops = Array.from({ length: columns }, () => Math.random() * -40);
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0ff';

        let raf = 0;
        let last = 0;
        /** @param {number} now */
        const tick = (now) => {
            raf = requestAnimationFrame(tick);
            if (now - last < 50) return;
            last = now;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = accent;
            ctx.font = `${fontSize}px monospace`;
            ctx.globalAlpha = 0.55;
            for (let i = 0; i < columns; i++) {
                const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            ctx.globalAlpha = 1;
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [active]);

    if (!active) return null;

    return <canvas ref={ref} className={`pointer-events-none ${className}`} aria-hidden="true" />;
}
