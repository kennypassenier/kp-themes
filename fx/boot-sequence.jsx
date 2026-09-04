// `motion` is an optional peer the consumer installs; this package does
// not, so the type checker has nothing to read here. The import is real
// at runtime for anyone who uses BootSequence — which is why this file
// is NOT in the fx barrel since 3.0.0 [KT6]: import it from
// '@kp-soft/themes/fx/boot-sequence' and only you pay for the peer.
// @ts-ignore -- optional peer dependency, not installed in this repository
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useReducedMotion } from './use-reduced-motion.js';
import { useTheme } from '../hooks/use-theme.js';
import { effectActive } from './when.js';

const DEFAULT_LINES = ['> INIT', '> LOADING THEME ... CYBERPUNK', '> AUTH LAYER ... OK', '> RENDER ... OK'];

/** Where "once per session" is remembered. A default; two apps on one origin pass their own. */
export const BOOT_STORAGE_KEY = 'fx-booted';

/**
 * CP-E1: the site "boots" — a few monospace log lines, once per session,
 * skippable with a click. Requires the optional `motion` peer.
 *
 * The overlay's classes are yours. The default set is the Tailwind one
 * kp-soft used, kept so that consumer sees no change; a consumer without
 * Tailwind passes `className` and `preClassName` with their own.
 *
 * @param {{
 *   lines?: string[],
 *   when?: import('./when.js').When,
 *   once?: boolean,
 *   storageKey?: string,
 *   perLineMs?: number,
 *   tailMs?: number,
 *   exitSeconds?: number,
 *   className?: string,
 *   preClassName?: string,
 *   caretClassName?: string,
 *   onDone?: () => void,
 * }} props
 */
export default function BootSequence({
    lines: LINES = DEFAULT_LINES,
    when = 'cyberpunk',
    once = true,
    storageKey = BOOT_STORAGE_KEY,
    perLineMs = 140,
    tailMs = 260,
    exitSeconds = 0.18,
    className = 'bg-background fixed inset-0 z-[90] cursor-pointer p-6 sm:p-10',
    preClassName = 'text-primary font-mono text-sm leading-7',
    caretClassName = 'bg-primary ml-1 inline-block h-4 w-2 animate-pulse align-middle',
    onDone,
}) {
    const { theme } = useTheme();
    const reduced = useReducedMotion();
    const [visible, setVisible] = useState(false);
    const [lines, setLines] = useState(0);

    useEffect(() => {
        if (!effectActive(when, theme)) return;
        if (once) {
            try {
                if (sessionStorage.getItem(storageKey)) return;
                sessionStorage.setItem(storageKey, '1');
            } catch {
                return;
            }
        }
        if (reduced) return;

        setVisible(true);
        const timer = setInterval(() => setLines((n) => n + 1), perLineMs);
        const done = setTimeout(
            () => {
                setVisible(false);
                onDone?.();
            },
            perLineMs * LINES.length + tailMs,
        );
        return () => {
            clearInterval(timer);
            clearTimeout(done);
        };
    }, [theme, when, once, storageKey, LINES.length, reduced, perLineMs, tailMs, onDone]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    exit={{ opacity: 0 }}
                    transition={{ duration: exitSeconds }}
                    className={className}
                    onClick={() => {
                        setVisible(false);
                        onDone?.();
                    }}
                    aria-hidden="true"
                >
                    <pre className={preClassName}>
                        {LINES.slice(0, lines + 1).join('\n')}
                        <span className={caretClassName} />
                    </pre>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
