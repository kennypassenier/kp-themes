import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useReducedMotion } from './use-reduced-motion.js';
import { useTheme } from '../hooks/use-theme.js';
import { effectActive } from './when.js';

/** The default glyph set: binary plus half-width katakana. A default, not a decision. */
export const RAIN_GLYPHS = '01ｱｲｳｶｷｸｻｼｽﾀﾁﾂﾅﾆﾇﾊﾋﾌ';

/**
 * CP-D4: falling-glyph rain. Renders nothing under reduced motion or
 * wherever `when` says no.
 *
 * Until 3.0.0 [KT6] this carried eleven literals a consumer could not
 * reach — the glyphs, the font size that doubles as column density, the
 * frame interval, the trail colour (hardcoded black, which smeared over
 * a light surface), the accent token, the alpha, the respawn chance, the
 * DPR cap, the canvas font — and it read its size once, so a canvas that
 * resized kept raining into the old box.
 *
 * @typedef {{
 *   when?: import('./when.js').When,
 *   glyphs?: string,
 *   fontSize?: number,
 *   intervalMs?: number,
 *   colourToken?: string,
 *   trailToken?: string,
 *   trailAlpha?: number,
 *   alpha?: number,
 *   respawn?: number,
 *   maxDevicePixelRatio?: number,
 *   font?: string,
 *   className?: string,
 *   style?: import('react').CSSProperties,
 * } & Record<string, unknown>} DigitalRainProps
 */
/**
 * @param {DigitalRainProps} props
 * @param {import('react').ForwardedRef<HTMLCanvasElement>} ref
 */
function DigitalRainInner(
    {
        when = 'cyberpunk',
        glyphs = RAIN_GLYPHS,
        fontSize = 13,
        intervalMs = 50,
        colourToken = '--accent',
        trailToken = '--background',
        trailAlpha = 0.12,
        alpha = 0.55,
        respawn = 0.025,
        maxDevicePixelRatio = 2,
        font,
        className = '',
        style,
        ...rest
    },
    ref,
) {
    const { theme } = useTheme();
    const reduced = useReducedMotion();
    /** @type {import('react').RefObject<HTMLCanvasElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLCanvasElement} */ (inner.current), []);
    const active = effectActive(when, theme);

    useEffect(() => {
        const canvas = inner.current;
        if (!active || !canvas || reduced) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const styles = getComputedStyle(document.documentElement);
        const colour = styles.getPropertyValue(colourToken).trim() || 'currentColor';
        // The trail is the background with some alpha, so the rain fades
        // into whatever surface it is on rather than into black.
        const trail = styles.getPropertyValue(trailToken).trim();
        const mono = font ?? `${fontSize}px ${styles.getPropertyValue('--font-mono').trim() || 'monospace'}`;

        let width = 0;
        let height = 0;
        /** @type {number[]} */
        let drops = [];
        const size = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, maxDevicePixelRatio);
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const columns = Math.ceil(width / fontSize);
            drops = Array.from({ length: columns }, (_, i) => drops[i] ?? Math.random() * -40);
        };
        size();
        const observer = new ResizeObserver(size);
        observer.observe(canvas);

        let raf = 0;
        let last = 0;
        /** @param {number} now */
        const tick = (now) => {
            raf = requestAnimationFrame(tick);
            if (now - last < intervalMs) return;
            last = now;
            ctx.globalAlpha = trailAlpha;
            ctx.fillStyle = trail || '#000';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = colour;
            ctx.font = mono;
            ctx.globalAlpha = alpha;
            for (let i = 0; i < drops.length; i++) {
                const ch = glyphs[Math.floor(Math.random() * glyphs.length)] ?? '';
                const y = (drops[i] ?? 0) * fontSize;
                ctx.fillText(ch, i * fontSize, y);
                if (y > height && Math.random() < respawn) drops[i] = 0;
                drops[i] = (drops[i] ?? 0) + 1;
            }
            ctx.globalAlpha = 1;
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
        };
    }, [active, reduced, glyphs, fontSize, intervalMs, colourToken, trailToken, trailAlpha, alpha, respawn, maxDevicePixelRatio, font]);

    if (!active) return null;

    return <canvas ref={inner} className={`kp-rain ${className}`.trim()} style={{ pointerEvents: 'none', ...style }} aria-hidden="true" {...rest} />;
}

const DigitalRain = forwardRef(DigitalRainInner);

export default DigitalRain;
