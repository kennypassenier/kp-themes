// The CSS blocks the theme generator writes (gates/generate-themes.mjs): the derived states of a theme, its block and the hero's remap and block [DI3, AR2, TH116].
import { readFileSync } from 'node:fs';
import { derive, deriveVisible, deriveVisited } from './colour.mjs';

const CONFIG = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf8'));

/**
 * Surfaces that are genuinely interactive, and therefore need states.
 *
 * Buttons and the selected surface — not the alert plates. `--success`,
 * `--warning` and `--info` are the background of a message, and a message
 * does not respond to a cursor; deriving states for them produced values
 * whose own ink no longer read, which is the gate catching a modelling
 * mistake rather than a colour one.
 */
const INTERACTIVE = ['primary', 'secondary', 'accent', 'destructive'];

/**
 * State values are derived, not authored [DI3, AR2].
 *
 * Carbon's grammar: hover is half a step, selected one, pressed two. The
 * step is a lightness move in OKLCh so it looks the same size in every
 * theme (AR4) — a numeric HSL step does not, which is what makes the
 * worst-case shortcut of AR12 sound.
 *
 * A theme may record its own step size in its token file. Cyberpunk and
 * terminal do: neon has almost nowhere lighter to go before magenta turns
 * pink, and a phosphor brightens rather than darkens. Both say so in their
 * anatomy documents, and both forfeit AR12's shortcut in exchange.
 *
 * @param {{tokens: Record<string,string>, dark: boolean, stepL: number}} ctx
 */
function derivedStates({ tokens, dark, stepL }) {
    const out = [];
    // The two-channel focus ring [DI2]. A single ring has to contrast with
    // whatever it lands on, and no one colour does: measured 2026-09-04,
    // the ring sat at 1.00 — identical luminance — on primary buttons in
    // three themes. Two adjacent rings solve it, provided the pair itself
    // contrasts and at least one of the two reaches 3:1 on every surface.
    //
    // The pair is the theme's own foreground and background: its widest
    // spread, already gated at 4.5:1 against each other, and measured to
    // cover all eleven surfaces in all seven themes. A theme may author
    // both tokens itself; check-invariants.mjs then measures those instead.
    // The link colours [TH31]. Browser-default blue is unreadable on the
    // dark themes — 1.99, 2.09 and 2.06 against their backgrounds — so a
    // theme that does not say what a link looks like is not complete.
    // --link is the theme's primary, which the contrast gate already holds
    // at AA against both surfaces a link sits on; the visited state is
    // rotated off it.
    const link = tokens.link ?? tokens.primary;
    if (tokens.link === undefined) out.push(`    --link: ${link};`);
    if (tokens['link-visited'] === undefined) {
        const visited = deriveVisited(link, [tokens.background, tokens.card], CONFIG.perceptualDistanceFloor.value);
        if (visited === null) {
            throw new Error(
                `no visited-link colour derivable from ${link}: nothing clears 4.5 on both surfaces while staying ` +
                    `${CONFIG.perceptualDistanceFloor.value} from the link colour. Author --link-visited in the theme.`,
            );
        }
        out.push(`    --link-visited: ${visited};`);
    }

    if (tokens['focus-ring'] === undefined) out.push(`    --focus-ring: ${tokens.foreground};`);
    if (tokens['focus-ring-contrast'] === undefined) out.push(`    --focus-ring-contrast: ${tokens.background};`);
    const d = CONFIG.derivation;
    for (const surface of INTERACTIVE) {
        const base = tokens[surface];
        if (base === undefined) continue;
        for (const [state, steps] of [
            ['hover', d.hover],
            ['active', d.active],
            ['disabled', d.disabled],
        ]) {
            // A theme may write its own state, the way it may already write
            // its own --link [Kenny, 2026-09-12]. The derivation takes one
            // step per state from the resting colour, which is the right
            // answer almost everywhere and the wrong one at the ends of the
            // scale: a near-white signal has nowhere left to go, so two
            // steps down off it look like no step at all. Both of round
            // seven's new themes have exactly that — the spectral
            // instrument's signal is 93% lightness and titanium's is 87% —
            // and their own approved demos already write their hover by
            // hand rather than leave it derived.
            //
            // Authored wins, and nothing is emitted here: the value is
            // already in the theme's own entries, which are written before
            // these. Parity is unaffected, because the generated block ends
            // up with exactly one declaration of the name either way.
            if (tokens[`${surface}-${state}`] !== undefined) continue;
            let value;
            if (state === 'disabled') {
                value = derive(base, 1.5, { towardsLight: !dark, stepL });
            } else if (state === 'active') {
                // The pressed state is the one a person is told by [KT2].
                value = deriveVisible(
                    base,
                    steps,
                    { towardsLight: dark, stepL },
                    {
                        floor: CONFIG.stateVisibilityFloor.value,
                        ink: tokens[`${surface}-foreground`],
                    },
                );
            } else {
                value = derive(base, steps, { towardsLight: dark, stepL });
            }
            out.push(`    --${surface}-${state}: ${value};`);
        }
    }
    return out;
}

/**
 * One theme block: the authored entries verbatim, then the derived states.
 * @param {{selector: string, entries: Array<{raw?: string, token?: string, value?: string}>, derivation?: {stepL: number}}} theme
 * @returns {string}
 */
export function block(theme) {
    const body = theme.entries.map((e) => (e.raw !== undefined ? e.raw : `    --${e.token}: ${e.value};`));
    const tokens = Object.fromEntries(theme.entries.filter((e) => e.token !== undefined).map((e) => [e.token, e.value]));
    const states = derivedStates({
        tokens,
        dark: tokens['color-scheme'] === 'dark',
        stepL: theme.derivation?.stepL ?? CONFIG.derivation.stepL,
    });
    return [`${theme.selector} {`, ...body, '', '    /* Derived interaction states — see gates/generate-themes.mjs. */', ...states, '}'].join('\n');
}

/**
 * What the hero surface remaps, source → the token a component reads
 * [TH116, AR38]. A component inside `[data-kp-surface='hero']` keeps
 * reading `--background`, `--primary` and the rest; the surface changes
 * what those mean. Everything not listed here — secondary, accent, muted,
 * popover, input, ring — stays the app's, on purpose: the hero has its
 * own ground, ink, frame, button, alert and card, and borrows the rest.
 */
export const HERO_REMAP = [
    ['surface-hero-bg', 'background'],
    ['surface-hero-fg', 'foreground'],
    ['surface-hero-muted', 'muted-foreground'],
    ['surface-hero-border', 'border-strong'],
    ['surface-hero-border', 'input'],
    ['surface-hero-primary', 'selected'],
    ['surface-hero-primary', 'primary'],
    ['surface-hero-primary-foreground', 'primary-foreground'],
    ['surface-hero-danger', 'destructive'],
    ['surface-hero-danger-foreground', 'destructive-foreground'],
    ['surface-hero-card', 'card'],
    ['surface-hero-card-foreground', 'card-foreground'],
];

/** The hero's interactive surfaces: the ones that get derived states. */
export const HERO_INTERACTIVE = [
    ['surface-hero-primary', 'primary'],
    ['surface-hero-danger', 'destructive'],
];

/** @param {string} value an hsl() literal */
export function isDark(value) {
    const m = value.match(/hsl\([^,]+,[^,]+,\s*([\d.]+)%/);
    return m !== null && Number(m[1]) < 50;
}

/**
 * The hero block: `[data-theme='x'] [data-kp-surface='hero']` remaps the
 * tokens a component reads to the hero sources, then derives hover,
 * active and disabled for the hero's button and alert exactly as
 * derivedStates() does for the app ground — the critic's blocking
 * objection to the first draft was a hero button that hovered with the
 * app's colour. The states move away from the hero ground's own
 * lightness, because a dark theme may carry a light hero. The focus ring
 * follows the hero's ink and ground (DI2 on the hero is measured by
 * check-invariants.mjs). The block sits inside `@layer kp.base`, so the
 * register layers above it as usual.
 *
 * @param {{selector: string, entries: Array<{raw?: string, token?: string, value?: string}>, derivation?: {stepL: number}}} theme
 * @returns {string}
 */
export function heroBlock(theme) {
    const tokens = Object.fromEntries(theme.entries.filter((e) => e.token !== undefined).map((e) => [e.token, e.value]));
    const stepL = theme.derivation?.stepL ?? CONFIG.derivation.stepL;
    // A theme's selector may be a list (`:root, [data-theme='formal']`);
    // each member gets the surface, on its own line as prettier writes it.
    const selectors = theme.selector
        .split(',')
        .map((part) => `${part.trim()} [data-kp-surface='hero']`)
        .join(',\n    ');
    const out = [`    ${selectors} {`];
    for (const [source, target] of HERO_REMAP) {
        if (tokens[source] === undefined) throw new Error(`${theme.selector} declares no --${source} (S47: every theme carries the hero sources)`);
        out.push(`        --${target}: var(--${source});`);
    }
    out.push(`        --link: var(--surface-hero-fg-2);`);
    out.push(`        --focus-ring: var(--surface-hero-fg);`);
    out.push(`        --focus-ring-contrast: var(--surface-hero-bg);`);
    const d = CONFIG.derivation;
    const heroDark = isDark(tokens['surface-hero-bg']);
    for (const [source, target] of HERO_INTERACTIVE) {
        const base = tokens[source];
        const ink = tokens[`${source}-foreground`];
        // Authored wins here too [Kenny, 2026-09-12]. The hero remaps the
        // theme's own tokens, so a theme that writes `--surface-hero-primary-active`
        // is saying what the hero's press looks like, and that is the last
        // word — see derivedStates() for why the derivation is not always
        // the right answer at the ends of the lightness scale.
        const authored = (/** @type {string} */ state) => tokens[`${source}-${state}`];
        out.push(`        --${target}-hover: ${authored('hover') ?? derive(base, d.hover, { towardsLight: heroDark, stepL })};`);
        out.push(
            `        --${target}-active: ${authored('active') ?? deriveVisible(base, d.active, { towardsLight: heroDark, stepL }, { floor: CONFIG.stateVisibilityFloor.value, ink })};`,
        );
        out.push(`        --${target}-disabled: ${authored('disabled') ?? derive(base, 1.5, { towardsLight: !heroDark, stepL })};`);
    }
    out.push('    }');
    return out.join('\n');
}
