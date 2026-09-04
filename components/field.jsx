import { useId } from 'react';

// Form field [TH5, DI4].
//
// The label is always a real <label>, the help and error text are wired
// through aria-describedby, and an invalid field says what is wrong in
// words: a red border alone is colour as the only carrier, and silence to
// a screen reader.

/**
 * @param {{ label: string, help?: string, error?: string, className?: string }} props
 */
export default function Field({ label, help, error, className = '', ...rest }) {
    const id = useId();
    const helpId = `${id}-help`;
    const errorId = `${id}-error`;
    const described = [help && helpId, error && errorId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={`kp-field ${error ? 'kp-field--invalid' : ''} ${className}`.trim()}>
            <label className="kp-field__label" htmlFor={id}>
                {label}
            </label>
            <input id={id} className="kp-field__input" aria-describedby={described} aria-invalid={error ? 'true' : undefined} {...rest} />
            {help && (
                <span className="kp-field__help" id={helpId}>
                    {help}
                </span>
            )}
            {error && (
                <span className="kp-field__error" id={errorId}>
                    {error}
                </span>
            )}
        </div>
    );
}
