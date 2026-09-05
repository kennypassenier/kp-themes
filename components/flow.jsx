import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { parseDate, toISO } from '../js/datepicker.js';
import { datePattern, formatBytes, formatDate, resolveLocale, weekStartsOn } from '../js/locale.js';
import { acceptsFile } from '../js/upload.js';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

// Date picker, upload and wizard, React [TH43, TH44, TH48].
//
// Same contracts as their framework-free halves. The date parsing is
// imported rather than repeated — two implementations of "is 31-02 a
// date" is exactly how the two channels come to disagree.
//
// Since 3.0.0 [KT6, D5]: the locale comes from the page rather than
// being Dutch; every state has a controlled form; every component
// forwards a ref and passes the rest to its root; the upload reports
// progress and rejections, which the first version could not; the wizard
// can be held at a step and deep-linked to one.

/**
 * The page's locale, read from the nearest `lang` above the element
 * once it is mounted — the same rule the framework-free channel uses.
 *
 * @param {import('react').RefObject<HTMLElement | null>} ref
 * @param {string | undefined} explicit
 */
function useLocale(ref, explicit) {
    const [locale, setLocale] = useState(() => resolveLocale(explicit));
    useEffect(() => {
        setLocale(resolveLocale(explicit, ref.current));
    }, [explicit, ref]);
    return locale;
}

/**
 * @typedef {object} DatePickerProps
 * @property {string} label
 * @property {string} [value]          Controlled text.
 * @property {string} [defaultValue]   Initial text when uncontrolled.
 * @property {(iso: string | null, date: Date | null) => void} [onChange]
 * @property {boolean} [open]          Controlled panel state.
 * @property {boolean} [defaultOpen]
 * @property {(open: boolean) => void} [onOpenChange]
 * @property {string} [locale]         Default: the nearest `lang`, else the browser's.
 * @property {number} [weekStartsOn]   0 = Sunday. Default: the locale's.
 * @property {string} [min]            ISO. Days before are disabled.
 * @property {string} [max]            ISO. Days after are disabled.
 * @property {number[]} [disabledDays] Weekdays (0-6) that cannot be chosen.
 * @property {(date: Date) => boolean} [isDateDisabled]
 * @property {boolean} [closeOnSelect] Default true.
 * @property {boolean} [returnFocus]   Default true.
 * @property {import('react').ReactNode} [trigger]  What the open button shows. Default: the dictionary's `calendarButton`.
 * @property {import('react').ReactNode} [previousGlyph]
 * @property {import('react').ReactNode} [nextGlyph]
 * @property {(date: Date, defaults: { className: string, disabled: boolean }) => import('react').ReactNode} [renderDay]
 * @property {string} [placeholder]    Default: the locale's pattern, e.g. dd-mm-yyyy.
 * @property {Record<string, unknown>} [inputProps]  Spread onto the input (name, required, aria-describedby, …).
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * A date field where typing is the primary path and the grid is an aid
 * [TH43].
 *
 * @param {DatePickerProps} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function DatePickerInner(
    {
        label,
        value,
        defaultValue = '',
        onChange,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        locale: localeProp,
        weekStartsOn: weekProp,
        min,
        max,
        disabledDays = [],
        isDateDisabled,
        closeOnSelect = true,
        returnFocus = true,
        trigger,
        previousGlyph = '‹',
        nextGlyph = '›',
        renderDay,
        placeholder,
        inputProps,
        strings,
        className = '',
        style,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const id = useId();
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDivElement} */ (inner.current), []);
    const locale = useLocale(inner, localeProp);
    const firstDay = weekStartsOn(locale, weekProp);
    const [text, setText] = useControllable(value, defaultValue, undefined);
    const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
    const [cursor, setCursor] = useState(() => parseDate(defaultValue, locale) ?? new Date());
    const button = useRef(/** @type {HTMLButtonElement | null} */ (null));

    const chosen = parseDate(text, locale);
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const lead = (new Date(year, month, 1).getDay() - firstDay + 7) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const lower = min ? parseDate(min, locale) : null;
    const upper = max ? parseDate(max, locale) : null;
    /** @param {Date} date */
    const disabled = (date) =>
        (lower !== null && date < lower) ||
        (upper !== null && date > upper) ||
        disabledDays.includes(date.getDay()) ||
        (isDateDisabled?.(date) ?? false);

    /** @param {Date} date */
    const take = (date) => {
        if (disabled(date)) return;
        setText(formatDate(date, locale));
        onChange?.(toISO(date), date);
        if (closeOnSelect) setOpen(false);
        if (returnFocus) button.current?.focus();
    };

    /** @param {import('react').KeyboardEvent} event @param {Date} day */
    const onDayKey = (event, day) => {
        const y = day.getFullYear();
        const m = day.getMonth();
        const d = day.getDate();
        const offset = (day.getDay() - firstDay + 7) % 7;
        /** @type {Record<string, Date>} */
        const moves = {
            ArrowRight: new Date(y, m, d + 1),
            ArrowLeft: new Date(y, m, d - 1),
            ArrowDown: new Date(y, m, d + 7),
            ArrowUp: new Date(y, m, d - 7),
            PageDown: new Date(y, m + 1, d),
            PageUp: new Date(y, m - 1, d),
            Home: new Date(y, m, d - offset),
            End: new Date(y, m, d + (6 - offset)),
        };
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            take(day);
            return;
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
            button.current?.focus();
            return;
        }
        const moved = moves[event.key];
        if (moved === undefined) return;
        event.preventDefault();
        // The arrows cross the month boundary; stopping at the edge of the
        // drawn grid is the difference between a calendar and a picture.
        setCursor(moved);
        requestAnimationFrame(() => {
            // Scoped to this picker: two pickers on a page stole each
            // other's focus in the first version.
            /** @type {HTMLElement | null | undefined} */
            const target = inner.current?.querySelector(`[data-kp-day="${toISO(moved)}"]`);
            target?.focus();
        });
    };

    return (
        <div
            ref={inner}
            className={`kp-datepicker ${className}`.trim()}
            style={style}
            data-kp-datepicker
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
            }}
            {...rest}
        >
            <div className="kp-field">
                <label className="kp-field__label" htmlFor={id}>
                    {label}
                </label>
                <input
                    id={id}
                    className="kp-field__input"
                    type="text"
                    inputMode="numeric"
                    // The hint follows the locale, so it cannot lie about
                    // the format.
                    placeholder={placeholder ?? datePattern(locale).hint}
                    data-kp-date-input
                    // ISO in the attribute, the locale on screen: parsing a
                    // localised string on the server is how off-by-one-day
                    // bugs are born.
                    data-kp-date-value={chosen === null ? undefined : toISO(chosen)}
                    value={text}
                    onChange={(event) => {
                        setText(event.target.value);
                        const date = parseDate(event.target.value, locale);
                        onChange?.(date === null ? null : toISO(date), date);
                        if (date !== null) setCursor(date);
                    }}
                    {...inputProps}
                />
            </div>
            <button
                type="button"
                ref={button}
                className="kp-button kp-button--ghost"
                data-kp-date-open
                aria-label={s.calendarOpen}
                aria-expanded={open}
                onClick={() => setOpen(!open)}
            >
                {trigger ?? s.calendarButton}
            </button>
            {open && (
                <div className="kp-datepicker__panel" data-kp-date-panel>
                    <div className="kp-datepicker__head">
                        <button
                            type="button"
                            className="kp-button kp-button--ghost"
                            aria-label={s.previousMonth}
                            onClick={() => setCursor(new Date(year, month - 1, 1))}
                        >
                            {previousGlyph}
                        </button>
                        <span className="kp-datepicker__title" id={`${id}-title`}>
                            {s.monthTitle(s.months[month] ?? '', year)}
                        </span>
                        <button
                            type="button"
                            className="kp-button kp-button--ghost"
                            aria-label={s.nextMonth}
                            onClick={() => setCursor(new Date(year, month + 1, 1))}
                        >
                            {nextGlyph}
                        </button>
                    </div>
                    <div className="kp-datepicker__grid" role="grid" aria-labelledby={`${id}-title`}>
                        {Array.from({ length: 7 }, (_, i) => s.weekdays[(firstDay + i) % 7] ?? '').map((day, i) => (
                            <span className="kp-datepicker__weekday" role="columnheader" aria-label={day} key={`${day}-${i}`}>
                                {day}
                            </span>
                        ))}
                        {Array.from({ length: lead }, (_, i) => (
                            <span className="kp-datepicker__blank" key={`blank-${i}`} />
                        ))}
                        {Array.from({ length: days }, (_, i) => {
                            const day = new Date(year, month, i + 1);
                            const iso = toISO(day);
                            const off = disabled(day);
                            return (
                                <button
                                    type="button"
                                    key={iso}
                                    className="kp-datepicker__day"
                                    data-kp-day={iso}
                                    data-kp-disabled={off ? '' : undefined}
                                    role="gridcell"
                                    // The full date as the name: "4" alone
                                    // tells a screen reader nothing about
                                    // which month it is in.
                                    aria-label={s.dayLabel(i + 1, s.months[month] ?? '', year)}
                                    aria-selected={chosen !== null && toISO(chosen) === iso}
                                    aria-disabled={off ? 'true' : undefined}
                                    // Exactly one day in the tab order, so
                                    // Tab leaves the grid instead of walking
                                    // 31 buttons.
                                    tabIndex={i + 1 === cursor.getDate() ? 0 : -1}
                                    onKeyDown={(event) => onDayKey(event, day)}
                                    onClick={() => take(day)}
                                >
                                    {renderDay ? renderDay(day, { className: 'kp-datepicker__day', disabled: off }) : i + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
export const DatePicker = forwardRef(DatePickerInner);

/** @typedef {{ id: string, file: File, name: string, size: number, progress: number, state: 'waiting' | 'uploading' | 'done' | 'error', message?: string }} UploadRow */

/**
 * @typedef {object} UploadProps
 * @property {string} [label]
 * @property {number} [maxBytes]
 * @property {number} [maxFiles]
 * @property {number} [maxTotal]
 * @property {string} [accept]         Same syntax as the input's own; also set on the input.
 * @property {boolean} [multiple]      Default true.
 * @property {boolean} [dropping]      Drag and drop. Default true.
 * @property {boolean} [disabled]
 * @property {UploadRow[]} [rows]      Controlled list.
 * @property {(rows: UploadRow[]) => void} [onRowsChange]
 * @property {(files: File[]) => void} [onFiles]   The accepted files of one pick.
 * @property {(file: File, reason: string, message: string) => void} [onReject]
 * @property {(row: UploadRow) => boolean | void} [onRemove]  Return false to keep the row.
 * @property {(file: File, accepted: File[]) => string | null} [validate]  A reason refuses the file.
 * @property {string} [locale]
 * @property {(row: UploadRow, remove: () => void) => import('react').ReactNode} [renderRow]
 * @property {import('react').ReactNode} [removeGlyph]
 * @property {import('react').ReactNode} [children]  What the zone shows. Default: `label`, else the dictionary's.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * A drop zone and a file list [TH44]. The sending stays the consumer's;
 * the rows are theirs to update through `rows` / `onRowsChange`, or
 * through the `progress`, `done` and `fail` helpers exported beside it.
 *
 * @param {UploadProps} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function UploadInner(
    {
        label,
        maxBytes = Infinity,
        maxFiles = Infinity,
        maxTotal = Infinity,
        accept,
        multiple = true,
        dropping = true,
        disabled = false,
        rows: rowsProp,
        onRowsChange,
        onFiles,
        onReject,
        onRemove,
        validate,
        locale: localeProp,
        renderRow,
        removeGlyph = '×',
        children,
        strings,
        className = '',
        style,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const id = useId();
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDivElement} */ (inner.current), []);
    const locale = useLocale(inner, localeProp);
    const [rows, setRows] = useControllable(rowsProp, /** @type {UploadRow[]} */ ([]), onRowsChange);
    const [dragging, setDragging] = useState(false);
    const input = useRef(/** @type {HTMLInputElement | null} */ (null));
    const counter = useRef(0);

    /** @param {FileList | File[]} files */
    const take = (files) => {
        const list = [...files];
        /** @type {UploadRow[]} */
        const next = [];
        /** @type {File[]} */
        const ok = [];
        const already = rows.filter((r) => r.state !== 'error').map((r) => r.file);
        for (const file of list) {
            const accepted = [...already, ...ok];
            /** @type {[string, string] | null} */
            let refused = null;
            if (accepted.length >= maxFiles) refused = ['too-many', s.uploadTooMany(maxFiles)];
            else if (file.size > maxBytes) refused = ['too-large', s.uploadTooLarge(formatBytes(maxBytes, locale))];
            else if (accepted.reduce((sum, f) => sum + f.size, 0) + file.size > maxTotal)
                refused = ['total-too-large', s.uploadTotalTooLarge(formatBytes(maxTotal, locale))];
            else if (accept && !acceptsFile(file, accept)) refused = ['wrong-type', s.uploadWrongType(accept)];
            else {
                const custom = validate?.(file, accepted) ?? null;
                if (custom !== null) refused = [custom, custom];
            }
            const row = { id: `${id}-${++counter.current}`, file, name: file.name, size: file.size, progress: 0 };
            if (refused !== null) {
                // Refused per file, with the reason on its own row: a list
                // that says WHICH file is wrong is the point of having a list.
                next.push({ ...row, state: 'error', message: refused[1] });
                onReject?.(file, refused[0], refused[1]);
            } else {
                next.push({ ...row, state: 'waiting' });
                ok.push(file);
            }
        }
        setRows([...rows, ...next]);
        if (ok.length > 0) onFiles?.(ok);
        // Cleared, or picking a file, removing it and picking it again
        // does nothing at all.
        if (input.current !== null) input.current.value = '';
    };
    /** @param {UploadRow} row */
    const remove = (row) => {
        if (onRemove?.(row) === false) return;
        setRows(rows.filter((r) => r.id !== row.id));
    };

    return (
        <div ref={inner} className={`kp-upload ${className}`.trim()} style={style} data-kp-upload {...rest}>
            <input
                ref={input}
                id={id}
                type="file"
                multiple={multiple}
                accept={accept}
                disabled={disabled}
                className="kp-sr-only"
                data-kp-upload-input
                onChange={(event) => event.target.files && take(event.target.files)}
            />
            {/* A label pointing at a real file input is the whole
                accessibility story: Tab reaches it, Enter opens the picker,
                and a screen reader announces a file field. */}
            <label
                className="kp-upload__zone"
                htmlFor={id}
                data-kp-upload-zone
                data-kp-dragging={dragging ? '' : undefined}
                onDragOver={(event) => {
                    if (!dropping || disabled) return;
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                    if (!dropping || disabled) return;
                    event.preventDefault();
                    setDragging(false);
                    if (event.dataTransfer.files.length > 0) take(event.dataTransfer.files);
                }}
            >
                {children ?? label ?? s.uploadZone}
            </label>
            <ul className="kp-upload__list" data-kp-upload-list>
                {rows.map((row) =>
                    renderRow ? (
                        <li key={row.id} className="kp-upload__file" data-kp-upload-file={row.name} data-state={row.state}>
                            {renderRow(row, () => remove(row))}
                        </li>
                    ) : (
                        <li
                            className="kp-upload__file"
                            key={row.id}
                            data-kp-upload-file={row.name}
                            data-state={row.state}
                            data-error={row.state === 'error' ? row.message : undefined}
                            style={/** @type {import('react').CSSProperties} */ ({ '--kp-progress': `${row.progress}%` })}
                        >
                            <span className="kp-upload__name">{row.name}</span>
                            <span className="kp-upload__size">{formatBytes(row.size, locale)}</span>
                            <span
                                className="kp-upload__bar"
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={row.progress}
                                aria-label={s.uploadProgress(row.name)}
                            />
                            <span className="kp-upload__message" role="status" aria-live="polite">
                                {row.message}
                            </span>
                            <button
                                type="button"
                                className="kp-button kp-button--ghost"
                                aria-label={s.removeNamed(row.name)}
                                onClick={() => remove(row)}
                            >
                                {removeGlyph}
                            </button>
                        </li>
                    ),
                )}
            </ul>
        </div>
    );
}
export const Upload = forwardRef(UploadInner);

/** Helpers for a consumer holding the rows: return the list with one row updated. */
/** @param {UploadRow[]} rows @param {string} id @param {number} percent */
export const withProgress = (rows, id, percent) =>
    rows.map((r) =>
        r.id === id ? { ...r, progress: Math.max(0, Math.min(100, Math.round(percent))), state: percent >= 100 ? 'done' : 'uploading' } : r,
    );
/** @param {UploadRow[]} rows @param {string} id @param {string} [message] */
export const withDone = (rows, id, message) => rows.map((r) => (r.id === id ? { ...r, progress: 100, state: 'done', message } : r));
/** @param {UploadRow[]} rows @param {string} id @param {string} message */
export const withError = (rows, id, message) => rows.map((r) => (r.id === id ? { ...r, state: 'error', message } : r));

/**
 * @typedef {object} WizardProps
 * @property {{ id?: string, label: string, content: import('react').ReactNode, optional?: boolean }[]} steps
 * @property {number} [step]           Controlled step index.
 * @property {number} [defaultStep]    Default 0.
 * @property {(step: number, detail: { previous: number, direction: 'forward' | 'back' }) => void} [onStepChange]
 * @property {(from: number, to: number) => boolean | Promise<boolean>} [beforeStep]  Return false to hold the wizard.
 * @property {(step: number) => boolean} [canGoNext]   Default: always.
 * @property {() => void} [onFinish]
 * @property {() => void} [onCancel]
 * @property {boolean} [navigable]     Completed steps in the list are clickable. Default false.
 * @property {boolean} [focusStep]     Move focus into the new step. Default true.
 * @property {(state: { at: number, of: number, back: () => void, next: () => void, isLast: boolean, busy: boolean }) => import('react').ReactNode} [renderActions]
 * @property {boolean} [busy]          Disables Next while an async check runs, if the consumer wants to show it.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * A multi-step form [TH48].
 *
 * @param {WizardProps} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function WizardInner(
    {
        steps,
        step,
        defaultStep = 0,
        onStepChange,
        beforeStep,
        canGoNext,
        onFinish,
        onCancel,
        navigable = false,
        focusStep = true,
        renderActions,
        busy = false,
        strings,
        className = '',
        style,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDivElement} */ (inner.current), []);
    const [at, setAt] = useControllable(step, defaultStep, undefined);
    const [pending, setPending] = useState(false);
    const panel = useRef(/** @type {HTMLElement | null} */ (null));

    /** @param {number} next */
    const go = async (next) => {
        if (next < 0 || next >= steps.length || next === at || pending) return;
        const direction = next > at ? 'forward' : 'back';
        if (direction === 'forward' && canGoNext && !canGoNext(at)) return;
        if (beforeStep) {
            setPending(true);
            let allowed = false;
            try {
                allowed = await beforeStep(at, next);
            } finally {
                setPending(false);
            }
            if (!allowed) return;
        }
        const previous = at;
        setAt(next);
        onStepChange?.(next, { previous, direction });
        // Focus moves into the new step, or a keyboard user presses Next
        // and stays where they were with no idea anything moved.
        if (focusStep) requestAnimationFrame(() => panel.current?.focus());
    };
    const isLast = at === steps.length - 1;
    const next = () => {
        if (isLast) {
            if (canGoNext && !canGoNext(at)) return;
            onFinish?.();
        } else void go(at + 1);
    };
    const back = () => void go(at - 1);

    return (
        <div ref={inner} className={`kp-wizard ${className}`.trim()} style={style} data-kp-wizard {...rest}>
            <ol className="kp-wizard__steps">
                {steps.map((entry, i) => (
                    <li
                        key={entry.id ?? entry.label}
                        data-kp-step-label
                        data-state={i < at ? 'done' : i === at ? 'current' : 'todo'}
                        aria-current={i === at ? 'step' : undefined}
                        tabIndex={navigable && i < at ? 0 : undefined}
                        role={navigable && i < at ? 'button' : undefined}
                        onClick={navigable && i < at ? () => void go(i) : undefined}
                        onKeyDown={navigable && i < at ? (e) => (e.key === 'Enter' || e.key === ' ') && void go(i) : undefined}
                    >
                        {entry.label}
                    </li>
                ))}
            </ol>
            <p data-kp-wizard-status role="status" aria-live="polite">
                {s.wizardStep(at + 1, steps.length)}
            </p>
            <section data-kp-step tabIndex={-1} ref={panel}>
                {steps[at]?.content}
            </section>
            <div className="kp-wizard__actions">
                {renderActions ? (
                    renderActions({ at, of: steps.length, back, next, isLast, busy: busy || pending })
                ) : (
                    <>
                        {onCancel && (
                            <button type="button" className="kp-button kp-button--ghost" data-kp-wizard-cancel onClick={onCancel}>
                                {s.close}
                            </button>
                        )}
                        <button type="button" className="kp-button" data-kp-wizard-back disabled={at === 0 || pending} onClick={back}>
                            {s.back}
                        </button>
                        <button
                            type="button"
                            className="kp-button kp-button--primary"
                            data-kp-wizard-next
                            disabled={busy || pending}
                            aria-busy={busy || pending ? 'true' : undefined}
                            onClick={next}
                        >
                            {isLast ? s.finish : s.next}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
export const Wizard = forwardRef(WizardInner);
