import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';

// Combobox and tag input, React [TH39, TH41].
//
// The same class names and the same ARIA as the framework-free channel in
// js/combobox.js, and the same rule: virtual focus. DOM focus stays in the
// input, `aria-activedescendant` says which option is current. Moving real
// focus into the list is the bug this pattern exists to avoid — it takes
// focus out of the input and typing stops working.
//
// The behaviour is written twice on purpose (AR7): a shared core would
// have to own the DOM, and this channel's whole point is that React owns
// it. What is NOT written twice is the contract — class names, attributes
// and the event — and the browser suite drives both to prove it.

/**
 * @typedef {{ value: string, label: string, disabled?: boolean }} ComboboxOption
 */

/**
 * @param {{
 *   options: ComboboxOption[],
 *   label: string,
 *   tags?: boolean,
 *   value?: string,
 *   values?: string[],
 *   placeholder?: string,
 *   onChange?: (value: string, values: string[]) => void,
 *   strings?: Partial<import('../js/strings.js').Strings>,
 *   className?: string,
 * }} props
 */
export default function Combobox({ options, label, tags = false, value, values, placeholder, onChange, strings, className = '' }) {
    const s = useStrings(strings);
    const id = useId();
    const listId = `${id}-list`;
    const [query, setQuery] = useState(value ?? '');
    const [chosen, setChosen] = useState(values ?? []);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const boxRef = useRef(/** @type {HTMLDivElement | null} */ (null));
    const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));

    const visible = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return options.filter((option) => {
            if (tags && chosen.includes(option.value)) return false;
            return needle === '' || option.label.toLowerCase().includes(needle);
        });
    }, [options, query, chosen, tags]);

    // The highlight is reset whenever the list changes, so Enter can never
    // take an option that scrolled out from under it.
    useEffect(() => {
        setActive(-1);
    }, [query, chosen]);

    /** @param {ComboboxOption} option */
    const take = (option) => {
        if (tags) {
            const next = chosen.includes(option.value) ? chosen : [...chosen, option.value];
            setChosen(next);
            setQuery('');
            onChange?.(option.value, next);
        } else {
            setQuery(option.label);
            setOpen(false);
            onChange?.(option.value, [option.value]);
        }
    };

    /** @param {string} removed */
    const drop = (removed) => {
        const next = chosen.filter((v) => v !== removed);
        setChosen(next);
        onChange?.(removed, next);
        inputRef.current?.focus();
    };

    /** @param {import('react').KeyboardEvent<HTMLInputElement>} event */
    const onKeyDown = (event) => {
        const count = visible.length;
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setOpen(true);
                setActive((at) => (count === 0 ? -1 : at + 1 >= count ? 0 : at + 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                setOpen(true);
                setActive((at) => (count === 0 ? -1 : at - 1 < 0 ? count - 1 : at - 1));
                break;
            case 'Home':
                if (count > 0) {
                    event.preventDefault();
                    setActive(0);
                }
                break;
            case 'End':
                if (count > 0) {
                    event.preventDefault();
                    setActive(count - 1);
                }
                break;
            case 'Enter': {
                const option = visible[active];
                // Only swallow Enter when it chose something, so a
                // combobox inside a form does not block submitting.
                if (option !== undefined) {
                    event.preventDefault();
                    take(option);
                }
                break;
            }
            case 'Escape':
                setOpen(false);
                break;
            case 'Backspace':
                if (tags && query === '' && chosen.length > 0) drop(chosen[chosen.length - 1] ?? '');
                break;
            default:
                break;
        }
    };

    const results = visible.length === 0 ? s.noResults : visible.length === 1 ? s.oneResult : s.manyResults(visible.length);

    return (
        <div
            className={`kp-combobox ${className}`.trim()}
            ref={boxRef}
            data-kp-combobox
            data-kp-tags={tags ? '' : undefined}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
            }}
        >
            <label className="kp-field__label" htmlFor={id}>
                {label}
            </label>

            {tags && (
                <ul className="kp-tag-list" data-kp-tag-list>
                    {chosen.map((v) => (
                        <li className="kp-tag" data-value={v} key={v}>
                            <span>{options.find((o) => o.value === v)?.label ?? v}</span>
                            {/* The LABEL, not the value: the button says what a
                                person reads on the tag. The contract suite caught
                                this channel naming the value while the other named
                                the label — the same label/value confusion that bit
                                the two channels when this component was written. */}
                            <button
                                type="button"
                                className="kp-tag__remove"
                                aria-label={s.removeNamed(options.find((o) => o.value === v)?.label ?? v)}
                                onClick={() => drop(v)}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <input
                id={id}
                ref={inputRef}
                className="kp-combobox__input"
                type="text"
                role="combobox"
                autoComplete="off"
                placeholder={placeholder}
                aria-expanded={open}
                aria-controls={listId}
                aria-activedescendant={active >= 0 && visible[active] ? `${listId}-option-${active}` : undefined}
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
            />

            <ul className="kp-combobox__list" id={listId} role="listbox" hidden={!open || visible.length === 0}>
                {visible.map((option, i) => (
                    <li
                        className={`kp-combobox__option ${i === active ? 'is-active' : ''}`.trim()}
                        id={`${listId}-option-${i}`}
                        key={option.value}
                        role="option"
                        aria-selected={i === active}
                        data-kp-option
                        data-value={option.value}
                        data-kp-disabled={option.disabled ? '' : undefined}
                        onMouseOver={() => setActive(i)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => take(option)}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>

            {/* A sighted user watches the list shrink; without this nobody
                else knows anything happened. */}
            <p className="kp-combobox__status" data-kp-combobox-status role="status" aria-live="polite">
                {open ? results : ''}
            </p>
        </div>
    );
}
