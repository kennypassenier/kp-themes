// A small JSON Schema validator for the theme signatures (gates/signature.mjs): the keywords the schema uses, type names, refs, anyOf/oneOf/if.

const KNOWN = new Set([
    '$schema',
    '$id',
    '$defs',
    '$ref',
    'title',
    'description',
    'type',
    'required',
    'properties',
    'additionalProperties',
    'items',
    'minItems',
    'minLength',
    'maxLength',
    'pattern',
    'enum',
    'const',
    'anyOf',
    'oneOf',
    'if',
    'then',
    'else',
]);

/** @param {unknown} value */
function typeOf(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

/**
 * Validate `value` against `schema`; the problems, each with a JSON pointer.
 *
 * @param {unknown} value
 * @param {any} schema
 * @param {any} [rootSchema]
 * @param {string} [at]
 * @returns {string[]}
 */
export function validate(value, schema, rootSchema = schema, at = '') {
    /** @type {string[]} */
    const problems = [];
    for (const key of Object.keys(schema))
        if (!KNOWN.has(key)) problems.push(`${at || '/'}: the schema uses "${key}", which gates/signature.mjs does not check`);
    if (schema.$ref) {
        const path = String(schema.$ref).replace(/^#\//, '').split('/');
        let target = rootSchema;
        for (const part of path) target = target?.[part];
        if (!target) return [...problems, `${at || '/'}: unresolved $ref ${schema.$ref}`];
        problems.push(...validate(value, target, rootSchema, at));
    }
    const kind = typeOf(value);
    if (schema.type && schema.type !== kind && !(schema.type === 'integer' && Number.isInteger(value))) {
        return [...problems, `${at || '/'}: expected ${schema.type}, found ${kind}`];
    }
    if ('const' in schema && value !== schema.const) problems.push(`${at || '/'}: expected ${JSON.stringify(schema.const)}`);
    if (schema.enum && !schema.enum.includes(value)) problems.push(`${at || '/'}: ${JSON.stringify(value)} is not one of ${schema.enum.join(', ')}`);
    if (kind === 'string') {
        const text = /** @type {string} */ (value);
        if (schema.minLength !== undefined && text.length < schema.minLength) problems.push(`${at || '/'}: shorter than ${schema.minLength}`);
        if (schema.maxLength !== undefined && text.length > schema.maxLength) problems.push(`${at || '/'}: longer than ${schema.maxLength}`);
        if (schema.pattern && !new RegExp(schema.pattern).test(text))
            problems.push(`${at || '/'}: ${JSON.stringify(text)} does not match ${schema.pattern}`);
    }
    if (kind === 'array') {
        const list = /** @type {unknown[]} */ (value);
        if (schema.minItems !== undefined && list.length < schema.minItems) problems.push(`${at || '/'}: fewer than ${schema.minItems} item(s)`);
        if (schema.items) list.forEach((item, i) => problems.push(...validate(item, schema.items, rootSchema, `${at}/${i}`)));
    }
    if (kind === 'object') {
        const object = /** @type {Record<string, unknown>} */ (value);
        for (const name of schema.required ?? []) if (!(name in object)) problems.push(`${at || '/'}: missing "${name}"`);
        for (const [name, child] of Object.entries(object)) {
            if (schema.properties?.[name]) problems.push(...validate(child, schema.properties[name], rootSchema, `${at}/${name}`));
            else if (schema.additionalProperties === false) problems.push(`${at || '/'}: "${name}" is not allowed`);
        }
    }
    if (schema.anyOf && !schema.anyOf.some((/** @type {any} */ s) => validate(value, s, rootSchema, at).length === 0)) {
        problems.push(`${at || '/'}: matches none of the allowed shapes`);
    }
    if (schema.oneOf) {
        const matching = schema.oneOf.filter((/** @type {any} */ s) => validate(value, s, rootSchema, at).length === 0).length;
        if (matching !== 1) problems.push(`${at || '/'}: must match exactly one shape, matches ${matching}`);
    }
    if (schema.if) {
        const branch = validate(value, schema.if, rootSchema, at).length === 0 ? schema.then : schema.else;
        if (branch) problems.push(...validate(value, branch, rootSchema, at));
    }
    return problems;
}
