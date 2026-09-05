import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import { TOAST_MS } from '../js/overlays.js';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

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
//
// Since 3.0.0 [KT6]: every state has a controlled and an uncontrolled
// form, every component forwards a ref and passes className, style and
// the rest to its root, and what the audit found welded shut is a prop
// — Escape on a dialog with unsaved changes, a tab list in manual
// activation, a tooltip with a delay, a toast that is an error, a
// pagination with five hundred pages.

/**
 * @typedef {object} DialogProps
 * @property {boolean} [open]           Controlled.
 * @property {boolean} [defaultOpen]
 * @property {(open: boolean, reason: 'escape' | 'close' | 'action') => void} [onOpenChange]
 * @property {() => void} [onClose]     Kept from 1.x: called when the dialog closed.
 * @property {import('react').ReactNode} title
 * @property {1 | 2 | 3 | 4 | 5 | 6} [headingLevel]  Default 2.
 * @property {import('react').ReactNode} [description]
 * @property {boolean} [modal]          Default true.
 * @property {boolean} [closeOnEscape]  Default true. False keeps the dialog open on Escape — an unsaved-changes guard.
 * @property {boolean} [closeButton]    A close button in the header. Default false.
 * @property {import('react').RefObject<HTMLElement | null>} [initialFocus]
 * @property {import('react').ReactNode} [actions]
 * @property {import('react').ReactNode} [children]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {{ title?: string, body?: string, actions?: string, close?: string }} [classNames]
 */

/**
 * @param {DialogProps} props
 * @param {import('react').ForwardedRef<HTMLDialogElement>} ref
 */
function DialogInner(
    {
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        onClose,
        title,
        headingLevel = 2,
        description,
        modal = true,
        closeOnEscape = true,
        closeButton = false,
        initialFocus,
        actions,
        children,
        strings,
        className = '',
        style,
        classNames = {},
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    /** @type {import('react').RefObject<HTMLDialogElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDialogElement} */ (inner.current), []);
    const labelId = useId();
    const descriptionId = useId();
    const [open, setOpen] = useControllable(openProp, defaultOpen, undefined);
    const Heading = /** @type {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} */ (`h${headingLevel}`);

    useEffect(() => {
        const dialog = inner.current;
        if (!dialog) return;
        // showModal(), not show(): only the modal form makes the rest of
        // the page inert and returns focus on close.
        if (open && !dialog.open) {
            if (modal) dialog.showModal();
            else dialog.show();
            initialFocus?.current?.focus();
        }
        if (!open && dialog.open) dialog.close();
    }, [open, modal, initialFocus]);

    /** @param {'escape' | 'close' | 'action'} reason */
    const close = (reason) => {
        setOpen(false);
        onOpenChange?.(false, reason);
        onClose?.();
    };

    return (
        <dialog
            ref={inner}
            className={`kp-dialog ${className}`.trim()}
            style={style}
            aria-labelledby={labelId}
            aria-describedby={description ? descriptionId : undefined}
            onClose={() => {
                // The browser closed it (Escape, or a form method=dialog):
                // the state follows.
                if (open) close('close');
            }}
            onCancel={(event) => {
                if (!closeOnEscape) {
                    event.preventDefault();
                    return;
                }
                event.preventDefault();
                close('escape');
            }}
            {...rest}
        >
            <Heading className={`kp-dialog__title ${classNames.title ?? ''}`.trim()} id={labelId}>
                {title}
            </Heading>
            {closeButton && (
                <button
                    type="button"
                    className={`kp-icon-button kp-dialog__close ${classNames.close ?? ''}`.trim()}
                    aria-label={s.close}
                    onClick={() => close('close')}
                >
                    ×
                </button>
            )}
            {description && (
                <p className="kp-dialog__description" id={descriptionId}>
                    {description}
                </p>
            )}
            <div className={`kp-dialog__body ${classNames.body ?? ''}`.trim()}>{children}</div>
            {actions && <div className={`kp-dialog__actions ${classNames.actions ?? ''}`.trim()}>{actions}</div>}
        </dialog>
    );
}
export const Dialog = forwardRef(DialogInner);

/** @typedef {{ label: import('react').ReactNode, onSelect?: () => void, disabled?: boolean, icon?: import('react').ReactNode, destructive?: boolean, separator?: boolean, id?: string }} MenuItem */

/**
 * A menu on the popover layer. `popover="auto"` gives light dismiss,
 * Escape, and focus restoration; anchor positioning puts it under the
 * trigger without either measuring the other.
 *
 * @typedef {object} DropdownMenuProps
 * @property {import('react').ReactNode} label
 * @property {MenuItem[]} items
 * @property {boolean} [open]           Controlled.
 * @property {(open: boolean) => void} [onOpenChange]
 * @property {boolean} [closeOnSelect]  Default true.
 * @property {'auto' | 'manual'} [dismiss]  The popover mode. Default auto (light dismiss).
 * @property {(props: { popoverTarget: string, style: import('react').CSSProperties, 'aria-haspopup': 'menu', 'aria-expanded': boolean }) => import('react').ReactNode} [renderTrigger]
 * @property {(item: MenuItem) => import('react').ReactNode} [renderItem]
 * @property {string} [id]
 * @property {string} [className]       On the trigger, as in 1.x.
 * @property {string} [menuClassName]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * @param {DropdownMenuProps} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref the popover element
 */
function DropdownMenuInner(
    {
        label,
        items,
        open: openProp,
        onOpenChange,
        closeOnSelect = true,
        dismiss = 'auto',
        renderTrigger,
        renderItem,
        id: idProp,
        className = '',
        menuClassName = '',
        style,
        ...rest
    },
    ref,
) {
    const generated = useId().replace(/:/g, '');
    const id = idProp ?? generated;
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLDivElement} */ (inner.current), []);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const popover = inner.current;
        if (!popover) return;
        /** @param {Event} e */
        const onToggle = (e) => {
            const next = /** @type {ToggleEvent} */ (e).newState === 'open';
            setOpen(next);
            onOpenChange?.(next);
        };
        popover.addEventListener('toggle', onToggle);
        return () => popover.removeEventListener('toggle', onToggle);
    }, [onOpenChange]);
    useEffect(() => {
        const popover = inner.current;
        if (!popover || openProp === undefined) return;
        if (openProp && !popover.matches(':popover-open')) popover.showPopover();
        if (!openProp && popover.matches(':popover-open')) popover.hidePopover();
    }, [openProp]);

    const triggerProps = /** @type {const} */ ({
        popoverTarget: id,
        style: { anchorName: `--${id}`, ...style },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
    });

    return (
        <>
            {renderTrigger ? (
                renderTrigger(triggerProps)
            ) : (
                <button type="button" className={`kp-button ${className}`.trim()} {...triggerProps}>
                    {label}
                </button>
            )}
            <div
                ref={inner}
                popover={dismiss}
                id={id}
                className={`kp-popover ${menuClassName}`.trim()}
                style={{ positionAnchor: `--${id}` }}
                {...rest}
            >
                <ul className="kp-menu" role="menu">
                    {items.map((item, i) =>
                        item.separator ? (
                            <li key={item.id ?? `separator-${i}`} role="separator" className="kp-menu__separator" />
                        ) : (
                            <li key={item.id ?? (typeof item.label === 'string' ? item.label : i)} role="none">
                                {renderItem ? (
                                    renderItem(item)
                                ) : (
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className={`kp-menu__item ${item.destructive ? 'kp-menu__item--destructive' : ''}`.trim()}
                                        disabled={item.disabled}
                                        onClick={() => {
                                            item.onSelect?.();
                                            if (closeOnSelect) inner.current?.hidePopover();
                                        }}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                )}
                            </li>
                        ),
                    )}
                </ul>
            </div>
        </>
    );
}
export const DropdownMenu = forwardRef(DropdownMenuInner);

/**
 * A tooltip is a description, so it is wired with aria-describedby and
 * never carries the only copy of anything: a tooltip that holds the
 * label is unreachable by touch.
 *
 * @typedef {object} TooltipProps
 * @property {import('react').ReactNode} text
 * @property {import('react').ReactNode} children
 * @property {boolean} [open]           Controlled.
 * @property {(open: boolean) => void} [onOpenChange]
 * @property {number} [openDelayMs]     Default 300: a toolbar with instant tooltips is a flicker storm.
 * @property {number} [closeDelayMs]    Default 100.
 * @property {boolean} [closeOnEscape]  Default true — WCAG 1.4.13 asks for it.
 * @property {boolean} [interactive]    The pointer may move into the tooltip. Default false.
 * @property {import('react').ElementType} [as]  The wrapper element. Default span.
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {string} [tooltipClassName]
 */

/**
 * @param {TooltipProps} props
 * @param {import('react').ForwardedRef<HTMLElement>} ref
 */
function TooltipInner(
    {
        text,
        children,
        open: openProp,
        onOpenChange,
        openDelayMs = 300,
        closeDelayMs = 100,
        closeOnEscape = true,
        interactive = false,
        as: As = 'span',
        className = '',
        style,
        tooltipClassName = '',
        ...rest
    },
    ref,
) {
    const id = useId().replace(/:/g, '');
    const [shown, setShown] = useControllable(openProp, false, onOpenChange);
    const timer = useRef(0);
    /** @type {import('react').RefObject<HTMLElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLElement} */ (inner.current), []);
    useEffect(() => () => clearTimeout(timer.current), []);
    /** @param {boolean} next @param {number} delay */
    const schedule = (next, delay) => {
        clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setShown(next), delay);
    };
    useEffect(() => {
        if (!shown || !closeOnEscape) return;
        /** @param {KeyboardEvent} e */
        const onKey = (e) => {
            if (e.key === 'Escape') setShown(false);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shown, closeOnEscape]);

    return (
        <As
            ref={inner}
            className={`kp-tooltip-anchor ${className}`.trim()}
            style={{ anchorName: `--${id}`, ...style }}
            onMouseEnter={() => schedule(true, openDelayMs)}
            onMouseLeave={() => schedule(false, closeDelayMs)}
            {...rest}
        >
            <span aria-describedby={id} onFocus={() => schedule(true, 0)} onBlur={() => schedule(false, 0)}>
                {children}
            </span>
            <span
                role="tooltip"
                id={id}
                hidden={!shown}
                className={`kp-popover kp-tooltip ${tooltipClassName}`.trim()}
                style={{ positionAnchor: `--${id}`, pointerEvents: interactive ? 'auto' : 'none' }}
            >
                {text}
            </span>
        </As>
    );
}
export const Tooltip = forwardRef(TooltipInner);

/** @typedef {{ id: string | number, text: import('react').ReactNode, variant?: 'info' | 'success' | 'warning' | 'error', action?: { label: string, onClick: () => void }, ms?: number }} ToastMessage */

/**
 * @typedef {object} ToastsProps
 * @property {ToastMessage[]} messages
 * @property {(id: string | number) => void} [onDismiss]  Called when a toast times out or is dismissed. Without it nothing auto-dismisses, as in 1.x.
 * @property {number} [ms]            Default TOAST_MS; 0 never dismisses.
 * @property {number} [max]           Show at most this many, newest last.
 * @property {boolean} [dismissible]  A close button per toast. Default false.
 * @property {'polite' | 'assertive'} [live]  Default polite; error toasts are announced assertively regardless.
 * @property {(message: ToastMessage, dismiss: () => void) => import('react').ReactNode} [renderToast]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * @param {ToastsProps} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function ToastsInner(
    { messages, onDismiss, ms = TOAST_MS, max, dismissible = false, live = 'polite', renderToast, strings, className = '', style, ...rest },
    ref,
) {
    const s = useStrings(strings);
    const shown = max === undefined ? messages : messages.slice(-max);
    // Auto-dismiss, finally used: TOAST_MS was exported beside a
    // component that never read it.
    useEffect(() => {
        if (!onDismiss) return;
        const timers = shown.map((m) => {
            const wait = m.ms ?? ms;
            return wait > 0 ? window.setTimeout(() => onDismiss(m.id), wait) : 0;
        });
        return () => timers.forEach((t) => clearTimeout(t));
    }, [shown, ms, onDismiss]);
    const polite = shown.filter((m) => m.variant !== 'error');
    const urgent = shown.filter((m) => m.variant === 'error');
    /** @param {ToastMessage} m */
    const toast = (m) => (
        <div className={`kp-toast ${m.variant ? `kp-toast--${m.variant}` : ''}`.trim()} key={m.id} data-kp-variant={m.variant}>
            {renderToast ? (
                renderToast(m, () => onDismiss?.(m.id))
            ) : (
                <>
                    {m.text}
                    {m.action && (
                        <button type="button" className="kp-button kp-button--ghost" onClick={m.action.onClick}>
                            {m.action.label}
                        </button>
                    )}
                    {dismissible && (
                        <button type="button" className="kp-icon-button kp-toast__close" aria-label={s.close} onClick={() => onDismiss?.(m.id)}>
                            ×
                        </button>
                    )}
                </>
            )}
        </div>
    );
    // role="status", not alert, for the ordinary ones: a toast is an
    // announcement, and alert interrupts whatever a screen reader was in
    // the middle of saying. An error is the exception and gets its own
    // region, so the politeness is per message rather than per page.
    return (
        <>
            <div ref={ref} className={`kp-toasts ${className}`.trim()} style={style} role="status" aria-live={live} {...rest}>
                {polite.map(toast)}
            </div>
            {urgent.length > 0 && (
                <div className={`kp-toasts kp-toasts--assertive ${className}`.trim()} role="alert" aria-live="assertive">
                    {urgent.map(toast)}
                </div>
            )}
        </>
    );
}
export const Toasts = forwardRef(ToastsInner);

export { TOAST_MS };

/** @typedef {{ id?: string, summary: import('react').ReactNode, body: import('react').ReactNode, disabled?: boolean, className?: string }} AccordionItem */

/**
 * @typedef {object} AccordionProps
 * @property {AccordionItem[]} items
 * @property {string[]} [value]          Controlled: the open ids.
 * @property {string[]} [defaultValue]
 * @property {(open: string[]) => void} [onValueChange]
 * @property {'single' | 'multiple'} [type]  Default multiple.
 * @property {1 | 2 | 3 | 4 | 5 | 6} [headingLevel]  Wraps each summary in a heading of this level.
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * @param {AccordionProps} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function AccordionInner({ items, value, defaultValue = [], onValueChange, type = 'multiple', headingLevel, className = '', style, ...rest }, ref) {
    const [open, setOpen] = useControllable(value, defaultValue, onValueChange);
    const base = useId();
    const Heading = headingLevel ? /** @type {'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} */ (`h${headingLevel}`) : null;
    return (
        <div ref={ref} className={`kp-accordion ${className}`.trim()} style={style} {...rest}>
            {items.map((item, i) => {
                const id = item.id ?? `${base}-${i}`;
                const isOpen = open.includes(id);
                const summary = <summary className="kp-accordion__summary">{item.summary}</summary>;
                return (
                    <details
                        className={`kp-accordion__item ${item.className ?? ''}`.trim()}
                        key={id}
                        open={isOpen}
                        // The group name is what makes <details> exclusive
                        // in the platform itself.
                        name={type === 'single' ? `${base}-group` : undefined}
                        onToggle={(event) => {
                            const next = event.currentTarget.open;
                            if (next === isOpen) return;
                            if (next) setOpen(type === 'single' ? [id] : [...open, id]);
                            else setOpen(open.filter((o) => o !== id));
                        }}
                    >
                        {Heading ? <Heading className="kp-accordion__heading">{summary}</Heading> : summary}
                        <div className="kp-accordion__body">{item.body}</div>
                    </details>
                );
            })}
        </div>
    );
}
export const Accordion = forwardRef(AccordionInner);

/** @typedef {{ id?: string, label: import('react').ReactNode, panel: import('react').ReactNode, disabled?: boolean, icon?: import('react').ReactNode }} Tab */

/**
 * Tabs with a roving tabindex: one stop in the tab order, arrows to move.
 * Without it a keyboard user presses Tab once per tab to get past a row.
 *
 * @typedef {object} TabsProps
 * @property {Tab[]} tabs
 * @property {number} [value]            Controlled index.
 * @property {number} [defaultValue]     Default 0.
 * @property {(index: number) => void} [onChange]
 * @property {'automatic' | 'manual'} [activation]  Default automatic; manual moves focus with the arrows and selects on Enter or Space.
 * @property {'horizontal' | 'vertical'} [orientation]  Default horizontal.
 * @property {boolean} [loop]            Default true.
 * @property {boolean} [lazy]            Mount a panel the first time it is shown. Default false.
 * @property {boolean} [unmountHidden]   Unmount a panel when it hides. Default false.
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {{ list?: string, tab?: string, panel?: string }} [classNames]
 */

/**
 * @param {TabsProps} props
 * @param {import('react').ForwardedRef<HTMLDivElement>} ref
 */
function TabsInner(
    {
        tabs,
        value,
        defaultValue = 0,
        onChange,
        activation = 'automatic',
        orientation = 'horizontal',
        loop = true,
        lazy = false,
        unmountHidden = false,
        className = '',
        style,
        classNames = {},
        ...rest
    },
    ref,
) {
    const base = useId().replace(/:/g, '');
    const [active, setActive] = useControllable(value, defaultValue, onChange);
    const [focused, setFocused] = useState(active);
    const [mounted, setMounted] = useState(() => new Set([active]));
    /** @type {import('react').RefObject<HTMLDivElement | null>} */
    const list = useRef(null);
    useEffect(() => {
        setMounted((was) => (was.has(active) ? was : new Set([...was, active])));
    }, [active]);

    /** @param {number} index */
    const focusTab = (index) => {
        setFocused(index);
        /** @type {HTMLElement | null | undefined} */ (list.current?.querySelectorAll('[role="tab"]')[index])?.focus();
    };
    /** @param {import('react').KeyboardEvent} e */
    const onKey = (e) => {
        const current = activation === 'manual' ? focused : active;
        const next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
        const prev = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
        if (activation === 'manual' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setActive(focused);
            return;
        }
        const move = { [next]: 1, [prev]: -1, Home: -current, End: tabs.length - 1 - current }[e.key];
        if (move === undefined) return;
        e.preventDefault();
        let target = current + move;
        if (loop) target = (target + tabs.length) % tabs.length;
        else target = Math.max(0, Math.min(tabs.length - 1, target));
        if (tabs[target]?.disabled) return;
        if (activation === 'manual') focusTab(target);
        else {
            setActive(target);
            focusTab(target);
        }
    };

    return (
        <div ref={ref} className={`kp-tabs ${className}`.trim()} style={style} data-kp-orientation={orientation} {...rest}>
            <div
                className={`kp-tabs__list ${classNames.list ?? ''}`.trim()}
                role="tablist"
                aria-orientation={orientation}
                ref={list}
                onKeyDown={onKey}
            >
                {tabs.map((tab, i) => (
                    <button
                        type="button"
                        key={tab.id ?? i}
                        className={`kp-tab ${classNames.tab ?? ''}`.trim()}
                        role="tab"
                        id={`${base}-tab-${i}`}
                        aria-controls={`${base}-panel-${i}`}
                        aria-selected={i === active}
                        disabled={tab.disabled}
                        tabIndex={i === (activation === 'manual' ? focused : active) ? 0 : -1}
                        onClick={() => {
                            setActive(i);
                            setFocused(i);
                        }}
                        onFocus={() => setFocused(i)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
            {tabs.map((tab, i) => {
                const hidden = i !== active;
                if (hidden && ((lazy && !mounted.has(i)) || unmountHidden)) return null;
                return (
                    <div
                        className={`kp-tabs__panel ${classNames.panel ?? ''}`.trim()}
                        key={tab.id ?? i}
                        role="tabpanel"
                        id={`${base}-panel-${i}`}
                        aria-labelledby={`${base}-tab-${i}`}
                        hidden={hidden}
                    >
                        {tab.panel}
                    </div>
                );
            })}
        </div>
    );
}
export const Tabs = forwardRef(TabsInner);

/**
 * The same `linkComponent` escape as NavBar: a breadcrumb inside a router
 * application is a route, not a page load.
 *
 * @typedef {object} BreadcrumbProps
 * @property {{ href?: string, label: import('react').ReactNode, id?: string, icon?: import('react').ReactNode }[]} items
 * @property {import('react').ElementType} [linkComponent]
 * @property {boolean} [linkCurrent]  Render the last item as a link too. Default false.
 * @property {import('react').ReactNode} [separator]  Default: the stylesheet's.
 * @property {(item: BreadcrumbProps['items'][number], current: boolean) => import('react').ReactNode} [renderItem]
 * @property {string} [label]         Accessible name. Default: the dictionary's.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * @param {BreadcrumbProps} props
 * @param {import('react').ForwardedRef<HTMLElement>} ref
 */
function BreadcrumbInner(
    { items, linkComponent: Link = 'a', linkCurrent = false, separator, renderItem, label, strings, className = '', style, ...rest },
    ref,
) {
    const s = useStrings(strings);
    return (
        <nav
            ref={ref}
            className={`kp-breadcrumb ${className}`.trim()}
            style={style}
            aria-label={label ?? s.breadcrumb}
            data-kp-separator={separator ? '' : undefined}
            {...rest}
        >
            <ol>
                {items.map((item, i) => {
                    const current = i === items.length - 1;
                    return (
                        <li key={item.id ?? (typeof item.label === 'string' ? item.label : i)}>
                            {i > 0 && separator && (
                                <span className="kp-breadcrumb__separator" aria-hidden="true">
                                    {separator}
                                </span>
                            )}
                            {renderItem ? (
                                renderItem(item, current)
                            ) : item.href && (!current || linkCurrent) ? (
                                <Link href={item.href} aria-current={current ? 'page' : undefined}>
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ) : (
                                <span aria-current={current ? 'page' : undefined}>
                                    {item.icon}
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
export const Breadcrumb = forwardRef(BreadcrumbInner);

/**
 * Which page numbers to show: the first and last `boundary`, `siblings`
 * either side of the current one, and an ellipsis where a run is
 * skipped. Five hundred pages was five hundred links in 1.x.
 *
 * @param {number} pages @param {number} current @param {number} siblings @param {number} boundary
 * @returns {(number | 'gap')[]}
 */
export function pageRange(pages, current, siblings, boundary) {
    if (pages <= boundary * 2 + siblings * 2 + 3) return Array.from({ length: pages }, (_, i) => i + 1);
    /** @type {Set<number>} */
    const keep = new Set();
    for (let i = 1; i <= boundary; i++) keep.add(i);
    for (let i = pages - boundary + 1; i <= pages; i++) keep.add(i);
    for (let i = current - siblings; i <= current + siblings; i++) if (i >= 1 && i <= pages) keep.add(i);
    /** @type {(number | 'gap')[]} */
    const out = [];
    let last = 0;
    for (const p of [...keep].sort((a, b) => a - b)) {
        if (p - last === 2) out.push(last + 1);
        else if (p - last > 2) out.push('gap');
        out.push(p);
        last = p;
    }
    return out;
}

/**
 * @typedef {object} PaginationProps
 * @property {number} pages
 * @property {number} [current]         Controlled page (1-based).
 * @property {number} [defaultCurrent]  Default 1.
 * @property {(page: number) => void} [onPageChange]
 * @property {(page: number) => string} [href]
 * @property {import('react').ElementType} [linkComponent]
 * @property {number} [siblings]        Pages either side of the current. Default 1.
 * @property {number} [boundary]        Pages at each end. Default 1.
 * @property {boolean} [showPrevNext]   Default true.
 * @property {boolean} [showFirstLast]  Default false.
 * @property {import('react').ReactNode} [previousLabel]
 * @property {import('react').ReactNode} [nextLabel]
 * @property {string} [label]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/**
 * @param {PaginationProps} props
 * @param {import('react').ForwardedRef<HTMLElement>} ref
 */
function PaginationInner(
    {
        pages,
        current: currentProp,
        defaultCurrent = 1,
        onPageChange,
        href = (p) => `#page-${p}`,
        linkComponent: Link = 'a',
        siblings = 1,
        boundary = 1,
        showPrevNext = true,
        showFirstLast = false,
        previousLabel,
        nextLabel,
        label,
        strings,
        className = '',
        style,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const [current, setCurrent] = useControllable(currentProp, defaultCurrent, onPageChange);
    /** @param {number} p @param {import('react').MouseEvent} e */
    const go = (p, e) => {
        if (!onPageChange && currentProp === undefined) return;
        // A consumer that listens gets the click and keeps the URL to
        // itself; one that does not gets the plain link.
        e.preventDefault();
        setCurrent(p);
    };
    /** @param {number} p @param {import('react').ReactNode} text @param {string} [ariaLabel] */
    const link = (p, text, ariaLabel) => (
        <Link
            href={href(p)}
            aria-current={p === current ? 'page' : undefined}
            aria-label={ariaLabel}
            aria-disabled={p < 1 || p > pages ? 'true' : undefined}
            onClick={(/** @type {import('react').MouseEvent} */ e) => go(p, e)}
        >
            {text}
        </Link>
    );
    return (
        <nav ref={ref} className={`kp-pagination ${className}`.trim()} style={style} aria-label={label ?? s.pagination} {...rest}>
            <ul>
                {showFirstLast && current > 1 && <li key="first">{link(1, '«')}</li>}
                {showPrevNext && current > 1 && <li key="prev">{link(current - 1, previousLabel ?? s.previous)}</li>}
                {pageRange(pages, current, siblings, boundary).map((p, i) =>
                    p === 'gap' ? (
                        <li key={`gap-${i}`} className="kp-pagination__gap" aria-hidden="true">
                            …
                        </li>
                    ) : (
                        <li key={p}>{link(p, p)}</li>
                    ),
                )}
                {showPrevNext && current < pages && <li key="next">{link(current + 1, nextLabel ?? s.next)}</li>}
                {showFirstLast && current < pages && <li key="last">{link(pages, '»')}</li>}
            </ul>
        </nav>
    );
}
export const Pagination = forwardRef(PaginationInner);

/**
 * @typedef {object} ProgressProps
 * @property {number} [value]
 * @property {number} [max]
 * @property {string} label
 * @property {string} [valueText]    aria-valuetext, e.g. "3 of 10 files".
 * @property {boolean} [showValue]   Render the percentage beside the bar.
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */
/** @param {ProgressProps} props @param {import('react').ForwardedRef<HTMLProgressElement>} ref */
function ProgressInner({ value, max = 100, label, valueText, showValue = false, className = '', style, ...rest }, ref) {
    // No value means indeterminate, and <progress> already says so; the
    // label is what makes it mean anything to a screen reader.
    const bar = (
        <progress
            ref={ref}
            className={`kp-progress ${className}`.trim()}
            style={style}
            value={value}
            max={max}
            aria-label={label}
            aria-valuetext={valueText}
            {...rest}
        />
    );
    if (!showValue || value === undefined) return bar;
    return (
        <span className="kp-progress__wrap">
            {bar}
            <span className="kp-progress__value">{valueText ?? `${Math.round((value / max) * 100)}%`}</span>
        </span>
    );
}
export const Progress = forwardRef(ProgressInner);

/** @param {{ label?: string, size?: string, strings?: Partial<import('../js/strings.js').Strings>, className?: string, style?: import('react').CSSProperties }} props @param {import('react').ForwardedRef<HTMLSpanElement>} ref */
function SpinnerInner({ label, size, strings, className = '', style, ...rest }, ref) {
    const s = useStrings(strings);
    const text = label ?? s.busy;
    return (
        <span
            ref={ref}
            className={`kp-spinner ${className}`.trim()}
            style={/** @type {import('react').CSSProperties} */ ({ '--kp-spinner-size': size, ...style })}
            role="status"
            aria-label={text}
            {...rest}
        />
    );
}
export const Spinner = forwardRef(SpinnerInner);

/** @param {{ width?: string, height?: string, count?: number, shape?: 'line' | 'circle' | 'block', gap?: string, className?: string, style?: import('react').CSSProperties }} props @param {import('react').ForwardedRef<HTMLSpanElement>} ref */
function SkeletonInner({ width = '100%', height, count = 1, shape = 'line', gap, className = '', style, ...rest }, ref) {
    // aria-hidden: a skeleton is a placeholder for content that is not
    // there yet, and announcing it says nothing useful.
    return (
        <span
            ref={ref}
            aria-hidden="true"
            className={className}
            style={/** @type {import('react').CSSProperties} */ ({ '--kp-skeleton-gap': gap, ...style })}
            {...rest}
        >
            {Array.from({ length: count }, (_, i) => (
                <span className={`kp-skeleton kp-skeleton--${shape}`} key={i} style={{ width, height }} />
            ))}
        </span>
    );
}
export const Skeleton = forwardRef(SkeletonInner);
