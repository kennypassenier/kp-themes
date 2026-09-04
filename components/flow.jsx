import { useId, useRef, useState } from 'react';
import { parseDate, toDutch, toISO } from '../js/datepicker.js';
import { useStrings } from '../hooks/use-strings.jsx';

// Date picker, upload and wizard, React [TH43, TH44, TH48].
//
// Same contracts as their framework-free halves. The date parsing is
// imported rather than repeated — two implementations of "is 31-02 a
// date" is exactly how the two channels come to disagree.

/**
 * A date field where typing is the primary path and the grid is an aid
 * [TH43].
 *
 * @param {{ label: string, value?: string, onChange?: (iso: string | null) => void, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export function DatePicker({ label, value = '', onChange, strings }) {
    const s = useStrings(strings);
    const id = useId();
    const [text, setText] = useState(value);
    const [open, setOpen] = useState(false);
    const [cursor, setCursor] = useState(parseDate(value) ?? new Date());
    const button = useRef(/** @type {HTMLButtonElement | null} */ (null));

    const chosen = parseDate(text);
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const lead = (new Date(year, month, 1).getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();

    /** @param {Date} date */
    const take = (date) => {
        setText(toDutch(date));
        onChange?.(toISO(date));
        setOpen(false);
        button.current?.focus();
    };

    /** @param {import('react').KeyboardEvent} event @param {Date} day */
    const onDayKey = (event, day) => {
        /** @type {Date | null} */
        let moved = null;
        const shift = (/** @type {number} */ n) => new Date(day.getFullYear(), day.getMonth(), day.getDate() + n);
        switch (event.key) {
            case 'ArrowRight':
                moved = shift(1);
                break;
            case 'ArrowLeft':
                moved = shift(-1);
                break;
            case 'ArrowDown':
                moved = shift(7);
                break;
            case 'ArrowUp':
                moved = shift(-7);
                break;
            case 'PageDown':
                moved = new Date(day.getFullYear(), day.getMonth() + 1, day.getDate());
                break;
            case 'PageUp':
                moved = new Date(day.getFullYear(), day.getMonth() - 1, day.getDate());
                break;
            case 'Home':
                moved = shift(-((day.getDay() + 6) % 7));
                break;
            case 'End':
                moved = shift(6 - ((day.getDay() + 6) % 7));
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                take(day);
                return;
            case 'Escape':
                event.preventDefault();
                setOpen(false);
                button.current?.focus();
                return;
            default:
                return;
        }
        event.preventDefault();
        // The arrows cross the month boundary; stopping at the edge of the
        // drawn grid is the difference between a calendar and a picture.
        setCursor(moved);
        requestAnimationFrame(() => {
            /** @type {HTMLElement | null} */
            const target = document.querySelector(`[data-kp-day="${toISO(moved)}"]`);
            target?.focus();
        });
    };

    return (
        <div
            className="kp-datepicker"
            data-kp-datepicker
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
            }}
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
                    placeholder={s.dateFormatHint}
                    data-kp-date-input
                    // ISO in the attribute, Dutch on screen: parsing a
                    // localised string on the server is how off-by-one-day
                    // bugs are born.
                    data-kp-date-value={chosen === null ? undefined : toISO(chosen)}
                    value={text}
                    onChange={(event) => {
                        setText(event.target.value);
                        const date = parseDate(event.target.value);
                        onChange?.(date === null ? null : toISO(date));
                        if (date !== null) setCursor(date);
                    }}
                />
            </div>
            <button
                type="button"
                ref={button}
                className="kp-button kp-button--ghost"
                data-kp-date-open
                aria-label={s.calendarOpen}
                aria-expanded={open}
                onClick={() => setOpen((was) => !was)}
            >
                {s.calendarButton}
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
                            ‹
                        </button>
                        <span className="kp-datepicker__title" id={`${id}-title`}>
                            {s.months[month]} {year}
                        </span>
                        <button
                            type="button"
                            className="kp-button kp-button--ghost"
                            aria-label={s.nextMonth}
                            onClick={() => setCursor(new Date(year, month + 1, 1))}
                        >
                            ›
                        </button>
                    </div>
                    <div className="kp-datepicker__grid" role="grid" aria-labelledby={`${id}-title`}>
                        {s.weekdays.map((day) => (
                            <span className="kp-datepicker__weekday" role="columnheader" aria-label={day} key={day}>
                                {day}
                            </span>
                        ))}
                        {Array.from({ length: lead }, (_, i) => (
                            <span className="kp-datepicker__blank" key={`blank-${i}`} />
                        ))}
                        {Array.from({ length: days }, (_, i) => {
                            const day = new Date(year, month, i + 1);
                            const iso = toISO(day);
                            return (
                                <button
                                    type="button"
                                    key={iso}
                                    className="kp-datepicker__day"
                                    data-kp-day={iso}
                                    role="gridcell"
                                    // The full date as the name: "4" alone
                                    // tells a screen reader nothing about
                                    // which month it is in.
                                    aria-label={s.dayLabel(i + 1, s.months[month] ?? '', year)}
                                    aria-selected={chosen !== null && toISO(chosen) === iso}
                                    // Exactly one day in the tab order, so
                                    // Tab leaves the grid instead of walking
                                    // 31 buttons.
                                    tabIndex={i + 1 === cursor.getDate() ? 0 : -1}
                                    onKeyDown={(event) => onDayKey(event, day)}
                                    onClick={() => take(day)}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

/** @param {number} bytes */
function readableSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * A drop zone and a file list [TH44]. The sending stays the consumer's.
 *
 * @param {{ label?: string, maxBytes?: number, onFiles?: (files: File[]) => void, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export function Upload({ label, maxBytes = Infinity, onFiles, strings }) {
    const s = useStrings(strings);
    const id = useId();
    const [rows, setRows] = useState(/** @type {{ name: string, size: number, error?: string }[]} */ ([]));
    const [dragging, setDragging] = useState(false);
    const input = useRef(/** @type {HTMLInputElement | null} */ (null));

    /** @param {FileList | File[]} files */
    const take = (files) => {
        const list = [...files];
        setRows((was) => [
            ...was,
            // Refused per file, with the reason on its own row: a list that
            // says WHICH file is wrong is the point of having a list.
            ...list.map((file) => ({
                name: file.name,
                size: file.size,
                error: file.size > maxBytes ? s.uploadTooLarge(readableSize(maxBytes)) : undefined,
            })),
        ]);
        onFiles?.(list.filter((file) => file.size <= maxBytes));
        // Cleared, or picking a file, removing it and picking it again
        // does nothing at all.
        if (input.current !== null) input.current.value = '';
    };

    return (
        <div className="kp-upload" data-kp-upload>
            <input
                ref={input}
                id={id}
                type="file"
                multiple
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
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    if (event.dataTransfer.files.length > 0) take(event.dataTransfer.files);
                }}
            >
                {label ?? s.uploadZone}
            </label>
            <ul className="kp-upload__list" data-kp-upload-list>
                {rows.map((row, i) => (
                    <li
                        className="kp-upload__file"
                        key={`${row.name}-${i}`}
                        data-kp-upload-file={row.name}
                        data-state={row.error ? 'error' : 'waiting'}
                    >
                        <span className="kp-upload__name">{row.name}</span>
                        <span className="kp-upload__size">{readableSize(row.size)}</span>
                        <span
                            className="kp-upload__bar"
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={0}
                            aria-label={s.uploadProgress(row.name)}
                        />
                        <span className="kp-upload__message" role="status" aria-live="polite">
                            {row.error}
                        </span>
                        <button
                            type="button"
                            className="kp-button kp-button--ghost"
                            aria-label={s.removeNamed(row.name)}
                            onClick={() => setRows((was) => was.filter((_, at) => at !== i))}
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/**
 * A multi-step form [TH48].
 *
 * @param {{ steps: { label: string, content: import('react').ReactNode }[], onFinish?: () => void, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export function Wizard({ steps, onFinish, strings }) {
    const s = useStrings(strings);
    const [at, setAt] = useState(0);
    const panel = useRef(/** @type {HTMLElement | null} */ (null));

    const go = (/** @type {number} */ next) => {
        setAt(next);
        // Focus moves into the new step, or a keyboard user presses Next
        // and stays where they were with no idea anything moved.
        requestAnimationFrame(() => panel.current?.focus());
    };

    return (
        <div className="kp-wizard" data-kp-wizard>
            <ol className="kp-wizard__steps">
                {steps.map((step, i) => (
                    <li
                        key={step.label}
                        data-kp-step-label
                        data-state={i < at ? 'done' : i === at ? 'current' : 'todo'}
                        aria-current={i === at ? 'step' : undefined}
                    >
                        {step.label}
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
                <button type="button" className="kp-button" data-kp-wizard-back disabled={at === 0} onClick={() => go(at - 1)}>
                    {s.back}
                </button>
                <button
                    type="button"
                    className="kp-button kp-button--primary"
                    data-kp-wizard-next
                    onClick={() => {
                        if (at === steps.length - 1) onFinish?.();
                        else go(at + 1);
                    }}
                >
                    {at === steps.length - 1 ? s.finish : s.next}
                </button>
            </div>
        </div>
    );
}
