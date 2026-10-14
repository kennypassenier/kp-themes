// One parser for the colours a browser reports from getComputedStyle, shared by
// the tests that read a painted colour (suite triage 10.0.0, rows 22, 29, 44).
//
// A plain colour computes to `rgb(r, g, b)`; a relative one (`hsl(from …)`) to
// `color(srgb r g b)`; and Firefox serialises `color-mix(in oklab, …)` and
// `oklch(from …)` as `oklab(L a b)` or `oklch(L C h)`. A test that only knew
// the first two called a deliberate mix of a theme's own tokens "a foreign
// colour" or "not a colour". This reads all of them, in Node, never in the page.

/** @param {string} word one number of a colour function, `none`, a percentage or an angle @param {number} full what 100% means */
const num = (word, full) => {
    if (word === 'none') return 0;
    if (word.endsWith('%')) return (Number(word.slice(0, -1)) / 100) * full;
    if (word.endsWith('deg')) return Number(word.slice(0, -3));
    if (word.endsWith('turn')) return Number(word.slice(0, -4)) * 360;
    if (word.endsWith('rad')) return (Number(word.slice(0, -3)) * 180) / Math.PI;
    return Number(word);
};

/** @param {number} linear linear-light sRGB channel, 0..1 */
const gamma = (linear) => {
    const c = Math.min(1, Math.max(0, linear));
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};

/**
 * Oklab to sRGB 0..1 (Björn Ottosson's matrices), clipped into gamut.
 * @param {number} L @param {number} a @param {number} b
 */
const oklab = (L, a, b) => {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
        gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    ];
};

/**
 * A computed CSS colour as `{ r, g, b, a }`, channels 0..255 (rounded), alpha 0..1.
 * Returns null for anything it does not know, so a caller decides what that means.
 * @param {string} css
 * @returns {{ r: number, g: number, b: number, a: number } | null}
 */
export function parseColour(css) {
    const text = String(css).trim();
    if (text === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
    const fn = /^([a-z]+)\(\s*(.*)\s*\)$/i.exec(text);
    if (!fn) return null;
    let name = fn[1].toLowerCase();
    let body = fn[2];
    if (name === 'color') {
        const space = /^(\S+)\s+(.*)$/.exec(body);
        if (!space || space[1] !== 'srgb') return null;
        name = 'srgb';
        body = space[2];
    }
    const [channels, alphaWord] = body.split('/').map((part) => part.trim());
    const words = channels.split(/[\s,]+/).filter(Boolean);
    let alpha = alphaWord === undefined ? 1 : num(alphaWord, 1);
    if (words.length === 4 && alphaWord === undefined) alpha = num(words.pop() ?? '1', 1);
    if (words.length !== 3) return null;
    /** @type {number[]} sRGB 0..1 */
    let srgb;
    if (name === 'rgb' || name === 'rgba') srgb = words.map((w) => num(w, 255) / 255);
    else if (name === 'srgb') srgb = words.map((w) => num(w, 1));
    else if (name === 'oklab') srgb = oklab(num(words[0], 1), num(words[1], 0.4), num(words[2], 0.4));
    else if (name === 'oklch') {
        const [L, C, h] = [num(words[0], 1), num(words[1], 0.4), (num(words[2], 360) * Math.PI) / 180];
        srgb = oklab(L, C * Math.cos(h), C * Math.sin(h));
    } else return null;
    const [r, g, b] = srgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255));
    return { r, g, b, a: alpha };
}

/** Like parseColour, but a colour it cannot read is an error that says so. @param {string} css */
export function colourOf(css) {
    const colour = parseColour(css);
    if (!colour) throw new Error(`not a colour: ${css}`);
    return colour;
}
