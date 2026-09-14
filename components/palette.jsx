import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { subsequence } from '../js/listbox.js';
import { closeOnOutsidePress, isMac } from '../js/palette.js';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

// Command palette and shortcut sheet, React [TH40, TH49].
//
// Same contract as js/palette.js: a <dialog>, virtual focus, a
// literal match by default (subsequence on request, scope-56), and the command's value handed back rather than run
// here. What a command DOES is the application's business.
//
// The dialog element is used through a ref because `showModal()` is a
// method, not a prop — and it is the method that trapped focus, Escape
// and focus return come from. Rendering `open` as an attribute instead
// gives a non-modal dialog that does none of those three.
//
// Since 3.0.0 [KT6]: both open from code — a "⌘K" button in a header
// was impossible, the only entry was a hardcoded global key; the hotkey
// is a prop and can be off; which palette answers the key is nominated;
// the matcher is a choice; commands can be grouped; and the sheet's
// heading reads the resolved label rather than the raw prop, which left
// it empty whenever the default was wanted.
//
// Since scope-48: a command with an `href` is a link — Enter and a click
// both follow it, `onRun` still hears about it first, and `linkComponent`
// hands the rendering to a router the way NavBar's does. `PaletteTrigger`
// is the button for the bar's `search` slot; it and any
// `data-kp-palette-open` naming this palette's id open it, as they open the
// framework-free one.

/** @typedef {{ value: string, label: string, keys?: string, group?: string, description?: string, icon?: import('react').ReactNode, disabled?: boolean, href?: string, target?: string, rel?: string }} Command */
/** @typedef {(label: string, query: string, command: Command) => boolean} Matcher */

/** @type {Record<string, Matcher>} */
export const MATCHERS = {
    subsequence: (label, query) => subsequence(label, query),
    substring: (label, query) => label.toLowerCase().includes(query.toLowerCase()),
    prefix: (label, query) => label.toLowerCase().startsWith(query.toLowerCase()),
};

/**
 * @typedef {object} CommandPaletteProps
 * @property {Command[]} commands
 * @property {(value: string, command: Command) => void} [onRun]
 * @property {boolean} [open]           Controlled.
 * @property {boolean} [defaultOpen]
 * @property {(open: boolean) => void} [onOpenChange]
 * @property {string} [query]           Controlled.
 * @property {(query: string) => void} [onQueryChange]
 * @property {string | null} [hotkey]   The letter, with Ctrl/⌘. Default 'k'; null disables it.
 * @property {boolean} [primary]        This palette answers the key when there are several. Default: the first in the document.
 * @property {keyof typeof MATCHERS | Matcher} [match]  Default substring; 'subsequence' lets "thm" find "Theme" [scope-56].
 * @property {boolean} [resetOnClose]   Default true.
 * @property {boolean} [closeOnRun]     Default true.
 * @property {boolean} [loading]
 * @property {(command: Command, state: { active: boolean }) => import('react').ReactNode} [renderItem]
 * @property {import('react').ReactNode} [emptyState]
 * @property {import('react').ElementType} [linkComponent]  What renders a command with an `href`. Default: a plain `<a>`.
 * @property {string} [placeholder]
 * @property {string} [label]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {{ input?: string, list?: string, option?: string, group?: string, status?: string }} [classNames]
 */

/**
 * @param {CommandPaletteProps} props
 * @param {import('react').ForwardedRef<HTMLDialogElement>} ref
 */
function CommandPaletteInner(
    {
        commands,
        onRun,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        query: queryProp,
        onQueryChange,
        hotkey = 'k',
        primary = false,
        match = 'substring',
        resetOnClose = true,
        closeOnRun = true,
        loading = false,
        renderItem,
        emptyState,
        linkComponent: Link = 'a',
        placeholder,
        label,
        strings,
        className = '',
        style,
        classNames = {},
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const text = placeholder ?? s.commandPlaceholder;
    const name = label ?? s.commandsLabel;
    const id = useId();
    const listId = `${id}-list`;
    const dialog = useRef(/** @type {HTMLDialogElement | null} */ (null));
    useImperativeHandle(ref, () => /** @type {HTMLDialogElement} */ (dialog.current), []);
    const input = useRef(/** @type {HTMLInputElement | null} */ (null));
    const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
    const [query, setQuery] = useControllable(queryProp, '', onQueryChange);
    const [active, setActive] = useState(0);
    const matcher = typeof match === 'function' ? match : (MATCHERS[match] ?? MATCHERS.substring);

    const visible = commands.filter((command) => matcher(command.label, query, command));
    /** @type {Map<string, Command[]>} */
    const groups = new Map();
    for (const command of visible) {
        const key = command.group ?? '';
        groups.set(key, [...(groups.get(key) ?? []), command]);
    }

    // The state drives the element: showModal() when it opens, close()
    // when it closes, whichever side asked.
    useEffect(() => {
        const element = dialog.current;
        if (!element) return;
        if (open && !element.open) {
            element.showModal();
            input.current?.focus();
        }
        if (!open && element.open) element.close();
    }, [open]);

    // A press outside the box closes it, as Escape does [scope-80]; the
    // element's close event then sets the state, as it does for Escape.
    useEffect(() => {
        const element = dialog.current;
        return element === null ? undefined : closeOnOutsidePress(element);
    }, []);

    useEffect(() => {
        if (hotkey === null) return;
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            // ⌘K on a Mac, Ctrl+K everywhere else — checked rather than
            // assumed, because binding only one of them binds nothing on
            // the other platform.
            if (event.key.toLowerCase() !== hotkey.toLowerCase() || !(event.metaKey || event.ctrlKey)) return;
            const element = dialog.current;
            if (element === null) return;
            // One palette answers the key: the nominated one, else the
            // first in the document. The contract suite put one from each
            // channel on a page and both opened, stacking two dialogs.
            const nominated = document.querySelector('[data-kp-palette][data-kp-primary]');
            if ((nominated ?? document.querySelector('[data-kp-palette]')) !== element) return;
            event.preventDefault();
            setOpen(!element.open);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hotkey]);

    // A trigger opens it without a line of script [gap-12, scope-48]: a
    // `data-kp-palette-open` naming this dialog's id, or an empty one when
    // this is the palette that answers the key.
    useEffect(() => {
        /** @param {MouseEvent} event */
        const onOpener = (event) => {
            const opener = event.target instanceof Element ? event.target.closest('[data-kp-palette-open]') : null;
            const element = dialog.current;
            if (opener === null || element === null) return;
            const name = opener.getAttribute('data-kp-palette-open') ?? '';
            if (name === '') {
                const nominated = document.querySelector('[data-kp-palette][data-kp-primary]');
                if ((nominated ?? document.querySelector('[data-kp-palette]')) !== element) return;
            } else if (name !== element.id) return;
            setOpen(true);
        };
        document.addEventListener('click', onOpener);
        return () => document.removeEventListener('click', onOpener);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** @param {Command} command */
    const run = (command) => {
        if (command.disabled) return;
        onRun?.(command.value, command);
        if (closeOnRun) setOpen(false);
    };

    let index = -1;
    /** @param {Command} command */
    const option = (command) => {
        index += 1;
        const i = index;
        const props = {
            className: `kp-palette__option ${i === active ? 'is-active' : ''} ${classNames.option ?? ''}`.trim(),
            id: `${listId}-option-${i}`,
            role: 'option',
            'aria-selected': i === active,
            'aria-disabled': command.disabled ? /** @type {const} */ ('true') : undefined,
            'data-kp-option': '',
            'data-value': command.value,
            onMouseOver: () => setActive(i),
            onClick: () => run(command),
        };
        const content = renderItem ? (
            renderItem(command, { active: i === active })
        ) : (
            <>
                {command.icon}
                <span>{command.label}</span>
                {command.description && <span className="kp-palette__description">{command.description}</span>}
                {command.keys && <kbd className="kp-palette__keys">{command.keys}</kbd>}
            </>
        );
        // A link is the option itself, inside a presentational item, so the
        // listbox still holds options and the browser still follows the link
        // [scope-48]. Pointed at, never tabbed to: focus stays in the input.
        if (command.href !== undefined)
            return (
                <li role="presentation" key={command.value}>
                    <Link {...props} href={command.href} target={command.target} rel={command.rel} tabIndex={-1}>
                        {content}
                    </Link>
                </li>
            );
        return (
            <li {...props} key={command.value}>
                {content}
            </li>
        );
    };

    return (
        <dialog
            className={`kp-palette ${className}`.trim()}
            style={style}
            data-kp-palette
            data-kp-primary={primary ? '' : undefined}
            ref={dialog}
            aria-label={name}
            // Cleared on close rather than on open: reopening a palette
            // that looks filtered for no visible reason is a small trap,
            // and the two channels have to spring it identically or not
            // at all.
            onClose={() => {
                if (resetOnClose) {
                    setQuery('');
                    setActive(0);
                }
                setOpen(false);
            }}
            {...rest}
        >
            <input
                ref={input}
                className={`kp-palette__input ${classNames.input ?? ''}`.trim()}
                type="text"
                role="combobox"
                autoComplete="off"
                placeholder={text}
                aria-label={name}
                aria-expanded="true"
                aria-controls={listId}
                aria-busy={loading ? 'true' : undefined}
                aria-activedescendant={visible[active] ? `${listId}-option-${active}` : undefined}
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                }}
                onKeyDown={(event) => {
                    const count = visible.length;
                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        setActive((at) => (count === 0 ? 0 : at + 1 >= count ? 0 : at + 1));
                    } else if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        setActive((at) => (count === 0 ? 0 : at - 1 < 0 ? count - 1 : at - 1));
                    } else if (event.key === 'Enter') {
                        const command = visible[active];
                        if (command !== undefined) {
                            event.preventDefault();
                            // A link is clicked, so the browser — or the
                            // router behind linkComponent — follows it, and
                            // the click runs the command on its way.
                            const link =
                                command.href !== undefined && !command.disabled ? document.getElementById(`${listId}-option-${active}`) : null;
                            if (link !== null) link.click();
                            else run(command);
                        }
                    }
                }}
            />
            <ul className={`kp-palette__list ${classNames.list ?? ''}`.trim()} id={listId} role="listbox" aria-label={name}>
                {[...groups.entries()].map(([group, list]) =>
                    group === '' ? (
                        list.map(option)
                    ) : (
                        <li role="presentation" className={`kp-palette__group ${classNames.group ?? ''}`.trim()} data-kp-group key={group}>
                            <span className="kp-palette__group-label" aria-hidden="true">
                                {group}
                            </span>
                            <ul role="group" aria-label={group}>
                                {list.map(option)}
                            </ul>
                        </li>
                    ),
                )}
            </ul>
            {visible.length === 0 && emptyState}
            <p className={`kp-palette__status ${classNames.status ?? ''}`.trim()} role="status" aria-live="polite">
                {loading ? s.busy : visible.length === 0 ? s.noCommands : visible.length === 1 ? s.oneCommand : s.manyCommands(visible.length)}
            </p>
        </dialog>
    );
}
export const CommandPalette = forwardRef(CommandPaletteInner);

/**
 * The palette's trigger, for NavBar's `search` slot [scope-48]: a button
 * that says it opens a dialog and prints the hotkey in the platform's own
 * spelling. It opens the palette whose id it names — either channel's.
 *
 * @typedef {object} PaletteTriggerProps
 * @property {string} palette            The palette's id; empty for the one that answers the key.
 * @property {string | null} [hotkey]    The letter it prints. Default 'k'; null prints none.
 * @property {import('react').ReactNode} [label]  Default: the dictionary's word.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 */

/**
 * @param {PaletteTriggerProps & Omit<import('react').ButtonHTMLAttributes<HTMLButtonElement>, 'children'>} props
 * @param {import('react').ForwardedRef<HTMLButtonElement>} ref
 */
function PaletteTriggerInner({ palette, hotkey = 'k', label, strings, className = '', ...rest }, ref) {
    const s = useStrings(strings);
    // Read after mounting, so a server render and the first client render
    // agree; a Mac changes Ctrl to ⌘ one frame later.
    const [mac, setMac] = useState(false);
    useEffect(() => setMac(isMac()), []);
    return (
        <button
            ref={ref}
            type="button"
            className={`kp-nav__search-trigger ${className}`.trim()}
            data-kp-palette-open={palette}
            aria-haspopup="dialog"
            aria-keyshortcuts={hotkey === null ? undefined : `${mac ? 'Meta' : 'Control'}+${hotkey.toUpperCase()}`}
            {...rest}
        >
            {label ?? s.paletteTrigger}
            {hotkey !== null && (
                <>
                    {' '}
                    <kbd className="kp-palette__keys" data-kp-palette-keys>
                        {s.paletteHotkey(hotkey, mac)}
                    </kbd>
                </>
            )}
        </button>
    );
}
export const PaletteTrigger = forwardRef(PaletteTriggerInner);

/**
 * The shortcut sheet [TH49]. `?` opens it, unless someone is typing one.
 *
 * @typedef {object} ShortcutSheetProps
 * @property {{ keys: string, description: import('react').ReactNode, group?: string }[]} shortcuts
 * @property {boolean} [open]           Controlled.
 * @property {boolean} [defaultOpen]
 * @property {(open: boolean) => void} [onOpenChange]
 * @property {string | null} [hotkey]   Default '?'; null disables it.
 * @property {boolean} [primary]
 * @property {string} [typingSelector]  Where a bare key is typing, not a shortcut. Default: inputs, textareas, selects, textboxes.
 * @property {import('react').ReactNode} [actions]  Replaces the close button.
 * @property {string} [label]
 * @property {1 | 2 | 3 | 4 | 5 | 6} [headingLevel]  Default 2.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * @param {ShortcutSheetProps} props
 * @param {import('react').ForwardedRef<HTMLDialogElement>} ref
 */
function ShortcutSheetInner(
    {
        shortcuts,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        hotkey = '?',
        primary = false,
        typingSelector = 'input, textarea, select, [role="textbox"]',
        actions,
        label,
        headingLevel = 2,
        strings,
        className = '',
        style,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const name = label ?? s.shortcutsLabel;
    const dialog = useRef(/** @type {HTMLDialogElement | null} */ (null));
    useImperativeHandle(ref, () => /** @type {HTMLDialogElement} */ (dialog.current), []);
    const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
    const Heading = /** @type {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} */ (`h${headingLevel}`);

    useEffect(() => {
        const element = dialog.current;
        if (!element) return;
        if (open && !element.open) element.showModal();
        if (!open && element.open) element.close();
    }, [open]);

    // A press outside the sheet closes it, as it does the palette [scope-80].
    useEffect(() => {
        const element = dialog.current;
        return element === null ? undefined : closeOnOutsidePress(element);
    }, []);

    useEffect(() => {
        if (hotkey === null) return;
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            if (event.key !== hotkey || event.ctrlKey || event.metaKey || event.altKey) return;
            const target = event.target;
            // A `?` typed into a field is a question mark, not a command.
            if (target instanceof HTMLElement && (target.isContentEditable || target.matches(typingSelector))) return;
            const element = dialog.current;
            if (element === null) return;
            const nominated = document.querySelector('[data-kp-shortcuts][data-kp-primary]');
            if ((nominated ?? document.querySelector('[data-kp-shortcuts]')) !== element) return;
            event.preventDefault();
            setOpen(!element.open);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hotkey, typingSelector]);

    /** @type {Map<string, typeof shortcuts>} */
    const groups = new Map();
    for (const shortcut of shortcuts) {
        const key = shortcut.group ?? '';
        groups.set(key, [...(groups.get(key) ?? []), shortcut]);
    }
    /** @param {typeof shortcuts} list */
    const rows = (list) => (
        <dl className="kp-shortcuts__list">
            {list.map((shortcut) => (
                <div className="kp-shortcuts__row" key={shortcut.keys}>
                    <dt>
                        <kbd className="kp-palette__keys">{shortcut.keys}</kbd>
                    </dt>
                    <dd>{shortcut.description}</dd>
                </div>
            ))}
        </dl>
    );

    return (
        <dialog
            className={`kp-shortcuts ${className}`.trim()}
            style={style}
            data-kp-shortcuts
            data-kp-primary={primary ? '' : undefined}
            ref={dialog}
            aria-label={name}
            onClose={() => setOpen(false)}
            {...rest}
        >
            {/* The resolved name, not the raw prop: with `label` omitted the
                first version rendered an empty heading. */}
            <Heading className="kp-dialog__title">{name}</Heading>
            {[...groups.entries()].map(([group, list]) =>
                group === '' ? (
                    <div key="ungrouped">{rows(list)}</div>
                ) : (
                    <section className="kp-shortcuts__group" key={group}>
                        <h3 className="kp-shortcuts__group-label">{group}</h3>
                        {rows(list)}
                    </section>
                ),
            )}
            <div className="kp-dialog__actions">
                {actions ?? (
                    <button type="button" className="kp-button" onClick={() => setOpen(false)}>
                        {s.close}
                    </button>
                )}
            </div>
        </dialog>
    );
}
export const ShortcutSheet = forwardRef(ShortcutSheetInner);
