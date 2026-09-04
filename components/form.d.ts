export type FormState = {
    errors: Record<string, string>;
    validate: (el: HTMLInputElement) => void;
};
/**
 * One field: label, optional help, error, and the wiring between them.
 *
 * @param {{
 *   label: string,
 *   name: string,
 *   help?: string,
 *   error?: string,
 *   required?: boolean,
 *   type?: string,
 *   strings?: Partial<import('../js/strings.js').Strings>,
 *   className?: string,
 * } & Record<string, unknown>} props
 */
export declare function FormField({ label, name, help, error, required, type, strings, className, ...rest }: {
    label: string;
    name: string;
    help?: string;
    error?: string;
    required?: boolean;
    type?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
} & Record<string, unknown>): import("react").JSX.Element;
/**
 * A form that gathers its errors and takes focus to them.
 *
 * @param {{
 *   children: import('react').ReactNode,
 *   onValid?: (data: FormData) => void,
 *   submitLabel?: string,
 *   busyLabel?: string,
 *   strings?: Partial<import('../js/strings.js').Strings>,
 *   className?: string,
 * }} props
 */
export declare function Form({ children, onValid, submitLabel, busyLabel, strings, className }: {
    children: import('react').ReactNode;
    onValid?: (data: FormData) => void;
    submitLabel?: string;
    busyLabel?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
}): import("react").JSX.Element;
