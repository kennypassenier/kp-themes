export type ButtonProps = {
    variant?: 'default' | 'primary' | 'destructive' | 'ghost';
    /**
     * Phrase shown on the first click; the second click acts [DI10].
     */
    confirm?: string;
    /**
     * Offered instead of a confirmation — SC 3.3.4 accepts either.
     */
    onUndo?: () => void;
    confirmWindowMs?: number;
};
/**
 * @typedef {object} ButtonProps
 * @property {'default'|'primary'|'destructive'|'ghost'} [variant]
 * @property {string} [confirm]  Phrase shown on the first click; the second click acts [DI10].
 * @property {() => void} [onUndo]  Offered instead of a confirmation — SC 3.3.4 accepts either.
 * @property {number} [confirmWindowMs]
 */
/** @param {ButtonProps & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props */
export default function Button({ variant, confirm, onUndo, confirmWindowMs, className, children, onClick, ...rest }: ButtonProps & import('react').ButtonHTMLAttributes<HTMLButtonElement>): import("react").JSX.Element;
