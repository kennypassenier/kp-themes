export type PlotContext = import('./context.js').PlotContext;
export type LegendFields = {
    buildLegend: () => void;
    medianWords: (opt: {
        median: boolean;
        medianWords: string;
        runs: boolean;
        minPoints: number;
        minUnit: string;
        key: boolean;
        band: 'tint' | 'hatch' | 'bracket';
    }) => string;
    paintKey: (opt: {
        median: boolean;
        medianWords: string;
        runs: boolean;
        minPoints: number;
        minUnit: string;
        key: boolean;
        band: 'tint' | 'hatch' | 'bracket';
    }) => void;
    skeletonLegend: () => void;
};
/** @typedef {import('./context.js').PlotContext} PlotContext */
/**
 * What the the legend: its keys, its median words and its loading skeleton part adds to the table's context.
 *
 * @typedef {{
 *     buildLegend: () => void;
 *     medianWords: (opt: { median: boolean; medianWords: string; runs: boolean; minPoints: number; minUnit: string; key: boolean; band: 'tint' | 'hatch' | 'bracket'; }) => string;
 *     paintKey: (opt: { median: boolean; medianWords: string; runs: boolean; minPoints: number; minUnit: string; key: boolean; band: 'tint' | 'hatch' | 'bracket'; }) => void;
 *     skeletonLegend: () => void;
 * }} LegendFields
 */
/**
 * The legend: its keys, its median words and its loading skeleton.
 *
 * @param {PlotContext} c
 */
export declare function installLegend(c: PlotContext): void;
