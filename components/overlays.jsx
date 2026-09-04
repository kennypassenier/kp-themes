import { useEffect, useId, useRef, useState } from 'react';
import { TOAST_MS } from '../js/overlays.js';
import { useStrings } from '../hooks/use-strings.jsx';

// The eleven overlays, React channel [L8, TH35].
//
// One file rather than eleven: each of these is a dozen lines, and what
// matters about them is that they agree with the framework-free channel,
// which is easier to see when they sit together. The seven base
// components stayed one per file because each is used on its own.
//
// The behaviour these lean on is the platform's, not ours: <dialog>
// traps focus, closes on Escape and returns focus to the opener; popover
// light-dismisses; <details> is a disclosure. A hand-written focus trap
// is how focus traps break, so there is none here.

/**
 * @param {{ open: boolean, onClose: () => void, title: string, className?: string, children?: import('react').ReactNode, actions?: import('react').ReactNode }} props
 */
export function Dialog({ open, onClose, title, className = '', children, actions }) {
    /** @type {import('react').RefObject<HTMLDialogElement | null>} */
    const ref = useRef(null);
    const labelId = useId();

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        // showModal(), not show(): only the modal form makes the rest of
        // the page inert and returns focus on close.
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog ref={ref} className={`kp-dialog ${className}`.trim()} aria-labelledby={labelId} onClose={onClose} onCancel={onClose}>
            <h2 className="kp-dialog__title" id={labelId}>
                {title}
            </h2>
            <div>{children}</div>
            <div className="kp-dialog__actions">{actions}</div>
        </dialog>
    );
}

/**
 * A menu on the popover layer. `popover="auto"` gives light dismiss,
 * Escape, and focus restoration; anchor positioning puts it under the
 * trigger without either measuring the other.
 *
 * @param {{ label: string, items: {label: string, onSelect?: () => void}[], className?: string }} props
 */
export function DropdownMenu({ label, items, className = '' }) {
    const id = useId().replace(/:/g, '');
    return (
        <>
            <button type="button" className={`kp-button ${className}`.trim()} popoverTarget={id} style={{ anchorName: `--${id}` }}>
                {label}
            </button>
            <div popover="auto" id={id} className="kp-popover" style={{ positionAnchor: `--${id}` }}>
                <ul className="kp-menu">
                    {items.map((item) => (
                        <li key={item.label}>
                            <button type="button" className="kp-menu__item" onClick={item.onSelect}>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

/**
 * A tooltip is a description, so it is wired with aria-describedby and
 * never carries the only copy of anything: a tooltip that holds the
 * label is unreachable by touch.
 *
 * @param {{ text: string, children: import('react').ReactNode }} props
 */
export function Tooltip({ text, children }) {
    const id = useId().replace(/:/g, '');
    const [shown, setShown] = useState(false);
    return (
        <span style={{ anchorName: `--${id}` }} onMouseEnter={() => setShown(true)} onMouseLeave={() => setShown(false)}>
            <span aria-describedby={id} onFocus={() => setShown(true)} onBlur={() => setShown(false)}>
                {children}
            </span>
            <span role="tooltip" id={id} hidden={!shown} className="kp-popover kp-tooltip" style={{ positionAnchor: `--${id}` }}>
                {text}
            </span>
        </span>
    );
}

/**
 * @param {{ messages: {id: string|number, text: string}[] }} props
 */
export function Toasts({ messages }) {
    // role="status", not alert: a toast is an announcement, and alert
    // interrupts whatever a screen reader was in the middle of saying.
    return (
        <div className="kp-toasts" role="status" aria-live="polite">
            {messages.map((m) => (
                <div className="kp-toast" key={m.id}>
                    {m.text}
                </div>
            ))}
        </div>
    );
}

export { TOAST_MS };

/**
 * @param {{ items: {summary: string, body: import('react').ReactNode}[], className?: string }} props
 */
export function Accordion({ items, className = '' }) {
    return (
        <div className={`kp-accordion ${className}`.trim()}>
            {items.map((item) => (
                <details className="kp-accordion__item" key={item.summary}>
                    <summary className="kp-accordion__summary">{item.summary}</summary>
                    <div className="kp-accordion__body">{item.body}</div>
                </details>
            ))}
        </div>
    );
}

/**
 * Tabs with a roving tabindex: one stop in the tab order, arrows to move.
 * Without it a keyboard user presses Tab once per tab to get past a row.
 *
 * @param {{ tabs: {label: string, panel: import('react').ReactNode}[], className?: string }} props
 */
export function Tabs({ tabs, className = '' }) {
    const base = useId().replace(/:/g, '');
    const [active, setActive] = useState(0);
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const list = useRef(null);

    /** @param {import('react').KeyboardEvent} e */
    const onKey = (e) => {
        const move = { ArrowRight: 1, ArrowLeft: -1, Home: -active, End: tabs.length - 1 - active }[e.key];
        if (move === undefined) return;
        e.preventDefault();
        const next = (active + move + tabs.length) % tabs.length;
        setActive(next);
        /** @type {HTMLElement | null | undefined} */ (list.current?.querySelectorAll('[role="tab"]')[next])?.focus();
    };

    return (
        <div className={`kp-tabs ${className}`.trim()}>
            <div className="kp-tabs__list" role="tablist" ref={list} onKeyDown={onKey}>
                {tabs.map((tab, i) => (
                    <button
                        type="button"
                        key={tab.label}
                        className="kp-tab"
                        role="tab"
                        id={`${base}-tab-${i}`}
                        aria-controls={`${base}-panel-${i}`}
                        aria-selected={i === active}
                        tabIndex={i === active ? 0 : -1}
                        onClick={() => setActive(i)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            {tabs.map((tab, i) => (
                <div
                    className="kp-tabs__panel"
                    key={tab.label}
                    role="tabpanel"
                    id={`${base}-panel-${i}`}
                    aria-labelledby={`${base}-tab-${i}`}
                    hidden={i !== active}
                >
                    {tab.panel}
                </div>
            ))}
        </div>
    );
}

/**
 * The same `linkComponent` escape as NavBar: a breadcrumb inside a router
 * application is a route, not a page load.
 *
 * @param {{ items: {href?: string, label: string}[], linkComponent?: import('react').ElementType, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export function Breadcrumb({ items, linkComponent: Link = 'a', strings }) {
    const s = useStrings(strings);
    return (
        <nav className="kp-breadcrumb" aria-label={s.breadcrumb}>
            <ol>
                {items.map((item, i) => (
                    <li key={item.label}>
                        {item.href && i < items.length - 1 ? (
                            <Link href={item.href}>{item.label}</Link>
                        ) : (
                            <span aria-current="page">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

/** @param {{ pages: number, current: number, href?: (page: number) => string, linkComponent?: import('react').ElementType, strings?: Partial<import('../js/strings.js').Strings> }} props */
export function Pagination({ pages, current, href = (p) => `#page-${p}`, linkComponent: Link = 'a', strings }) {
    const s = useStrings(strings);
    return (
        <nav className="kp-pagination" aria-label={s.pagination}>
            <ul>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <li key={p}>
                        <Link href={href(p)} aria-current={p === current ? 'page' : undefined}>
                            {p}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

/** @param {{ value?: number, max?: number, label: string }} props */
export function Progress({ value, max = 100, label }) {
    // No value means indeterminate, and <progress> already says so; the
    // label is what makes it mean anything to a screen reader.
    return <progress className="kp-progress" value={value} max={max} aria-label={label} />;
}

/** @param {{ label?: string, strings?: Partial<import('../js/strings.js').Strings> }} props */
export function Spinner({ label, strings }) {
    const s = useStrings(strings);
    const text = label ?? s.busy;
    return <span className="kp-spinner" role="status" aria-label={text} />;
}

/** @param {{ width?: string, count?: number }} props */
export function Skeleton({ width = '100%', count = 1 }) {
    // aria-hidden: a skeleton is a placeholder for content that is not
    // there yet, and announcing it says nothing useful.
    return (
        <span aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <span className="kp-skeleton" key={i} style={{ width, marginBottom: '0.375rem' }} />
            ))}
        </span>
    );
}
