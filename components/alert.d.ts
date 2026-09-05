export type AlertProps = {
    flavour?: 'success' | 'warning' | 'info' | 'destructive';
    label?: import('react').ReactNode;
    /**
     * Between the label and the text. Default ": ".
     */
    separator?: string;
    icon?: import('react').ReactNode;
    /**
     * Renders a close button when given.
     */
    onDismiss?: () => void;
    /**
     * Default 'div'.
     */
    as?: import('react').ElementType;
    classNames?: {
        label?: string;
        body?: string;
        icon?: string;
        close?: string;
    };
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    children?: import('react').ReactNode;
};
declare const Alert: import("react").ForwardRefExoticComponent<AlertProps & import("react").HTMLAttributes<HTMLElement> & import("react").RefAttributes<HTMLElement>>;
export default Alert;
