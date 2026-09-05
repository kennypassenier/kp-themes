import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { CONFIRM_WINDOW_MS } from '../js/components.js';
import { UNDO_MS } from '../js/patterns.js';
import { useStrings } from '../hooks/use-strings.jsx';
import { useControllable } from '../hooks/use-controllable.js';

// Button [TH1, DI10].
//
// Renders the same class names as the framework-free channel, and behaves
// the same way when the destructive contract is broken: it does not throw.
// A page that mixes both channels must not be able to tell them apart,
// and one bad button should not take a dashboard down.
//
// Since 3.0.0 [KT6]: `onUndo` does something — for two versions it was
// declared, checked for truthiness to satisfy the contract, and never
// called. Now a destructive button with `onUndo` acts on the click and
// offers an undo for `undoMs`, calling `onUndo` if it is taken. The armed
// state is controllable, `onBlur` composes rather than replaces the
// disarm, `disabled={false}` can no longer re-enable a contract-broken
// button, the element can be another (`as`), and a ref is forwarded.

/**
 * @typedef {object} ButtonProps
 * @property {'default'|'primary'|'destructive'|'ghost'} [variant]
 * @property {string} [confirm]  Phrase shown on the first click; the second click acts [DI10].
 * @property {() => void} [onUndo]  Offered instead of a confirmation — SC 3.3.4 accepts either. Called if the person takes the undo.
 * @property {number} [undoMs]  How long the undo is offered. Default UNDO_MS.
 * @property {import('react').ReactNode} [undoLabel]  Default: the dictionary's `undo`.
 * @property {number} [confirmWindowMs]
 * @property {boolean} [armed]  Controlled armed state.
 * @property {(armed: boolean) => void} [onArmedChange]
 * @property {boolean} [disarmOnBlur]  Default true.
 * @property {(rule: 'DI10', message: string) => void} [onContractError]  Default: console.error.
 * @property {import('react').ElementType} [as]  Default 'button'.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 */

/**
 * @param {ButtonProps & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props
 * @param {import('react').ForwardedRef<HTMLButtonElement>} ref
 */
function ButtonInner(
    {
        variant = 'default',
        confirm,
        onUndo,
        undoMs = UNDO_MS,
        undoLabel,
        confirmWindowMs = CONFIRM_WINDOW_MS,
        armed: armedProp,
        onArmedChange,
        disarmOnBlur = true,
        onContractError,
        as: As = 'button',
        strings,
        className = '',
        children,
        onClick,
        onBlur,
        disabled,
        ...rest
    },
    ref,
) {
    const s = useStrings(strings);
    const [armed, setArmed] = useControllable(armedProp, false, onArmedChange);
    const [undoOpen, setUndoOpen] = useState(false);
    const timer = useRef(0);
    const undoTimer = useRef(0);
    /** @type {import('react').RefObject<HTMLButtonElement | null>} */
    const inner = useRef(null);
    useImperativeHandle(ref, () => /** @type {HTMLButtonElement} */ (inner.current), []);

    const broken = variant === 'destructive' && confirm === undefined && onUndo === undefined;

    useEffect(() => {
        if (!broken) return;
        const message = s.contractDestructive;
        if (onContractError) onContractError('DI10', message);
        else console.error(`[kp-themes DI10] ${message}`);
    }, [broken, onContractError, s]);

    useEffect(
        () => () => {
            clearTimeout(timer.current);
            clearTimeout(undoTimer.current);
        },
        [],
    );

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
        if (onUndo !== undefined && confirm === undefined) {
            // The action happened; the way back is offered for a while.
            setUndoOpen(true);
            clearTimeout(undoTimer.current);
            undoTimer.current = window.setTimeout(() => setUndoOpen(false), undoMs);
        }
    };

    const classes = ['kp-button', variant === 'default' ? '' : `kp-button--${variant}`, className].filter(Boolean).join(' ');

    return (
        <>
            <As
                type={As === 'button' ? 'button' : undefined}
                ref={inner}
                className={classes}
                {...rest}
                // After the rest, so a consumer cannot re-enable a
                // contract-broken button by accident [KT6].
                disabled={broken || disabled}
                data-kp-destructive={variant === 'destructive' ? '' : undefined}
                data-kp-confirm={confirm}
                data-kp-undo={onUndo ? '' : undefined}
                data-kp-armed={armed ? 'true' : undefined}
                data-kp-contract-error={broken ? 'DI10' : undefined}
                onBlur={(/** @type {import('react').FocusEvent<HTMLButtonElement>} */ event) => {
                    if (disarmOnBlur) setArmed(false);
                    onBlur?.(event);
                }}
                onClick={handle}
            >
                {armed ? confirm : children}
            </As>
            {undoOpen && (
                <span className="kp-button__undo" role="status" data-kp-undo-offer>
                    <button
                        type="button"
                        className="kp-button kp-button--ghost"
                        onClick={() => {
                            clearTimeout(undoTimer.current);
                            setUndoOpen(false);
                            onUndo?.();
                        }}
                    >
                        {undoLabel ?? s.undo}
                    </button>
                </span>
            )}
        </>
    );
}

const Button = forwardRef(ButtonInner);
export default Button;
