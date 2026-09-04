import { DEFAULT_STRINGS, getStrings } from '../js/strings.js';
/**
 * @param {{ value: Partial<import('../js/strings.js').Strings>, children: import('react').ReactNode }} props
 */
export declare function StringsProvider({ value, children }: {
    value: Partial<import('../js/strings.js').Strings>;
    children: import('react').ReactNode;
}): import("react").JSX.Element;
/**
 * The strings for this component: global, then provider, then prop.
 *
 * @param {Partial<import('../js/strings.js').Strings>} [overrides] the component's own `strings` prop
 * @returns {import('../js/strings.js').Strings}
 */
export declare function useStrings(overrides?: Partial<import('../js/strings.js').Strings>): import('../js/strings.js').Strings;
export { DEFAULT_STRINGS, getStrings };
