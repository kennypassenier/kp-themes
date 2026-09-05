export type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
export type FormState = {
    errors: Record<string, string>;
    validate: (el: Control) => void;
    revalidate: (el: Control) => void;
    validateOn: 'blur' | 'change' | 'submit';
};
export type FormFieldProps = {
    label: import('react').ReactNode;
    name: string;
    help?: import('react').ReactNode;
    error?: import('react').ReactNode;
    required?: boolean;
    /**
     * Show the word beside the label. Default true.
     */
    requiredIndicator?: boolean;
    labelHidden?: boolean;
    /**
     * The control: an input type, or select, textarea, checkbox, radio.
     */
    type?: string;
    options?: {
        value: string;
        label: import('react').ReactNode;
        disabled?: boolean;
        help?: import('react').ReactNode;
    }[];
    /**
     * For a radio group. Default stacked.
     */
    layout?: 'stacked' | 'inline';
    wrapperProps?: import('react').HTMLAttributes<HTMLElement>;
    classNames?: {
        label?: string;
        control?: string;
        help?: string;
        error?: string;
        option?: string;
    };
    children?: import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
};
export declare const FormField: import("react").ForwardRefExoticComponent<FormFieldProps & Omit<import("react").AllHTMLAttributes<HTMLElement>, "children" | "className" | "label" | "name" | "required" | "type" | "wrap"> & import("react").RefAttributes<Control>>;
export type FormProps = {
    children: import('react').ReactNode;
    onValid?: (data: FormData, done: () => void, event: import('react').FormEvent<HTMLFormElement>) => void | Promise<unknown>;
    onInvalid?: (errors: Record<string, string>, fields: Control[]) => void;
    /**
     * Controlled.
     */
    busy?: boolean;
    /**
     * Errors from outside — a server's — by field name. Merged with what the browser finds.
     */
    errors?: Record<string, string>;
    /**
     * Default blur.
     */
    validateOn?: 'blur' | 'change' | 'submit';
    /**
     * Once a field is marked. Default change.
     */
    revalidateOn?: 'change' | 'blur' | 'none';
    /**
     * Move focus to the summary. Default true.
     */
    focusOnError?: boolean;
    /**
     * Render the error summary. Default true.
     */
    summary?: boolean;
    /**
     * Default: a paragraph.
     */
    summaryHeadingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    renderSummary?: (state: {
        count: number;
        items: {
            id: string;
            name: string;
        }[];
        focus: (id: string) => void;
    }) => import('react').ReactNode;
    /**
     * Default true.
     */
    submitButton?: boolean;
    /**
     * Replaces the submit button; the consumer renders its own controls.
     */
    actions?: import('react').ReactNode;
    submitLabel?: import('react').ReactNode;
    busyLabel?: import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    classNames?: {
        summary?: string;
        submit?: string;
    };
};
export declare const Form: import("react").ForwardRefExoticComponent<FormProps & Omit<import("react").FormHTMLAttributes<HTMLFormElement>, "onInvalid" | "onSubmit"> & import("react").RefAttributes<HTMLFormElement>>;
