import { TOAST_MS } from '../js/overlays.js';
/**
 * @param {{ open: boolean, onClose: () => void, title: string, className?: string, children?: import('react').ReactNode, actions?: import('react').ReactNode }} props
 */
export declare function Dialog({ open, onClose, title, className, children, actions }: {
    open: boolean;
    onClose: () => void;
    title: string;
    className?: string;
    children?: import('react').ReactNode;
    actions?: import('react').ReactNode;
}): import("react").JSX.Element;
/**
 * A menu on the popover layer. `popover="auto"` gives light dismiss,
 * Escape, and focus restoration; anchor positioning puts it under the
 * trigger without either measuring the other.
 *
 * @param {{ label: string, items: {label: string, onSelect?: () => void}[], className?: string }} props
 */
export declare function DropdownMenu({ label, items, className }: {
    label: string;
    items: {
        label: string;
        onSelect?: () => void;
    }[];
    className?: string;
}): import("react").JSX.Element;
/**
 * A tooltip is a description, so it is wired with aria-describedby and
 * never carries the only copy of anything: a tooltip that holds the
 * label is unreachable by touch.
 *
 * @param {{ text: string, children: import('react').ReactNode }} props
 */
export declare function Tooltip({ text, children }: {
    text: string;
    children: import('react').ReactNode;
}): import("react").JSX.Element;
/**
 * @param {{ messages: {id: string|number, text: string}[] }} props
 */
export declare function Toasts({ messages }: {
    messages: {
        id: string | number;
        text: string;
    }[];
}): import("react").JSX.Element;
export { TOAST_MS };
/**
 * @param {{ items: {summary: string, body: import('react').ReactNode}[], className?: string }} props
 */
export declare function Accordion({ items, className }: {
    items: {
        summary: string;
        body: import('react').ReactNode;
    }[];
    className?: string;
}): import("react").JSX.Element;
/**
 * Tabs with a roving tabindex: one stop in the tab order, arrows to move.
 * Without it a keyboard user presses Tab once per tab to get past a row.
 *
 * @param {{ tabs: {label: string, panel: import('react').ReactNode}[], className?: string }} props
 */
export declare function Tabs({ tabs, className }: {
    tabs: {
        label: string;
        panel: import('react').ReactNode;
    }[];
    className?: string;
}): import("react").JSX.Element;
/** @param {{ items: {href?: string, label: string}[] }} props */
export declare function Breadcrumb({ items }: {
    items: {
        href?: string;
        label: string;
    }[];
}): import("react").JSX.Element;
/** @param {{ pages: number, current: number, href?: (page: number) => string }} props */
export declare function Pagination({ pages, current, href }: {
    pages: number;
    current: number;
    href?: (page: number) => string;
}): import("react").JSX.Element;
/** @param {{ value?: number, max?: number, label: string }} props */
export declare function Progress({ value, max, label }: {
    value?: number;
    max?: number;
    label: string;
}): import("react").JSX.Element;
/** @param {{ label?: string }} props */
export declare function Spinner({ label }: {
    label?: string;
}): import("react").JSX.Element;
/** @param {{ width?: string, count?: number }} props */
export declare function Skeleton({ width, count }: {
    width?: string;
    count?: number;
}): import("react").JSX.Element;
