// Colour arithmetic shared by every gate and by the state derivation [AR4].
//
// Values are authored and emitted as `hsl(h, s%, l%)`, because that is what
// the stylesheet has always used and what the vendored copies contain. But
// HSL lightness is not perceptually uniform: one numeric step on terminal's
// saturated green and on formal's dark navy look nothing alike. So anything
// that reasons about how a colour *looks* — the derivation, the distance
// checks — converts to OKLCh first and comes back at the end.
//
// Nothing here is configuration. The WCAG numbers below are standards
// constants and stay pinned with the reason; the house numbers that get
// tuned live in gates/config.json.

/** @typedef {{h: number, s: number, l: number}} Hsl */
/** @typedef {[number, number, number]} Rgb linear-ish sRGB in 0..1 */

/**
 * @param {string} text e.g. "hsl(40, 25%, 97%)"
 * @returns {Hsl}
 */
export function parseHsl(text) {
    const n = text.match(/-?[\d.]+/g);
    if (!n || n.length < 3) throw new Error(`not an hsl() value: ${text}`);
    return { h: Number(n[0]), s: Number(n[1]), l: Number(n[2]) };
}

/** @param {Hsl} c @returns {string} */
export function formatHsl({ h, s, l }) {
    const r = (v, p = 0) => Number(v.toFixed(p));
    return `hsl(${r(h)}, ${r(s)}%, ${r(l)}%)`;
}

/** @param {Hsl} c @returns {Rgb} */
export function hslToRgb({ h, s, l }) {
    const S = s / 100;
    const L = l / 100;
    const c = (1 - Math.abs(2 * L - 1)) * S;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = L - c / 2;
    const [r, g, b] = [
        [c, x, 0],
        [x, c, 0],
        [0, c, x],
        [0, x, c],
        [x, 0, c],
        [c, 0, x],
    ][Math.floor(h / 60) % 6];
    return [r + m, g + m, b + m];
}

/** @param {Rgb} rgb @returns {Hsl} */
export function rgbToHsl([r, g, b]) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    if (d === 0) return { h: 0, s: 0, l: l * 100 };
    const s = d / (1 - Math.abs(2 * l - 1));
    let h;
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
    return { h: (h + 360) % 360, s: s * 100, l: l * 100 };
}

const srgbToLinear = (u) => (u <= 0.04045 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (u) => (u <= 0.0031308 ? u * 12.92 : 1.055 * u ** (1 / 2.4) - 0.055);

/**
 * WCAG relative luminance. Note the 0.03928 threshold: it is the value the
 * specification names, and it differs slightly from the sRGB standard's
 * 0.04045. Pinned deliberately — the gates measure against WCAG.
 * @param {Rgb} rgb
 */
export function luminance([r, g, b]) {
    const f = (u) => (u <= 0.03928 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/**
 * WCAG contrast ratio between two colours.
 * @param {Rgb} a @param {Rgb} b
 */
export function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}

/** @param {Rgb} rgb @returns {{L: number, C: number, h: number}} OKLCh */
export function rgbToOklch(rgb) {
    const [r, g, b] = rgb.map(srgbToLinear);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return { L, C: Math.hypot(a, bb), h: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
}

/** @param {{L: number, C: number, h: number}} c @returns {Rgb} clamped to sRGB */
export function oklchToRgb({ L, C, h }) {
    const a = C * Math.cos((h * Math.PI) / 180);
    const b = C * Math.sin((h * Math.PI) / 180);
    const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const lin = [
        4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
        -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
        -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
    ];
    return /** @type {Rgb} */ (lin.map((u) => Math.min(1, Math.max(0, linearToSrgb(u)))));
}

/**
 * Machado, Oliveira & Fernandes (2009), severity 1.0. Deuteranomaly is the
 * commonest form: about 8% of men and 0.4% of women of European ancestry
 * (Birch, JOSA A 29(3), 2012).
 * @param {Rgb} rgb @returns {Rgb}
 */
export function simulateDeuteranopia(rgb) {
    const M = [
        [0.367322, 0.860646, -0.227968],
        [0.280085, 0.672501, 0.047413],
        [-0.01182, 0.04294, 0.968881],
    ];
    return /** @type {Rgb} */ (M.map((row) => Math.min(1, Math.max(0, row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2]))));
}

/**
 * Perceptual distance in OKLab, scaled so the numbers read on the familiar
 * CIE76 scale where roughly 10 is "tells them apart".
 * @param {Rgb} a @param {Rgb} b
 */
export function distance(a, b) {
    const A = rgbToOklch(a);
    const B = rgbToOklch(b);
    const [ax, ay] = [A.C * Math.cos((A.h * Math.PI) / 180), A.C * Math.sin((A.h * Math.PI) / 180)];
    const [bx, by] = [B.C * Math.cos((B.h * Math.PI) / 180), B.C * Math.sin((B.h * Math.PI) / 180)];
    return Math.hypot(A.L - B.L, ax - bx, ay - by) * 100;
}

/** Convenience: parse an authored value straight to sRGB. */
export const hsl = (text) => hslToRgb(parseHsl(text));

/**
 * Move a colour a given number of derivation steps away from a reference —
 * lighter on a dark ground, darker on a light one. Done in OKLCh so a step
 * is the same perceived size in every theme (AR4), which is the property
 * AR12's worst-case shortcut depends on.
 * @param {string} value the authored hsl() text
 * @param {number} steps
 * @param {{towardsLight: boolean, stepL: number}} opts
 * @returns {string} an hsl() value
 */
export function derive(value, steps, { towardsLight, stepL }) {
    const c = rgbToOklch(hsl(value));
    const L = Math.min(1, Math.max(0, c.L + (towardsLight ? 1 : -1) * steps * stepL));
    return formatHsl(rgbToHsl(oklchToRgb({ ...c, L })));
}
