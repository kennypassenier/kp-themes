import { forwardRef, useEffect, useRef } from 'react';
import { COPIED_MS } from '../js/patterns.js';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

// The small patterns, React [TH50, TH51, TH52, TH53, TH54].
//
// Same class names and same attributes as js/patterns.js. These are the
// things every application rewrites badly — the fifth reimplementation of
// "copy this value" is not better than the first, only differently wrong.
//
// Since 3.0.0 [KT6]: every one forwards a ref and passes className,
// style and the rest to its root; the empty state renders the action the
// consumer gave it (it silently discarded one when filtered — the one
// case where "Clear filters" is the right action); the copy button tells
// the consumer what happened; and every fixed word, glyph or element is
// a prop.

/**
 * An empty state that knows which emptiness it is [TH50].
 *
 * "Nothing yet" and "nothing found" are different messages, and offering
 * "create one" to someone who just typed a filter is noise — so the
 * consumer passes `filteredAction` for that case, and `action` for the
 * other. Both are theirs; neither is dropped.
 *
 * @typedef {object} EmptyStateProps
 * @property {import('react').ReactNode} title
 * @property {import('react').ReactNode} [body]
 * @property {import('react').ReactNode} [action]          Shown when not filtered.
 * @property {import('react').ReactNode} [filteredAction]  Shown when filtered, e.g. "Clear filters".
 * @property {boolean} [filtered]
 * @property {import('react').ReactNode} [icon]
 * @property {1 | 2 | 3 | 4 | 5 | 6} [headingLevel]  Renders the title as a heading of this level. Default: a paragraph.
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */
/** @param {EmptyStateProps & import('react').HTMLAttributes<HTMLDivElement>} props @param {import('react').ForwardedRef<HTMLDivElement>} ref */
function EmptyStateInner({ title, body, action, filteredAction, filtered = false, icon, headingLevel, className = '', style, ...rest }, ref) {
    const Title = headingLevel ? /** @type {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} */ (`h${headingLevel}`) : 'p';
    return (
        <div ref={ref} className={`kp-empty ${className}`.trim()} style={style} data-kp-empty data-filtered={filtered ? '' : undefined} {...rest}>
            {icon && (
                <span className="kp-empty__icon" aria-hidden="true">
                    {icon}
                </span>
            )}
            <Title className="kp-empty__title">{title}</Title>
            {body && <p className="kp-empty__body">{body}</p>}
            {filtered ? filteredAction : action}
        </div>
    );
}
export const EmptyState = forwardRef(EmptyStateInner);

/**
 * A value with a copy button that confirms in words [TH53].
 *
 * @typedef {object} CopyableProps
 * @property {string} value
 * @property {string} [copyValue]    What goes to the clipboard, if not what is shown (a masked key).
 * @property {import('react').ReactNode} [label]
 * @property {import('react').ReactNode} [copiedText]
 * @property {import('react').ReactNode} [failedText]
 * @property {number} [resetMs]      Default COPIED_MS.
 * @property {'idle' | 'copied' | 'failed'} [state]  Controlled.
 * @property {(state: 'idle' | 'copied' | 'failed') => void} [onStateChange]
 * @property {(value: string) => void} [onCopy]
 * @property {(error: unknown) => void} [onError]
 * @property {(value: string) => import('react').ReactNode} [renderValue]
 * @property {import('react').ReactNode} [icon]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {{ value?: string, button?: string }} [classNames]
 */
/** @param {CopyableProps & import('react').HTMLAttributes<HTMLSpanElement>} props @param {import('react').ForwardedRef<HTMLSpanElement>} ref */
function CopyableInner(
    {
        value,
        copyValue,
        label,
        copiedText,
        failedText,
        resetMs = COPIED_MS,
        state: stateProp,
        onStateChange,
        onCopy,
        onError,
        renderValue,
        icon,
        strings,
        className = '',
        style,
        classNames = {},
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const [state, setState] = useControllable(stateProp, /** @type {'idle' | 'copied' | 'failed'} */ ('idle'), onStateChange);
    const timer = useRef(/** @type {ReturnType<typeof setTimeout> | undefined} */ (undefined));
    useEffect(() => () => clearTimeout(timer.current), []);

    const copy = async () => {
        const text = copyValue ?? value;
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            // An insecure context, or the permission denied. Silence here
            // is how a copy button becomes the control people click twice
            // and then distrust — and the failed state resets, unlike 1.x,
            // where it stuck for the life of the page.
            setState('failed');
            onError?.(error);
            timer.current = setTimeout(() => setState('idle'), resetMs);
            return;
        }
        setState('copied');
        onCopy?.(text);
        timer.current = setTimeout(() => setState('idle'), resetMs);
    };

    return (
        <span ref={ref} className={`kp-copyable ${className}`.trim()} style={style} {...rest}>
            <span className={`kp-copyable__value ${classNames.value ?? ''}`.trim()}>{renderValue ? renderValue(value) : value}</span>
            <button
                type="button"
                className={`kp-button kp-button--ghost kp-copyable__button ${classNames.button ?? ''}`.trim()}
                data-kp-copy-value={copyValue ?? value}
                data-kp-copied={state === 'copied' ? '' : undefined}
                data-kp-copy-failed={state === 'failed' ? '' : undefined}
                onClick={copy}
            >
                {icon}
                {state === 'copied' ? (copiedText ?? s.copied) : state === 'failed' ? (failedText ?? s.copyBlocked) : (label ?? s.copy)}
            </button>
            {/* Announced as well as shown: the button's own text changing
                is not something a screen reader reports on its own. */}
            <span className="kp-sr-only" role="status" aria-live="polite">
                {state === 'copied' ? s.copiedAnnouncement(value) : state === 'failed' ? s.copyBlockedAnnouncement : ''}
            </span>
        </span>
    );
}
export const Copyable = forwardRef(CopyableInner);

/**
 * A health indicator [TH52]. The dot is never the only carrier.
 *
 * @typedef {object} HealthProps
 * @property {'ok' | 'warn' | 'down' | 'unknown' | (string & {})} state  The four the stylesheet knows, or your own with your own CSS.
 * @property {import('react').ReactNode} label
 * @property {import('react').ReactNode} [indicator]  Replaces the dot.
 * @property {import('react').ElementType} [as]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */
/** @param {HealthProps & import('react').HTMLAttributes<HTMLElement>} props @param {import('react').ForwardedRef<HTMLElement>} ref */
function HealthInner({ state, label, indicator, as: As = 'span', className = '', style, ...rest }, ref) {
    return (
        <As ref={ref} className={`kp-health ${className}`.trim()} style={style} data-state={state} {...rest}>
            {indicator ?? <span className="kp-health__dot" aria-hidden="true" />}
            {label}
        </As>
    );
}
export const Health = forwardRef(HealthInner);

/** @typedef {{ id?: string, when: import('react').ReactNode, dateTime?: string, what: import('react').ReactNode, marker?: import('react').ReactNode, state?: string, href?: string }} TimelineEvent */

/**
 * An event timeline [TH52].
 *
 * @typedef {object} TimelineProps
 * @property {TimelineEvent[]} events
 * @property {(event: TimelineEvent) => import('react').ReactNode} [renderItem]
 * @property {import('react').ElementType} [linkComponent]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */
/** @param {TimelineProps & import('react').HTMLAttributes<HTMLOListElement>} props @param {import('react').ForwardedRef<HTMLOListElement>} ref */
function TimelineInner({ events, renderItem, linkComponent: Link = 'a', className = '', style, ...rest }, ref) {
    return (
        <ol ref={ref} className={`kp-timeline ${className}`.trim()} style={style} {...rest}>
            {events.map((event, i) => (
                <li className="kp-timeline__item" key={event.id ?? i} data-state={event.state}>
                    {event.marker ?? <span className="kp-timeline__marker" aria-hidden="true" />}
                    <span>
                        {renderItem ? (
                            renderItem(event)
                        ) : (
                            <>
                                <time className="kp-timeline__when" dateTime={event.dateTime}>
                                    {event.when}
                                </time>
                                {event.href ? <Link href={event.href}>{event.what}</Link> : event.what}
                            </>
                        )}
                    </span>
                </li>
            ))}
        </ol>
    );
}
export const Timeline = forwardRef(TimelineInner);

/**
 * A diff view [TH54].
 *
 * The sign has a column of its own so it survives where the colour does
 * not: printed, in high contrast, or for a reader who cannot tell green
 * from red [DI4].
 *
 * @typedef {object} DiffProps
 * @property {{ kind: 'added' | 'removed' | 'same', text: string, number?: number, oldNumber?: number, newNumber?: number }[]} lines
 * @property {boolean} [lineNumbers]  Default true.
 * @property {{ added?: string, removed?: string, same?: string }} [signs]
 * @property {(text: string, line: DiffProps['lines'][number]) => import('react').ReactNode} [renderText]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */
/** @param {DiffProps & import('react').HTMLAttributes<HTMLPreElement>} props @param {import('react').ForwardedRef<HTMLPreElement>} ref */
function DiffInner({ lines, lineNumbers = true, signs = {}, renderText, className = '', style, ...rest }, ref) {
    const sign = { added: signs.added ?? '+', removed: signs.removed ?? '-', same: signs.same ?? ' ' };
    return (
        <pre ref={ref} className={`kp-diff ${className}`.trim()} style={style} data-kp-line-numbers={lineNumbers ? '' : undefined} {...rest}>
            {lines.map((line, i) => (
                <span className="kp-diff__line" data-kind={line.kind} key={i}>
                    {lineNumbers && <span className="kp-diff__number">{line.number ?? line.newNumber ?? line.oldNumber ?? i + 1}</span>}
                    <span className="kp-diff__sign">{sign[line.kind]}</span>
                    <span>{renderText ? renderText(line.text, line) : line.text}</span>
                </span>
            ))}
        </pre>
    );
}
export const Diff = forwardRef(DiffInner);
