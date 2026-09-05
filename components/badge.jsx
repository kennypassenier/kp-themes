import { forwardRef, useEffect } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';

// Badge [TH2, DI4].
//
// JobTracker hand-wrote this as StatusPill.jsx. The contract it carries:
// a badge whose colour means something must also say what it means, or
// the seven status plates are one plate to a reader who cannot tell those
// colours apart.
//
// Since 3.0.0 [KT6]: a consumer's `style` merges with the status colours
// rather than replacing them, the token prefix is a prop, the element can
// be another, the contract error goes to a callback, and a ref is
// forwarded.

/**
 * @typedef {object} BadgeProps
 * @property {string} [status]
 * @property {string} [tokenPrefix]  The custom property family. Default `--status-`.
 * @property {import('react').ElementType} [as]  Default 'span'.
 * @property {(rule: 'DI4', message: string) => void} [onContractError]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {import('react').ReactNode} [children]
 */

/**
 * @param {BadgeProps & import('react').HTMLAttributes<HTMLElement>} props
 * @param {import('react').ForwardedRef<HTMLElement>} ref
 */
function BadgeInner({ status, tokenPrefix = '--status-', as: As = 'span', onContractError, strings, className = '', style, children, ...rest }, ref) {
    const s = useStrings(strings);
    const empty = typeof children === 'string' ? children.trim() === '' : children === undefined || children === null;
    const broken = status !== undefined && empty;

    useEffect(() => {
        if (!broken) return;
        if (onContractError) onContractError('DI4', s.contractSemantic);
        else console.error(`[kp-themes DI4] ${s.contractSemantic}`);
    }, [broken, onContractError, s]);

    const colours = status ? { background: `var(${tokenPrefix}${status})`, color: `var(${tokenPrefix}${status}-foreground)` } : {};

    return (
        <As
            ref={ref}
            className={`kp-badge ${className}`.trim()}
            style={{ ...colours, ...style }}
            data-kp-semantic={status === undefined ? undefined : ''}
            data-status={status}
            data-kp-contract-error={broken ? 'DI4' : undefined}
            {...rest}
        >
            {children}
        </As>
    );
}

const Badge = forwardRef(BadgeInner);
export default Badge;
