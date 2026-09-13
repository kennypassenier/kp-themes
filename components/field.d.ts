export type FieldOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
export type FieldProps = {
    label: import('react').ReactNode;
    help?: import('react').ReactNode;
    error?: import('react').ReactNode;
    id?: string;
    /**
     * Visually hidden, still read.
     */
    labelHidden?: boolean;
    required?: boolean;
    wrapperProps?: import('react').HTMLAttributes<HTMLDivElement>;
    renderControl?: (props: {
        id: string;
        className: string;
        'aria-describedby': string | undefined;
        'aria-invalid': 'true' | undefined;
        required: boolean;
    }) => import('react').ReactNode;
    classNames?: {
        label?: string;
        input?: string;
        help?: string;
        error?: string;
    };
    strings?: Partial<import('../js/strings.js').Strings>;
    /**
     * On the wrapper, as in 1.x.
     */
    className?: string;
    /**
     * Render a <select> with these options instead of an input [scope-54].
     */
    options?: FieldOption[];
    /**
     * With `options`: lay the drawn list over the select (`data-kp-select`). Default false: the native list [scope-54].
     */
    drawn?: boolean;
};
declare const Field: import("react").ForwardRefExoticComponent<FieldProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement> & import("react").SelectHTMLAttributes<HTMLSelectElement>, "id" | "required"> & import("react").RefAttributes<HTMLInputElement | HTMLSelectElement>>;
export default Field;
