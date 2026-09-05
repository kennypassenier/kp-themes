export type ComboboxOption = {
    value: string;
    label: string;
    disabled?: boolean;
    group?: string;
};
export type Matcher = (label: string, query: string, option: ComboboxOption) => boolean;
/**
 * @typedef {{ value: string, label: string, disabled?: boolean, group?: string }} ComboboxOption
 */
/** @typedef {(label: string, query: string, option: ComboboxOption) => boolean} Matcher */
/** @type {Record<string, Matcher>} */
export declare const MATCHERS: Record<string, Matcher>;
export type ComboboxProps = {
    options: ComboboxOption[];
    label: string;
    tags?: boolean;
    /**
     * Controlled text (combobox) — the query.
     */
    value?: string;
    defaultValue?: string;
    onQueryChange?: (query: string) => void;
    /**
     * Controlled chosen values (tags).
     */
    values?: string[];
    defaultValues?: string[];
    onChange?: (value: string, values: string[], action: 'add' | 'remove' | 'clear' | 'create') => void;
    /**
     * Controlled.
     */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * Default substring.
     */
    match?: keyof typeof MATCHERS | Matcher;
    /**
     * Default true.
     */
    openOnFocus?: boolean;
    /**
     * Default true.
     */
    closeOnBlur?: boolean;
    /**
     * Default true.
     */
    backspaceRemoves?: boolean;
    /**
     * Keep the list open after adding a tag. Default true.
     */
    stayOpen?: boolean;
    maxTags?: number;
    allowDuplicates?: boolean;
    /**
     * Enter on no match creates the typed value.
     */
    creatable?: boolean;
    /**
     * A clear button on the combobox.
     */
    clearable?: boolean;
    /**
     * Arrow keys wrap. Default true.
     */
    loop?: boolean;
    /**
     * Says so in the status line instead of a count.
     */
    loading?: boolean;
    /**
     * A hidden input carries the value(s) for a plain <form>.
     */
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    renderOption?: (option: ComboboxOption, state: {
        active: boolean;
        selected: boolean;
    }) => import('react').ReactNode;
    renderTag?: (value: string, label: string, remove: () => void) => import('react').ReactNode;
    removeGlyph?: import('react').ReactNode;
    clearGlyph?: import('react').ReactNode;
    inputProps?: Record<string, unknown>;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
    classNames?: {
        label?: string;
        input?: string;
        list?: string;
        option?: string;
        tag?: string;
        status?: string;
    };
};
declare const Combobox: import("react").ForwardRefExoticComponent<ComboboxProps & import("react").RefAttributes<HTMLInputElement>>;
export default Combobox;
