// Turning rows keyed by (block, theme, engine) into the nested objects the review tools work with, and back.

/**
 * Rows to `{ [row[k0]]: { [row[k1]]: … leaf(row) } }`, in row order.
 * @template R, L
 * @param {R[]} rows
 * @param {(keyof R)[]} keys
 * @param {(row: R) => L} leaf
 * @returns {Record<string, any>}
 */
export function nest(rows, keys, leaf) {
    /** @type {Record<string, any>} */
    const out = {};
    for (const row of rows) {
        let at = out;
        for (const key of keys.slice(0, -1)) at = at[String(row[key])] ??= {};
        at[String(row[keys[keys.length - 1]])] = leaf(row);
    }
    return out;
}

/**
 * The leaves of a nested object with the keys that lead to them: `depth` levels of keys, then the leaf.
 * @param {Record<string, any>} nested
 * @param {number} depth
 * @returns {{ path: string[], leaf: any }[]}
 */
export function leaves(nested, depth) {
    /** @type {{ path: string[], leaf: any }[]} */
    const out = [];
    const walk = (/** @type {any} */ node, /** @type {string[]} */ path) => {
        if (path.length === depth) {
            out.push({ path, leaf: node });
            return;
        }
        if (!node || typeof node !== 'object') throw new Error(`expected an object at ${path.join(' · ') || 'the top'}, found ${JSON.stringify(node)}`);
        for (const [key, value] of Object.entries(node)) walk(value, [...path, key]);
    };
    walk(nested ?? {}, []);
    return out;
}
