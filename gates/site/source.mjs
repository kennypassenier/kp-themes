// Reading source text the way the extractors need it [AR21].
//
// Two chores that every extractor here would otherwise repeat, and one of
// them was already got wrong once by a regex: `js/upload.js` documents its
// markup in a `//` comment containing `accept="image/*"`, and a
// block-comment regex applied first swallowed everything from that `/*`
// down to the next `*/` — sixty lines of real code, including the
// selector the module attaches to. The attribute went missing from the
// extraction and the count still looked plausible, which is exactly the
// failure AR26 is about.
//
// So: a scanner, not a regex. String contents are kept (a selector lives
// in a string), and a quote misread inside a regex literal can only leave
// a comment standing, never drop code.

/**
 * @param {string} source JavaScript or TypeScript
 * @returns {string} the same text with its comments blanked out
 */
export function stripComments(source) {
    let out = '';
    let i = 0;
    while (i < source.length) {
        const ch = source[i];
        if (ch === '/' && source[i + 1] === '/') {
            while (i < source.length && source[i] !== '\n') i++;
            continue;
        }
        if (ch === '/' && source[i + 1] === '*') {
            const end = source.indexOf('*/', i + 2);
            i = end < 0 ? source.length : end + 2;
            continue;
        }
        if (ch === "'" || ch === '"' || ch === '`') {
            out += ch;
            i++;
            while (i < source.length) {
                const c = source[i];
                out += c;
                i++;
                if (c === '\\') {
                    out += source[i] ?? '';
                    i++;
                    continue;
                }
                if (c === ch) break;
            }
            continue;
        }
        out += ch;
        i++;
    }
    return out;
}

/**
 * The index of the `}`, `)` or `]` matching the opener at `open`.
 *
 * @param {string} source
 * @param {number} open index of the opening bracket
 */
export function matchingBracket(source, open) {
    const pairs = { '{': '}', '(': ')', '[': ']' };
    const opener = /** @type {keyof typeof pairs} */ (source[open]);
    const closer = pairs[opener];
    if (!closer) throw new Error(`matchingBracket: index ${open} is "${source[open]}", not an opening bracket`);
    let depth = 0;
    for (let i = open; i < source.length; i++) {
        if (source[i] === opener) depth++;
        else if (source[i] === closer) {
            depth--;
            if (depth === 0) return i;
        }
    }
    throw new Error(`matchingBracket: no ${closer} closes the ${opener} at index ${open}`);
}
