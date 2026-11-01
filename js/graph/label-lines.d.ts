/**
 * The room tried, in order, for names beside the ring at a phone width [graph-1020]: the picture as tall as ever, then taller; on each
 * height the ring as wide as ever, then a little narrower or wider; on each width the ring unturned, then turned a quarter step at a time.
 */
export declare const SIDE_ROOM: {
    height: number;
    stretch: number;
    phase: number;
}[];
/** How many pairs of node groups (a node and its name) of a drawn world come closer than 3 px? @param {SVGGElement} world */
export declare function groupsTouching(world: SVGGElement): number;
/**
 * A name on as few centred lines as keep each within `target` [graph-1020]: broken after a hyphen or at a space, and of all the ways
 * to break it into that many lines the one whose widest line is narrowest, so the lines are as even as the name allows. A name that
 * fits, or has no break point, is one line. `widthOf(text)` is the width of a piece as drawn.
 * @param {string} label
 * @param {number} target
 * @param {(text: string) => number} widthOf
 * @returns {string[]}
 */
export declare function graphLabelLines(label: string, target: number, widthOf: (text: string) => number): string[];
