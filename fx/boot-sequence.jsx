import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTheme } from '../hooks/use-theme.js';

const DEFAULT_LINES = ['> INIT', '> LOADING THEME ... CYBERPUNK', '> AUTH LAYER ... OK', '> RENDER ... OK'];

/**
 * CP-E1: the site "boots" - a few monospace log lines, once per
 * session, skippable with a click. Cyberpunk only; other themes never
 * mount the overlay at all. Requires the optional `motion` peer.
 * @param {{ lines?: string[] }} props  kp-soft used '> INIT KP-SOFT' as the first line; pass your own.
 */
export default function BootSequence({ lines: LINES = DEFAULT_LINES }) {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const [lines, setLines] = useState(0);

    useEffect(() => {
        if (theme !== 'cyberpunk') return;
        try {
            if (sessionStorage.getItem('fx-booted')) return;
            sessionStorage.setItem('fx-booted', '1');
        } catch {
            return;
        }
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        setVisible(true);
        const perLine = 140;
        const timer = setInterval(() => setLines((n) => n + 1), perLine);
        const done = setTimeout(() => setVisible(false), perLine * LINES.length + 260);
        return () => {
            clearInterval(timer);
            clearTimeout(done);
        };
    }, [theme, LINES.length]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="bg-background fixed inset-0 z-[90] cursor-pointer p-6 sm:p-10"
                    onClick={() => setVisible(false)}
                    aria-hidden="true"
                >
                    <pre className="text-primary font-mono text-sm leading-7">
                        {LINES.slice(0, lines + 1).join('\n')}
                        <span className="bg-primary ml-1 inline-block h-4 w-2 animate-pulse align-middle" />
                    </pre>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
