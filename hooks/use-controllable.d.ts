/**
 * @template T
 * @param {T | undefined} value the controlled value, or undefined for uncontrolled
 * @param {T} defaultValue the initial value when uncontrolled
 * @param {((next: T) => void) | undefined} [onChange]
 * @returns {[T, (next: T | ((current: T) => T)) => void, boolean]} state, setter, and whether it is controlled
 */
export declare function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: ((next: T) => void) | undefined): [T, (next: T | ((current: T) => T)) => void, boolean];
