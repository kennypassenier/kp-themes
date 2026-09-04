/**
 * A colour picker that measures itself against the theme [TH57].
 *
 * @param {{ against?: string, kind?: 'text' | 'large' | 'non-text', initial?: {h: number, s: number, l: number}, onChange?: (value: string) => void, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export declare function ColorPicker({ against, kind, initial, onChange, strings }: {
    against?: string;
    kind?: 'text' | 'large' | 'non-text';
    initial?: {
        h: number;
        s: number;
        l: number;
    };
    onChange?: (value: string) => void;
    strings?: Partial<import('../js/strings.js').Strings>;
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
 * @param {{ tiles: Tile[], columns?: number, onLayout?: (layout: Tile[]) => void, render?: (tile: Tile) => import('react').ReactNode, strings?: Partial<import('../js/strings.js').Strings> }} props
 */
export declare function GridLayout({ tiles, columns, onLayout, render, strings }: {
    tiles: Tile[];
    columns?: number;
    onLayout?: (layout: Tile[]) => void;
    render?: (tile: Tile) => import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
}): import("react").JSX.Element;
