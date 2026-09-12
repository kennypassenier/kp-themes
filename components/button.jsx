import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { CONFIRM_WINDOW_MS, openConfirmation } from '../js/components.js';
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
// Since 4.0.0 [TH107, AR27, AR29]: the default obstacle is the modal
// dialog, opened through the same `openConfirmation` the framework-free
// channel uses, so both channels are one implementation and cannot drift.
// `confirmMode="inline"` keeps the arm-then-act of 3.x. And the element
// says who owns its confirmation, because js/auto.js attaches the module
// over the whole document: without the mark the two channels re-armed
// each other's button forever and the action never fired.
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
 * @property {'sm'|'md'|'lg'} [size]  The size scale [TH111]. Default 'md', the unmodified button.
 * @property {string} [confirm]  Phrase shown on the first click; the second click acts [DI10].
 * @property {() => void} [onUndo]  Offered instead of a confirmation — SC 3.3.4 accepts either. Called if the person takes the undo.
 * @property {number} [undoMs]  How long the undo is offered. Default UNDO_MS.
 * @property {import('react').ReactNode} [undoLabel]  Default: the dictionary's `undo`.
 * @property {number} [confirmWindowMs]  How long `confirmMode="inline"` stays armed.
 * @property {'dialog'|'inline'} [confirmMode]  Default 'dialog': a modal <dialog> [TH107]. 'inline' is 3.x's arm-then-act.
 * @property {(dialog: HTMLDialogElement) => void} [onConfirmOpen]  Handed the dialog this opened, so the state has a way out [KT6].
 * @property {() => void} [onConfirmCancel]  Escape or Cancel. The action does not run.
 * @property {string} [confirmDialogClassName]
 * @property {boolean} [armed]  Controlled armed state (`confirmMode="inline"` only).
 * @property {(armed: boolean) => void} [onArmedChange]
 * @property {boolean} [disarmOnBlur]  Default true.
 * @property {(rule: 'DI10', message: string) => void} [onContractError]  Default: console.error.
 * @property {import('react').ElementType} [as]  Default 'button'.
 * @property {import('react').ReactNode} [readout]  A small reading a theme may print beside the control [scope-16, scope-17]. The consumer's own text; nothing is written for it.
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 */

/**
 * @param {ButtonProps & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props
 * @param {import('react').ForwardedRef<HTMLButtonElement>} ref
 */
function ButtonInner(
    {
        variant = 'default',
        size = 'md',
        confirm,
        onUndo,
        undoMs = UNDO_MS,
        undoLabel,
        confirmWindowMs = CONFIRM_WINDOW_MS,
        confirmMode = 'dialog',
        onConfirmOpen,
        onConfirmCancel,
        confirmDialogClassName = '',
        armed: armedProp,
        onArmedChange,
        disarmOnBlur = true,
        onContractError,
        as: As = 'button',
        readout,
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
    // AR27's one-shot lock, this channel's half: Confirm re-fires the
    // click on the element so a consumer's ordinary onClick runs, and
    // this lets that one click through. Cleared on the tick it is
    // consumed — never on a timer, or the button stays unguarded.
    const unlocked = useRef(false);
    /** @type {import('react').RefObject<HTMLDialogElement | null>} */
    const dialog = useRef(null);
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
            // Nothing this component opened outlives it [KT6].
            dialog.current?.close('');
        },
        [],
    );

    /** @param {import('react').MouseEvent<HTMLButtonElement>} event */
    const handle = (event) => {
        if (confirm !== undefined && confirmMode === 'dialog') {
            if (unlocked.current)
                unlocked.current = false; // the re-fired click, through untouched
            else {
                // The click is the question, not the action.
                event.preventDefault();
                const element = inner.current;
                if (element === null) return;
                dialog.current = openConfirmation(element, {
                    phrase: confirm,
                    strings: s,
                    className: confirmDialogClassName,
                    onCancel: () => {
                        dialog.current = null;
                        onConfirmCancel?.();
                    },
                    onAccept: () => {
                        dialog.current = null;
                        unlocked.current = true;
                        element.click();
                    },
                });
                onConfirmOpen?.(dialog.current);
                return;
            }
        } else if (confirm !== undefined && !armed) {
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

    // 'md' is the unmodified button, so it adds no class: the middle
    // step of the scale is what .kp-button already was [TH111].
    const classes = ['kp-button', variant === 'default' ? '' : `kp-button--${variant}`, size === 'md' ? '' : `kp-button--${size}`, className]
        .filter(Boolean)
        .join(' ');

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
                // AR29: this channel owns this button's confirmation, so
                // the framework-free module skips it.
                data-kp-confirm-owner={confirm === undefined ? undefined : 'react'}
                data-kp-undo={onUndo ? '' : undefined}
                data-kp-armed={armed && confirmMode === 'inline' ? 'true' : undefined}
                data-kp-contract-error={broken ? 'DI10' : undefined}
                onBlur={(/** @type {import('react').FocusEvent<HTMLButtonElement>} */ event) => {
                    if (disarmOnBlur) setArmed(false);
                    onBlur?.(event);
                }}
                onClick={handle}
            >
                {/* Two surfaces a theme may paint on, and nothing else
                    [scope-16, scope-17, Kenny 2026-09-12]. Both approved
                    concept demos of round seven put an oxide film along the
                    control's edge AND a small reading above it, which is one
                    surface more than a button's two pseudo-elements can
                    carry — the spectral instrument already spends both on
                    its brackets. They are empty, inert and invisible in
                    every theme that does not style them.

                    `readout` is a consumer's own text, so nothing is written
                    here [KT5]: the element exists, and whoever wants a word
                    in it passes one. */}
                <span className="kp-button__edge" aria-hidden="true" />
                {readout === undefined ? null : (
                    <span className="kp-button__readout" aria-hidden="true">
                        {readout}
                    </span>
                )}
                {/* The label in its own element [S49, A7]: phantom's approved
                    demo skews the button itself and skews the label back,
                    which needs something around the words to skew. Inert
                    in every other theme. */}
                <span className="kp-button__label">{armed && confirmMode === 'inline' ? confirm : children}</span>
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
