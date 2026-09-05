import { createContext, forwardRef, useContext, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

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
// Since 3.0.0 [KT6]: the errors a server finds can be handed in
// (`errors`), the three rules are defaults rather than laws
// (`validateOn`, `revalidateOn`, `focusOnError`), the submit button and
// the summary can be the consumer's, the <form> takes its own attributes
// (action, method, id), FormField composes a consumer's onBlur and
// aria-describedby instead of dropping them, and both forward a ref.

/** @typedef {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement} Control */

/** @typedef {{ errors: Record<string, string>, validate: (el: Control) => void, revalidate: (el: Control) => void, validateOn: 'blur' | 'change' | 'submit' }} FormState */

// The default is null and the type has to say so, or createContext infers
// `Context<null>` from the argument and refuses every real value.
const FormContext = createContext(/** @type {FormState | null} */ (null));

/**
 * @typedef {object} FormFieldProps
 * @property {import('react').ReactNode} label
 * @property {string} name
 * @property {import('react').ReactNode} [help]
 * @property {import('react').ReactNode} [error]
 * @property {boolean} [required]
 * @property {boolean} [requiredIndicator]  Show the word beside the label. Default true.
 * @property {boolean} [labelHidden]
 * @property {string} [type]            The control: an input type, or select, textarea, checkbox, radio.
 * @property {{ value: string, label: import('react').ReactNode, disabled?: boolean, help?: import('react').ReactNode }[]} [options]
 * @property {'stacked' | 'inline'} [layout]  For a radio group. Default stacked.
 * @property {import('react').HTMLAttributes<HTMLElement>} [wrapperProps]
 * @property {{ label?: string, control?: string, help?: string, error?: string, option?: string }} [classNames]
 * @property {import('react').ReactNode} [children]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 */

/**
 * One field: label, optional help, error, and the wiring between them.
 *
 * `type` is the control, not only the input type. Anything the browser
 * knows (`text`, `email`, `number`, …) renders an `<input>`; `select`,
 * `textarea`, `checkbox` and `radio` render what they say. Everything
 * else in the props goes to the control; `wrapperProps` reach the
 * wrapper.
 *
 * @param {FormFieldProps & Omit<import('react').AllHTMLAttributes<HTMLElement>, 'type' | 'name' | 'required' | 'className' | 'children' | 'label' | 'wrap'>} props
 * @param {import('react').ForwardedRef<Control>} ref
 */
function FormFieldInner(
    {
        label,
        name,
        help,
        error,
        required = false,
        requiredIndicator = true,
        labelHidden = false,
        type = 'text',
        options,
        layout = 'stacked',
        wrapperProps,
        classNames = {},
        children,
        strings,
        className = '',
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const id = useId();
    const form = useContext(FormContext);
    const helpId = `${id}-help`;
    const errorId = `${id}-error`;
    // The form's own finding wins over a message passed in, so a
    // consumer-supplied error still works and live validation still shows.
    const message = form?.errors[name] ?? error;
    // Both, in order, after whatever the consumer already pointed at: the
    // help stays pointed at when an error arrives. Overwriting describedby
    // is how help disappears the first time someone gets something wrong.
    const consumerDescribed = /** @type {string | undefined} */ (rest['aria-describedby']);
    const described = [consumerDescribed, help && helpId, message && errorId].filter(Boolean).join(' ') || undefined;
    const consumerBlur = /** @type {((event: import('react').FocusEvent<Control>) => void) | undefined} */ (rest.onBlur);
    const consumerChange = /** @type {((event: import('react').ChangeEvent<Control>) => void) | undefined} */ (rest.onChange);
    const { 'aria-describedby': _d, onBlur: _b, onChange: _c, ...control } = rest;

    // Only once someone has left the field, by default. Reporting while
    // they type the third character of an email address is technically
    // true and practically hostile — but a field already marked invalid
    // clears as they fix it.
    /** @param {import('react').FocusEvent<Control>} event */
    const onBlur = (event) => {
        if (form?.validateOn === 'blur') form.validate(event.currentTarget);
        else form?.revalidate(event.currentTarget);
        consumerBlur?.(event);
    };
    /** @param {import('react').ChangeEvent<Control>} event */
    const onChange = (event) => {
        if (form?.validateOn === 'change') form.validate(event.currentTarget);
        else form?.revalidate(event.currentTarget);
        consumerChange?.(event);
    };

    /** The word, not only the asterisk: a star is read aloud as "star". */
    const marker = required && requiredIndicator ? <span className="kp-field__required">{s.formRequired}</span> : null;
    const labelClass = `kp-field__label ${labelHidden ? 'kp-sr-only' : ''} ${classNames.label ?? ''}`.trim();
    const notes = (
        <>
            {help && (
                <span className={`kp-field__help ${classNames.help ?? ''}`.trim()} id={helpId}>
                    {help}
                </span>
            )}
            {message && (
                <span className={`kp-field__error ${classNames.error ?? ''}`.trim()} id={errorId} data-kp-field-error>
                    {message}
                </span>
            )}
        </>
    );
    const wrapper = `kp-field ${message ? 'kp-field--invalid' : ''} ${className} ${wrapperProps?.className ?? ''}`.trim();

    // A radio group is a group, so the label is a legend and the state
    // belongs to the group rather than to one of its buttons: aria-invalid
    // on a single radio says the wrong thing about the other three.
    if (type === 'radio') {
        return (
            <fieldset
                {...wrapperProps}
                className={`${wrapper} kp-fieldset`}
                role="radiogroup"
                aria-describedby={described}
                aria-invalid={message ? 'true' : undefined}
                data-kp-radiogroup={name}
                data-kp-layout={layout}
            >
                <legend className={labelClass}>
                    {label}
                    {marker}
                </legend>
                {children ??
                    (options ?? []).map((option, index) => (
                        <div className={`kp-field__option ${classNames.option ?? ''}`.trim()} key={option.value}>
                            <input
                                ref={index === 0 ? /** @type {import('react').Ref<HTMLInputElement>} */ (ref) : undefined}
                                id={`${id}-${index}`}
                                name={name}
                                type="radio"
                                value={option.value}
                                required={required}
                                disabled={option.disabled}
                                className={`kp-field__check ${classNames.control ?? ''}`.trim()}
                                onBlur={onBlur}
                                onChange={onChange}
                                {...control}
                            />
                            <label htmlFor={`${id}-${index}`}>{option.label}</label>
                            {option.help && <span className="kp-field__help">{option.help}</span>}
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
            <div {...wrapperProps} className={`${wrapper} kp-field--check`}>
                <input
                    ref={/** @type {import('react').Ref<HTMLInputElement>} */ (ref)}
                    id={id}
                    name={name}
                    type="checkbox"
                    required={required}
                    className={`kp-field__check ${classNames.control ?? ''}`.trim()}
                    aria-describedby={described}
                    aria-invalid={message ? 'true' : undefined}
                    onBlur={onBlur}
                    onChange={onChange}
                    {...control}
                />
                <label className={labelClass} htmlFor={id}>
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
        className: `kp-field__input ${classNames.control ?? ''}`.trim(),
        'aria-describedby': described,
        'aria-invalid': message ? /** @type {const} */ ('true') : undefined,
        onBlur,
        onChange,
    };

    return (
        <div {...wrapperProps} className={wrapper}>
            <label className={labelClass} htmlFor={id}>
                {label}
                {marker}
            </label>
            {type === 'select' ? (
                <select ref={/** @type {import('react').Ref<HTMLSelectElement>} */ (ref)} {...control} {...shared}>
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
                <textarea
                    ref={/** @type {import('react').Ref<HTMLTextAreaElement>} */ (ref)}
                    {...control}
                    {...shared}
                    className={`${shared.className} kp-field__input--multiline`}
                />
            ) : (
                <input ref={/** @type {import('react').Ref<HTMLInputElement>} */ (ref)} type={type} {...control} {...shared} />
            )}
            {notes}
        </div>
    );
}
export const FormField = forwardRef(FormFieldInner);

/**
 * @typedef {object} FormProps
 * @property {import('react').ReactNode} children
 * @property {(data: FormData, done: () => void, event: import('react').FormEvent<HTMLFormElement>) => void | Promise<unknown>} [onValid]
 * @property {(errors: Record<string, string>, fields: Control[]) => void} [onInvalid]
 * @property {boolean} [busy]          Controlled.
 * @property {Record<string, string>} [errors]  Errors from outside — a server's — by field name. Merged with what the browser finds.
 * @property {'blur' | 'change' | 'submit'} [validateOn]  Default blur.
 * @property {'change' | 'blur' | 'none'} [revalidateOn]  Once a field is marked. Default change.
 * @property {boolean} [focusOnError]  Move focus to the summary. Default true.
 * @property {boolean} [summary]       Render the error summary. Default true.
 * @property {1 | 2 | 3 | 4 | 5 | 6} [summaryHeadingLevel]  Default: a paragraph.
 * @property {(state: { count: number, items: { id: string, name: string }[], focus: (id: string) => void }) => import('react').ReactNode} [renderSummary]
 * @property {boolean} [submitButton]  Default true.
 * @property {import('react').ReactNode} [actions]  Replaces the submit button; the consumer renders its own controls.
 * @property {import('react').ReactNode} [submitLabel]
 * @property {import('react').ReactNode} [busyLabel]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {{ summary?: string, submit?: string }} [classNames]
 */

/**
 * A form that gathers its errors and takes focus to them.
 *
 * The busy state is the consumer's to end [KT6]. Three ways, nearest
 * wins: a controlled `busy` prop; a promise returned from `onValid`,
 * awaited and cleared when it settles — fulfilled OR rejected, because a
 * login that renders "wrong password" resolves rather than throws; or the
 * `done()` handed to `onValid` as its second argument. Nothing returned
 * and nothing called keeps the button busy, on purpose: a consumer who
 * navigates away on submit must not get back a button that double-sends.
 *
 * @param {FormProps & Omit<import('react').FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onInvalid'>} props
 * @param {import('react').ForwardedRef<HTMLFormElement>} ref
 */
function FormInner(
    {
        children,
        onValid,
        onInvalid,
        busy: busyProp,
        errors: externalErrors,
        validateOn = 'blur',
        revalidateOn = 'change',
        focusOnError = true,
        summary: showSummary = true,
        summaryHeadingLevel,
        renderSummary,
        submitButton = true,
        actions,
        submitLabel,
        busyLabel,
        strings,
        className = '',
        classNames = {},
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const [errors, setErrors] = useState(/** @type {Record<string, string>} */ ({}));
    const [summaryList, setSummaryList] = useState(/** @type {{ id: string, name: string }[]} */ ([]));
    const [busy, setBusy] = useControllable(busyProp, false, undefined);
    const form = useRef(/** @type {HTMLFormElement | null} */ (null));
    useImperativeHandle(ref, () => /** @type {HTMLFormElement} */ (form.current), []);
    const summary = useRef(/** @type {HTMLDivElement | null} */ (null));
    // A promise that settles after the form is gone must not set state
    // on a component that no longer exists.
    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);
    const merged = { ...errors, ...externalErrors };
    const SummaryTitle = summaryHeadingLevel ? /** @type {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} */ (`h${summaryHeadingLevel}`) : 'p';

    /** @param {Control} field */
    const validate = (field) => {
        setErrors((was) => {
            const next = { ...was };
            if (field.checkValidity()) delete next[field.name];
            else next[field.name] = field.validationMessage || s.formInvalid;
            return next;
        });
    };
    /** @param {Control} field */
    const revalidate = (field) => {
        const marked =
            field.type === 'radio'
                ? field.closest('[role="radiogroup"]')?.getAttribute('aria-invalid') === 'true'
                : field.getAttribute('aria-invalid') === 'true';
        if (marked && revalidateOn !== 'none') validate(field);
    };

    /** @param {HTMLFormElement} element */
    const controlsOf = (element) =>
        /** @type {Control[]} */ (
            [...element.elements].filter(
                (el) =>
                    (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) && el.type !== 'submit',
            )
        );

    /** @param {import('react').FormEvent<HTMLFormElement>} event */
    const onSubmit = (event) => {
        event.preventDefault();
        const element = event.currentTarget;
        // Every control the browser validates, not only the inputs: a
        // required select that nobody chose from is exactly the field a
        // summary has to name.
        const fields = controlsOf(element);
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
                    element.querySelector(`label[for="${CSS.escape(field.id)}"]`)?.textContent?.trim() ??
                    field.name,
            })),
        );

        if (bad.length > 0) {
            onInvalid?.(found, bad);
            // Focused on the next frame, once the summary exists. Rendered
            // is not enough: a message above the fold is invisible to
            // someone whose focus is at the bottom of a long form, which is
            // exactly where the submit button is.
            if (focusOnError) requestAnimationFrame(() => summary.current?.focus());
            return;
        }
        // Says it is working without waiting to be told: a slow save that
        // looks like a click that missed gets clicked again.
        setBusy(true);
        const done = () => {
            if (mounted.current) setBusy(false);
        };
        const result = onValid?.(new FormData(element), done, event);
        // Settled either way. A submit whose failure is an outcome the
        // screen renders resolves normally, and that is the common shape,
        // not the exception.
        if (result !== undefined && result !== null && typeof (/** @type {{ then?: unknown }} */ (result).then) === 'function') {
            Promise.resolve(result).then(done, done);
        }
    };
    /** @param {string} id */
    const focusField = (id) => /** @type {HTMLElement | null} */ (form.current?.querySelector(`#${CSS.escape(id)}`))?.focus();

    // The summary lists the browser's findings and, when the consumer
    // handed errors in, those too — by name, so a server's "email taken"
    // gets a line and a link like everything else.
    const items = [
        ...summaryList,
        ...Object.keys(externalErrors ?? {})
            .filter((name) => !summaryList.some((i) => form.current?.querySelector(`[name="${CSS.escape(name)}"]`)?.id === i.id))
            .map((name) => {
                const field = /** @type {HTMLElement | null} */ (form.current?.querySelector(`[name="${CSS.escape(name)}"]`) ?? null);
                return {
                    id: field?.id ?? name,
                    name: form.current?.querySelector(`label[for="${CSS.escape(field?.id ?? '')}"]`)?.textContent?.trim() ?? name,
                };
            }),
    ];

    return (
        <FormContext.Provider value={{ errors: merged, validate, revalidate, validateOn }}>
            <form ref={form} className={`kp-form ${className}`.trim()} data-kp-form noValidate onSubmit={onSubmit} {...rest}>
                {showSummary && items.length > 0 && (
                    <div className={`kp-form__summary ${classNames.summary ?? ''}`.trim()} data-kp-form-summary tabIndex={-1} ref={summary}>
                        {renderSummary ? (
                            renderSummary({ count: items.length, items, focus: focusField })
                        ) : (
                            <>
                                <SummaryTitle className="kp-form__summary-title">
                                    {items.length === 1 ? s.formSummaryOne : s.formSummaryMany(items.length)}
                                </SummaryTitle>
                                <ul>
                                    {items.map((error) => (
                                        <li key={error.id}>
                                            <a
                                                href={`#${error.id}`}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    /** @type {HTMLElement | null} */ (
                                                        form.current?.querySelector(`#${CSS.escape(error.id)}`)
                                                    )?.focus();
                                                }}
                                            >
                                                {error.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
                {children}
                {actions ??
                    (submitButton && (
                        <button
                            type="submit"
                            className={`kp-button kp-button--primary ${classNames.submit ?? ''}`.trim()}
                            data-kp-submit
                            disabled={busy}
                            aria-busy={busy ? 'true' : undefined}
                        >
                            {busy ? (busyLabel ?? s.busy) : (submitLabel ?? s.save)}
                        </button>
                    ))}
            </form>
        </FormContext.Provider>
    );
}
export const Form = forwardRef(FormInner);
