// Finding the test declarations (titles, tags) inside a Playwright spec file.

import * as acorn from 'prettier/plugins/acorn';

const DECLARING = new Set([
    '',
    'only',
    'skip',
    'fixme',
    'fail',
    'slow',
    'describe',
    'describe.only',
    'describe.skip',
    'describe.fixme',
    'describe.serial',
    'describe.parallel',
    'describe.serial.only',
    'describe.parallel.only',
]);

/** @param {any} callee @returns {string | null} `''` for test(), `describe` for test.describe(), … */
function testApi(callee) {
    const parts = [];
    let n = callee;
    while (n.type === 'MemberExpression' && !n.computed) {
        parts.unshift(n.property.name);
        n = n.object;
    }
    if (n.type !== 'Identifier' || n.name !== 'test') return null;
    const path = parts.join('.');
    return DECLARING.has(path) ? path : null;
}

/**
 * Every test and describe a spec file declares, with the tags written on it.
 * A declaration is a `test…(title, [details,] fn)` call whose last argument is
 * a function — `test.skip(condition, reason)` is not one.
 *
 * @param {string} source
 * @returns {Promise<{ kind: 'test' | 'describe', line: number, title: string, tags: string[], parent: number, start: number, end: number, fnStart: number, details: any, text: string }[]>}
 *   `tags` holds each tag as written: a literal, or a template's source with `${…}` left in.
 */
export async function declarations(source) {
    const ast = await acorn.parsers.acorn.parse(source, /** @type {any} */ ({}));
    /** @type {any[]} */
    const found = [];
    /** @param {any} node @param {number} parent */
    const walk = (node, parent) => {
        if (!node || typeof node.type !== 'string') return;
        if (node.type === 'CallExpression') {
            const api = testApi(node.callee);
            const args = node.arguments;
            const last = args[args.length - 1];
            if (api !== null && args.length >= 2 && last && /Function/.test(last.type) && !/Function/.test(args[0].type)) {
                const details = args.length >= 3 && args[1].type === 'ObjectExpression' ? args[1] : null;
                /** @type {string[]} */
                const tags = [];
                const tagProp = details?.properties.find((/** @type {any} */ p) => p.key && (p.key.name === 'tag' || p.key.value === 'tag'));
                if (tagProp) {
                    const v = tagProp.value;
                    const items = v.type === 'ArrayExpression' ? v.elements : [v];
                    for (const item of items) {
                        if (item.type === 'Literal') tags.push(String(item.value));
                        else if (item.type === 'TemplateLiteral') tags.push(source.slice(item.start + 1, item.end - 1));
                        else tags.push(`<${source.slice(item.start, item.end)}>`);
                    }
                }
                const index = found.length;
                found.push({
                    kind: api.startsWith('describe') ? 'describe' : 'test',
                    line: source.slice(0, node.start).split('\n').length,
                    title: source.slice(args[0].start, args[0].end),
                    tags,
                    parent,
                    start: node.start,
                    end: node.end,
                    fnStart: last.start,
                    details,
                    text: source.slice(node.start, node.end),
                });
                for (const a of args) walk(a, index);
                return;
            }
        }
        for (const key of Object.keys(node)) {
            if (key === 'loc' || key === 'range') continue;
            const v = node[key];
            if (Array.isArray(v)) for (const x of v) walk(x, parent);
            else if (v && typeof v.type === 'string') walk(v, parent);
        }
    };
    walk(ast, -1);
    return found;
}
