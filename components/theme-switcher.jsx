import { useEffect, useRef, useState } from 'react';
import { THEME_LABELS, THEME_META, THEMES, useTheme } from '../hooks/use-theme.js';

// Dependency-free port of kp-soft's switcher: the shadcn DropdownMenu and
// lucide icons are replaced by a plain button + listbox and two inline
// SVGs. Class names are Tailwind/shadcn tokens (bg-accent, border-border,
// text-destructive ...): they style themselves in a Tailwind consumer that
// imports css/tailwind-bridge.css and are harmless elsewhere.

/** @param {{ className?: string }} props */
function PaletteIcon({ className = '' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.6-10-8.6z" />
        </svg>
    );
}

/** @param {{ className?: string }} props */
function CheckIcon({ className = '' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

/**
 * @typedef {object} ThemeSwitcherProps
 * @property {import('../hooks/use-theme.js').UseThemeOptions} [themeOptions]  Passed straight to useTheme (preferred / fallback / onChange).
 * @property {string} [label]         Accessible name of the trigger. Default: 'Thema kiezen'.
 * @property {string} [failedMessage] Shown when onChange refused the change. Default: 'Niet bewaard op de server — je keuze is teruggezet.'
 * @property {string} [className]     Extra classes on the wrapper.
 */

/** @param {ThemeSwitcherProps} props */
export default function ThemeSwitcher({
    themeOptions,
    label = 'Thema kiezen',
    failedMessage = 'Niet bewaard op de server — je keuze is teruggezet.',
    className = '',
}) {
    const { theme, updateTheme, saveFailed } = useTheme(themeOptions);
    const [open, setOpen] = useState(false);
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const wrapper = useRef(null);

    useEffect(() => {
        if (!open) return;
        /** @param {MouseEvent} e */
        const onClick = (e) => {
            if (wrapper.current && !wrapper.current.contains(/** @type {Node} */ (e.target))) setOpen(false);
        };
        /** @param {KeyboardEvent} e */
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <div ref={wrapper} className={`relative inline-block ${className}`} data-theme-switcher="">
            <button
                type="button"
                className="hover:bg-accent hover:text-accent-foreground inline-flex size-9 items-center justify-center rounded-md transition-colors"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
            >
                <PaletteIcon className="size-4" />
            </button>
            {open && (
                <ul
                    role="listbox"
                    aria-label={label}
                    className="bg-popover text-popover-foreground border-border absolute right-0 z-50 mt-1 w-44 rounded-md border p-1 shadow-md"
                >
                    {saveFailed && <li className="text-destructive px-2 py-1.5 text-xs">{failedMessage}</li>}
                    {THEMES.map((t) => (
                        <li
                            key={t}
                            role="option"
                            aria-selected={theme === t}
                            tabIndex={0}
                            onClick={() => {
                                updateTheme(t);
                                setOpen(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    updateTheme(t);
                                    setOpen(false);
                                }
                            }}
                            className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                        >
                            <span
                                className="border-border inline-block size-4 rounded-full border"
                                style={{
                                    background: `linear-gradient(135deg, ${THEME_META[t].bg} 50%, ${THEME_META[t].primary} 50%)`,
                                }}
                            />
                            <span className="flex-1">{THEME_LABELS[t]}</span>
                            {theme === t && <CheckIcon className="size-4" />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
