/** The ink and ground the code is drawn in. @param {HTMLElement} root @returns {{ ink: string, ground: string, look: 'plate' | 'theme' }} */
export declare function palette(root: HTMLElement): {
    ink: string;
    ground: string;
    look: 'plate' | 'theme';
};
/** @param {HTMLElement} root @param {{ size: number, rows: boolean[][] }} m @returns {SVGSVGElement} */
export declare function drawSvg(root: HTMLElement, m: {
    size: number;
    rows: boolean[][];
}): SVGSVGElement;
/** @param {HTMLElement} root @param {{ size: number, rows: boolean[][] }} m @returns {HTMLCanvasElement} */
export declare function drawCanvas(root: HTMLElement, m: {
    size: number;
    rows: boolean[][];
}): HTMLCanvasElement;
