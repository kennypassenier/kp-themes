import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { ALARM_CLOSE_EVENT, ALARM_OPEN_EVENT, ALARM_SECONDS, glyphCells, noiseGlyph, writeCountdown } from '../js/alarm.js';
import { useStrings } from '../hooks/use-strings.jsx';

// The alarm, React channel [scope-94].
//
// The same tree js/alarm.js builds, rendered here, so a register rule and a
// test reach the same elements in both channels [AR7]. The behaviour leans
// on the platform the way the framework-free one does: `showModal()` puts
// the alarm in the top layer, makes the page inert and keeps focus inside;
// this component adds the two ways out, the countdown and the hand-back of
// focus to whatever had it when the alarm opened.
//
// Two ways to use it. `<Alarm open title=… onClose={(reason) => …} />` when
// the state lives in the component that raises it; `useAlarm()` when the
// alarm is a question with an answer — it returns a `show(options)` that
// resolves with the close reason, as `showAlarm()` does, and the element
// to render.

/**
 * @typedef {'ack' | 'timeout' | 'escape'} AlarmReason
 */

/**
 * @typedef {object} AlarmProps
 * @property {boolean} [open]  Raises the alarm while true. Default false.
 * @property {string} title  The huge word(s), and the alarm's accessible name.
 * @property {string} [detail]  The line under the headline.
 * @property {string} [code]  The small line above the headline.
 * @property {'ack' | 'auto'} [mode]  'ack': only its button closes it. 'auto': closes after `seconds`. Default 'ack'.
 * @property {number} [seconds]  Auto only. Eight when left out (ALARM_SECONDS).
 * @property {boolean} [escape]  Ack only: Escape closes it as well. Default false.
 * @property {string} [action]  The button's label. Default: the dictionary's `alarmAction`.
 * @property {(reason: AlarmReason) => void} [onClose]  Called once when it closed, with why; set `open` back to false here.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * @param {AlarmProps} props
 * @param {import('react').ForwardedRef<HTMLDialogElement>} ref
 */
function AlarmInner(
    {
        open = false,
        title,
        detail = '',
        code = '',
        mode = 'ack',
        seconds = ALARM_SECONDS,
        escape = false,
        action,
        onClose,
        strings,
        className = '',
        style,
    },
    ref,
) {
    const s = useStrings(strings);
    /** @type {import('react').RefObject<HTMLDialogElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDialogElement} */ (inner.current), []);
    /** @type {import('react').RefObject<HTMLButtonElement | null>} */
    const ackRef = useRef(null);
    const base = useId();
    const secs = Math.max(1, Math.round(Number(seconds)) || ALARM_SECONDS);
    const label = action || s.alarmAction;
    const [kept, setKept] = useState(false);
    const [whole, setWhole] = useState(secs);
    const current = mode === 'auto' && !kept ? 'auto' : 'ack';
    const escapeAllowed = current === 'auto' || escape;
    // The noise glyphs are drawn once per headline, not on every render.
    const cells = useMemo(
        () => glyphCells(title).map((part) => ({ ...part, chars: part.chars.map((c) => ({ ...c, n1: noiseGlyph(), n2: noiseGlyph() })) })),
        [title],
    );
    /** The latest close callback and the element focus goes back to, for the effect that outlives a render. */
    const latest = useRef({ onClose, returnTo: /** @type {HTMLElement | null} */ (null), reason: /** @type {AlarmReason} */ ('escape') });
    latest.current.onClose = onClose;

    const close = useCallback(
        /** @param {AlarmReason} reason */
        (reason) => {
            const dialog = inner.current;
            latest.current.reason = reason;
            if (dialog?.open) dialog.close(reason);
        },
        [],
    );

    useEffect(() => {
        const dialog = inner.current;
        if (!dialog || !open || dialog.open) return undefined;
        const returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        latest.current.returnTo = returnTo;
        latest.current.reason = 'escape';
        setKept(false);
        setWhole(secs);
        writeCountdown(dialog, null, 1, 1, '');
        dialog.showModal();
        if (mode === 'auto') dialog.focus();
        else ackRef.current?.focus();
        dialog.dispatchEvent(new CustomEvent(ALARM_OPEN_EVENT, { bubbles: true, detail: { id: dialog.id, mode } }));

        const onDialogClose = () => {
            const { reason, onClose: done } = latest.current;
            if (returnTo?.isConnected) returnTo.focus();
            (returnTo?.isConnected ? returnTo : document).dispatchEvent(
                new CustomEvent(ALARM_CLOSE_EVENT, { bubbles: true, detail: { reason, id: dialog.id } }),
            );
            done?.(reason);
        };
        dialog.addEventListener('close', onDialogClose, { once: true });
        return () => {
            dialog.removeEventListener('close', onDialogClose);
            if (dialog.open) dialog.close();
        };
        // `mode` and `secs` are read at the moment it opens, as in showAlarm().
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // The countdown: the bar's two shares straight onto the dialog, the whole
    // seconds through state, so React owns every word it rendered.
    useEffect(() => {
        const dialog = inner.current;
        if (!dialog || !open || current !== 'auto') return undefined;
        const total = secs * 1000;
        const began = performance.now();
        const tick = () => {
            const remaining = Math.max(0, total - (performance.now() - began));
            const left = Math.ceil(remaining / 1000);
            writeCountdown(dialog, null, remaining / total, left / secs, '');
            setWhole(left);
            if (remaining <= 0) close('timeout');
        };
        const timer = window.setInterval(tick, 100);
        tick();
        return () => window.clearInterval(timer);
    }, [open, current, secs, close]);

    // Keep open hands focus to the button it just revealed, once it shows:
    // a hidden button cannot take focus, so this waits for the render.
    useEffect(() => {
        if (kept && inner.current?.open) ackRef.current?.focus();
    }, [kept]);

    const auto = mode === 'auto';
    const when = kept ? s.alarmKeptOpen(label) : auto ? s.alarmClosesBy(secs) : s.alarmPressTo(label);

    return (
        <dialog
            ref={inner}
            id={base}
            tabIndex={-1}
            className={`kp-alarm ${className}`.trim()}
            style={style}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`${base}-title`}
            aria-describedby={`${detail ? `${base}-detail ` : ''}${base}-when`}
            data-kp-alarm-mode={current}
            // `closedby` is not among React's dialog attributes yet; a spread writes it through as it stands.
            {...{ closedby: escapeAllowed ? 'closerequest' : 'none' }}
            onCancel={(event) => {
                event.preventDefault();
                if (escapeAllowed) close('escape');
            }}
            onKeyDown={(event) => {
                if (event.key === 'Escape' && !escapeAllowed) event.preventDefault();
            }}
        >
            <div className="kp-alarm__scan" aria-hidden="true" />
            <div className="kp-alarm__bars" aria-hidden="true" />
            <div className="kp-alarm__panel">
                {code && <p className="kp-alarm__code">{code}</p>}
                <div className="kp-alarm__title" role="heading" aria-level={2}>
                    <span className="kp-sr-only" id={`${base}-title`}>
                        {title}
                    </span>
                    <span className="kp-alarm__glyphs" data-text={title} aria-hidden="true">
                        {cells.map((part, index) =>
                            part.chars.length === 0 ? (
                                ' '
                            ) : (
                                <span className="kp-alarm__word" key={index}>
                                    {part.chars.map((c) => (
                                        <span
                                            className="kp-alarm__char"
                                            key={c.i}
                                            data-n1={c.n1}
                                            data-n2={c.n2}
                                            style={/** @type {import('react').CSSProperties} */ ({ '--i': String(c.i) })}
                                        >
                                            {c.ch}
                                        </span>
                                    ))}
                                </span>
                            ),
                        )}
                    </span>
                </div>
                {detail && (
                    <p className="kp-alarm__detail" id={`${base}-detail`}>
                        {detail}
                    </p>
                )}
                <p className="kp-sr-only" id={`${base}-when`} aria-live="assertive">
                    {when}
                </p>
                <div className="kp-alarm__actions">
                    <button type="button" className="kp-button kp-alarm__ack" ref={ackRef} onClick={() => close('ack')}>
                        {label}
                    </button>
                    <span className="kp-alarm__hint" aria-hidden="true">
                        {s.alarmHint}
                    </span>
                </div>
                <div className="kp-alarm__countdown">
                    <span className="kp-alarm__track" aria-hidden="true">
                        <span className="kp-alarm__fill" />
                    </span>
                    <span className="kp-alarm__left" aria-hidden="true">
                        {s.alarmCountdown(whole)}
                    </span>
                    <button type="button" className="kp-button kp-button--ghost kp-button--sm kp-alarm__keep" onClick={() => setKept(true)}>
                        {s.alarmKeepOpen}
                    </button>
                </div>
            </div>
        </dialog>
    );
}

export const Alarm = forwardRef(AlarmInner);

/**
 * An alarm as a question with an answer: `show(options)` raises it and
 * resolves with why it closed, as `showAlarm()` does in the framework-free
 * channel. Render the returned element once, anywhere in the tree.
 *
 *   const [showAlarm, alarm] = useAlarm();
 *   const reason = await showAlarm({ title: 'Access denied', mode: 'auto', seconds: 6 });
 *
 * @returns {[(options: Omit<AlarmProps, 'open' | 'onClose'>) => Promise<AlarmReason>, import('react').ReactElement | null]}
 */
export function useAlarm() {
    /** @typedef {{ key: number, options: Omit<AlarmProps, 'open' | 'onClose'>, resolve: (reason: AlarmReason) => void }} PendingAlarm */
    const [pending, setPending] = useState(/** @type {PendingAlarm | null} */ (null));
    const serial = useRef(0);
    const show = useCallback(
        /** @param {Omit<AlarmProps, 'open' | 'onClose'>} options */
        (options) =>
            /** @type {Promise<AlarmReason>} */ (
                new Promise((resolve) => {
                    serial.current += 1;
                    setPending({ key: serial.current, options, resolve });
                })
            ),
        [],
    );
    const element = pending ? (
        <Alarm
            key={pending.key}
            {...pending.options}
            open
            onClose={(reason) => {
                pending.resolve(reason);
                setPending(null);
            }}
        />
    ) : null;
    return [show, element];
}
