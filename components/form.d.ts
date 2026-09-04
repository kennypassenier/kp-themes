export type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FormState = {
    errors: Record<string, string>;
    validate: (el: Control) => void;
};
/**
 * One field: label, optional help, error, and the wiring between them.
 *
 * `type` is the control, not only the input type. Anything the browser
 * knows (`text`, `email`, `number`, …) renders an `<input>`; `select`,
 * `textarea`, `checkbox` and `radio` render what they say. Before this
 * the component rendered an `<input>` whatever it was told, so half of
 * every real form had to be written by hand beside it — losing the
 * label, the error and the describedby wiring that are the whole point.
 *
 * @param {{
 *   label: string,
 *   name: string,
 *   help?: string,
 *   error?: string,
 *   required?: boolean,
 *   type?: string,
 *   options?: { value: string, label: string, disabled?: boolean }[],
 *   children?: import('react').ReactNode,
 *   strings?: Partial<import('../js/strings.js').Strings>,
 *   className?: string,
 * } & Record<string, unknown>} props
 */
export declare function FormField({ label, name, help, error, required, type, options, children, strings, className, ...rest }: {
    label: string;
    name: string;
    help?: string;
    error?: string;
    required?: boolean;
    type?: string;
    options?: {
        value: string;
        label: string;
        disabled?: boolean;
    }[];
    children?: import('react').ReactNode;
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
