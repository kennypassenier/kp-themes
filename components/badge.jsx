// Badge [TH2, DI4].
//
// JobTracker hand-wrote this as StatusPill.jsx. The contract it carries:
// a badge whose colour means something must also say what it means, or
// the seven status plates are one plate to a reader who cannot tell those
// colours apart.

/**
 * @param {{ status?: string, className?: string, children?: import('react').ReactNode }} props
 */
export default function Badge({ status, className = '', children, ...rest }) {
    const empty = typeof children === 'string' ? children.trim() === '' : children === undefined || children === null;
    const broken = status !== undefined && empty;

    if (broken) {
        console.error('[kp-themes DI4] a badge carrying a semantic colour must also say what it means: colour is never the only carrier.');
    }

    const style = status ? { background: `var(--status-${status})`, color: `var(--status-${status}-foreground)` } : undefined;

    return (
        <span
            className={`kp-badge ${className}`.trim()}
            style={style}
            data-kp-semantic={status === undefined ? undefined : ''}
            data-status={status}
            data-kp-contract-error={broken ? 'DI4' : undefined}
            {...rest}
        >
            {children}
        </span>
    );
}
