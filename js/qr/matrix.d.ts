/**
 * The matrix for a text: rows of booleans, or the reason it cannot be made.
 * @param {string} text @param {'L' | 'M' | 'Q' | 'H'} [level]
 * @returns {{ size: number, rows: boolean[][], bytes: number } | { error: string }}
 */
export declare function qrMatrix(text: string, level?: 'L' | 'M' | 'Q' | 'H'): {
    size: number;
    rows: boolean[][];
    bytes: number;
} | {
    error: string;
};
/** The WCAG contrast of two colours. @param {string} a @param {string} b */
export declare function qrContrast(a: string, b: string): number;
/** The path of the dark modules. @param {boolean[][]} rows @param {number} quiet @param {'square' | 'round'} shape */
export declare function modulesPath(rows: boolean[][], quiet: number, shape: 'square' | 'round'): string;
