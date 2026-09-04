/**
 * @param {{ title?: string, className?: string, children?: import('react').ReactNode }} props
 */
export default function Card({ title, className, children, ...rest }: {
    title?: string;
    className?: string;
    children?: import('react').ReactNode;
}): import("react").JSX.Element;
