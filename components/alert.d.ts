/**
 * @param {{ flavour?: 'success'|'warning'|'info'|'destructive', label?: string, className?: string, children?: import('react').ReactNode }} props
 */
export default function Alert({ flavour, label, className, children, ...rest }: {
    flavour?: 'success' | 'warning' | 'info' | 'destructive';
    label?: string;
    className?: string;
    children?: import('react').ReactNode;
}): import("react").JSX.Element;
