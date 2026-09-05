import { useCallback, useRef, useState } from 'react';

// The controlled / uncontrolled pair, once [KT6].
//
// Every piece of state a component owns — open, selected, sort, page,
// step, colour — can be the consumer's instead: pass `value` and
// `onChange` and the component renders what it is told; pass
// `defaultValue` or nothing and it keeps its own. This is the contract
// every mature library ships (Radix, React Aria, Ark, Mantine), and the
// audit found no component here that had it. Written once so that every
// component gets the same edge cases right: a controlled value never
// falls back to internal state mid-life, and onChange fires in both
// modes.

/**
 * @template T
 * @param {T | undefined} value the controlled value, or undefined for uncontrolled
 * @param {T} defaultValue the initial value when uncontrolled
 * @param {((next: T) => void) | undefined} [onChange]
 * @returns {[T, (next: T | ((current: T) => T)) => void, boolean]} state, setter, and whether it is controlled
 */
export function useControllable(value, defaultValue, onChange) {
    const [internal, setInternal] = useState(defaultValue);
    // Decided at mount, like React's own inputs: switching between the
    // two modes mid-life is the bug the warning exists for.
    const controlled = useRef(value !== undefined).current;
    const current = controlled ? /** @type {T} */ (value) : internal;
    const latest = useRef(current);
    latest.current = current;
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const set = useCallback(
        /** @param {T | ((current: T) => T)} next */
        (next) => {
            const resolved = typeof next === 'function' ? /** @type {(current: T) => T} */ (next)(latest.current) : next;
            if (!controlled) setInternal(resolved);
            if (!Object.is(resolved, latest.current)) onChangeRef.current?.(resolved);
        },
        [controlled],
    );

    return [current, set, controlled];
}
