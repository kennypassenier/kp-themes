export type BadgeProps = {
    status?: string;
    /**
     * The custom property family. Default `--status-`.
     */
    tokenPrefix?: string;
    /**
     * Default 'span'.
     */
    as?: import('react').ElementType;
    onContractError?: (rule: 'DI4', message: string) => void;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
    children?: import('react').ReactNode;
};
declare const Badge: import("react").ForwardRefExoticComponent<BadgeProps & import("react").HTMLAttributes<HTMLElement> & import("react").RefAttributes<HTMLElement>>;
export default Badge;
