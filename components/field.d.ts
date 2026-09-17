export type FieldOption = {
    value: string;
    label: string;
    disabled?: boolean;
};
/** @typedef {{ value: string, label: string, disabled?: boolean }} FieldOption */
/**
 * A callback ref that lays the drawn list over the select it is given and
 * takes it away again when the select goes or `enabled` turns false [KT6].
 * Every React select of the package's uses it, so the default reaches the
 * data table's and the form's selects as well as Field's.
 *
 * @param {boolean} [enabled] Default true.
 * @returns {(element: HTMLSelectElement | null) => void}
 */
export declare function useDrawnSelect(enabled?: boolean): (element: HTMLSelectElement | null) => void;
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
     * With `options`: lay the package's drawn list over the select. Default true since 2026-09-13; false keeps the browser's list (`data-kp-select="native"`). A `multiple` select is always the browser's.
     */
    drawn?: boolean;
};
declare const Field: import("react").ForwardRefExoticComponent<FieldProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement> & import("react").SelectHTMLAttributes<HTMLSelectElement>, "id" | "required"> & import("react").RefAttributes<HTMLInputElement | HTMLSelectElement>>;
export default Field;
