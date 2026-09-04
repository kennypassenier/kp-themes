import { createContext, useContext, useId, useRef, useState } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';

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

/** @typedef {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} Control */

/** @typedef {{ errors: Record<string, string>, validate: (el: Control) => void }} FormState */

// The default is null and the type has to say so, or createContext infers
// `Context<null>` from the argument and refuses every real value.
const FormContext = createContext(/** @type {FormState | null} */ (null));

/**
 * One field: label, optional help, error, and the wiring between them.
 *
 * `type` is the control, not only the input type. Anything the browser
 * knows (`text`, `email`, `number`, …) renders an `<input>`; `select`,
 * `textarea`, `checkbox` and `radio` render what they say. Before this
 * the component rendered an `<input>` whatever it was told, so half of
 * every real form had to be written by hand beside it — losing the
 * label, the error and the describedby wiring that are the whole point.
 *
 * @param {{
 *   label: string,
 *   name: string,
 *   help?: string,
 *   error?: string,
 *   required?: boolean,
 *   type?: string,
 *   options?: { value: string, label: string, disabled?: boolean }[],
 *   children?: import('react').ReactNode,
 *   strings?: Partial<import('../js/strings.js').Strings>,
 *   className?: string,
 * } & Record<string, unknown>} props
 */
export function FormField({ label, name, help, error, required = false, type = 'text', options, children, strings, className = '', ...rest }) {
    const s = useStrings(strings);
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
    // Only once someone has left the field. Reporting while they type the
    // third character of an email address is technically true and
    // practically hostile.
    /** @param {import('react').FocusEvent<Control>} event */
    const onBlur = (event) => form?.validate(event.currentTarget);

    /** The word, not only the asterisk: a star is read aloud as "star". */
    const marker = required ? <span className="kp-field__required">{s.formRequired}</span> : null;
    const notes = (
        <>
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
        </>
    );
    const wrapper = `kp-field ${message ? 'kp-field--invalid' : ''} ${className}`.trim();

    // A radio group is a group, so the label is a legend and the state
    // belongs to the group rather than to one of its buttons: aria-invalid
    // on a single radio says the wrong thing about the other three.
    if (type === 'radio') {
        return (
            <fieldset
                className={`${wrapper} kp-fieldset`}
                role="radiogroup"
                aria-describedby={described}
                aria-invalid={message ? 'true' : undefined}
                data-kp-radiogroup={name}
            >
                <legend className="kp-field__label">
                    {label}
                    {marker}
                </legend>
                {(options ?? []).map((option, index) => (
                    <div className="kp-field__option" key={option.value}>
                        <input
                            id={`${id}-${index}`}
                            name={name}
                            type="radio"
                            value={option.value}
                            required={required}
                            disabled={option.disabled}
                            className="kp-field__check"
                            onBlur={onBlur}
                            {...rest}
                        />
                        <label htmlFor={`${id}-${index}`}>{option.label}</label>
                    </div>
                ))}
                {notes}
            </fieldset>
        );
    }

    // The box comes before its label, because that is the order it is
    // read in and the order it is clicked in.
    if (type === 'checkbox') {
        return (
            <div className={`${wrapper} kp-field--check`}>
                <input
                    id={id}
                    name={name}
                    type="checkbox"
                    required={required}
                    className="kp-field__check"
                    aria-describedby={described}
                    aria-invalid={message ? 'true' : undefined}
                    onBlur={onBlur}
                    {...rest}
                />
                <label className="kp-field__label" htmlFor={id}>
                    {label}
                    {marker}
                </label>
                {notes}
            </div>
        );
    }

    const shared = {
        id,
        name,
        required,
        className: 'kp-field__input',
        'aria-describedby': described,
        'aria-invalid': message ? /** @type {const} */ ('true') : undefined,
        onBlur,
    };

    return (
        <div className={wrapper}>
            <label className="kp-field__label" htmlFor={id}>
                {label}
                {marker}
            </label>
            {type === 'select' ? (
                <select {...shared} {...rest}>
                    {/* The options a consumer passes, or whatever they put
                        inside — an optgroup is theirs to write. */}
                    {children ??
                        (options ?? []).map((option) => (
                            <option key={option.value} value={option.value} disabled={option.disabled}>
                                {option.label}
                            </option>
                        ))}
                </select>
            ) : type === 'textarea' ? (
                <textarea {...shared} className="kp-field__input kp-field__input--multiline" {...rest} />
            ) : (
                <input type={type} {...shared} {...rest} />
            )}
            {notes}
        </div>
    );
}

/**
 * A form that gathers its errors and takes focus to them.
 *
 * @param {{
 *   children: import('react').ReactNode,
 *   onValid?: (data: FormData) => void,
 *   submitLabel?: string,
 *   busyLabel?: string,
 *   strings?: Partial<import('../js/strings.js').Strings>,
 *   className?: string,
 * }} props
 */
export function Form({ children, onValid, submitLabel, busyLabel, strings, className = '' }) {
    const s = useStrings(strings);
    const [errors, setErrors] = useState(/** @type {Record<string, string>} */ ({}));
    const [summaryList, setSummaryList] = useState(/** @type {{ id: string, name: string }[]} */ ([]));
    const [busy, setBusy] = useState(false);
    const summary = useRef(/** @type {HTMLDivElement | null} */ (null));

    /** @param {Control} field */
    const validate = (field) => {
        setErrors((was) => {
            const next = { ...was };
            if (field.checkValidity()) delete next[field.name];
            else next[field.name] = field.validationMessage || s.formInvalid;
            return next;
        });
    };

    /** @param {import('react').FormEvent<HTMLFormElement>} event */
    const onSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        // Every control the browser validates, not only the inputs: a
        // required select that nobody chose from is exactly the field a
        // summary has to name, and the first version of this filter threw
        // it away before looking.
        const fields = /** @type {Control[]} */ (
            [...form.elements].filter(
                (el) =>
                    (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) && el.type !== 'submit',
            )
        );
        // One line per group, not per radio button: four radios in one
        // group are one thing somebody forgot to answer.
        /** @type {Set<string>} */
        const groups = new Set();
        const bad = fields.filter((field) => {
            if (field.checkValidity()) return false;
            if (field.type !== 'radio') return true;
            if (groups.has(field.name)) return false;
            groups.add(field.name);
            return true;
        });

        /** @type {Record<string, string>} */
        const found = {};
        for (const field of bad) found[field.name] = field.validationMessage || s.formInvalid;
        setErrors(found);
        setSummaryList(
            bad.map((field) => ({
                id: field.id,
                // A radio's own label is the name of one option; the
                // legend is the name of the question.
                name:
                    (field.type === 'radio' ? field.closest('fieldset')?.querySelector('legend')?.textContent?.trim() : undefined) ??
                    form.querySelector(`label[for="${CSS.escape(field.id)}"]`)?.textContent?.trim() ??
                    field.name,
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
                            {summaryList.length === 1 ? s.formSummaryOne : s.formSummaryMany(summaryList.length)}
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
                    {busy ? (busyLabel ?? s.busy) : (submitLabel ?? s.save)}
                </button>
            </form>
        </FormContext.Provider>
    );
}
