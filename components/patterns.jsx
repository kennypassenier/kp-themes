import { useEffect, useRef, useState } from 'react';

// The small patterns, React [TH50, TH51, TH52, TH53, TH54].
//
// Same class names and same attributes as js/patterns.js. These are the
// things every application rewrites badly — the fifth reimplementation of
// "copy this value" is not better than the first, only differently wrong.

/**
 * An empty state that knows which emptiness it is [TH50].
 *
 * "Nog geen items" and "niets gevonden" are different messages, and
 * offering "maak er een" to someone who just typed a filter is noise.
 *
 * @param {{ title: string, body?: string, action?: import('react').ReactNode, filtered?: boolean }} props
 */
export function EmptyState({ title, body, action, filtered = false }) {
    return (
        <div className="kp-empty" data-kp-empty data-filtered={filtered ? '' : undefined}>
            <p className="kp-empty__title">{title}</p>
            {body && <p className="kp-empty__body">{body}</p>}
            {/* No action when a filter emptied the list: the thing to do
                is change the filter, and a "create" button here sends
                people the wrong way. */}
            {!filtered && action}
        </div>
    );
}

/**
 * A value with a copy button that confirms in words [TH53].
 *
 * @param {{ value: string, label?: string, copiedText?: string }} props
 */
export function Copyable({ value, label = 'Kopiëren', copiedText = 'Gekopieerd' }) {
    const [state, setState] = useState(/** @type {'idle' | 'copied' | 'failed'} */ ('idle'));
    const timer = useRef(/** @type {ReturnType<typeof setTimeout> | undefined} */ (undefined));

    useEffect(() => () => clearTimeout(timer.current), []);

    return (
        <span className="kp-copyable">
            <span className="kp-copyable__value">{value}</span>
            <button
                type="button"
                className="kp-button kp-button--ghost kp-copyable__button"
                data-kp-copy-value={value}
                data-kp-copied={state === 'copied' ? '' : undefined}
                data-kp-copy-failed={state === 'failed' ? '' : undefined}
                onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(value);
                    } catch {
                        // An insecure context, or the permission denied.
                        // Silence here is how a copy button becomes the
                        // control people click twice and then distrust.
                        setState('failed');
                        return;
                    }
                    setState('copied');
                    timer.current = setTimeout(() => setState('idle'), 1500);
                }}
            >
                {state === 'copied' ? copiedText : state === 'failed' ? 'Geblokkeerd' : label}
            </button>
            {/* Announced as well as shown: the button's own text changing
                is not something a screen reader reports on its own. */}
            <span className="kp-sr-only" role="status" aria-live="polite">
                {state === 'copied' ? `${value} gekopieerd` : state === 'failed' ? 'Kopiëren is geblokkeerd' : ''}
            </span>
        </span>
    );
}

/**
 * A health indicator [TH52]. The dot is never the only carrier.
 *
 * @param {{ state: 'ok' | 'warn' | 'down' | 'unknown', label: string }} props
 */
export function Health({ state, label }) {
    return (
        <span className="kp-health" data-state={state}>
            <span className="kp-health__dot" aria-hidden="true" />
            {label}
        </span>
    );
}

/**
 * An event timeline [TH52].
 *
 * @param {{ events: { when: string, what: string }[] }} props
 */
export function Timeline({ events }) {
    return (
        <ol className="kp-timeline">
            {events.map((event) => (
                <li className="kp-timeline__item" key={`${event.when}-${event.what}`}>
                    <span className="kp-timeline__marker" aria-hidden="true" />
                    <span>
                        <time className="kp-timeline__when">{event.when}</time>
                        {event.what}
                    </span>
                </li>
            ))}
        </ol>
    );
}

/**
 * A diff view [TH54].
 *
 * The sign has a column of its own so it survives where the colour does
 * not: printed, in high contrast, or for a reader who cannot tell green
 * from red [DI4].
 *
 * @param {{ lines: { kind: 'added' | 'removed' | 'same', text: string, number?: number }[] }} props
 */
export function Diff({ lines }) {
    return (
        <pre className="kp-diff">
            {lines.map((line, i) => (
                <span className="kp-diff__line" data-kind={line.kind} key={i}>
                    <span className="kp-diff__number">{line.number ?? i + 1}</span>
                    <span className="kp-diff__sign">{line.kind === 'added' ? '+' : line.kind === 'removed' ? '-' : ' '}</span>
                    <span>{line.text}</span>
                </span>
            ))}
        </pre>
    );
}
