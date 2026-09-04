/**
 * @param {{ status?: string, className?: string, children?: import('react').ReactNode }} props
 */
export default function Badge({ status, className, children, ...rest }: {
    status?: string;
    className?: string;
    children?: import('react').ReactNode;
}): import("react").JSX.Element;
