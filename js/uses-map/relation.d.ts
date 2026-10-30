export type UsesNode = import('../uses-map.js').UsesNode;
export type UsesLine = import('../uses-map.js').UsesLine;
/**
 * The relation of a spec, as lists. Pure.
 * @param {{ rows?: readonly UsesNode[], columns?: readonly UsesNode[], cell?: (row: string, column: string) => unknown }} spec
 * @returns {{ uses: Map<string, string[]>, usedBy: Map<string, string[]>, lines: Map<string, UsesLine> }} `lines` by `"<row>><column>"`
 */
export declare function usesRelation(spec: {
    rows?: readonly UsesNode[];
    columns?: readonly UsesNode[];
    cell?: (row: string, column: string) => unknown;
}): {
    uses: Map<string, string[]>;
    usedBy: Map<string, string[]>;
    lines: Map<string, UsesLine>;
};
/**
 * The path of one line between two points. Pure.
 * @param {'curve' | 'elbow' | 'straight'} shape @param {number} x1 @param {number} y1 @param {number} x2 @param {number} y2
 */
export declare function usesPath(shape: 'curve' | 'elbow' | 'straight', x1: number, y1: number, x2: number, y2: number): string;
