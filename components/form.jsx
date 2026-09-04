import { createContext, useContext, useId, useRef, useState } from 'react';

// Form, React [TH38].
//
// Same contract as js/forms.js, and the same three rules: the summary
// takes focus, aria-describedby is appended to rather than replaced, and
// validation reports on blur.
//
// The browser's constraint validation does the checking here too —
// `checkValidity()` on the real elements — rather than a parallel rule
// engine. A component that revalidates in JavaScript ends up disagreeing
// with the browser about what `type="email"` means, and the browser wins
// on the server.
//
// The first version of this component had no per-field state at all: it
// gathered a summary and left the fields unmarked. The contract suite put
// it beside the framework-free half and four assertions failed at once —
// no `aria-invalid`, no blur validation, no busy state. Hence the
// context: the form owns the validation, the fields render what it found.

/** @typedef {{ errors: Record<string, string>, validate: (el: HTMLInputElement) => void }} FormState */

// The default is null and the type has to say so, or createContext infers
// `Context<null>` from the argument and refuses every real value.
const FormContext = createContext(/** @type {FormState | null} */ (null));

/**
 * One field: label, optional help, error, and the wiring between them.
 *
 * @param {{
 *   label: string,
 *   name: string,
 *   help?: string,
 *   error?: string,
 *   required?: boolean,
 *   type?: string,
 *   className?: string,
 * } & Record<string, unknown>} props
 */
export function FormField({ label, name, help, error, required = false, type = 'text', className = '', ...rest }) {
    const id = useId();
    const form = useContext(FormContext);
    const helpId = `${id}-help`;
    const errorId = `${id}-error`;
    // The form's own finding wins over a message passed in, so a
    // consumer-supplied error still works and live validation still shows.
    const message = form?.errors[name] ?? error;
    // Both, in order: the help stays pointed at when an error arrives.
    // Overwriting describedby is how help disappears the first time
    // someone gets something wrong.
    const described = [help && helpId, message && errorId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={`kp-field ${message ? 'kp-field--invalid' : ''} ${className}`.trim()}>
            <label className="kp-field__label" htmlFor={id}>
                {label}
                {/* The word, not only the asterisk: a star is read aloud as
                    "star" and means nothing to anyone who never learned the
                    convention. */}
                {required && <span className="kp-field__required">verplicht</span>}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                required={required}
                className="kp-field__input"
                aria-describedby={described}
                aria-invalid={message ? 'true' : undefined}
                // Only once someone has left the field. Reporting while
                // they type the third character of an email address is
                // technically true and practically hostile.
                onBlur={(event) => form?.validate(event.currentTarget)}
                {...rest}
            />
            {help && (
                <span className="kp-field__help" id={helpId}>
                    {help}
                </span>
            )}
            {message && (
                <span className="kp-field__error" id={errorId} data-kp-field-error>
                    {message}
                </span>
            )}
        </div>
    );
}

/** What the browser's own message becomes when the field says nothing better. */
const FALLBACK = 'Dit veld is niet correct ingevuld.';

/**
 * A form that gathers its errors and takes focus to them.
 *
 * @param {{
 *   children: import('react').ReactNode,
 *   onValid?: (data: FormData) => void,
 *   submitLabel?: string,
 *   busyLabel?: string,
 *   className?: string,
 * }} props
 */
export function Form({ children, onValid, submitLabel = 'Opslaan', busyLabel = 'Bezig…', className = '' }) {
    const [errors, setErrors] = useState(/** @type {Record<string, string>} */ ({}));
    const [summaryList, setSummaryList] = useState(/** @type {{ id: string, name: string }[]} */ ([]));
    const [busy, setBusy] = useState(false);
    const summary = useRef(/** @type {HTMLDivElement | null} */ (null));

    /** @param {HTMLInputElement} field */
    const validate = (field) => {
        setErrors((was) => {
            const next = { ...was };
            if (field.checkValidity()) delete next[field.name];
            else next[field.name] = field.validationMessage || FALLBACK;
            return next;
        });
    };

    /** @param {import('react').FormEvent<HTMLFormElement>} event */
    const onSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const fields = /** @type {HTMLInputElement[]} */ ([...form.elements].filter((el) => el instanceof HTMLInputElement && el.type !== 'submit'));
        const bad = fields.filter((field) => !field.checkValidity());

        /** @type {Record<string, string>} */
        const found = {};
        for (const field of bad) found[field.name] = field.validationMessage || FALLBACK;
        setErrors(found);
        setSummaryList(
            bad.map((field) => ({
                id: field.id,
                name: form.querySelector(`label[for="${CSS.escape(field.id)}"]`)?.textContent?.trim() ?? field.name,
            })),
        );

        if (bad.length > 0) {
            // Focused on the next frame, once the summary exists. Rendered
            // is not enough: a message above the fold is invisible to
            // someone whose focus is at the bottom of a long form, which is
            // exactly where the submit button is.
            requestAnimationFrame(() => summary.current?.focus());
            return;
        }
        // Says it is working without waiting to be told: a slow save that
        // looks like a click that missed gets clicked again.
        setBusy(true);
        onValid?.(new FormData(form));
    };

    return (
        <FormContext.Provider value={{ errors, validate }}>
            <form className={`kp-form ${className}`.trim()} data-kp-form noValidate onSubmit={onSubmit}>
                {summaryList.length > 0 && (
                    <div className="kp-form__summary" data-kp-form-summary tabIndex={-1} ref={summary}>
                        <p className="kp-form__summary-title">
                            {summaryList.length === 1
                                ? 'Er is 1 veld niet correct ingevuld.'
                                : `Er zijn ${summaryList.length} velden niet correct ingevuld.`}
                        </p>
                        <ul>
                            {summaryList.map((error) => (
                                <li key={error.id}>
                                    <a
                                        href={`#${error.id}`}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            document.getElementById(error.id)?.focus();
                                        }}
                                    >
                                        {error.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {children}
                <button type="submit" className="kp-button kp-button--primary" data-kp-submit disabled={busy} aria-busy={busy ? 'true' : undefined}>
                    {busy ? busyLabel : submitLabel}
                </button>
            </form>
        </FormContext.Provider>
    );
}
