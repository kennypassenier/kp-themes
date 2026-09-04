/**
 * @param {{ brand: string, links: {href: string, label: string, current?: boolean}[], skipTo?: string, className?: string, children?: import('react').ReactNode }} props
 */
export default function NavBar({ brand, links, skipTo, className, children }: {
    brand: string;
    links: {
        href: string;
        label: string;
        current?: boolean;
    }[];
    skipTo?: string;
    className?: string;
    children?: import('react').ReactNode;
}): import("react").JSX.Element;
