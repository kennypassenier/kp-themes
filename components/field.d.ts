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
};
declare const Field: import("react").ForwardRefExoticComponent<FieldProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "id" | "required"> & import("react").RefAttributes<HTMLInputElement>>;
export default Field;
