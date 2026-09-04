import { useEffect, useId, useRef, useState } from 'react';
import { subsequence } from '../js/listbox.js';

// Command palette and shortcut sheet, React [TH40, TH49].
//
// Same contract as js/palette.js: a <dialog>, virtual focus, a
// subsequence match, and the command's value handed back rather than run
// here. What a command DOES is the application's business.
//
// The dialog element is used through a ref because `showModal()` is a
// method, not a prop — and it is the method that trapped focus, Escape
// and focus return come from. Rendering `open` as an attribute instead
// gives a non-modal dialog that does none of those three.

/** @typedef {{ value: string, label: string, keys?: string }} Command */

/**
 * @param {{ commands: Command[], onRun?: (value: string) => void, placeholder?: string, label?: string }} props
 */
export function CommandPalette({ commands, onRun, placeholder = 'Typ een opdracht…', label = 'Opdrachten' }) {
    const id = useId();
    const listId = `${id}-list`;
    const dialog = useRef(/** @type {HTMLDialogElement | null} */ (null));
    const input = useRef(/** @type {HTMLInputElement | null} */ (null));
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);

    const visible = commands.filter((command) => subsequence(command.label, query));

    useEffect(() => {
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            // ⌘K on a Mac, Ctrl+K everywhere else — checked rather than
            // assumed, because binding only one of them binds nothing on
            // the other platform.
            if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
            const element = dialog.current;
            if (element === null) return;
            // Only the first palette in the document answers the key. The
            // contract suite put one from each channel on a page and both
            // opened, stacking two modal dialogs.
            if (document.querySelector('[data-kp-palette]') !== element) return;
            event.preventDefault();
            if (element.open) {
                element.close();
            } else {
                element.showModal();
                input.current?.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    /** @param {Command} command */
    const run = (command) => {
        onRun?.(command.value);
        dialog.current?.close();
    };

    return (
        <dialog
            className="kp-palette"
            data-kp-palette
            ref={dialog}
            aria-label={label}
            // Cleared on close rather than on open: the contract suite
            // opened the dialog directly and found this channel keeping
            // the old query, while the framework-free one had already
            // cleared it. Reopening a palette that looks filtered for no
            // visible reason is a small trap, and the two channels have to
            // spring it identically or not at all.
            onClose={() => {
                setQuery('');
                setActive(0);
            }}
        >
            <input
                ref={input}
                className="kp-palette__input"
                type="text"
                role="combobox"
                autoComplete="off"
                placeholder={placeholder}
                aria-label={label}
                aria-expanded="true"
                aria-controls={listId}
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
                            run(command);
                        }
                    }
                }}
            />
            <ul className="kp-palette__list" id={listId} role="listbox" aria-label={label}>
                {visible.map((command, i) => (
                    <li
                        className={`kp-palette__option ${i === active ? 'is-active' : ''}`.trim()}
                        id={`${listId}-option-${i}`}
                        key={command.value}
                        role="option"
                        aria-selected={i === active}
                        data-kp-option
                        data-value={command.value}
                        onMouseOver={() => setActive(i)}
                        onClick={() => run(command)}
                    >
                        <span>{command.label}</span>
                        {command.keys && <kbd className="kp-palette__keys">{command.keys}</kbd>}
                    </li>
                ))}
            </ul>
            <p className="kp-palette__status" role="status" aria-live="polite">
                {visible.length === 0 ? 'Geen opdrachten' : visible.length === 1 ? '1 opdracht' : `${visible.length} opdrachten`}
            </p>
        </dialog>
    );
}

/**
 * The shortcut sheet [TH49]. `?` opens it, unless someone is typing one.
 *
 * @param {{ shortcuts: { keys: string, description: string }[], label?: string }} props
 */
export function ShortcutSheet({ shortcuts, label = 'Sneltoetsen' }) {
    const dialog = useRef(/** @type {HTMLDialogElement | null} */ (null));

    useEffect(() => {
        /** @param {KeyboardEvent} event */
        const onKey = (event) => {
            if (event.key !== '?' || event.ctrlKey || event.metaKey || event.altKey) return;
            const target = event.target;
            // A `?` typed into a field is a question mark, not a command.
            if (
                target instanceof HTMLElement &&
                (target.isContentEditable || ['input', 'textarea', 'select'].includes(target.tagName.toLowerCase()))
            ) {
                return;
            }
            const element = dialog.current;
            if (element === null) return;
            if (document.querySelector('[data-kp-shortcuts]') !== element) return;
            event.preventDefault();
            if (element.open) element.close();
            else element.showModal();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    return (
        <dialog className="kp-shortcuts" data-kp-shortcuts ref={dialog} aria-label={label}>
            <h2 className="kp-dialog__title">{label}</h2>
            <dl className="kp-shortcuts__list">
                {shortcuts.map((shortcut) => (
                    <div className="kp-shortcuts__row" key={shortcut.keys}>
                        <dt>
                            <kbd className="kp-palette__keys">{shortcut.keys}</kbd>
                        </dt>
                        <dd>{shortcut.description}</dd>
                    </div>
                ))}
            </dl>
            <div className="kp-dialog__actions">
                <button type="button" className="kp-button" onClick={() => dialog.current?.close()}>
                    Sluiten
                </button>
            </div>
        </dialog>
    );
}
