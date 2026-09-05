export type EmptyStateProps = {
    title: import('react').ReactNode;
    body?: import('react').ReactNode;
    /**
     * Shown when not filtered.
     */
    action?: import('react').ReactNode;
    /**
     * Shown when filtered, e.g. "Clear filters".
     */
    filteredAction?: import('react').ReactNode;
    filtered?: boolean;
    icon?: import('react').ReactNode;
    /**
     * Renders the title as a heading of this level. Default: a paragraph.
     */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const EmptyState: import("react").ForwardRefExoticComponent<EmptyStateProps & import("react").HTMLAttributes<HTMLDivElement> & import("react").RefAttributes<HTMLDivElement>>;
export type CopyableProps = {
    value: string;
    /**
     * What goes to the clipboard, if not what is shown (a masked key).
     */
    copyValue?: string;
    label?: import('react').ReactNode;
    copiedText?: import('react').ReactNode;
    failedText?: import('react').ReactNode;
    /**
     * Default COPIED_MS.
     */
    resetMs?: number;
    /**
     * Controlled.
     */
    state?: 'idle' | 'copied' | 'failed';
    onStateChange?: (state: 'idle' | 'copied' | 'failed') => void;
    onCopy?: (value: string) => void;
    onError?: (error: unknown) => void;
    renderValue?: (value: string) => import('react').ReactNode;
    icon?: import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
    classNames?: {
        value?: string;
        button?: string;
    };
};
export declare const Copyable: import("react").ForwardRefExoticComponent<CopyableProps & import("react").HTMLAttributes<HTMLSpanElement> & import("react").RefAttributes<HTMLSpanElement>>;
export type HealthProps = {
    /**
     * The four the stylesheet knows, or your own with your own CSS.
     */
    state: 'ok' | 'warn' | 'down' | 'unknown' | (string & {});
    label: import('react').ReactNode;
    /**
     * Replaces the dot.
     */
    indicator?: import('react').ReactNode;
    as?: import('react').ElementType;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Health: import("react").ForwardRefExoticComponent<HealthProps & import("react").HTMLAttributes<HTMLElement> & import("react").RefAttributes<HTMLElement>>;
export type TimelineEvent = {
    id?: string;
    when: import('react').ReactNode;
    dateTime?: string;
    what: import('react').ReactNode;
    marker?: import('react').ReactNode;
    state?: string;
    href?: string;
};
export type TimelineProps = {
    events: TimelineEvent[];
    renderItem?: (event: TimelineEvent) => import('react').ReactNode;
    linkComponent?: import('react').ElementType;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Timeline: import("react").ForwardRefExoticComponent<TimelineProps & import("react").HTMLAttributes<HTMLOListElement> & import("react").RefAttributes<HTMLOListElement>>;
export type DiffProps = {
    lines: {
        kind: 'added' | 'removed' | 'same';
        text: string;
        number?: number;
        oldNumber?: number;
        newNumber?: number;
    }[];
    /**
     * Default true.
     */
    lineNumbers?: boolean;
    signs?: {
        added?: string;
        removed?: string;
        same?: string;
    };
    renderText?: (text: string, line: DiffProps['lines'][number]) => import('react').ReactNode;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Diff: import("react").ForwardRefExoticComponent<DiffProps & import("react").HTMLAttributes<HTMLPreElement> & import("react").RefAttributes<HTMLPreElement>>;
