export type SwitchProps = {
    label: import('react').ReactNode;
    help?: import('react').ReactNode;
    /**
     * Marks the switch invalid and says why.
     */
    error?: import('react').ReactNode;
    id?: string;
    /**
     * The On/Off word beside the track. Default true.
     */
    showState?: boolean;
    wrapperProps?: import('react').HTMLAttributes<HTMLDivElement>;
    classNames?: {
        row?: string;
        input?: string;
        state?: string;
        label?: string;
        help?: string;
        error?: string;
    };
    strings?: Partial<import('../js/strings.js').Strings>;
    /**
     * On the wrapper.
     */
    className?: string;
};
declare const Switch: import("react").ForwardRefExoticComponent<SwitchProps & Omit<import("react").InputHTMLAttributes<HTMLInputElement>, "className" | "id" | "role" | "type"> & import("react").RefAttributes<HTMLInputElement>>;
export default Switch;
