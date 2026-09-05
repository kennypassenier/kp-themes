export type CardProps = {
    title?: import('react').ReactNode;
    /**
     * Default 3.
     */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * Replaces the title row entirely.
     */
    header?: import('react').ReactNode;
    /**
     * Rendered beside the title.
     */
    actions?: import('react').ReactNode;
    footer?: import('react').ReactNode;
    /**
     * Wrap the children in the body element. Default true.
     */
    padded?: boolean;
    /**
     * Default 'div'.
     */
    as?: import('react').ElementType;
    classNames?: {
        title?: string;
        header?: string;
        body?: string;
        footer?: string;
        actions?: string;
    };
    className?: string;
    children?: import('react').ReactNode;
};
declare const Card: import("react").ForwardRefExoticComponent<CardProps & import("react").HTMLAttributes<HTMLElement> & import("react").RefAttributes<HTMLElement>>;
export default Card;
