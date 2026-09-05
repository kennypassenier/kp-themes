import { TOAST_MS } from '../js/overlays.js';
export type DialogProps = {
    /**
     * Controlled.
     */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, reason: 'escape' | 'close' | 'action') => void;
    /**
     * Kept from 1.x: called when the dialog closed.
     */
    onClose?: () => void;
    title: import('react').ReactNode;
    /**
     * Default 2.
     */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    description?: import('react').ReactNode;
    /**
     * Default true.
     */
    modal?: boolean;
    /**
     * Default true. False keeps the dialog open on Escape — an unsaved-changes guard.
     */
    closeOnEscape?: boolean;
    /**
     * A close button in the header. Default false.
     */
    closeButton?: boolean;
    initialFocus?: import('react').RefObject<HTMLElement | null>;
    actions?: import('react').ReactNode;
    children?: import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
    classNames?: {
        title?: string;
        body?: string;
        actions?: string;
        close?: string;
    };
};
export declare const Dialog: import("react").ForwardRefExoticComponent<DialogProps & import("react").RefAttributes<HTMLDialogElement>>;
export type MenuItem = {
    label: import('react').ReactNode;
    onSelect?: () => void;
    disabled?: boolean;
    icon?: import('react').ReactNode;
    destructive?: boolean;
    separator?: boolean;
    id?: string;
};
export type DropdownMenuProps = {
    label: import('react').ReactNode;
    items: MenuItem[];
    /**
     * Controlled.
     */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * Default true.
     */
    closeOnSelect?: boolean;
    /**
     * The popover mode. Default auto (light dismiss).
     */
    dismiss?: 'auto' | 'manual';
    renderTrigger?: (props: {
        popoverTarget: string;
        style: import('react').CSSProperties;
        'aria-haspopup': 'menu';
        'aria-expanded': boolean;
    }) => import('react').ReactNode;
    renderItem?: (item: MenuItem) => import('react').ReactNode;
    id?: string;
    /**
     * On the trigger, as in 1.x.
     */
    className?: string;
    menuClassName?: string;
    style?: import('react').CSSProperties;
};
export declare const DropdownMenu: import("react").ForwardRefExoticComponent<DropdownMenuProps & import("react").RefAttributes<HTMLDivElement>>;
export type TooltipProps = {
    text: import('react').ReactNode;
    children: import('react').ReactNode;
    /**
     * Controlled.
     */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * Default 300: a toolbar with instant tooltips is a flicker storm.
     */
    openDelayMs?: number;
    /**
     * Default 100.
     */
    closeDelayMs?: number;
    /**
     * Default true — WCAG 1.4.13 asks for it.
     */
    closeOnEscape?: boolean;
    /**
     * The pointer may move into the tooltip. Default false.
     */
    interactive?: boolean;
    /**
     * The wrapper element. Default span.
     */
    as?: import('react').ElementType;
    className?: string;
    style?: import('react').CSSProperties;
    tooltipClassName?: string;
};
export declare const Tooltip: import("react").ForwardRefExoticComponent<TooltipProps & import("react").RefAttributes<HTMLElement>>;
export type ToastMessage = {
    id: string | number;
    text: import('react').ReactNode;
    variant?: 'info' | 'success' | 'warning' | 'error';
    action?: {
        label: string;
        onClick: () => void;
    };
    ms?: number;
};
export type ToastsProps = {
    messages: ToastMessage[];
    /**
     * Called when a toast times out or is dismissed. Without it nothing auto-dismisses, as in 1.x.
     */
    onDismiss?: (id: string | number) => void;
    /**
     * Default TOAST_MS; 0 never dismisses.
     */
    ms?: number;
    /**
     * Show at most this many, newest last.
     */
    max?: number;
    /**
     * A close button per toast. Default false.
     */
    dismissible?: boolean;
    /**
     * Default polite; error toasts are announced assertively regardless.
     */
    live?: 'polite' | 'assertive';
    renderToast?: (message: ToastMessage, dismiss: () => void) => import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Toasts: import("react").ForwardRefExoticComponent<ToastsProps & import("react").RefAttributes<HTMLDivElement>>;
export { TOAST_MS };
export type AccordionItem = {
    id?: string;
    summary: import('react').ReactNode;
    body: import('react').ReactNode;
    disabled?: boolean;
    className?: string;
};
export type AccordionProps = {
    items: AccordionItem[];
    /**
     * Controlled: the open ids.
     */
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (open: string[]) => void;
    /**
     * Default multiple.
     */
    type?: 'single' | 'multiple';
    /**
     * Wraps each summary in a heading of this level.
     */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Accordion: import("react").ForwardRefExoticComponent<AccordionProps & import("react").RefAttributes<HTMLDivElement>>;
export type Tab = {
    id?: string;
    label: import('react').ReactNode;
    panel: import('react').ReactNode;
    disabled?: boolean;
    icon?: import('react').ReactNode;
};
export type TabsProps = {
    tabs: Tab[];
    /**
     * Controlled index.
     */
    value?: number;
    /**
     * Default 0.
     */
    defaultValue?: number;
    onChange?: (index: number) => void;
    /**
     * Default automatic; manual moves focus with the arrows and selects on Enter or Space.
     */
    activation?: 'automatic' | 'manual';
    /**
     * Default horizontal.
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * Default true.
     */
    loop?: boolean;
    /**
     * Mount a panel the first time it is shown. Default false.
     */
    lazy?: boolean;
    /**
     * Unmount a panel when it hides. Default false.
     */
    unmountHidden?: boolean;
    className?: string;
    style?: import('react').CSSProperties;
    classNames?: {
        list?: string;
        tab?: string;
        panel?: string;
    };
};
export declare const Tabs: import("react").ForwardRefExoticComponent<TabsProps & import("react").RefAttributes<HTMLDivElement>>;
export type BreadcrumbProps = {
    items: {
        href?: string;
        label: import('react').ReactNode;
        id?: string;
        icon?: import('react').ReactNode;
    }[];
    linkComponent?: import('react').ElementType;
    /**
     * Render the last item as a link too. Default false.
     */
    linkCurrent?: boolean;
    /**
     * Default: the stylesheet's.
     */
    separator?: import('react').ReactNode;
    renderItem?: (item: BreadcrumbProps['items'][number], current: boolean) => import('react').ReactNode;
    /**
     * Accessible name. Default: the dictionary's.
     */
    label?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Breadcrumb: import("react").ForwardRefExoticComponent<BreadcrumbProps & import("react").RefAttributes<HTMLElement>>;
/**
 * Which page numbers to show: the first and last `boundary`, `siblings`
 * either side of the current one, and an ellipsis where a run is
 * skipped. Five hundred pages was five hundred links in 1.x.
 *
 * @param {number} pages @param {number} current @param {number} siblings @param {number} boundary
 * @returns {(number | 'gap')[]}
 */
export declare function pageRange(pages: number, current: number, siblings: number, boundary: number): (number | 'gap')[];
export type PaginationProps = {
    pages: number;
    /**
     * Controlled page (1-based).
     */
    current?: number;
    /**
     * Default 1.
     */
    defaultCurrent?: number;
    onPageChange?: (page: number) => void;
    href?: (page: number) => string;
    linkComponent?: import('react').ElementType;
    /**
     * Pages either side of the current. Default 1.
     */
    siblings?: number;
    /**
     * Pages at each end. Default 1.
     */
    boundary?: number;
    /**
     * Default true.
     */
    showPrevNext?: boolean;
    /**
     * Default false.
     */
    showFirstLast?: boolean;
    previousLabel?: import('react').ReactNode;
    nextLabel?: import('react').ReactNode;
    label?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Pagination: import("react").ForwardRefExoticComponent<PaginationProps & import("react").RefAttributes<HTMLElement>>;
export type ProgressProps = {
    value?: number;
    max?: number;
    label: string;
    /**
     * aria-valuetext, e.g. "3 of 10 files".
     */
    valueText?: string;
    /**
     * Render the percentage beside the bar.
     */
    showValue?: boolean;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Progress: import("react").ForwardRefExoticComponent<ProgressProps & import("react").RefAttributes<HTMLProgressElement>>;
export declare const Spinner: import("react").ForwardRefExoticComponent<{
    label?: string;
    size?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
} & import("react").RefAttributes<HTMLSpanElement>>;
export declare const Skeleton: import("react").ForwardRefExoticComponent<{
    width?: string;
    height?: string;
    count?: number;
    shape?: 'line' | 'circle' | 'block';
    gap?: string;
    className?: string;
    style?: import('react').CSSProperties;
} & import("react").RefAttributes<HTMLSpanElement>>;
