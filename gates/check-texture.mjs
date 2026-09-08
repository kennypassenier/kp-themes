// The texture layer is felt, not seen [DI9, AR46].
//
// DI9's ceiling — `textureOpacityCeiling` in gates/config.json, 0.06 —
// was written down at round one and enforced by nothing: the critic's
// build pass found the number referenced in config.json and read by no
// gate at all. The register hid its 4% inside a gradient's alpha with
// `--fx-texture-opacity: 1`, and the approved demo's scanlines sit at
// 0.13 × 0.55 = 7.2%, over the ceiling, with nobody the wiser.
//
// So this gate reads every `--fx-texture` declaration in the authored
// stylesheets and computes the EFFECTIVE opacity the way the browser
// paints it: the block's `--fx-texture-opacity` (the layer's opacity)
// multiplied by the strongest alpha the texture value itself carries — an
// `hsl(… / 0.04)` or `rgba(…, 0.5)` stop, an SVG's `fill-opacity` or
// `stroke-opacity`, and 1 when the value declares no alpha (a white star
// is fully white). A texture is one number, not two places to hide one.
//
// It reports rather than refuses [Kenny, 2026-09-09]. It ran as a gate
// until then, with two lists beside it — a per-theme ceiling for a theme
// whose approved demo measured stronger, and a `texture-pending.json`
// ratchet for the rest — and both were the same thing: a place to write
// down that the rule does not apply here. The rule is advice now, so
// there is nothing to be excused from and neither list exists. Every
// declaration over DI9's number is simply named in the output.
//
// Usage: node gates/check-texture.mjs

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { rulesOf } from './selectors.mjs';
import { stylesheets } from './stylesheets.mjs';

const root = new URL('../', import.meta.url);
const CONFIG = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf8'));
export const CEILING = Number(CONFIG.textureOpacityCeiling.value);

// The per-theme ceiling list is gone [Kenny, 2026-09-09]. It existed
// because this was a gate and an approved demo had to be exempt from it;
// it is advice now, so a theme that paints stronger than DI9's number
// reads as exactly that in the output and needs no entry anywhere.

/**
 * The ceiling a declaration is held to, and the theme it belongs to.
 *
 * @param {string} selector
 * @param {number} fallback
 * @returns {{ ceiling: number, theme: string | null }}
 */
export function ceilingFor(selector, fallback) {
    const theme = selector.match(/\[data-theme='([a-z-]+)'\]/);
    return { ceiling: fallback, theme: theme ? theme[1] : null };
}

/** The stylesheets that declare textures. */
export const CSS = stylesheets('texture');

/**
 * The strongest alpha a texture value carries, or 1 when it declares none.
 *
 * @param {string} value the `--fx-texture` value
 * @returns {number}
 */
export function strongestAlpha(value) {
    let strongest = 0;
    let found = false;
    // `/ a)` closes a modern colour function — `hsl(from var(--x) h s l / 0.06)`
    // nests a var() inside, so the alpha is matched by its own shape rather
    // than by counting the function's parentheses.
    for (const m of value.matchAll(/\/\s*([\d.]+%?)\s*\)/g)) {
        found = true;
        strongest = Math.max(strongest, m[1].endsWith('%') ? Number(m[1].slice(0, -1)) / 100 : Number(m[1]));
    }
    // Legacy `rgba(r, g, b, a)` / `hsla(h, s, l, a)`: the fourth comma-separated argument.
    for (const m of value.matchAll(/(?:rgba|hsla)\(\s*[^,()]+,\s*[^,()]+,\s*[^,()]+,\s*([\d.]+)\s*\)/g)) {
        found = true;
        strongest = Math.max(strongest, Number(m[1]));
    }
    // An SVG data URI: fill-opacity / stroke-opacity, percent-encoded or not.
    const decoded = value.includes('data:image/svg+xml') ? decodeURIComponent(value) : value;
    for (const m of decoded.matchAll(/(?:fill|stroke)-opacity=['"]?([\d.]+)/g)) {
        found = true;
        strongest = Math.max(strongest, Number(m[1]));
    }
    // A colour with no alpha anywhere in the value paints at full strength.
    if (!found) return 1;
    // A value that mixes alpha stops with opaque colours (`transparent`
    // aside) is bounded by the opaque colour.
    if (/(?:^|[\s,(])(?:#[0-9a-fA-F]{3,6}\b|white|black|currentColor)/.test(decoded.replace(/fill=['"]?(?:white|black)/g, 'X'))) return 1;
    return strongest;
}

/**
 * Every texture declaration in a stylesheet: the selector it sits under,
 * the layer opacity, the strongest alpha and the effective value.
 *
 * @param {string} source
 * @returns {{ selector: string, opacity: number, alpha: number, effective: number, line: number }[]}
 */
export function textures(source) {
    /** @type {{ selector: string, opacity: number, alpha: number, effective: number, line: number }[]} */
    const out = [];
    for (const [selector, rules] of rulesOf(source)) {
        for (const rule of rules) {
            const texture = rule.body.match(/--fx-texture:\s*([^;]+);/);
            if (!texture) continue;
            const opacityMatch = rule.body.match(/--fx-texture-opacity:\s*([\d.]+)/);
            // No declared layer opacity means the base rule's default, 0:
            // a texture nobody turned on paints nothing.
            const opacity = opacityMatch ? Number(opacityMatch[1]) : 0;
            const alpha = strongestAlpha(texture[1]);
            out.push({ selector, opacity, alpha, effective: Number((opacity * alpha).toFixed(4)), line: rule.line });
        }
    }
    return out;
}

/**
 * @param {Map<string, string>} sources file → css
 * @param {number} ceiling
 * @returns {{ checked: number, over: string[] }}
 */
export function audit(sources, ceiling) {
    let checked = 0;
    /** @type {string[]} */
    const over = [];
    for (const [file, source] of sources) {
        for (const t of textures(source)) {
            checked++;
            const { ceiling: bar } = ceilingFor(t.selector, ceiling);
            if (t.effective <= bar) continue;
            over.push(
                `${file}:${t.line} ${t.selector}: texture paints at ${t.effective} (layer ${t.opacity} × alpha ${t.alpha}), over DI9's ceiling of ${ceiling}`,
            );
        }
    }
    return { checked, over };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    /** @type {Map<string, string>} */
    const sources = new Map(CSS.map((file) => [file, readFileSync(new URL(file, root), 'utf8')]));
    if (process.argv.includes('--measure')) {
        for (const [file, source] of sources)
            for (const t of textures(source)) console.log(`${file}:${t.line} ${t.selector} → ${t.effective} (${t.opacity} × ${t.alpha})`);
        process.exit(0);
    }
    const { checked, over } = audit(sources, CEILING);
    // A broken measurement is still a failure: reporting "nothing over
    // the ceiling" because nothing was read is the one outcome this
    // cannot be allowed to print.
    if (checked === 0) {
        console.error('the texture reading broke: found no texture declarations, which cannot be right while the themes ship textures.');
        process.exit(1);
    }
    for (const line of over) console.log(line);
    console.log(
        `Texture: ${checked} declarations measured against DI9's ceiling of ${CEILING}; ${over.length} over it. Advice, not a verdict [Kenny, 2026-09-09].`,
    );
}
