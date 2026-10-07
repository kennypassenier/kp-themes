// Motion invariants [L3, DI5, DI7]. Reads the stylesheets, not the tokens.
//
// DI5 is the only invariant in this project whose violation causes physical
// injury, and until now nobody had computed its numbers.
//
// Usage: node gates/check-motion.mjs

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { TIMINGS } from '../js/effects.js';
import { stylesheets } from './stylesheets.mjs';

/**
 * WCAG 2.2 SC 2.3.1 Three Flashes or Below Threshold, Level A. Standards
 * constants, pinned with their reason: no more than three opposing
 * relative-luminance changes of 10% or more per second. (The area escape —
 * a flash smaller than roughly 341 x 256 CSS px is exempt — is deliberately
 * not used here. These effects cover the page.)
 */
const MAX_FLASHES_PER_SECOND = 3;
const LUMINANCE_STEP = 0.1;

/**
 * The shortest --fx-duration any theme declares. An animation whose
 * duration is a calc() over that token is bounded by this, so the gate
 * measures the worst case rather than giving up.
 */
// A theme that declares 0ms runs no motion at all (high-contrast since
// 2026-09-05), so it cannot flash: the bound is the shortest duration a
// theme that moves declares. At 0 every computed duration read as Infinity
// flashes, which is what the compliance table published once it was
// regenerated on 2026-10-04 (it had not been since report:di5 started
// refusing, which stops `generate:all` before the table).
export const SHORTEST_THEME_DURATION_MS = Math.min(
    ...[...readFileSync(new URL('../css/themes.css', import.meta.url), 'utf8').matchAll(/--fx-duration:\s*([\d.]+)ms/g)]
        .map((m) => Number(m[1]))
        .filter((ms) => ms > 0),
);

/**
 * The duration to rate an animation at: its literal, else, for a custom
 * property such as `var(--kp-sig-dur)`, the shortest value the same
 * stylesheet gives that property (a register sets it per element), else the
 * shortest a theme that moves declares. The compliance table rates with the
 * same function [step-6].
 * @param {{ name: string, durationMs: number | null, duration: string }} anim
 * @param {string} source
 * @returns {number}
 */
export function durationBound(anim, source) {
    if (anim.durationMs !== null) return anim.durationMs;
    const custom = /var\(\s*(--[\w-]+)/.exec(anim.duration);
    if (custom) {
        const declaration = new RegExp(`${custom[1]}:\\s*([\\d.]+)(ms|s)\\b`, 'g');
        const ms = (/** @type {RegExpMatchArray} */ m) => (m[2] === 's' ? Number(m[1]) * 1000 : Number(m[1]));
        // The property is set on the element the animation runs on, or on
        // the element whose pseudo-element runs it: read the rule block that
        // names the animation, else the blocks for the same element
        // (its selector without the pseudo-element).
        const selectorOf = (/** @type {number} */ open) => {
            const start = Math.max(source.lastIndexOf('}', open), source.lastIndexOf('{', open - 1), source.lastIndexOf('*/', open)) + 1;
            return source
                .slice(start, open)
                .replace(/::?(after|before)\b/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };
        const found = [];
        const uses = new RegExp(`animation[^;]*\\b${anim.name}\\b`, 'g');
        for (const use of source.matchAll(uses)) {
            const open = source.lastIndexOf('{', use.index);
            const close = source.indexOf('}', use.index);
            const own = [...source.slice(open, close).matchAll(declaration)].map(ms);
            if (own.length) {
                found.push(Math.min(...own));
                continue;
            }
            const element = selectorOf(open);
            for (const brace of source.matchAll(/\{/g)) {
                const at = /** @type {number} */ (brace.index);
                if (selectorOf(at) !== element) continue;
                const end = source.indexOf('}', at);
                const there = [...source.slice(at, end).matchAll(declaration)].map(ms);
                if (there.length) found.push(Math.min(...there));
            }
        }
        if (found.length) return Math.min(...found);
        const declared = [...source.matchAll(declaration)].map(ms);
        if (declared.length) return Math.min(...declared);
    }
    return SHORTEST_THEME_DURATION_MS;
}

/**
 * Whether every opacity animation a stylesheet runs stays under the flash
 * threshold, rated the one way: the compliance table and the gate's test
 * read this, so the same sum cannot drift between them [step-6].
 * @param {string} source
 * @returns {boolean}
 */
export function flashVerdict(source) {
    const frames = parseOpacityKeyframes(source);
    for (const anim of animations(source)) {
        const stops = frames.get(anim.name);
        if (!stops) continue;
        if (flashesPerSecond(stops, durationBound(anim, source), anim.cycles) > MAX_FLASHES_PER_SECOND) return false;
    }
    return true;
}

// components.css joined this list the moment it grew an animation. A
// motion gate that reads two of three stylesheets reports green over the
// one it does not read.
const CSS = stylesheets('motion').map((file) => `../${file}`);

/**
 * Animations the flash threshold does not reach, each with the reason.
 * AR8: a gate says what it did not check, or it is not a gate. An
 * animation missing from both this list and the opacity analysis fails.
 */
/** @type {Record<string, string>} */
const OUT_OF_SCOPE = {
    // The phantom register [PH1]: the loader's bar and its shove out, both
    // transforms; the retro register [RT1]: the selection bar and the
    // redaction brush, both clip-paths; the terminal register [TM1]: the
    // sweep band; the brutalism register [BR1]: the slam and the marquee.
    'kp-bar-run': 'a horizontal scale on a 3px bar, once; no luminance change and nothing over 341x256 px',
    'kp-load-out': 'the arrival overlay skewing and translating off the viewport once; the overlay keeps its colours, only its position moves',
    'kp-drag-select': 'a clip-path widening over a phrase once (the selection bar); under 341x256 px',
    'kp-redact-lift': 'a clip-path narrowing over a phrase once (the redaction brush); under 341x256 px',
    'kp-sweep': 'a band translating down the viewport once per ten seconds, resting eight of them; a transform, and the band is a 9% tint',
    'kp-caret': 'a background layer of one character cell appearing and disappearing once a second; rated in TIMINGS at 1/s and under 341x256 px',
    'kp-caret-reverse':
        'the colour of the one character under kp-caret switching in step with it, once a second; rated in TIMINGS at 1/s and under 341x256 px',
    'kp-slam': 'a word translating onto its text-shadow once; a transform on a word, under 341x256 px',
    'kp-marquee': 'a strip translating -50% over 42 seconds; the strip keeps its colours, only its position moves',
    // The solstice register [scope-12]: the raking band.
    'kp-rake': 'a 45%-wide band translating once across a control under the pointer; a transform, and the band is a 50% tint of the theme primary',
    // The synthwave register [SW1].
    'kp-shine':
        'a highlight band sliding across clipped text once (background-position); the text keeps its colours and the band is under 341x256 px',
    'kp-tube-on': 'a colour and text-shadow switch on an inline phrase, one dip, once; rated in TIMINGS at 2.7/s and under 341x256 px',
    'kp-floor-drift': 'a background-position slide of a grid over 6 seconds; the pattern keeps its colours, only its position moves',

    'kp-spin': 'a rotation: no luminance change at all',
    'kp-rule-in': 'a horizontal scale on a 1px rule; no luminance change and nothing over 341x256 px',
    'kp-settle': 'a scale from 0.92 to 1 on a badge, once',
    'kp-slide-in': 'a 6px translate on a badge, once; nothing changes luminance [TH70]',
    'kp-drift': 'a background-position slide over 40 seconds; the texture keeps its colours, only their position moves',
    // The busy progress bar [scope-140].
    'kp-progressbar-sweep':
        'a band a third of the track wide translating across a bar 0.75rem tall every 1.4 seconds; a transform, the band keeps its colour, only its position moves, and it stands still under reduced motion',
    // Cyberpunk's section divider [scope-96].
    'kp-stream-144':
        'a mask-position slide of a 144px dash tile by one tile every 8 seconds, on a 28px divider; the dashes keep their colours, only their position moves',
    'kp-stream-216':
        'a mask-position slide of a 216px packet tile by one tile every 8 seconds, on a 28px divider; the packets keep their colours, only their position moves',
    'kp-ember': 'a box-shadow that grows and fades once over the card edge; the card itself does not change luminance',
    'kp-charge':
        'a skewed light band translating across a button once on hover, blended over the face; the face itself does not change luminance and the band is under 341x256 px [TH118]',
    // The dark register [S48, LIFT_PLAN row 15]: the mark's ignite and the
    // rule's sweep are both bound to `animation-timeline: view()` — the
    // reader's own scroll position, not a clock — so neither can free-run
    // or loop; each is one monotonic change across its range.
    'kp-ignite':
        'a mark’s ink and underline colour resolving once as the reader scrolls past it; a colour property this gate cannot parse from opacity stops, and it cannot oscillate because it is scroll-bound, not timed',
    'kp-sweep-in':
        'a rule sweeping in under a heading once as it enters the viewport (background-position); the rule keeps its colours, only its position moves, and it is scroll-bound so it cannot loop',
    // The high-contrast register [S48, LIFT_PLAN row 14]: the headline's
    // ellipse wipe (a clip-path reveal, once, on load) and the rule's
    // horizontal scale (a transform on a 3px bar, once, under 341x256 px).
    'kp-hc-headline-wipe': 'a clip-path ellipse wipe across the hero headline, once, on load; no opacity change anywhere',
    'kp-hc-rule-wipe': 'a horizontal scale on a 3px rule under a heading, once, on load; no luminance change and under 341x256 px',
    // The solstice register [S48, LIFT_PLAN row 18].
    'kp-cal-slide':
        'a clip-path sweep, once, over the headline overlay (mix-blend-mode: difference); strictly monotonic in one direction, so it has zero opposing luminance changes, which is the threshold DI5 measures',
    'kp-cal-rule': 'a horizontal scale on a 3px rule; no luminance change and nothing over 341x256 px',
    'kp-cal-redact': 'a background narrowing over one marked phrase in a dossier paragraph, once; under 341x256 px',
    // The mono register [S48, LIFT_PLAN row 11]: a hard-edge mask sweeping
    // once across a headline or a redaction bar (mask-position).
    'kp-wipe':
        'a hard-edge mask sweeping once across a headline (the whole line, unsplit) or a redaction bar (mark::after); the content under the mask keeps its own colours, only the reveal edge moves',
    // The Lapis register [S48, LIFT_PLAN row 6].
    'kp-burnish':
        'a clip-path wipe over the headline once (the burnish); the text is gold from the first frame of the wipe and stays gold, only the reveal boundary moves',
    // The blueprint register [S48, LIFT_PLAN row 6]: the two dimension
    // lines extending like a tape measure, one transform each.
    'kp-dim-draw': 'a horizontal scale on a hairline under the headline, once; no luminance change and nothing over 341x256 px',
    'kp-elev-draw': 'a vertical scale on a hairline beside the headline, once; no luminance change and nothing over 341x256 px',
    // The grotesk register [S48, LIFT_PLAN row 12]: the headline's optical
    // resolve, on the whole, unsplit line (`kp-sharpen-in` — not
    // `kp-focus`/`focus`, which the dark and Shade (dark) registers
    // already own for their own, different mechanics).
    'kp-sharpen-in':
        "a blur+brightness filter resolving a headline from dim to full once, monotone, over 640ms — one change, well under the three DI5 allows, matching the demo's own worked example of a single fade [S49]",
    // The light register [S48, LIFT_PLAN, A1]: the lede mark's
    // background-size sweep, one colour swap on an inline phrase, once —
    // matches the shape of the retro selection bar's kp-drag-select below;
    // under 341x256 px.
    'kp-mark-sweep': 'a background-size sweep with one colour swap on an inline phrase, once; under 341x256 px',
    // The forest register [TP1]: the contour trace beside the headline.
    'kp-trace': 'a stroke-dashoffset draw on a 9rem SVG path once; no luminance change and well under 341x256 px',
    // The Shade (light) register [SL2]: the lede mark's ink-fill is a
    // background-size change, not a luminance one — the fill colour and
    // its alpha are constant throughout, only the covered area grows.
    'kp-mark-in': 'a background-size widening over a mark once, 0% to 100%; the fill colour and alpha never change, only the area',
    // The pastel register [S48, LIFT_PLAN row 6].
    'kp-fill': "a mark's background-size growing from 0% to 100% once; the ink colour itself never changes, only how much of the word it covers",
    'kp-draw': "a rule's width growing from 0% to 100% once; no luminance change and the rule is a few px tall",
    // The woodblock register [S48].
    'kp-kento-blue':
        'a translate of a ghost plate converging to its final offset, once; no luminance change (mix-blend-mode multiply, no opacity or colour-stop keyframe)',
    'kp-kento-red':
        'a translate of a ghost plate converging to its final offset, once; no luminance change (mix-blend-mode multiply, no opacity or colour-stop keyframe)',
    // The shared marquee [M1, 2026-09-08]: one transform across a doubled
    // row, at whatever speed the theme names. No luminance change of its
    // own, and it rests while it is off screen unless a theme says never.
    // The alarm [scope-94]: the split copies of the headline, the letter
    // cells' decode, the hazard stripes and the sweeping band. Every opacity
    // step of the alarm is measured by the pass above; the rendered frames
    // of the whole alarm are measured in tests/alarm.spec.mjs.
    'kp-alarm-slice-in':
        'a clip-path showing thin bands of two copies of the headline, four positions once; the copies keep their colours and a band is under 341x256 px',
    'kp-alarm-slice': 'the same bands for 200 ms once every five seconds; a clip-path, under 341x256 px',
    'kp-alarm-decode-letter':
        'a letter cell turning from transparent to its ink once, stepped; one change per cell, ever, and a cell is far under 341x256 px',
    'kp-alarm-march':
        'a background-position slide of the hazard stripes by one period every 1.6 seconds, on a bar 0.9rem tall; the stripes keep their colours, only their position moves',
    'kp-alarm-sweep': 'a band of a faint tint translating down the plate once per six seconds; a transform, and the tint is under the 10% change',
    'kp-marquee-pass':
        'a row of items translated -50% and back to its start, seamlessly; a transform only, no opacity or colour stop, and paused whenever the band is outside the viewport',
    // The meter with a mark, each theme's way [research/character-meter round 3,
    // 2026-10-05]: transforms, clip-paths and pattern slides on a meter a few px tall.
    'kp-sig-formal-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    'kp-sig-formal-meter-wipe-d': "a clip-path wipe revealing a meter's share once, replayed in the destructive tone; under 341x256 px",
    'kp-sig-formal-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-formal-meter-wipe-w': "a clip-path wipe revealing a meter's share once, replayed in the warning tone; under 341x256 px",
    'kp-sig-light-meter-day': 'a soft glint band translating across a loading meter a few px tall; a transform, the band keeps its colour',
    'kp-sig-light-meter-bump-d': 'a meter swelling once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-light-meter-bump-o': 'a meter swelling once as its tone clears; a transform, under 341x256 px',
    'kp-sig-light-meter-bump-w': 'a meter swelling once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-light-meter-grow-o': "a meter's share scaling in from its start once; a transform, under 341x256 px",
    'kp-sig-synthwave-meter-bump-d': 'a meter swelling once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-synthwave-meter-bump-o': 'a meter swelling once as its tone clears; a transform, under 341x256 px',
    'kp-sig-synthwave-meter-bump-w': 'a meter swelling once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-synthwave-meter-grow-o': "a meter's share scaling in from its start once; a transform, under 341x256 px",
    'kp-sig-synthwave-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    'kp-sig-pastel-meter-drift':
        'a striped tape pattern translating one stripe along a loading meter; the stripes keep their colours, only their position moves',
    'kp-sig-pastel-meter-drop-d': "a meter's share dropping into its track once, replayed in the destructive tone; a transform, under 341x256 px",
    'kp-sig-pastel-meter-drop-o': "a meter's share dropping into its track once; a transform, under 341x256 px",
    'kp-sig-pastel-meter-drop-w': "a meter's share dropping into its track once, replayed in the warning tone; a transform, under 341x256 px",
    'kp-sig-terminal-meter-jolt-d': 'a meter shaking 2px sideways once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-terminal-meter-jolt-o': 'a meter shaking 2px sideways once as its tone clears; a transform, under 341x256 px',
    'kp-sig-terminal-meter-jolt-w': 'a meter shaking 2px sideways once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-terminal-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    'kp-sig-terminal-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-forest-meter-bump-d': 'a meter swelling once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-forest-meter-bump-o': 'a meter swelling once as its tone clears; a transform, under 341x256 px',
    'kp-sig-forest-meter-bump-w': 'a meter swelling once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-forest-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    'kp-sig-forest-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-sepia-meter-knock-d': 'a meter knocked up 3px and back once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-sepia-meter-knock-o': 'a meter knocked up 3px and back once as its tone clears; a transform, under 341x256 px',
    'kp-sig-sepia-meter-knock-w': 'a meter knocked up 3px and back once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-sepia-meter-slant-o': "a slanted clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-sepia-meter-width': 'the loading picture of a meter a few px tall widening across it; its colour never changes, only the area',
    'kp-sig-blueprint-meter-plot': 'the plotted line sliding across a loading meter; the picture keeps its colours, only its position moves',
    'kp-sig-blueprint-meter-wipe-d': "a clip-path wipe revealing a meter's share once, replayed in the destructive tone; under 341x256 px",
    'kp-sig-blueprint-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-blueprint-meter-wipe-w': "a clip-path wipe revealing a meter's share once, replayed in the warning tone; under 341x256 px",
    'kp-sig-solstice-meter-bump-d': 'a meter swelling once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-solstice-meter-bump-o': 'a meter swelling once as its tone clears; a transform, under 341x256 px',
    'kp-sig-solstice-meter-bump-w': 'a meter swelling once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-solstice-meter-grow-o': "a meter's share scaling in from its start once; a transform, under 341x256 px",
    'kp-sig-solstice-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    'kp-sig-brutalism-meter-stack':
        'a clip-path revealing the stacked blocks across a loading meter, then again; the blocks keep their colours, under 341x256 px',
    'kp-sig-brutalism-meter-bump-d': 'a meter swelling once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-brutalism-meter-bump-o': 'a meter swelling once as its tone clears; a transform, under 341x256 px',
    'kp-sig-brutalism-meter-bump-w': 'a meter swelling once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-brutalism-meter-drop-o': "a meter's share dropping into its track once; a transform, under 341x256 px",
    'kp-sig-deco-meter-knock-d': 'a meter knocked up 3px and back once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-deco-meter-knock-o': 'a meter knocked up 3px and back once as its tone clears; a transform, under 341x256 px',
    'kp-sig-deco-meter-knock-w': 'a meter knocked up 3px and back once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-deco-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    'kp-sig-deco-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-phantom-meter-screen1': 'a halftone screen sliding by one dot on a loading meter; the dots keep their colours, only their position moves',
    'kp-sig-phantom-meter-jolt-d': 'a meter shaking 2px sideways once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-phantom-meter-jolt-o': 'a meter shaking 2px sideways once as its tone clears; a transform, under 341x256 px',
    'kp-sig-phantom-meter-jolt-w': 'a meter shaking 2px sideways once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-phantom-meter-slant-o': "a slanted clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-nostromo-meter-scan': 'a lit band sliding along the tube of a loading meter; the band keeps its colour, only its position moves',
    'kp-sig-nostromo-meter-jolt-d': 'a meter shaking 2px sideways once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-nostromo-meter-jolt-o': 'a meter shaking 2px sideways once as its tone clears; a transform, under 341x256 px',
    'kp-sig-nostromo-meter-jolt-w': 'a meter shaking 2px sideways once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-nostromo-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-titanium-meter-cut': 'a bright cut sliding along the groove of a loading meter; the cut keeps its colour, only its position moves',
    'kp-sig-titanium-meter-grow-o': "a meter's share scaling in from its start once; a transform, under 341x256 px",
    'kp-sig-titanium-meter-jolt-d': 'a meter shaking 2px sideways once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-titanium-meter-jolt-o': 'a meter shaking 2px sideways once as its tone clears; a transform, under 341x256 px',
    'kp-sig-titanium-meter-jolt-w': 'a meter shaking 2px sideways once as it turns to the warning tone; a transform, under 341x256 px',
    // The meter, round 4 [research/character-meter, 2026-10-05]: dark again and the
    // six reopened themes; transforms, clip-paths and pattern slides on a meter a few px tall.
    'kp-sig-dark-meter-bump-d': 'a meter swelling once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-dark-meter-bump-o': 'a meter swelling once as its tone clears; a transform, under 341x256 px',
    'kp-sig-dark-meter-bump-w': 'a meter swelling once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-dark-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    'kp-sig-dark-meter-press-o': "a meter's share pressed in from its edge once; a transform, under 341x256 px",
    'kp-sig-cyberpunk-meter-knock-d': 'a meter knocked up 3px and back once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-cyberpunk-meter-knock-o': 'a meter knocked up 3px and back once as its tone clears; a transform, under 341x256 px',
    'kp-sig-cyberpunk-meter-knock-w': 'a meter knocked up 3px and back once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-cyberpunk-meter-noise':
        'three thin slivers jumping to new places along a loading meter in hard steps; they keep their colours, only their position moves',
    'kp-sig-cyberpunk-meter-slip-o': "a meter's share landing with a few px sideways jumps and offset ghosts once; a transform, under 341x256 px",
    'kp-sig-high-contrast-meter-march': 'a row of chevrons translating one step along a loading meter; a transform, the chevrons keep their colour',
    'kp-sig-high-contrast-meter-wipe-d': "a clip-path wipe revealing a meter's share once, replayed in the destructive tone; under 341x256 px",
    'kp-sig-high-contrast-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-high-contrast-meter-wipe-w': "a clip-path wipe revealing a meter's share once, replayed in the warning tone; under 341x256 px",
    'kp-sig-retro-meter-knock-d': 'a meter knocked up 3px and back once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-retro-meter-knock-o': 'a meter knocked up 3px and back once as its tone clears; a transform, under 341x256 px',
    'kp-sig-retro-meter-knock-w': 'a meter knocked up 3px and back once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-retro-meter-shake':
        'two lamps sliding in from both ends of a loading meter and apart again; they keep their colours, only their position moves',
    'kp-sig-retro-meter-wipe-o': "a clip-path wipe revealing a meter's share once; the share keeps its colour, under 341x256 px",
    'kp-sig-grotesk-meter-grow-o': "a meter's share scaling in from its start once; a transform, under 341x256 px",
    'kp-sig-grotesk-meter-jolt-d': 'a meter shaking 2px sideways once as it turns to the destructive tone; a transform, under 341x256 px',
    'kp-sig-grotesk-meter-jolt-o': 'a meter shaking 2px sideways once as its tone clears; a transform, under 341x256 px',
    'kp-sig-grotesk-meter-jolt-w': 'a meter shaking 2px sideways once as it turns to the warning tone; a transform, under 341x256 px',
    'kp-sig-grotesk-meter-pos':
        'a background-position slide of the loading picture inside a meter a few px tall; the picture keeps its colours, only its position moves',
    // Information that updates in place [research/update-motion, 2026-10-05].
    'kp-sig-cyberpunk-update-stutter':
        'two unblurred text-shadow copies of a changed value ticking home from 6px to nothing in four steps, once per update for 480 ms; the value itself keeps its colour and place, far under 341x256 px [research/cyberpunk-live]',
    'kp-sig-cyberpunk-update-still':
        'under reduced motion: two text-shadow copies of a changed value standing 2px out for 1.2 s, once, and going; nothing moves, far under 341x256 px [research/cyberpunk-live]',
};

/** @param {string} source @returns {Map<string, {stop: number, opacity: number}[]>} */
export function parseOpacityKeyframes(source) {
    const out = new Map();
    // Brace counting rather than a lazy regex: since AR17 the authored
    // stylesheets sit inside an @layer block, so every keyframes body is
    // indented and its steps close with braces of their own. A lazy match
    // stopped at the first step and reported the whole file unreadable.
    const head = /@keyframes\s+([\w-]+)\s*\{/g;
    for (let m = head.exec(source); m !== null; m = head.exec(source)) {
        let depth = 1;
        let i = m.index + m[0].length;
        const from = i;
        while (i < source.length && depth > 0) {
            if (source[i] === '{') depth += 1;
            else if (source[i] === '}') depth -= 1;
            i += 1;
        }
        const body = source.slice(from, i - 1);
        const stops = [];
        // A block is `0%, 100% { ... }` — several selectors, one body.
        for (const b of body.matchAll(/([\d.%,\s]+)\{([^}]*)\}/g)) {
            const o = b[2].match(/opacity:\s*([\d.]+)/);
            if (!o) continue;
            for (const p of b[1].match(/[\d.]+(?=%)/g) ?? []) {
                stops.push({ stop: Number(p), opacity: Number(o[1]) });
            }
        }
        if (stops.length > 0)
            out.set(
                m[1],
                stops.sort((a, b) => a.stop - b.stop),
            );
    }
    return out;
}

/**
 * The worst case an opacity animation can produce: the element is assumed to
 * be fully bright over a fully dark ground, so a swing from opacity a to b
 * is a relative-luminance change of |a - b|. Real elements are dimmer than
 * that, so a run that passes here passes in fact — the bound is deliberately
 * pessimistic, because the alternative is rendering every frame.
 *
 * @param {{stop: number, opacity: number}[]} stops
 * @param {number} durationMs
 * @returns {number} opposing changes of >= 10% per second
 */
export function flashesPerSecond(stops, durationMs, cycles = Infinity) {
    if (stops.length < 2) return 0;
    let opposing = 0;
    let lastDirection = 0;
    for (let i = 1; i < stops.length; i++) {
        const delta = stops[i].opacity - stops[i - 1].opacity;
        if (Math.abs(delta) < LUMINANCE_STEP) continue;
        const direction = Math.sign(delta);
        if (direction !== lastDirection) {
            opposing++;
            lastDirection = direction;
        }
    }
    // A run that plays once occupies at most one second of the reader's
    // attention: its changes are counted over the second they happen in,
    // never extrapolated as if it looped. The 4.x register set its hover
    // glitch to 340ms to dodge that extrapolation (one change in 320ms
    // read as 3.1 per second); the approved demo's 320ms is honest at
    // 1 per second, and a burst of four changes in 320ms still reads 4.
    // A looping run is extrapolated as before, because it does loop.
    const windowMs = cycles === Infinity ? durationMs : Math.max(durationMs * cycles, 1000);
    return opposing / (windowMs / 1000);
}

/**
 * Every `animation:` shorthand, with the keyframe name and its duration.
 *
 * The duration may be a calc() — `calc(var(--fx-duration) * 3)` — and the
 * first version of this matched a literal number only, so three
 * animations with computed durations were not skipped with a reason:
 * they were not seen at all. An unreadable duration now comes back as
 * null, and the runner measures the worst case rather than ignoring it.
 *
 * @param {string} source
 * @returns {{name: string, durationMs: number | null, duration: string, cycles: number}[]}
 */
/** @param {string} source */
export function animations(source) {
    return [...source.matchAll(/animation:\s*([\w-]+)\s+([^;]+);/g)].map((m) => {
        const literal = m[2].match(/^\s*([\d.]+)(m?s)/);
        // The iteration count: `infinite`, a bare number outside any
        // parentheses (`steps(2, end)` carries one that is not a count), or
        // the CSS default of one. A one-shot run is rated over the second
        // it occupies; a loop is extrapolated.
        const rest = m[2].replace(/\([^)]*\)/g, '');
        const count = rest.match(/(?:^|\s)(\d+(?:\.\d+)?)(?=\s|$)/);
        const cycles = /\binfinite\b/.test(rest) ? Infinity : count ? Number(count[1]) : 1;
        return {
            cycles,
            name: m[1],
            durationMs: literal ? (literal[2] === 's' ? Number(literal[1]) * 1000 : Number(literal[1])) : null,
            duration: m[2].trim(),
        };
    });
}

/** DI7: no transition or animation outside a reduced-motion guard. */
/** @param {string} source @returns {{line: number, declaration: string}[]} */
export function unguardedMotion(source) {
    // A `reduce` block is the preference honoured (its `transition: none`
    // is the guard itself), so it counts as guarded too.
    const guards = [...source.matchAll(/@media\s*\(prefers-reduced-motion:\s*(?:no-preference|reduce)\)\s*\{/g)].map((m) => m.index);
    /** @type {{line: number, declaration: string}[]} */
    const problems = [];
    // `transition: none` and `animation: none` are the ABSENCE of motion.
    // High-contrast's quirk [scope-12] is exactly that — a state change is a
    // switch, not a fade, because every frame between two legible states is
    // less legible than either. Wrapping that in a no-preference guard would
    // mean someone asking for less motion gets MORE of it.
    for (const m of source.matchAll(/^\s*(transition|animation):(?!\s*none\s*;)/gm)) {
        // A declaration is guarded when it sits after a guard's opening brace
        // and before that block closes. Brace-count from each guard rather
        // than assume, since the register nests theme selectors inside.
        const guarded = guards.some((start) => {
            let depth = 0;
            for (let i = source.indexOf('{', start); i < source.length; i++) {
                if (source[i] === '{') depth++;
                else if (source[i] === '}') depth--;
                if (depth === 0) return m.index > start && m.index < i;
            }
            return false;
        });
        // Inside the progress bar the guard is css/components.css's own
        // `prefers-reduced-motion: reduce` block, which reaches every
        // register's motion in the bar with `!important` [scope-140]: a
        // register's bar rule is guarded from there, whichever file it is in.
        const open = source.lastIndexOf('{', m.index);
        const selectorStart = Math.max(source.lastIndexOf('}', open), source.lastIndexOf('{', open - 1), source.lastIndexOf('*/', open)) + 1;
        const inBar = /kp-progressbar/.test(source.slice(selectorStart, open));
        if (!guarded && !inBar) {
            const line = source.slice(0, m.index).split('\n').length;
            problems.push({ line, declaration: m[1] });
        }
    }
    return problems;
}

/**
 * DI7's other half. A component that reads the preference once at mount
 * keeps animating for someone who turns the setting on mid-session — the
 * defect all four effect components shipped with, invisible to any test
 * that mounts after setting the preference. The fix is a shared subscribing
 * hook; this keeps a direct read from creeping back in beside it.
 *
 * @param {string} dir
 * @returns {{file: string, line: number}[]}
 */
export function unsubscribedPreferenceReads(dir) {
    const problems = [];
    // Every source in the directory, not only the React ones. Until
    // 2026-09-08 this filtered on `.jsx`, and `js/` holds none — so the
    // scan read zero files, passed every time, and its own comment said
    // it would name a module that stopped listening. The audit found it
    // by running the function rather than reading it.
    for (const file of readdirSync(dir).filter((f) => /\.(js|jsx|mjs)$/.test(f))) {
        const source = readFileSync(new URL(file, `file://${dir}/`), 'utf8');
        // A file may read the preference as long as it also subscribes to
        // it: that is the whole rule. `js/effects.js` reads it once and
        // adds a `change` listener, which is correct; a file that reads
        // and never listens shows the state the page had at load forever.
        const subscribes = /addEventListener\s*\(\s*['"`]change['"`]|addListener\s*\(|\.onchange\s*=/.test(source);
        if (subscribes) continue;
        // The call, not the word: every one of these files mentions the
        // preference in its own doc comment, and prose is not a defect.
        for (const m of source.matchAll(/matchMedia\s*\(\s*['"`][^'"`]*prefers-reduced-motion/g)) {
            problems.push({ file, line: source.slice(0, m.index).split('\n').length });
        }
    }
    return problems;
}

/**
 * The table pass [TH129, AR40]: every keyframe a stylesheet declares has
 * a row in TIMINGS, and where the row says "opacity" its steps are the
 * keyframe's own stops, so the table the report is computed from cannot
 * drift from the CSS it describes. Per S42 nothing is corrected here: a
 * row over the threshold is a line in the report for Kenny, and what
 * fails is a missing or mismatched row, because a table with a hole is
 * not a report.
 *
 * @param {string} source a stylesheet
 * @param {Readonly<Record<string, Readonly<{ property: string, luminanceSteps: readonly number[] }>>>} timings
 * @returns {string[]} problems
 */
export function tableProblems(source, timings) {
    /** @type {string[]} */
    const problems = [];
    const frames = parseOpacityKeyframes(source);
    for (const m of source.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
        const row = timings[m[1]];
        if (!row) {
            problems.push(`@keyframes ${m[1]} has no row in TIMINGS (js/effects.js) — the DI5 report cannot describe it.`);
            continue;
        }
        if (row.property !== 'opacity') continue;
        const expected = JSON.stringify(frames.get(m[1])?.map((s) => s.opacity) ?? []);
        const declared = JSON.stringify(row.luminanceSteps);
        if (expected !== declared)
            problems.push(`@keyframes ${m[1]} steps opacity ${expected} but TIMINGS says ${declared} — the table drifted from the keyframe.`);
    }
    return problems;
}

/**
 * The opacity keyframes a stylesheet can reach: its own first, then every
 * other stylesheet's [scope-98]. A register may name a keyframe the package
 * declares — cyberpunk's alarm names kp-alarm-jitter, kp-alarm-caret and
 * kp-alarm-decode-noise from css/components.css — and the cascade resolves
 * that name across files. Until scope-98 this gate read keyframes only from
 * the file that used them, so such a register was reported as animating
 * "something this gate cannot measure" when the package's own stops were a
 * file away.
 *
 * @param {string} source the stylesheet that names the animation
 * @param {Map<string, {stop: number, opacity: number}[]>} shared every stylesheet's keyframes
 */
export function reachableKeyframes(source, shared) {
    return new Map([...shared, ...parseOpacityKeyframes(source)]);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    let failed = 0;
    let checked = 0;
    /** @type {string[]} */
    const skipped = [];
    /** @type {Map<string, {stop: number, opacity: number}[]>} */
    const shared = new Map();
    for (const rel of CSS) for (const [k, v] of parseOpacityKeyframes(readFileSync(new URL(rel, import.meta.url), 'utf8'))) shared.set(k, v);

    for (const rel of CSS) {
        const path = new URL(rel, import.meta.url);
        const source = readFileSync(path, 'utf8');
        const name = rel.replace('../', '');
        const frames = reachableKeyframes(source, shared);

        for (const anim of animations(source)) {
            const stops = frames.get(anim.name);
            if (stops && anim.durationMs === null) {
                // It changes opacity and the gate cannot tell how fast.
                // The worst case is the shortest duration any theme
                // declares, so the flash rate is bounded by that.
                const shortest = durationBound(anim, source);
                checked++;
                const rate = flashesPerSecond(stops, shortest, anim.cycles);
                if (rate > MAX_FLASHES_PER_SECOND) {
                    failed++;
                    console.error(
                        `${name}: ${anim.name} has a computed duration (${anim.duration}) and would make ${rate.toFixed(1)} ` +
                            `opposing luminance changes per second at the shortest duration any theme declares (${shortest}ms).`,
                    );
                }
                continue;
            }
            if (!stops) {
                if (OUT_OF_SCOPE[anim.name] === undefined) {
                    failed++;
                    console.error(
                        `${name}: ${anim.name} animates something this gate cannot measure and is not listed as out of scope. ` +
                            'Add it to OUT_OF_SCOPE with the reason, or teach the gate to read it.',
                    );
                } else {
                    skipped.push(`${anim.name} — ${OUT_OF_SCOPE[anim.name]}`);
                }
                continue;
            }
            checked++;
            // Reached only when the duration is a literal: the computed
            // case is handled above and returns before here.
            const rate = flashesPerSecond(stops, durationBound(anim, source), anim.cycles);
            if (rate > MAX_FLASHES_PER_SECOND) {
                failed++;
                console.error(
                    `${name}: ${anim.name} makes ${rate.toFixed(1)} opposing luminance changes per second ` +
                        `over ${anim.durationMs}ms — SC 2.3.1 allows ${MAX_FLASHES_PER_SECOND}.`,
                );
            }
        }

        for (const p of unguardedMotion(source)) {
            checked++;
            failed++;
            console.error(`${name}:${p.line}: ${p.declaration} sits outside a prefers-reduced-motion guard (DI7).`);
        }
    }

    // The table pass [TH129, AR40], per stylesheet.
    for (const rel of CSS) {
        const name = rel.replace('../', '');
        for (const problem of tableProblems(readFileSync(new URL(rel, import.meta.url), 'utf8'), TIMINGS)) {
            checked++;
            failed++;
            console.error(`${name}: ${problem}`);
        }
    }
    /** @type {string[]} */
    const report = [];
    for (const [effect, row] of Object.entries(TIMINGS)) {
        const stops = row.luminanceSteps.map((opacity, i) => ({ stop: i, opacity }));
        const rate = row.property === 'opacity' ? flashesPerSecond(stops, row.durationMs, row.cycles) : 0;
        const loop = row.cycles === Infinity ? 'loops' : `${row.cycles}×`;
        report.push(
            `  ${effect}: ${row.property}, ${row.durationMs}ms ${loop} → ${rate.toFixed(2)}/s${rate > MAX_FLASHES_PER_SECOND ? '  OVER THE THRESHOLD (reported, S42)' : ''}`,
        );
    }

    // The scan covers fx/ and, since C3, js/ [AR40]: js/effects.js reads
    // the preference and subscribes to its change, which is what the scan
    // asks for; a module that read it once and stopped listening would be
    // named here.
    for (const dir of ['fx', 'js']) {
        const path = new URL(`../${dir}/`, import.meta.url).pathname.replace(/\/$/, '');
        for (const p of unsubscribedPreferenceReads(path)) {
            checked++;
            failed++;
            console.error(
                `${dir}/${p.file}:${p.line}: reads prefers-reduced-motion directly without listening for a change. ` +
                    'Use useReducedMotion() (React) or subscribe to the media query (DI7).',
            );
        }
    }

    if (checked === 0) {
        console.error('gate broke: found nothing to check, which cannot be right while the register ships animations.');
        process.exit(1);
    }
    if (failed > 0) {
        console.error(`\n${failed} motion violation(s).`);
        process.exit(1);
    }
    console.log(`Motion: ${checked} animation(s) under the flash threshold, none outside a reduced-motion guard.`);
    for (const s of skipped) console.log(`  out of scope: ${s}`);
    console.log(`DI5 report, ${report.length} effect(s) from TIMINGS [TH129]:`);
    for (const line of report) console.log(line);

    // The written report [TH129, T20]: reports/di5.md names every effect
    // with its rate, committed, so a reader sees the number without
    // running the gate. `--report` writes it; `--report --check` refuses a
    // stale one. Per S42 the gate corrects nothing: an effect over the
    // threshold shows red in the report and the run still passes here —
    // the flash pass above is the invariant, this is the ledger.
    if (process.argv.includes('--report')) {
        const target = new URL('../reports/di5.md', import.meta.url);
        const content = di5Report(TIMINGS);
        if (process.argv.includes('--check')) {
            let current = '';
            try {
                current = readFileSync(target, 'utf8');
            } catch {
                current = '';
            }
            if (current !== content) {
                console.error('reports/di5.md does not match TIMINGS. Run `npm run report:di5` and commit the result.');
                process.exit(1);
            }
            console.log(`DI5 report: reports/di5.md matches TIMINGS (${Object.keys(TIMINGS).length} effects).`);
        } else {
            mkdirSync(new URL('../reports/', import.meta.url), { recursive: true });
            writeFileSync(target, content);
            console.log(`wrote reports/di5.md (${Object.keys(TIMINGS).length} effects).`);
        }
    }
}

/**
 * The DI5 ledger as markdown: one row per effect, its rate, and a verdict
 * that says OVER when it is — reported, never corrected (S42).
 *
 * @param {Record<string, { durationMs: number, cycles: number, property: string, luminanceSteps: number[] }>} timings
 * @returns {string}
 */
export function di5Report(timings) {
    const lines = [
        '# DI5 — the flash rate of every effect [TH129, T20]',
        '',
        'Generated by `node gates/check-motion.mjs --report` from `TIMINGS` in',
        '`js/effects.js`; `npm run check:di5-report`, part of `npm run advice`, refuses a stale copy. The rate is the',
        'number of opposing luminance changes of 10% or more per second: a loop',
        'is extrapolated, a run that plays once is rated over the second it',
        'occupies. SC 2.3.1 allows three. Per S42 a rate over the threshold is',
        'reported here in capitals and corrected by nobody but Kenny.',
        '',
        '| Effect | Property | Duration | Plays | Opacity steps | Rate | Verdict |',
        '| --- | --- | --- | --- | --- | --- | --- |',
    ];
    for (const [effect, row] of Object.entries(timings)) {
        const stops = row.luminanceSteps.map((opacity, i) => ({ stop: i, opacity }));
        const rate = row.property === 'opacity' ? flashesPerSecond(stops, row.durationMs, row.cycles) : 0;
        const plays = row.cycles === Infinity ? 'loops' : `${row.cycles}×`;
        const steps = row.luminanceSteps.length > 0 ? row.luminanceSteps.join(' → ') : '—';
        const verdict = rate > MAX_FLASHES_PER_SECOND ? '**OVER THE THRESHOLD (S42: reported)**' : 'under';
        lines.push(`| \`${effect}\` | ${row.property} | ${row.durationMs} ms | ${plays} | ${steps} | ${rate.toFixed(2)}/s | ${verdict} |`);
    }
    return lines.join('\n') + '\n';
}
