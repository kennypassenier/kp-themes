// Reading the stylesheets: which selectors the table queries and which wrappers establish a context.

/**
 * Container names the stylesheet actually queries.
 * @param {string} css
 * @returns {Set<string>}
 */
export function queried(css) {
    return new Set([...css.matchAll(/@container\s+([A-Za-z][\w-]*)\s*\(/g)].map((m) => m[1]));
}

/**
 * Which classes establish which named container: `.x { container: NAME /
 * inline-size }`. More than one class may establish the same name — the
 * nearest one wins at runtime, and any of them satisfies this check.
 *
 * @param {string} css
 * @returns {Map<string, string[]>}
 */
export function establishers(css) {
    /** @type {Map<string, string[]>} */
    const found = new Map();
    // Split on `{` and read the prelude before each block, the same way
    // check-migration.mjs reads declared class names.
    const clean = css.replaceAll(/\/\*[\s\S]*?\*\//g, '');
    const blocks = clean.split('{');
    for (let i = 1; i < blocks.length; i += 1) {
        const body = blocks[i].split('}')[0];
        const match = body.match(/(?:^|;)\s*container(?:-name)?\s*:\s*([A-Za-z][\w-]*)/);
        if (match === null) continue;
        const prelude = blocks[i - 1].slice(Math.max(blocks[i - 1].lastIndexOf('}'), blocks[i - 1].lastIndexOf(';')) + 1);
        for (const m of prelude.matchAll(/\.(kp-[A-Za-z0-9_-]+)/g)) {
            const list = found.get(match[1]) ?? [];
            if (!list.includes(m[1])) list.push(m[1]);
            found.set(match[1], list);
        }
    }
    return found;
}
