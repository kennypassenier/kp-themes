import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { THEME_LABELS, THEME_RECORDS, useTheme } from '../hooks/use-theme.js';
import { useStrings } from '../hooks/use-strings.jsx';

// The theme switcher, React [S2, TH63].
//
// A plain button + listbox with two inline SVGs; no dependency. Since
// 3.0.0 [KT6] the class names are the package's own (`kp-theme-menu`,
// `kp-icon-button`, `kp-popover`, `kp-menu`) so the two channels look
// alike and a consumer without Tailwind gets a styled menu; the old
// Tailwind/shadcn names are gone. Everything else the audit found
// welded shut is a prop now: which themes appear, whether the list is
// grouped light and dark, the icons, the open state, what closes it,
// and whether a choice is persisted.

/** @param {{ className?: string }} props */
export function PaletteIcon({ className = '' }) {
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
export function CheckIcon({ className = '' }) {
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
 * @property {readonly import('../js/theme-registry.js').ThemeRecord[]} [themes]  Which themes to offer. Default: all of them.
 * @property {boolean} [grouped]      Light and dark in two sections, each with a small label [TH63]. Default true.
 * @property {{ light?: string, dark?: string }} [groupLabels]  The section labels. Default: the dictionary's.
 * @property {string} [label]         Accessible name of the trigger. Default: the dictionary's `themePicker`.
 * @property {string} [failedMessage] Shown when onChange refused the change. Default: the dictionary's `themeSaveRefused`.
 * @property {string} [storageMessage] Shown when the browser refused to store the choice. Default: the dictionary's `themeSaveFailed`.
 * @property {Partial<import('../js/strings.js').Strings>} [strings] override any of the words this component speaks
 * @property {Partial<Record<string, string>>} [labels]  Per-theme labels overriding the registry's.
 * @property {boolean} [open]          Controlled open state.
 * @property {boolean} [defaultOpen]   Initial open state when uncontrolled.
 * @property {(open: boolean) => void} [onOpenChange]
 * @property {boolean} [closeOnEscape]        Default true.
 * @property {boolean} [closeOnOutsideClick]  Default true.
 * @property {boolean} [closeOnSelect]        Default true.
 * @property {import('react').ReactNode} [icon]       The trigger's icon. Default: the palette.
 * @property {import('react').ReactNode} [checkIcon]  The mark on the current theme. Default: a check.
 * @property {(theme: string) => void} [onSelect]     Called after a choice, with the theme applied.
 * @property {string} [className]     Extra classes on the wrapper.
 * @property {import('react').CSSProperties} [style]
 * @property {{ trigger?: string, menu?: string, option?: string, group?: string, groupLabel?: string, status?: string }} [classNames]  Extra classes per part.
 */

/**
 * @param {ThemeSwitcherProps & Record<string, unknown>} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function ThemeSwitcherInner(
    {
        labels,
        themeOptions,
        themes = THEME_RECORDS,
        grouped = true,
        groupLabels = {},
        label,
        failedMessage,
        storageMessage,
        strings,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        closeOnEscape = true,
        closeOnOutsideClick = true,
        closeOnSelect = true,
        icon,
        checkIcon,
        onSelect,
        className = '',
        style,
        classNames = {},
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const name = label ?? s.themePicker;
    const refused = failedMessage ?? s.themeSaveRefused;
    const blocked = storageMessage ?? s.themeSaveFailed;
    const { theme, updateTheme, saveFailed, storageFailed } = useTheme(themeOptions);
    const [openState, setOpenState] = useState(defaultOpen);
    const open = openProp ?? openState;
    /** @param {boolean} next */
    const setOpen = (next) => {
        if (openProp === undefined) setOpenState(next);
        onOpenChange?.(next);
    };
    const id = useId();
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const wrapper = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDivElement} */ (wrapper.current), []);
    // Roving tabindex: one tab stop for the list, arrows between the
    // options [TH63]. The first version put every option in the tab
    // order, which is eleven stops to cross a menu.
    const [focused, setFocused] = useState(0);

    useEffect(() => {
        if (!open) return;
        /** @param {MouseEvent} e */
        const onClick = (e) => {
            if (closeOnOutsideClick && wrapper.current && !wrapper.current.contains(/** @type {Node} */ (e.target))) setOpen(false);
        };
        /** @param {KeyboardEvent} e */
        const onKey = (e) => {
            if (closeOnEscape && e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onClick);
            document.removeEventListener('keydown', onKey);
        };
        // setOpen is a closure over props that change with them; listing
        // it would re-bind on every render for no gain.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, closeOnEscape, closeOnOutsideClick]);

    const flat = themes.map((t) => t.name);
    /** @param {string} t */
    const choose = (t) => {
        updateTheme(/** @type {import('../js/theme-registry.js').ThemeName} */ (t));
        onSelect?.(t);
        if (closeOnSelect) setOpen(false);
    };
    /** @param {import('react').KeyboardEvent} e @param {number} index @param {string} t */
    const onOptionKey = (e, index, t) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            choose(t);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const next = (index + (e.key === 'ArrowDown' ? 1 : -1) + flat.length) % flat.length;
            setFocused(next);
            /** @type {HTMLElement | null} */ (wrapper.current?.querySelector(`[data-kp-theme="${flat[next]}"]`) ?? null)?.focus();
        }
    };

    /** @param {import('../js/theme-registry.js').ThemeRecord} t */
    const option = (t) => {
        const index = flat.indexOf(t.name);
        return (
            <li
                key={t.name}
                role="option"
                id={`${id}-${t.name}`}
                data-kp-theme={t.name}
                data-selected={theme === t.name}
                aria-selected={theme === t.name}
                tabIndex={index === focused ? 0 : -1}
                onClick={() => choose(t.name)}
                onFocus={() => setFocused(index)}
                onKeyDown={(e) => onOptionKey(e, index, t.name)}
                className={classNames.option}
            >
                {/* The swatch wears the theme it previews, so it shows the
                    live colours rather than a copy of them kept in step by
                    hand [AR11]. */}
                <span className="kp-swatch" data-theme={t.name} />
                <span className="kp-theme-option__label">
                    {labels?.[t.name] ?? THEME_LABELS[/** @type {import('../js/theme-registry.js').ThemeName} */ (t.name)] ?? t.label}
                </span>
                {theme === t.name && (checkIcon ?? <CheckIcon className="kp-theme-option__check" />)}
            </li>
        );
    };
    /** @param {'light' | 'dark'} kind @param {string} heading */
    const group = (kind, heading) => {
        const list = themes.filter((t) => (kind === 'dark' ? t.dark : !t.dark));
        if (list.length === 0) return null;
        return (
            <li role="presentation" className={`kp-theme-group ${classNames.group ?? ''}`.trim()} data-kp-theme-group={kind} key={kind}>
                <span className={`kp-theme-group__label ${classNames.groupLabel ?? ''}`.trim()} aria-hidden="true">
                    {heading}
                </span>
                <ul role="group" className="kp-theme-group__list" aria-label={heading}>
                    {list.map(option)}
                </ul>
            </li>
        );
    };

    return (
        <div ref={wrapper} className={`kp-theme-menu ${className}`.trim()} style={style} data-theme-switcher="" {...rest}>
            <button
                type="button"
                className={`kp-icon-button ${classNames.trigger ?? ''}`.trim()}
                aria-label={name}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                onClick={() => setOpen(!open)}
            >
                {icon ?? <PaletteIcon />}
            </button>
            {open && (
                <ul
                    id={`${id}-list`}
                    role="listbox"
                    aria-label={name}
                    className={`kp-popover kp-menu kp-theme-menu__list ${classNames.menu ?? ''}`.trim()}
                    data-kp-theme-picker=""
                >
                    {saveFailed && (
                        <li role="presentation" className={`kp-theme-menu__status ${classNames.status ?? ''}`.trim()} data-kp-theme-status="">
                            {refused}
                        </li>
                    )}
                    {storageFailed && (
                        <li role="presentation" className={`kp-theme-menu__status ${classNames.status ?? ''}`.trim()} data-kp-theme-status="">
                            {blocked}
                        </li>
                    )}
                    {grouped
                        ? [group('light', groupLabels.light ?? s.themeGroupLight), group('dark', groupLabels.dark ?? s.themeGroupDark)]
                        : themes.map(option)}
                </ul>
            )}
        </div>
    );
}

const ThemeSwitcher = forwardRef(ThemeSwitcherInner);
export default ThemeSwitcher;
