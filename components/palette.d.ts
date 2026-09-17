export type Command = {
    value: string;
    label: string;
    keys?: string;
    group?: string;
    description?: string;
    icon?: import('react').ReactNode;
    disabled?: boolean;
    href?: string;
    target?: string;
    rel?: string;
};
export type Matcher = (label: string, query: string, command: Command) => boolean;
/** @typedef {{ value: string, label: string, keys?: string, group?: string, description?: string, icon?: import('react').ReactNode, disabled?: boolean, href?: string, target?: string, rel?: string }} Command */
/** @typedef {(label: string, query: string, command: Command) => boolean} Matcher */
/** @type {Record<string, Matcher>} */
export declare const MATCHERS: Record<string, Matcher>;
export type CommandPaletteProps = {
    commands: Command[];
    onRun?: (value: string, command: Command) => void;
    /**
     * Controlled.
     */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * Controlled.
     */
    query?: string;
    onQueryChange?: (query: string) => void;
    /**
     * The letter, with Ctrl/⌘. Default 'k'; null disables it.
     */
    hotkey?: string | null;
    /**
     * This palette answers the key when there are several. Default: the first in the document.
     */
    primary?: boolean;
    /**
     * Default substring; 'subsequence' lets "thm" find "Theme" [scope-56].
     */
    match?: keyof typeof MATCHERS | Matcher;
    /**
     * Default true.
     */
    resetOnClose?: boolean;
    /**
     * Default true.
     */
    closeOnRun?: boolean;
    loading?: boolean;
    renderItem?: (command: Command, state: {
        active: boolean;
    }) => import('react').ReactNode;
    emptyState?: import('react').ReactNode;
    /**
     * What renders a command with an `href`. Default: a plain `<a>`.
     */
    linkComponent?: import('react').ElementType;
    placeholder?: string;
    label?: string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
    classNames?: {
        input?: string;
        list?: string;
        option?: string;
        group?: string;
        status?: string;
    };
};
export declare const CommandPalette: import("react").ForwardRefExoticComponent<CommandPaletteProps & import("react").RefAttributes<HTMLDialogElement>>;
export type PaletteTriggerProps = {
    /**
     * The palette's id; empty for the one that answers the key.
     */
    palette: string;
    /**
     * The letter it prints. Default 'k'; null prints none.
     */
    hotkey?: string | null;
    /**
     * Default: the dictionary's word.
     */
    label?: import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
};
export declare const PaletteTrigger: import("react").ForwardRefExoticComponent<PaletteTriggerProps & Omit<import("react").ButtonHTMLAttributes<HTMLButtonElement>, "children"> & import("react").RefAttributes<HTMLButtonElement>>;
export type ShortcutSheetProps = {
    shortcuts: {
        keys: string;
        description: import('react').ReactNode;
        group?: string;
    }[];
    /**
     * Controlled.
     */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /**
     * Default '?'; null disables it.
     */
    hotkey?: string | null;
    primary?: boolean;
    /**
     * Where a bare key is typing, not a shortcut. Default: inputs, textareas, selects, textboxes.
     */
    typingSelector?: string;
    /**
     * Replaces the close button.
     */
    actions?: import('react').ReactNode;
    label?: string;
    /**
     * Default 2.
     */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const ShortcutSheet: import("react").ForwardRefExoticComponent<ShortcutSheetProps & import("react").RefAttributes<HTMLDialogElement>>;
