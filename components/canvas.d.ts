/**
 * A colour picker that measures itself against the theme [TH57].
 *
 * @param {{ against?: string, kind?: 'text' | 'large' | 'non-text', initial?: {h: number, s: number, l: number}, onChange?: (value: string) => void }} props
 */
export declare function ColorPicker({ against, kind, initial, onChange }: {
    against?: string;
    kind?: 'text' | 'large' | 'non-text';
    initial?: {
        h: number;
        s: number;
        l: number;
    };
    onChange?: (value: string) => void;
}): import("react").JSX.Element;
export type Tile = {
    id: string;
    label: string;
    x: number;
    y: number;
    w: number;
    h: number;
};
/** @typedef {{ id: string, label: string, x: number, y: number, w: number, h: number }} Tile */
/**
 * A dashboard the reader arranges [TH56].
 *
 * @param {{ tiles: Tile[], columns?: number, onLayout?: (layout: Tile[]) => void, render?: (tile: Tile) => import('react').ReactNode }} props
 */
export declare function GridLayout({ tiles, columns, onLayout, render }: {
    tiles: Tile[];
    columns?: number;
    onLayout?: (layout: Tile[]) => void;
    render?: (tile: Tile) => import('react').ReactNode;
}): import("react").JSX.Element;
