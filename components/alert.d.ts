/**
 * @param {{ flavour?: 'success'|'warning'|'info'|'destructive', label?: string, strings?: Partial<import('../js/strings.js').Strings>, className?: string, children?: import('react').ReactNode }} props
 */
export default function Alert({ flavour, label, strings, className, children, ...rest }: {
    flavour?: 'success' | 'warning' | 'info' | 'destructive';
    label?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    children?: import('react').ReactNode;
}): import("react").JSX.Element;
