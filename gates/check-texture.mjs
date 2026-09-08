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
// Today's offenders live in gates/texture-pending.json with their
// measured value and the milestone that resolves them — a ratchet with
// the same two-way stale check as the coverage gate: an entry the
// stylesheet no longer exceeds is itself a failure. C2 empties the
// cyberpunk entry (AR46); the others are a finding for Kenny in the AFK
// queue, because a ceiling that was never enforced is a decision to
// re-take, not a fault to fix silently.
//
// Usage: node gates/check-texture.mjs

import { readFileSync } from 'node:fs';
import process from 'node:process';
import { rulesOf } from './selectors.mjs';
import { stylesheets } from './stylesheets.mjs';

const root = new URL('../', import.meta.url);
const CONFIG = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf8'));
export const CEILING = Number(CONFIG.textureOpacityCeiling.value);

/** Per-theme ceilings [S49]: a theme's approved demo may measure stronger. */
export const PER_THEME = Object.fromEntries(
    Object.entries(CONFIG.textureOpacityCeiling.perTheme ?? {})
        .filter(([name]) => name !== '//')
        .map(([name, value]) => [name, Number(value)]),
);

/**
 * The ceiling a declaration is held to: its theme's own, or DI9's.
 *
 * @param {string} selector
 * @param {number} fallback
 * @returns {{ ceiling: number, theme: string | null }}
 */
export function ceilingFor(selector, fallback) {
    const theme = selector.match(/\[data-theme='([a-z-]+)'\]/);
    const name = theme ? theme[1] : null;
    return { ceiling: name && name in PER_THEME ? PER_THEME[name] : fallback, theme: name };
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
 * @param {Record<string, number>} pending selector → the measured effective value, per gates/texture-pending.json
 * @param {number} ceiling
 * @returns {{ checked: number, over: string[], stale: string[] }}
 */
export function audit(sources, pending, ceiling) {
    let checked = 0;
    /** @type {string[]} */
    const over = [];
    /** @type {Set<string>} */
    const seen = new Set();
    for (const [file, source] of sources) {
        for (const t of textures(source)) {
            checked++;
            seen.add(t.selector);
            const { ceiling: bar, theme } = ceilingFor(t.selector, ceiling);
            if (t.effective <= bar) continue;
            const excused = pending[t.selector];
            if (excused === undefined)
                over.push(
                    `${file}:${t.line} ${t.selector}: texture paints at ${t.effective} (layer ${t.opacity} × alpha ${t.alpha}), over ${theme && theme in PER_THEME ? `${theme}'s ceiling of ${bar}` : `DI9's ceiling of ${ceiling}`}`,
                );
            else if (Math.abs(excused - t.effective) > 0.005)
                over.push(`${file}:${t.line} ${t.selector}: pending at ${excused} but paints at ${t.effective} — update the entry or the stylesheet`);
        }
    }
    const stale = Object.keys(pending).filter((selector) => {
        if (!seen.has(selector)) return true;
        for (const source of sources.values())
            for (const t of textures(source)) if (t.selector === selector && t.effective > ceilingFor(t.selector, ceiling).ceiling) return false;
        return true;
    });
    return { checked, over, stale };
}

if (import.meta.url === `file://${process.argv[1]}`) {
    /** @type {Map<string, string>} */
    const sources = new Map(CSS.map((file) => [file, readFileSync(new URL(file, root), 'utf8')]));
    /** @type {Record<string, number>} */
    const pending = JSON.parse(readFileSync(new URL('texture-pending.json', import.meta.url), 'utf8'));
    delete (/** @type {Record<string, unknown>} */ (pending)['//']);
    if (process.argv.includes('--measure')) {
        for (const [file, source] of sources)
            for (const t of textures(source)) console.log(`${file}:${t.line} ${t.selector} → ${t.effective} (${t.opacity} × ${t.alpha})`);
        process.exit(0);
    }
    const { checked, over, stale } = audit(sources, pending, CEILING);
    let failed = 0;
    for (const line of over) {
        failed++;
        console.error(line);
    }
    for (const selector of stale) {
        failed++;
        console.error(
            `${selector} is in gates/texture-pending.json and no longer exceeds the ceiling, or no longer declares a texture — remove the entry.`,
        );
    }
    if (checked === 0) {
        console.error('gate broke: found no texture declarations, which cannot be right while the themes ship textures.');
        process.exit(1);
    }
    if (failed > 0) {
        console.error(`\n${failed} texture fault(s) against DI9.`);
        process.exit(1);
    }
    console.log(
        `Texture: ${checked} declarations measured against DI9's ceiling of ${CEILING} (${Object.keys(PER_THEME).length} theme(s) with their own, from their approved demo); ${Object.keys(pending).length} pending with their measured value.`,
    );
}
