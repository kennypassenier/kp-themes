import { useStrings } from '../hooks/use-strings.jsx';
// Alert [TH4, DI4].
//
// Four flavours, each of which names itself in text. An alert is a
// message rather than a control, which is why its surface has no derived
// hover or active state: deriving them produced colours whose own ink no
// longer read, and the gate caught the modelling mistake.

/** @param {import('../js/strings.js').Strings} s */
const labels = (s) => ({ success: s.alertSuccess, warning: s.alertWarning, info: s.alertInfo, destructive: s.alertError });

/**
 * @param {{ flavour?: 'success'|'warning'|'info'|'destructive', label?: string, strings?: Partial<import('../js/strings.js').Strings>, className?: string, children?: import('react').ReactNode }} props
 */
export default function Alert({ flavour, label, strings, className = '', children, ...rest }) {
    const s = useStrings(strings);
    const classes = ['kp-alert', flavour ? `kp-alert--${flavour}` : '', className].filter(Boolean).join(' ');
    const text = label ?? (flavour ? labels(s)[flavour] : undefined);

    return (
        <div className={classes} role={flavour === 'destructive' ? 'alert' : 'status'} data-kp-semantic={flavour ? '' : undefined} {...rest}>
            <span>
                {text && <span className="kp-alert__label">{text}: </span>}
                {children}
            </span>
        </div>
    );
}
