import { forwardRef } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';
// Alert [TH4, DI4].
//
// Four flavours, each of which names itself in text. An alert is a
// message rather than a control, which is why its surface has no derived
// hover or active state: deriving them produced colours whose own ink no
// longer read, and the gate caught the modelling mistake.
//
// Since 3.0.0 [KT6]: the element can be another, the label's separator
// is a prop, there is an icon slot and a dismiss button, and a ref is
// forwarded.

/** @param {import('../js/strings.js').Strings} s */
const labels = (s) => ({ success: s.alertSuccess, warning: s.alertWarning, info: s.alertInfo, destructive: s.alertError });

/**
 * @typedef {object} AlertProps
 * @property {'success'|'warning'|'info'|'destructive'} [flavour]
 * @property {import('react').ReactNode} [label]
 * @property {string} [separator]  Between the label and the text. Default ": ".
 * @property {import('react').ReactNode} [icon]
 * @property {() => void} [onDismiss]  Renders a close button when given.
 * @property {import('react').ElementType} [as]  Default 'div'.
 * @property {{ label?: string, body?: string, icon?: string, close?: string }} [classNames]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').ReactNode} [children]
 */

/**
 * @param {AlertProps & import('react').HTMLAttributes<HTMLElement>} props
 * @param {import('react').ForwardedRef<HTMLElement>} ref
 */
function AlertInner(
    { flavour, label, separator = ': ', icon, onDismiss, as: As = 'div', classNames = {}, strings, className = '', children, ...rest },
    ref,
) {
    const s = useStrings(strings);
    const classes = ['kp-alert', flavour ? `kp-alert--${flavour}` : '', className].filter(Boolean).join(' ');
    const text = label ?? (flavour ? labels(s)[flavour] : undefined);

    return (
        <As ref={ref} className={classes} role={flavour === 'destructive' ? 'alert' : 'status'} data-kp-semantic={flavour ? '' : undefined} {...rest}>
            {icon && (
                <span className={`kp-alert__icon ${classNames.icon ?? ''}`.trim()} aria-hidden="true">
                    {icon}
                </span>
            )}
            <span className={`kp-alert__body ${classNames.body ?? ''}`.trim()}>
                {text && (
                    <span className={`kp-alert__label ${classNames.label ?? ''}`.trim()}>
                        {text}
                        {separator}
                    </span>
                )}
                {children}
            </span>
            {onDismiss && (
                <button
                    type="button"
                    className={`kp-icon-button kp-alert__close ${classNames.close ?? ''}`.trim()}
                    aria-label={s.close}
                    onClick={onDismiss}
                >
                    ×
                </button>
            )}
        </As>
    );
}

const Alert = forwardRef(AlertInner);
export default Alert;
