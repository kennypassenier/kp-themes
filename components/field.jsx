import { forwardRef, useCallback, useId, useRef } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';
import { attachSelect, drawsSelect } from '../js/combobox.js';

// Form field [TH5, DI4].
//
// The label is always a real <label>, the help and error text are wired
// through aria-describedby, and an invalid field says what is wrong in
// words: a red border alone is colour as the only carrier, and silence to
// a screen reader.
//
// Since 3.0.0 [KT6]: a consumer's `id` keeps the label wired (it used to
// break the association silently), the wrapper has its own props, the
// label can be visually hidden, `required` shows the word, a consumer's
// `aria-describedby` is appended to rather than overwritten, the control
// can be rendered by the consumer, and the ref reaches the input.
//
// Since 6.1 [scope-54]: `options` renders a <select> instead of an input,
// and the package's drawn list is laid over it — the same `attachSelect`
// the framework-free channel uses, because the native select stays the
// control React owns and the drawn list is only a sibling it never renders.
// Drawn by default since Kenny's form of 2026-09-13; `drawn={false}` keeps
// the browser's list and writes `data-kp-select="native"`, as the
// framework-free opt-out reads. A multiple select is always the browser's.

/** @typedef {{ value: string, label: string, disabled?: boolean }} FieldOption */

/**
 * A callback ref that lays the drawn list over the select it is given and
 * takes it away again when the select goes or `enabled` turns false [KT6].
 * Every React select of the package's uses it, so the default reaches the
 * data table's and the form's selects as well as Field's.
 *
 * @param {boolean} [enabled] Default true.
 * @returns {(element: HTMLSelectElement | null) => void}
 */
export function useDrawnSelect(enabled = true) {
    /** @type {import('react').MutableRefObject<(() => void) | null>} */
    const detach = useRef(null);
    return useCallback(
        (element) => {
            detach.current?.();
            detach.current = null;
            if (enabled && element !== null && drawsSelect(element) && element.dataset.kpSelectAttached === undefined)
                detach.current = attachSelect(element);
        },
        [enabled],
    );
}

/**
 * @typedef {object} FieldProps
 * @property {import('react').ReactNode} label
 * @property {import('react').ReactNode} [help]
 * @property {import('react').ReactNode} [error]
 * @property {string} [id]
 * @property {boolean} [labelHidden]   Visually hidden, still read.
 * @property {boolean} [required]
 * @property {import('react').HTMLAttributes<HTMLDivElement>} [wrapperProps]
 * @property {(props: { id: string, className: string, 'aria-describedby': string | undefined, 'aria-invalid': 'true' | undefined, required: boolean }) => import('react').ReactNode} [renderControl]
 * @property {{ label?: string, input?: string, help?: string, error?: string }} [classNames]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]   On the wrapper, as in 1.x.
 * @property {FieldOption[]} [options]   Render a <select> with these options instead of an input [scope-54].
 * @property {boolean} [drawn]   With `options`: lay the package's drawn list over the select. Default true since 2026-09-13; false keeps the browser's list (`data-kp-select="native"`). A `multiple` select is always the browser's.
 */

/**
 * @param {FieldProps & Omit<import('react').InputHTMLAttributes<HTMLInputElement> & import('react').SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'required'>} props
 * @param {import('react').ForwardedRef<HTMLInputElement | HTMLSelectElement>} ref
 */
function FieldInner(
    {
        label,
        help,
        error,
        id: idProp,
        labelHidden = false,
        required = false,
        wrapperProps,
        renderControl,
        classNames = {},
        strings,
        className = '',
        options,
        drawn = true,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    // The drawn list is attached to the element React rendered and taken
    // away with it; turning `drawn` off detaches it [KT6].
    const drawnRef = useDrawnSelect(drawn);
    // One stable ref for the select: an inline callback would be a new
    // function each render, and React would detach and redraw the list every time.
    const selectRef = useCallback(
        (/** @type {HTMLSelectElement | null} */ element) => {
            if (typeof ref === 'function') ref(element);
            else if (ref) /** @type {import('react').MutableRefObject<HTMLSelectElement | null>} */ (ref).current = element;
            drawnRef(element);
        },
        [ref, drawnRef],
    );
    const generated = useId();
    const id = idProp ?? generated;
    const helpId = `${id}-help`;
    const errorId = `${id}-error`;
    const described = [rest['aria-describedby'], help && helpId, error && errorId].filter(Boolean).join(' ') || undefined;
    const { 'aria-describedby': _ignored, ...inputRest } = rest;
    // One set of props and one ref, handed to whichever control renders.
    const selectProps = /** @type {import('react').SelectHTMLAttributes<HTMLSelectElement>} */ (inputRest);
    const inputProps = /** @type {import('react').InputHTMLAttributes<HTMLInputElement>} */ (inputRest);
    const inputRef = /** @type {import('react').ForwardedRef<HTMLInputElement>} */ (ref);

    const control = {
        id,
        className: `kp-field__input ${classNames.input ?? ''}`.trim(),
        'aria-describedby': described,
        'aria-invalid': error ? /** @type {const} */ ('true') : undefined,
        required,
    };

    return (
        <div {...wrapperProps} className={`kp-field ${error ? 'kp-field--invalid' : ''} ${className} ${wrapperProps?.className ?? ''}`.trim()}>
            <label className={`kp-field__label ${labelHidden ? 'kp-sr-only' : ''} ${classNames.label ?? ''}`.trim()} htmlFor={id}>
                {label}
                {required && <span className="kp-field__required">{s.formRequired}</span>}
            </label>
            {renderControl ? (
                renderControl(control)
            ) : options ? (
                <select ref={selectRef} {...selectProps} {...control} data-kp-select={drawn ? undefined : 'native'}>
                    {options.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input ref={inputRef} {...inputProps} {...control} />
            )}
            {help && (
                <span className={`kp-field__help ${classNames.help ?? ''}`.trim()} id={helpId}>
                    {help}
                </span>
            )}
            {error && (
                <span className={`kp-field__error ${classNames.error ?? ''}`.trim()} id={errorId}>
                    {error}
                </span>
            )}
        </div>
    );
}

const Field = forwardRef(FieldInner);
export default Field;
