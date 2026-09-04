/**
 * @param {{ brand: string, links: {href: string, label: string, current?: boolean}[], skipTo?: string, strings?: Partial<import('../js/strings.js').Strings>, className?: string, children?: import('react').ReactNode }} props
 */
export default function NavBar({ brand, links, skipTo, strings, className, children }: {
    brand: string;
    links: {
        href: string;
        label: string;
        current?: boolean;
    }[];
    skipTo?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    children?: import('react').ReactNode;
}): import("react").JSX.Element;
