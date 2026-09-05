export type ButtonProps = {
    variant?: 'default' | 'primary' | 'destructive' | 'ghost';
    /**
     * Phrase shown on the first click; the second click acts [DI10].
     */
    confirm?: string;
    /**
     * Offered instead of a confirmation — SC 3.3.4 accepts either. Called if the person takes the undo.
     */
    onUndo?: () => void;
    /**
     * How long the undo is offered. Default UNDO_MS.
     */
    undoMs?: number;
    /**
     * Default: the dictionary's `undo`.
     */
    undoLabel?: import('react').ReactNode;
    confirmWindowMs?: number;
    /**
     * Controlled armed state.
     */
    armed?: boolean;
    onArmedChange?: (armed: boolean) => void;
    /**
     * Default true.
     */
    disarmOnBlur?: boolean;
    /**
     * Default: console.error.
     */
    onContractError?: (rule: 'DI10', message: string) => void;
    /**
     * Default 'button'.
     */
    as?: import('react').ElementType;
    strings?: Partial<import('../js/strings.js').Strings>;
};
declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & import("react").ButtonHTMLAttributes<HTMLButtonElement> & import("react").RefAttributes<HTMLButtonElement>>;
export default Button;
