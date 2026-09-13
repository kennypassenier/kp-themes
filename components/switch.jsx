import { forwardRef, useId } from 'react';
import { useStrings } from '../hooks/use-strings.jsx';

// Switch [gap-11].
//
// A checkbox that says on and off instead of ticked. The control is a
// real `<input type="checkbox" role="switch">`, so it submits with a
// form, takes `checked` / `defaultChecked` / `onChange` like any checkbox,
// flips with Space, and a screen reader says "switch, on". The row is a
// `<label>`, so the whole of it is the target. The words beside the track
// come from the dictionary and are aria-hidden, because the role already
// announces the state [KT5, DI4].
//
// The same markup as the framework-free channel (css/components.css,
// `.kp-switch`), wrapped in a `.kp-field--check` so help and an error sit
// under the row and are wired through aria-describedby, as the checkbox
// in FormField is. The wrapper is always there, so a message that
// arrives does not remount the input and take focus with it.

/**
 * @typedef {object} SwitchProps
 * @property {import('react').ReactNode} label
 * @property {import('react').ReactNode} [help]
 * @property {import('react').ReactNode} [error]  Marks the switch invalid and says why.
 * @property {string} [id]
 * @property {boolean} [showState]  The On/Off word beside the track. Default true.
 * @property {import('react').HTMLAttributes<HTMLDivElement>} [wrapperProps]
 * @property {{ row?: string, input?: string, state?: string, label?: string, help?: string, error?: string }} [classNames]
 * @property {Partial<import('../js/strings.js').Strings>} [strings]
 * @property {string} [className]  On the wrapper.
 */

/**
 * @param {SwitchProps & Omit<import('react').InputHTMLAttributes<HTMLInputElement>, 'id' | 'type' | 'role' | 'className'>} props
 * @param {import('react').ForwardedRef<HTMLInputElement>} ref
 */
function SwitchInner({ label, help, error, id: idProp, showState = true, wrapperProps, classNames = {}, strings, className = '', ...rest }, ref) {
    const s = useStrings(strings);
    const generated = useId();
    const id = idProp ?? generated;
    const helpId = `${id}-help`;
    const errorId = `${id}-error`;
    const described = [rest['aria-describedby'], help && helpId, error && errorId].filter(Boolean).join(' ') || undefined;
    const { 'aria-describedby': _ignored, ...inputRest } = rest;

    return (
        <div
            {...wrapperProps}
            className={`kp-field kp-field--check ${error ? 'kp-field--invalid' : ''} ${className} ${wrapperProps?.className ?? ''}`.trim()}
        >
            <label className={`kp-switch ${classNames.row ?? ''}`.trim()} htmlFor={id}>
                <input
                    ref={ref}
                    {...inputRest}
                    id={id}
                    type="checkbox"
                    role="switch"
                    className={`kp-switch__input ${classNames.input ?? ''}`.trim()}
                    aria-describedby={described}
                    aria-invalid={error ? 'true' : inputRest['aria-invalid']}
                />
                {showState && (
                    <span className={`kp-switch__state ${classNames.state ?? ''}`.trim()} aria-hidden="true">
                        <span className="kp-switch__on">{s.switchOn}</span>
                        <span className="kp-switch__off">{s.switchOff}</span>
                    </span>
                )}
                <span className={classNames.label}>{label}</span>
            </label>
            {help && (
                <span className={`kp-field__help ${classNames.help ?? ''}`.trim()} id={helpId}>
                    {help}
                </span>
            )}
            {error && (
                <span className={`kp-field__error ${classNames.error ?? ''}`.trim()} id={errorId}>
                    {error}
                </span>
            )}
        </div>
    );
}

const Switch = forwardRef(SwitchInner);
export default Switch;
