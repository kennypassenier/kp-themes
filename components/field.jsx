import { forwardRef, useId } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';

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
 */

/**
 * @param {FieldProps & Omit<import('react').InputHTMLAttributes<HTMLInputElement>, 'id' | 'required'>} props
 * @param {import('react').ForwardedRef<HTMLInputElement>} ref
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
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const generated = useId();
    const id = idProp ?? generated;
    const helpId = `${id}-help`;
    const errorId = `${id}-error`;
    const described = [rest['aria-describedby'], help && helpId, error && errorId].filter(Boolean).join(' ') || undefined;
    const { 'aria-describedby': _ignored, ...inputRest } = rest;

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
            {renderControl ? renderControl(control) : <input ref={ref} {...inputRest} {...control} />}
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
