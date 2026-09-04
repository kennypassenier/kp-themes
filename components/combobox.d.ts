export type ComboboxOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
/**
 * @typedef {{ value: string, label: string, disabled?: boolean }} ComboboxOption
 */
/**
 * @param {{
 *   options: ComboboxOption[],
 *   label: string,
 *   tags?: boolean,
 *   value?: string,
 *   values?: string[],
 *   placeholder?: string,
 *   onChange?: (value: string, values: string[]) => void,
 *   strings?: Partial<import('../js/strings.js').Strings>,
 *   className?: string,
 * }} props
 */
export default function Combobox({ options, label, tags, value, values, placeholder, onChange, strings, className }: {
    options: ComboboxOption[];
    label: string;
    tags?: boolean;
    value?: string;
    values?: string[];
    placeholder?: string;
    onChange?: (value: string, values: string[]) => void;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
}): import("react").JSX.Element;
