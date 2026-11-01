// What the strings gate (gates/check-strings.mjs) looks at: the watched directories, the files not checked, the calls that put text on screen, the keys and words that are not text.

/** The directories whose code a consumer runs. Gates and tests are ours. */
export const WATCHED = ['js', 'components', 'hooks', 'fx'];

/** js/strings.js IS the dictionary, so its own sentences are the point. */
export const NOT_CHECKED = [
    // The dictionary itself: its sentences are the point. It is a facade over js/strings/ since the split.
    'js/strings.js',
    'js/strings/',
    // Generated from themes/*/tokens.json. The theme labels are Kenny's
    // names for his themes, not interface chrome — "Hoog contrast" stays
    // Dutch on an English page the way a product name does.
    'js/theme-registry.js',
];

/**
 * Where a literal actually reaches a person.
 *
 * The first version of this gate guessed from the shape of the string,
 * and guessing produced eighty findings of which six were real. A literal
 * is user-visible because of where it GOES, not because of how it looks —
 * `${bytes} kB` and `relative inline-block` are both "words" and neither
 * is something anybody translates.
 *
 * So this matches sinks: the properties and attributes that put text in
 * front of someone, plus JSX text nodes. Narrower, and every hit is real.
 */
export const SINKS = [
    // el.textContent = 'Something'
    /\.(?:textContent|innerText|placeholder|title|value)\s*=\s*(['"`])((?:[^'"`\\\n]|\\.)+)\1/g,
    // setAttribute('aria-label', 'Something')
    /setAttribute\(\s*['"`](?:aria-label|placeholder|title|alt|aria-description)['"`]\s*,\s*(['"`])((?:[^'"`\\\n]|\\.)+)\1/g,
    // JSX: aria-label="Something" / placeholder={'Something'}
    /(?:aria-label|placeholder|title|alt|aria-description|aria-valuetext)=\{?\s*(['"`])((?:[^'"`\\\n]|\\.)+)\1/g,
    // toast('Something')
    /toast\(\s*(['"`])((?:[^'"`\\\n]|\\.)+)\1/g,
];

/**
 * Attributes whose value is never something a person reads. Anything not
 * on this list, inside a .jsx file, is treated as text — which is the
 * right default: a new attribute that does carry text should have to be
 * thought about, not silently ignored.
 */
export const NOT_TEXT_ATTR =
    /(?:className|class|id|key|href|src|type|role|name|htmlFor|value|form|method|target|rel|slot|style|data-[\w-]+|aria-controls|aria-labelledby|aria-describedby|aria-activedescendant|popoverTarget|anchorName|positionAnchor|gridColumn|gridRow|width|background|content)\s*=\s*\{?\s*$/;

/**
 * A string literal inside a JSX file that is not an attribute above.
 *
 * This is the half the sink list cannot reach: an sr-only announcement is
 * rendered through an expression — `{copied ? \`${value} copied\` : ''}` —
 * which is neither a text node nor an attribute. That is exactly the
 * shape that made `Copyable` unusable in English, so a gate that misses
 * it misses the case it was written for. Drilled to prove it.
 */
// Every literal, including the one-character ones: skipping those made the
// scanner pair the closing quote of '+' with the opening quote of '-' and
// report the code between them as a string [KT7]. Length is filtered below.
export const JSX_LITERAL = /(['"`])((?:[^'"`\\\n]|\\.)*)\1/g;

/** Calls whose string argument is a CSS selector, never text [KT7]. */
export const NOT_TEXT_CALL = /(?:closest|querySelector|querySelectorAll|matches)\(\s*$/;

/** KeyboardEvent.key values and DOM event names: API constants, not text. */
const KEYS = new Set([
    'Enter',
    'Escape',
    'Tab',
    'Home',
    'End',
    'Backspace',
    'Delete',
    'PageUp',
    'PageDown',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Shift',
    'Control',
    'Alt',
    'Meta',
    'DOMContentLoaded',
]);

/** CSS values that happen to be English words. */
const CSS_WORDS = new Set(['contents', 'monospace', 'nearest', 'center', 'block', 'inline', 'auto', 'none', 'polite', 'assertive', 'step']);

/** @param {string} text @returns {boolean} */
export function readsLikeText(text) {
    // The hole stands in as a word for the "is this a phrase" test, and
    // as a space for everything else. Without that, `${value} copied`
    // reduced to the single lowercase word "copied" and was rejected as
    // an attribute value — which is precisely the sr-only announcement
    // that made Copyable unusable in English, so the gate would have
    // missed the case it exists for. The drill caught it.
    const spaced = text.replace(/\$\{[^}]*\}/g, ' ');
    const probe = text.replace(/\$\{[^}]*\}/g, ' Xxx ').trim();
    const trimmed = spaced.trim();
    // Key names, event names and CSS keywords are API values: renaming
    // "Enter" breaks the keyboard rather than translating anything.
    if (KEYS.has(trimmed)) return false;
    if (CSS_WORDS.has(trimmed)) return false;
    // A canvas font shorthand — "16px monospace" — is CSS with a space in
    // it, not a phrase.
    if (trimmed.split(/\s+/).every((word) => word === '' || CSS_WORDS.has(word) || /^[\d.]*(?:px|rem|em|%)$/.test(word))) return false;
    if (/[{}<>();=[\]/\\|&$#@*+~^%]/.test(trimmed)) return false;
    const words = probe.split(/\s+/).filter((token) => /^[A-Za-zÀ-ÿ']{3,}[.,!?…:;]?$/.test(token) && token !== 'Xxx');
    if (words.length === 0) return false;
    return /\s/.test(probe) || /^[A-ZÀ-Ý]/.test(probe);
}
