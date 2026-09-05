export type TreeNode = {
    id: string;
    label: import('react').ReactNode;
    children?: TreeNode[];
    disabled?: boolean;
    icon?: import('react').ReactNode;
};
export type TreeProps = {
    nodes: TreeNode[];
    label: string;
    /**
     * Controlled.
     */
    expanded?: string[];
    defaultExpanded?: string[];
    onExpandedChange?: (expanded: string[]) => void;
    /**
     * Controlled.
     */
    selected?: string | null;
    defaultSelected?: string | null;
    onSelectedChange?: (id: string | null) => void;
    /**
     * Kept from 1.x: called on a leaf (or any node when `selectable`).
     */
    onSelect?: (id: string) => void;
    /**
     * Branches can be selected too, and Enter selects rather than toggles. Default false.
     */
    selectable?: boolean;
    /**
     * What a click on a branch does. Default toggle.
     */
    clickBranch?: 'toggle' | 'select';
    /**
     * Default true.
     */
    typeahead?: boolean;
    /**
     * Default 500.
     */
    typeaheadMs?: number;
    /**
     * Per level. Default 1rem.
     */
    indent?: string;
    renderNode?: (node: TreeNode, state: {
        depth: number;
        expanded: boolean;
        selected: boolean;
    }) => import('react').ReactNode;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Tree: import("react").ForwardRefExoticComponent<TreeProps & Omit<import("react").HTMLAttributes<HTMLUListElement>, "onSelect"> & import("react").RefAttributes<HTMLUListElement>>;
export type ReorderItem = {
    id: string;
    label: import('react').ReactNode;
    disabled?: boolean;
};
export type ReorderProps = {
    items: ReorderItem[];
    /**
     * Controlled.
     */
    order?: string[];
    /**
     * Default: the items' order.
     */
    defaultOrder?: string[];
    onChange?: (order: string[], move: {
        id: string;
        from: number;
        to: number;
    }) => void;
    /**
     * Drag with a pointer. Default true.
     */
    pointer?: boolean;
    /**
     * Dispatch REORDER_EVENT on the list too. Default true.
     */
    emitDomEvent?: boolean;
    handleGlyph?: import('react').ReactNode;
    renderItem?: (item: ReorderItem, index: number) => import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const Reorder: import("react").ForwardRefExoticComponent<ReorderProps & Omit<import("react").HTMLAttributes<HTMLUListElement>, "onChange"> & import("react").RefAttributes<HTMLUListElement>>;
export type SplitPaneProps = {
    start: import('react').ReactNode;
    end: import('react').ReactNode;
    label?: string;
    /**
     * Default 10.
     */
    min?: number;
    /**
     * Default 90.
     */
    max?: number;
    /**
     * Controlled percentage.
     */
    value?: number;
    /**
     * Default 50.
     */
    defaultValue?: number;
    /**
     * Alias of defaultValue, kept from 1.x.
     */
    initial?: number;
    onChange?: (value: number) => void;
    /**
     * The separator's. Default vertical (left | right).
     */
    orientation?: 'vertical' | 'horizontal';
    /**
     * Default 2.
     */
    step?: number;
    /**
     * With Shift. Default 10.
     */
    largeStep?: number;
    /**
     * Default false.
     */
    collapseOnDoubleClick?: boolean;
    /**
     * Default true.
     */
    emitDomEvent?: boolean;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
    classNames?: {
        pane?: string;
        separator?: string;
    };
};
export declare const SplitPane: import("react").ForwardRefExoticComponent<SplitPaneProps & Omit<import("react").HTMLAttributes<HTMLDivElement>, "onChange"> & import("react").RefAttributes<HTMLDivElement>>;
