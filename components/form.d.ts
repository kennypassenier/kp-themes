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
 *   className?: string,
 * } & Record<string, unknown>} props
 */
export declare function FormField({ label, name, help, error, required, type, className, ...rest }: {
    label: string;
    name: string;
    help?: string;
    error?: string;
    required?: boolean;
    type?: string;
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
 *   className?: string,
 * }} props
 */
export declare function Form({ children, onValid, submitLabel, busyLabel, className }: {
    children: import('react').ReactNode;
    onValid?: (data: FormData) => void;
    submitLabel?: string;
    busyLabel?: string;
    className?: string;
}): import("react").JSX.Element;
