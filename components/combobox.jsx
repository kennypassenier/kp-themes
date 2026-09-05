import { forwardRef, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { subsequence } from '../js/listbox.js';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

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
//
// Since 3.0.0 [KT6]: the query, the chosen values and the open state are
// controllable and re-sync when their props change (they were one-time
// seeds); a disabled option is not selectable (it was, with a cosmetic
// attribute); the matcher, the flags, the cap, a clear button, custom
// values and a `name` for plain forms are props; and a ref reaches the
// input.

/**
 * @typedef {{ value: string, label: string, disabled?: boolean, group?: string }} ComboboxOption
 */
/** @typedef {(label: string, query: string, option: ComboboxOption) => boolean} Matcher */

/** @type {Record<string, Matcher>} */
export const MATCHERS = {
    substring: (label, query) => label.toLowerCase().includes(query.toLowerCase()),
    prefix: (label, query) => label.toLowerCase().startsWith(query.toLowerCase()),
    subsequence: (label, query) => subsequence(label, query),
};

/**
 * @typedef {object} ComboboxProps
 * @property {ComboboxOption[]} options
 * @property {string} label
 * @property {boolean} [tags]
 * @property {string} [value]            Controlled text (combobox) — the query.
 * @property {string} [defaultValue]
 * @property {(query: string) => void} [onQueryChange]
 * @property {string[]} [values]         Controlled chosen values (tags).
 * @property {string[]} [defaultValues]
 * @property {(value: string, values: string[], action: 'add' | 'remove' | 'clear' | 'create') => void} [onChange]
 * @property {boolean} [open]            Controlled.
 * @property {boolean} [defaultOpen]
 * @property {(open: boolean) => void} [onOpenChange]
 * @property {keyof typeof MATCHERS | Matcher} [match]  Default substring.
 * @property {boolean} [openOnFocus]     Default true.
 * @property {boolean} [closeOnBlur]     Default true.
 * @property {boolean} [backspaceRemoves]  Default true.
 * @property {boolean} [stayOpen]        Keep the list open after adding a tag. Default true.
 * @property {number} [maxTags]
 * @property {boolean} [allowDuplicates]
 * @property {boolean} [creatable]       Enter on no match creates the typed value.
 * @property {boolean} [clearable]       A clear button on the combobox.
 * @property {boolean} [loop]            Arrow keys wrap. Default true.
 * @property {boolean} [loading]         Says so in the status line instead of a count.
 * @property {string} [name]             A hidden input carries the value(s) for a plain <form>.
 * @property {string} [placeholder]
 * @property {boolean} [disabled]
 * @property {boolean} [required]
 * @property {(option: ComboboxOption, state: { active: boolean, selected: boolean }) => import('react').ReactNode} [renderOption]
 * @property {(value: string, label: string, remove: () => void) => import('react').ReactNode} [renderTag]
 * @property {import('react').ReactNode} [removeGlyph]
 * @property {import('react').ReactNode} [clearGlyph]
 * @property {Record<string, unknown>} [inputProps]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {{ label?: string, input?: string, list?: string, option?: string, tag?: string, status?: string }} [classNames]
 */

/**
 * @param {ComboboxProps} props
 * @param {import('react').ForwardedRef<HTMLInputElement>} ref
 */
function ComboboxInner(
    {
        options,
        label,
        tags = false,
        value,
        defaultValue = '',
        onQueryChange,
        values,
        defaultValues = [],
        onChange,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        match = 'substring',
        openOnFocus = true,
        closeOnBlur = true,
        backspaceRemoves = true,
        stayOpen = true,
        maxTags = Infinity,
        allowDuplicates = false,
        creatable = false,
        clearable = false,
        loop = true,
        loading = false,
        name,
        placeholder,
        disabled = false,
        required = false,
        renderOption,
        renderTag,
        removeGlyph = '×',
        clearGlyph = '×',
        inputProps,
        strings,
        className = '',
        style,
        classNames = {},
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const id = useId();
    const listId = `${id}-list`;
    const [query, setQuery] = useControllable(value, defaultValue, onQueryChange);
    const [chosen, setChosen] = useControllable(values, defaultValues, undefined);
    const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
    const [active, setActive] = useState(-1);
    const boxRef = useRef(/** @type {HTMLDivElement | null} */ (null));
    const inputRef = useRef(/** @type {HTMLInputElement | null} */ (null));
    useImperativeHandle(ref, () => /** @type {HTMLInputElement} */ (inputRef.current), []);
    const matcher = typeof match === 'function' ? match : (MATCHERS[match] ?? MATCHERS.substring);

    const visible = useMemo(() => {
        const needle = query.trim();
        return options.filter((option) => {
            if (tags && !allowDuplicates && chosen.includes(option.value)) return false;
            return needle === '' || matcher(option.label, needle, option);
        });
    }, [options, query, chosen, tags, allowDuplicates, matcher]);

    // The highlight is reset whenever the list changes, so Enter can never
    // take an option that scrolled out from under it.
    useEffect(() => {
        setActive(-1);
    }, [query, chosen]);

    /** @param {ComboboxOption} option */
    const take = (option) => {
        if (option.disabled) return;
        if (tags) {
            if (chosen.length >= maxTags) return;
            const next = !allowDuplicates && chosen.includes(option.value) ? chosen : [...chosen, option.value];
            setChosen(next);
            setQuery('');
            if (!stayOpen) setOpen(false);
            onChange?.(option.value, next, 'add');
        } else {
            setQuery(option.label);
            setOpen(false);
            onChange?.(option.value, [option.value], 'add');
        }
    };
    /** @param {string} typed */
    const create = (typed) => {
        const trimmed = typed.trim();
        if (trimmed === '') return;
        if (tags) {
            if (chosen.length >= maxTags || (!allowDuplicates && chosen.includes(trimmed))) return;
            const next = [...chosen, trimmed];
            setChosen(next);
            setQuery('');
            onChange?.(trimmed, next, 'create');
        } else {
            setOpen(false);
            onChange?.(trimmed, [trimmed], 'create');
        }
    };

    /** @param {string} removed */
    const drop = (removed) => {
        const next = chosen.filter((v) => v !== removed);
        setChosen(next);
        onChange?.(removed, next, 'remove');
        inputRef.current?.focus();
    };
    const clear = () => {
        setQuery('');
        setChosen([]);
        onChange?.('', [], 'clear');
        inputRef.current?.focus();
    };

    /** @param {number} from @param {1 | -1} direction */
    const step = (from, direction) => {
        const count = visible.length;
        if (count === 0) return -1;
        let next = from + direction;
        // Skip what cannot be chosen.
        for (let i = 0; i < count; i++) {
            if (next >= count) next = loop ? 0 : count - 1;
            if (next < 0) next = loop ? count - 1 : 0;
            if (!visible[next]?.disabled) return next;
            next += direction;
        }
        return from;
    };

    /** @param {import('react').KeyboardEvent<HTMLInputElement>} event */
    const onKeyDown = (event) => {
        const count = visible.length;
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setOpen(true);
                setActive((at) => step(at, 1));
                break;
            case 'ArrowUp':
                event.preventDefault();
                setOpen(true);
                setActive((at) => step(at, -1));
                break;
            case 'Home':
                if (count > 0) {
                    event.preventDefault();
                    setActive(step(-1, 1));
                }
                break;
            case 'End':
                if (count > 0) {
                    event.preventDefault();
                    setActive(step(count, -1));
                }
                break;
            case 'Enter': {
                const option = visible[active];
                // Only swallow Enter when it chose something, so a
                // combobox inside a form does not block submitting.
                if (option !== undefined) {
                    event.preventDefault();
                    take(option);
                } else if (creatable && query.trim() !== '') {
                    event.preventDefault();
                    create(query);
                }
                break;
            }
            case 'Escape':
                setOpen(false);
                break;
            case 'Backspace':
                if (tags && backspaceRemoves && query === '' && chosen.length > 0) drop(chosen[chosen.length - 1] ?? '');
                break;
            default:
                break;
        }
    };

    const results = loading ? s.busy : visible.length === 0 ? s.noResults : visible.length === 1 ? s.oneResult : s.manyResults(visible.length);
    /** @param {string} v */
    const labelOf = (v) => options.find((o) => o.value === v)?.label ?? v;

    return (
        <div
            className={`kp-combobox ${className}`.trim()}
            style={style}
            ref={boxRef}
            data-kp-combobox
            data-kp-tags={tags ? '' : undefined}
            onBlur={(event) => {
                if (closeOnBlur && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
            }}
            {...rest}
        >
            <label className={`kp-field__label ${classNames.label ?? ''}`.trim()} htmlFor={id}>
                {label}
            </label>

            {tags && (
                <ul className="kp-tag-list" data-kp-tag-list>
                    {chosen.map((v, i) => (
                        <li className={`kp-tag ${classNames.tag ?? ''}`.trim()} data-value={v} key={`${v}-${i}`}>
                            {renderTag ? (
                                renderTag(v, labelOf(v), () => drop(v))
                            ) : (
                                <>
                                    <span>{labelOf(v)}</span>
                                    {/* The LABEL, not the value: the button says what a
                                        person reads on the tag. */}
                                    <button type="button" className="kp-tag__remove" aria-label={s.removeNamed(labelOf(v))} onClick={() => drop(v)}>
                                        {removeGlyph}
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <input
                id={id}
                ref={inputRef}
                className={`kp-combobox__input ${classNames.input ?? ''}`.trim()}
                type="text"
                role="combobox"
                autoComplete="off"
                placeholder={placeholder}
                disabled={disabled}
                required={required && (tags ? chosen.length === 0 : true)}
                aria-expanded={open}
                aria-controls={listId}
                aria-activedescendant={active >= 0 && visible[active] ? `${listId}-option-${active}` : undefined}
                aria-busy={loading ? 'true' : undefined}
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                }}
                onFocus={() => {
                    if (openOnFocus) setOpen(true);
                }}
                onKeyDown={onKeyDown}
                {...inputProps}
            />
            {clearable && (query !== '' || chosen.length > 0) && (
                <button type="button" className="kp-combobox__clear" aria-label={s.close} onClick={clear}>
                    {clearGlyph}
                </button>
            )}
            {/* For a plain <form>: the chosen value(s), as the framework-free
                channel's server would receive them. */}
            {name &&
                (tags ? (
                    chosen.map((v) => <input type="hidden" name={name} value={v} key={v} />)
                ) : (
                    <input type="hidden" name={name} value={options.find((o) => o.label === query)?.value ?? query} />
                ))}

            <ul className={`kp-combobox__list ${classNames.list ?? ''}`.trim()} id={listId} role="listbox" hidden={!open || visible.length === 0}>
                {visible.map((option, i) => (
                    <li
                        className={`kp-combobox__option ${i === active ? 'is-active' : ''} ${classNames.option ?? ''}`.trim()}
                        id={`${listId}-option-${i}`}
                        key={option.value}
                        role="option"
                        aria-selected={i === active}
                        aria-disabled={option.disabled ? 'true' : undefined}
                        data-kp-option
                        data-value={option.value}
                        data-kp-disabled={option.disabled ? '' : undefined}
                        onMouseOver={() => {
                            if (!option.disabled) setActive(i);
                        }}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => take(option)}
                    >
                        {renderOption ? renderOption(option, { active: i === active, selected: chosen.includes(option.value) }) : option.label}
                    </li>
                ))}
            </ul>

            {/* A sighted user watches the list shrink; without this nobody
                else knows anything happened. */}
            <p className={`kp-combobox__status ${classNames.status ?? ''}`.trim()} data-kp-combobox-status role="status" aria-live="polite">
                {open ? results : ''}
            </p>
        </div>
    );
}

const Combobox = forwardRef(ComboboxInner);
export default Combobox;
