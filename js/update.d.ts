export { UPDATING_ATTRIBUTE, UPDATE_PROPERTY, UPDATE_STYLE } from './update/values.js';
export { updateIdea, updateTimingOf, updateTiming, updatePlays } from './update/timing.js';
export { markUpdating, unmarkUpdating } from './update/mark.js';
export { update } from './update/run.js';
export type SparkWrite = {
    svg: SVGSVGElement;
    parts: string;
    from: {
        line: string;
        area: string;
    };
    to: {
        line: string;
        area: string;
    };
};
export type UpdateJob = {
    el: Element;
    host: HTMLElement;
    spark: SparkWrite | null;
    resolve: (took: number) => void;
};
/**
 * @typedef {{ svg: SVGSVGElement, parts: string, from: { line: string, area: string }, to: { line: string, area: string } }} SparkWrite
 * @typedef {{ el: Element, host: HTMLElement, spark: SparkWrite | null, resolve: (took: number) => void }} UpdateJob
 */
