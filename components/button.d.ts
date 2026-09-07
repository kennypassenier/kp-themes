export type ButtonProps = {
    variant?: 'default' | 'primary' | 'destructive' | 'ghost';
    /**
     * The size scale [TH111]. Default 'md', the unmodified button.
     */
    size?: 'sm' | 'md' | 'lg';
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
    /**
     * How long `confirmMode="inline"` stays armed.
     */
    confirmWindowMs?: number;
    /**
     * Default 'dialog': a modal <dialog> [TH107]. 'inline' is 3.x's arm-then-act.
     */
    confirmMode?: 'dialog' | 'inline';
    /**
     * Handed the dialog this opened, so the state has a way out [KT6].
     */
    onConfirmOpen?: (dialog: HTMLDialogElement) => void;
    /**
     * Escape or Cancel. The action does not run.
     */
    onConfirmCancel?: () => void;
    confirmDialogClassName?: string;
    /**
     * Controlled armed state (`confirmMode="inline"` only).
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
