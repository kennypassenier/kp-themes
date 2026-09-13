import { forwardRef, useEffect, useId, useRef } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';
import { attachSelect } from '../js/combobox.js';

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
// and `drawn` lays the package's drawn list over it — the same
// `attachSelect` the framework-free channel uses, because the native
// select stays the control React owns and the drawn list is only a sibling
// it never renders. Without `drawn` the select stays native.

/** @typedef {{ value: string, label: string, disabled?: boolean }} FieldOption */

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
 * @property {boolean} [drawn]   With `options`: lay the drawn list over the select (`data-kp-select`). Default false: the native list [scope-54].
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
        drawn = false,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    /** @type {import('react').MutableRefObject<HTMLSelectElement | null>} */
    const selectRef = useRef(null);
    // The drawn list is attached to the element React rendered and taken
    // away with it; turning `drawn` off detaches it [KT6].
    useEffect(() => {
        const select = selectRef.current;
        if (!drawn || select === null) return undefined;
        return attachSelect(select);
    }, [drawn, options !== undefined]);
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
                <select
                    ref={(element) => {
                        selectRef.current = element;
                        if (typeof ref === 'function') ref(element);
                        else if (ref) ref.current = element;
                    }}
                    {...selectProps}
                    {...control}
                    data-kp-select={drawn ? '' : undefined}
                >
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
