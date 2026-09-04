import { createContext, useContext, useMemo } from 'react';
import { DEFAULT_STRINGS, getStrings, resolveStrings } from '../js/strings.js';

// The React side of the string dictionary [KT5].
//
// Three layers, and a component reads whichever is nearest: a `strings`
// prop wins over a provider, and a provider wins over whatever
// `setStrings()` put in place globally. A consumer that mounts nothing
// gets the English defaults, so this file costs an existing page nothing.
//
// The provider exists because passing the same object into every
// component is the kind of chore people do twice and then stop doing,
// which is how half a page ends up in one language.

/** @type {import('react').Context<Partial<import('../js/strings.js').Strings> | null>} */
const StringsContext = createContext(/** @type {Partial<import('../js/strings.js').Strings> | null} */ (null));

/**
 * @param {{ value: Partial<import('../js/strings.js').Strings>, children: import('react').ReactNode }} props
 */
export function StringsProvider({ value, children }) {
    // Memoised on the object identity the consumer passes: a fresh object
    // every render would re-render every component under it.
    const merged = useMemo(() => value, [value]);
    return <StringsContext.Provider value={merged}>{children}</StringsContext.Provider>;
}

/**
 * The strings for this component: global, then provider, then prop.
 *
 * @param {Partial<import('../js/strings.js').Strings>} [overrides] the component's own `strings` prop
 * @returns {import('../js/strings.js').Strings}
 */
export function useStrings(overrides) {
    const fromProvider = useContext(StringsContext);
    return useMemo(() => {
        const base = resolveStrings(fromProvider ?? undefined);
        return overrides === undefined ? base : { ...base, ...overrides };
    }, [fromProvider, overrides]);
}

export { DEFAULT_STRINGS, getStrings };
