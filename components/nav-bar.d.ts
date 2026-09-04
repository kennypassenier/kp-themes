/**
 * `linkComponent` is how a consumer with a router keeps their routing.
 *
 * The default is a plain `<a>`, which is correct HTML and reloads the
 * page — fine for a server-rendered site, and the wrong thing inside a
 * React Router or Next application, where every click would throw the
 * state away. Passing `linkComponent={Link}` hands the rendering over;
 * the component still receives `href`, so a router whose prop is called
 * something else gets a two-line wrapper rather than a fork of this file.
 *
 * The skip link is deliberately not routed. It is a same-page anchor to
 * an element on this page, and sending it through a router turns the one
 * link a keyboard user needs into a navigation.
 *
 * @param {{ brand: string, links: {href: string, label: string, current?: boolean}[], skipTo?: string, linkComponent?: import('react').ElementType, strings?: Partial<import('../js/strings.js').Strings>, className?: string, children?: import('react').ReactNode }} props
 */
export default function NavBar({ brand, links, skipTo, linkComponent: Link, strings, className, children }: {
    brand: string;
    links: {
        href: string;
        label: string;
        current?: boolean;
    }[];
    skipTo?: string;
    linkComponent?: import('react').ElementType;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    children?: import('react').ReactNode;
}): import("react").JSX.Element;
