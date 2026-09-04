export type TreeNode = {
    id: string;
    label: string;
    children?: TreeNode[];
};
/** @typedef {{ id: string, label: string, children?: TreeNode[] }} TreeNode */
/**
 * @param {{ nodes: TreeNode[], label: string, onSelect?: (id: string) => void }} props
 */
export declare function Tree({ nodes, label, onSelect }: {
    nodes: TreeNode[];
    label: string;
    onSelect?: (id: string) => void;
}): import("react").JSX.Element;
/**
 * A list that reorders from the keyboard [TH46].
 *
 * @param {{ items: { id: string, label: string }[], onChange?: (order: string[]) => void }} props
 */
export declare function Reorder({ items, onChange }: {
    items: {
        id: string;
        label: string;
    }[];
    onChange?: (order: string[]) => void;
}): import("react").JSX.Element;
/**
 * Two panes and a separator that moves with the arrow keys [TH55].
 *
 * @param {{ start: import('react').ReactNode, end: import('react').ReactNode, label?: string, min?: number, max?: number, initial?: number }} props
 */
export declare function SplitPane({ start, end, label, min, max, initial }: {
    start: import('react').ReactNode;
    end: import('react').ReactNode;
    label?: string;
    min?: number;
    max?: number;
    initial?: number;
}): import("react").JSX.Element;
