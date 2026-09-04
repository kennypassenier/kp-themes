export type Hsl = {
    h: number;
    s: number;
    l: number;
};
export type ColorPickerProps = {
    /**
     * The token measured against. Default `--background`.
     */
    against?: string;
    /**
     * Which WCAG threshold applies. Default text.
     */
    kind?: 'text' | 'large' | 'non-text';
    /**
     * Controlled colour, as an object or an hsl() string.
     */
    value?: Hsl | string;
    /**
     * Initial colour when uncontrolled.
     */
    defaultValue?: Hsl | string;
    /**
     * Alias of defaultValue, kept from 1.x.
     */
    initial?: Hsl;
    onChange?: (value: string, detail: {
        hsl: Hsl;
        ratio: number | null;
        ok: boolean | null;
    }) => void;
    /**
     * Where the theme is measured. Default: the document.
     */
    root?: Element | Document;
    /**
     * Re-measure on theme change. Default true.
     */
    followTheme?: boolean;
    /**
     * Slider step. Default 1.
     */
    step?: number;
    /**
     * Default true.
     */
    showSwatch?: boolean;
    /**
     * Default true.
     */
    showValue?: boolean;
    /**
     * Default true.
     */
    showContrast?: boolean;
    renderReport?: (report: {
        ratio: number | null;
        ok: boolean | null;
        against: string;
    }) => import('react').ReactNode;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
    classNames?: {
        label?: string;
        slider?: string;
        swatch?: string;
        value?: string;
        contrast?: string;
    };
};
export declare const ColorPicker: import("react").ForwardRefExoticComponent<Omit<ColorPickerProps & Record<string, unknown>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export type Tile = {
    id: string;
    label: string;
    x: number;
    y: number;
    w: number;
    h: number;
    static?: boolean;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
};
export type GridLayoutProps = {
    /**
     * Initial layout when uncontrolled (kept from 1.x).
     */
    tiles?: Tile[];
    /**
     * Same, under the 3.0.0 name.
     */
    defaultLayout?: Tile[];
    /**
     * Controlled layout.
     */
    layout?: Tile[];
    columns?: number;
    /**
     * Upper bound for `y + h`. Default unbounded.
     */
    rows?: number;
    /**
     * Cells per key press. Default 1.
     */
    step?: number;
    /**
     * Drag with a pointer as well. Default true.
     */
    pointer?: boolean;
    /**
     * Every change.
     */
    onLayout?: (layout: Tile[]) => void;
    /**
     * Once a burst of changes settles.
     */
    onLayoutCommit?: (layout: Tile[]) => void;
    /**
     * The settle time. Default 400.
     */
    commitMs?: number;
    render?: (tile: Tile) => import('react').ReactNode;
    tileClassName?: (tile: Tile) => string;
    strings?: Partial<import('../js/strings.js').Strings>;
    className?: string;
    style?: import('react').CSSProperties;
};
export declare const GridLayout: import("react").ForwardRefExoticComponent<Omit<GridLayoutProps & Record<string, unknown>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
