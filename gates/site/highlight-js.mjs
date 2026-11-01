// The JavaScript tokenizer of the documentation highlighter (gates/site/highlight.mjs): keywords, strings, templates, comments, numbers.
/** @typedef {import('./highlight.mjs').Kind} Kind */
/** @typedef {import('./highlight.mjs').Token} Token */

/** What a documentation snippet actually contains. Not the whole language. */
const JS_KEYWORDS = new Set([
    'as',
    'async',
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'from',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'let',
    'new',
    'null',
    'of',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'undefined',
    'var',
    'void',
    'while',
    'yield',
]);

/**
 * @param {Token[]} out
 * @param {Kind} kind
 * @param {string} text
 */
export function push(out, kind, text) {
    if (text === '') return;
    const last = out[out.length - 1];
    if (last && last.kind === kind) last.text += text;
    else out.push({ kind, text });
}

/** @param {string} code @returns {Token[]} */
export function tokenizeJs(code) {
    /** @type {Token[]} */
    const out = [];
    let i = 0;
    while (i < code.length) {
        const rest = code.slice(i);
        const line = /^\/\/[^\n]*/.exec(rest);
        if (line) {
            push(out, 'comment', line[0]);
            i += line[0].length;
            continue;
        }
        const block = /^\/\*[\s\S]*?(?:\*\/|$)/.exec(rest);
        if (block) {
            push(out, 'comment', block[0]);
            i += block[0].length;
            continue;
        }
        const string = /^(['"`])(?:\\.|(?!\1)[\s\S])*\1?/.exec(rest);
        if (string) {
            push(out, 'string', string[0]);
            i += string[0].length;
            continue;
        }
        const number = /^\d[\d_.]*(?:e[+-]?\d+)?/i.exec(rest);
        if (number) {
            push(out, 'string', number[0]);
            i += number[0].length;
            continue;
        }
        const word = /^[A-Za-z_$][\w$]*/.exec(rest);
        if (word) {
            push(out, JS_KEYWORDS.has(word[0]) ? 'keyword' : 'plain', word[0]);
            i += word[0].length;
            continue;
        }
        push(out, 'plain', code[i] ?? '');
        i++;
    }
    return out;
}

/**
 * Looking forward from a `name:` to decide whether it was a property.
 *
 * @param {string} after the text following the identifier
 */
export function endsAsDeclaration(after) {
    let parens = 0;
    for (const ch of after) {
        if (ch === '(') parens++;
        else if (ch === ')') {
            if (parens === 0) return true;
            parens--;
        } else if (parens === 0 && (ch === ';' || ch === '}')) return true;
        else if (parens === 0 && ch === '{') return false;
    }
    return false;
}
