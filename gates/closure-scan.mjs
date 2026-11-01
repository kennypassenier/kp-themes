// The scanner of the closure gate: the tokens of a JavaScript source and the module specifiers it imports, strings and comments told apart from code.

/**
 * @typedef {{ kind: 'word' | 'string' | 'template' | 'punct', value: string }} Token
 */

/**
 * The tokens of `source` that decide an import: words, string literals with
 * their value, whole template literals and punctuation. Comments, the text
 * inside a string or a template and regular expression literals are read
 * past, so a word in them is never taken for code.
 *
 * It used to be one regular expression from `import` or `export` to the next
 * `from` followed by a quote, anywhere after it: `export const DEFAULT_STRINGS`
 * then ran on to `bound === 'from' ? ...` inside js/strings.js and read the
 * text up to the next quote as an import (2026-09-14).
 *
 * @param {string} source
 * @returns {Token[]}
 */
function tokens(source) {
    /** @type {Token[]} */
    const out = [];
    let i = 0;
    /** Whether a `/` here starts a regular expression rather than a division. */
    const regexAllowed = () => {
        const last = out.at(-1);
        if (last === undefined) return true;
        if (last.kind === 'string' || last.kind === 'template') return false;
        if (last.kind === 'word') return /^(return|typeof|instanceof|in|of|new|delete|void|throw|case|do|else|yield|await)$/.test(last.value);
        return !/^[)\]}]$/.test(last.value);
    };
    /** Skip a template literal starting at the backtick at `i`, nested `${}` and templates included; returns the index after it. */
    const skipTemplate = (/** @type {number} */ at) => {
        let j = at + 1;
        while (j < source.length) {
            const c = source[j];
            if (c === '\\') j += 2;
            else if (c === '`') return j + 1;
            else if (c === '$' && source[j + 1] === '{') j = skipCode(j + 2, '}');
            else j += 1;
        }
        return j;
    };
    /** Skip a quoted string starting at `at`; returns the index after it. */
    const skipString = (/** @type {number} */ at) => {
        const quote = source[at];
        let j = at + 1;
        while (j < source.length && source[j] !== quote && source[j] !== '\n') j += source[j] === '\\' ? 2 : 1;
        return j + 1;
    };
    /** Skip code inside `${…}` up to its closing brace; returns the index after it. */
    const skipCode = (/** @type {number} */ at, /** @type {string} */ close) => {
        let depth = 0;
        let j = at;
        while (j < source.length) {
            const c = source[j];
            if (c === "'" || c === '"') j = skipString(j);
            else if (c === '`') j = skipTemplate(j);
            else if (c === '/' && source[j + 1] === '/') j = source.indexOf('\n', j) === -1 ? source.length : source.indexOf('\n', j);
            else if (c === '/' && source[j + 1] === '*') j = source.indexOf('*/', j + 2) === -1 ? source.length : source.indexOf('*/', j + 2) + 2;
            else if (c === '{') {
                depth += 1;
                j += 1;
            } else if (c === close && depth === 0) return j + 1;
            else {
                if (c === '}') depth -= 1;
                j += 1;
            }
        }
        return j;
    };

    while (i < source.length) {
        const c = source[i];
        if (/\s/.test(c)) i += 1;
        else if (c === '/' && source[i + 1] === '/') {
            const end = source.indexOf('\n', i);
            i = end === -1 ? source.length : end;
        } else if (c === '/' && source[i + 1] === '*') {
            const end = source.indexOf('*/', i + 2);
            i = end === -1 ? source.length : end + 2;
        } else if (c === "'" || c === '"') {
            const end = skipString(i);
            out.push({ kind: 'string', value: source.slice(i + 1, end - 1) });
            i = end;
        } else if (c === '`') {
            i = skipTemplate(i);
            out.push({ kind: 'template', value: '' });
        } else if (c === '/' && regexAllowed()) {
            let j = i + 1;
            let inClass = false;
            while (j < source.length && source[j] !== '\n') {
                if (source[j] === '\\') j += 1;
                else if (source[j] === '[') inClass = true;
                else if (source[j] === ']') inClass = false;
                else if (source[j] === '/' && !inClass) break;
                j += 1;
            }
            i = j + 1;
            while (i < source.length && /[a-z]/i.test(source[i])) i += 1;
            out.push({ kind: 'punct', value: 'regex' });
        } else if (/[\w$]/.test(c)) {
            let j = i;
            while (j < source.length && /[\w$]/.test(source[j])) j += 1;
            out.push({ kind: 'word', value: source.slice(i, j) });
            i = j;
        } else {
            out.push({ kind: 'punct', value: c });
            i += 1;
        }
    }
    return out;
}

/**
 * Every module specifier `source` imports, in source order: `import … from`,
 * a bare `import '…'`, `export … from` and the dynamic `import('…')`.
 *
 * @param {string} source
 * @returns {string[]}
 */
export function specifiers(source) {
    const list = tokens(source);
    /** @type {string[]} */
    const out = [];
    for (let i = 0; i < list.length; i += 1) {
        const token = list[i];
        if (token.kind !== 'word' || (token.value !== 'import' && token.value !== 'export')) continue;
        // A property named import (`x.import`) is not the keyword.
        if (list[i - 1]?.value === '.') continue;
        const next = list[i + 1];
        if (next === undefined) break;
        if (token.value === 'import' && next.value === '.') continue; // import.meta
        if (token.value === 'import' && next.value === '(') {
            if (list[i + 2]?.kind === 'string' && list[i + 3]?.value === ')') out.push(list[i + 2].value);
            continue;
        }
        if (token.value === 'import' && next.kind === 'string') {
            out.push(next.value);
            continue;
        }
        // Only `export {…} from` and `export * from` name a module; `export const` does not.
        if (token.value === 'export' && next.value !== '{' && next.value !== '*') continue;
        for (let j = i + 1; j < list.length; j += 1) {
            const t = list[j];
            if (t.value === ';' || (t.kind === 'word' && (t.value === 'import' || t.value === 'export'))) break;
            if (t.kind === 'word' && t.value === 'from' && list[j + 1]?.kind === 'string') {
                out.push(list[j + 1].value);
                i = j + 1;
                break;
            }
        }
    }
    return out;
}
