import { useEffect, useRef, useState } from 'react';
import { CONFIRM_WINDOW_MS } from '../js/components.js';

// Button [TH1, DI10].
//
// Renders the same class names as the framework-free channel, and behaves
// the same way when the destructive contract is broken: it does not throw.
// A page that mixes both channels must not be able to tell them apart,
// and one bad button should not take a dashboard down.

/**
 * @typedef {object} ButtonProps
 * @property {'default'|'primary'|'destructive'|'ghost'} [variant]
 * @property {string} [confirm]  Phrase shown on the first click; the second click acts [DI10].
 * @property {() => void} [onUndo]  Offered instead of a confirmation — SC 3.3.4 accepts either.
 * @property {number} [confirmWindowMs]
 */

/** @param {ButtonProps & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props */
export default function Button({
    variant = 'default',
    confirm,
    onUndo,
    confirmWindowMs = CONFIRM_WINDOW_MS,
    className = '',
    children,
    onClick,
    ...rest
}) {
    const [armed, setArmed] = useState(false);
    const timer = useRef(0);

    const broken = variant === 'destructive' && confirm === undefined && onUndo === undefined;

    useEffect(() => {
        if (!broken) return;
        console.error(
            '[kp-themes DI10] a destructive action must offer an undo (onUndo) or a confirmation (confirm="phrase"). ' +
                'SC 3.3.4 accepts either; it accepts neither of them missing.',
        );
    }, [broken]);

    useEffect(() => () => clearTimeout(timer.current), []);

    /** @param {import('react').MouseEvent<HTMLButtonElement>} event */
    const handle = (event) => {
        if (confirm !== undefined && !armed) {
            // The first click is the obstacle, not the action.
            event.preventDefault();
            setArmed(true);
            timer.current = window.setTimeout(() => setArmed(false), confirmWindowMs);
            return;
        }
        setArmed(false);
        clearTimeout(timer.current);
        onClick?.(event);
    };

    const classes = ['kp-button', variant === 'default' ? '' : `kp-button--${variant}`, className].filter(Boolean).join(' ');

    return (
        <button
            type="button"
            className={classes}
            disabled={broken || rest.disabled}
            data-kp-destructive={variant === 'destructive' ? '' : undefined}
            data-kp-confirm={confirm}
            data-kp-undo={onUndo ? '' : undefined}
            data-kp-armed={armed ? 'true' : undefined}
            data-kp-contract-error={broken ? 'DI10' : undefined}
            onBlur={() => setArmed(false)}
            {...rest}
            onClick={handle}
        >
            {armed ? confirm : children}
        </button>
    );
}
