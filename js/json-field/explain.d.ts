/**
 * What is wrong with `text`, and where: the engines word it differently.
 * @param {string} text
 * @returns {{ ok: true, value: unknown } | { ok: false, why: string, line: number | null, column: number | null }}
 */
export declare function explainJson(text: string): {
    ok: true;
    value: unknown;
} | {
    ok: false;
    why: string;
    line: number | null;
    column: number | null;
};
