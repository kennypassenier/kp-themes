// The design-invariant checks of the states (gates/check-invariants.mjs): the focus ring (DI2), the visible states, the second halves and the pressed states (KT2).
import { hsl, contrast, distance, luminance, derive, deriveVisible } from './colour.mjs';
import { BOUNDARY_FLOOR, HERO_FOCUS_SURFACES, HERO_INTERACTIVE, STATUS_NAMES, config, isDark } from './invariants-shared.mjs';
/** @typedef {import('./invariants-shared.mjs').Theme} Theme */

/**
 * DI2: the focus ring is two channels, and it is checked on everything it
 * can land on.
 *
 * A focus indicator that fails is not a cosmetic problem — it is a
 * keyboard user losing their place on the page. Two conditions, both
 * measured: the two rings contrast with each other, so the pair reads as
 * a ring whatever it sits on; and on every surface a component can have,
 * at least one of the two clears the 3:1 floor of SC 1.4.11.
 *
 * The second condition is what a single ring failed: measured 2026-09-04,
 * --ring against --primary was 1.00 in three themes. Identical luminance.
 */
const FOCUS_SURFACES = ['background', 'card', 'popover', 'primary', 'secondary', 'accent', 'destructive', 'muted', 'success', 'warning', 'info'];

/** @param {Theme} theme */
export function checkFocusRing(theme) {
    const problems = [];
    // Generated tokens are not in the authored source, so the values the
    // generator would derive are reproduced here rather than read back
    // from the stylesheet: this gate measures the source, and DI2's
    // default pair is the theme's own foreground and background.
    const inner = theme.tokens['focus-ring'] ?? theme.tokens.foreground;
    const outer = theme.tokens['focus-ring-contrast'] ?? theme.tokens.background;

    const pair = contrast(hsl(inner), hsl(outer));
    if (pair < BOUNDARY_FLOOR) {
        problems.push(`the two focus rings are ${pair.toFixed(2)} apart, under ${BOUNDARY_FLOOR.toFixed(1)} — the pair does not read as a ring`);
    }

    for (const surface of FOCUS_SURFACES) {
        const value = theme.tokens[surface];
        if (value === undefined) continue;
        const best = Math.max(contrast(hsl(inner), hsl(value)), contrast(hsl(outer), hsl(value)));
        if (best < BOUNDARY_FLOOR) {
            problems.push(
                `neither focus ring reaches ${BOUNDARY_FLOOR.toFixed(1)} on --${surface} (best ${best.toFixed(2)}), so focus is invisible there`,
            );
        }
    }
    // DI2 on the hero [TH116]: the generator remaps the ring to the hero's
    // ink and ground, so that pair and every hero surface are measured.
    const heroInner = theme.tokens['surface-hero-fg'];
    const heroOuter = theme.tokens['surface-hero-bg'];
    if (heroInner !== undefined && heroOuter !== undefined) {
        const heroPair = contrast(hsl(heroInner), hsl(heroOuter));
        if (heroPair < BOUNDARY_FLOOR) {
            problems.push(`on the hero the two focus rings are ${heroPair.toFixed(2)} apart, under ${BOUNDARY_FLOOR.toFixed(1)}`);
        }
        for (const surface of HERO_FOCUS_SURFACES) {
            const best = Math.max(contrast(hsl(heroInner), hsl(theme.tokens[surface])), contrast(hsl(heroOuter), hsl(theme.tokens[surface])));
            if (best < BOUNDARY_FLOOR) {
                problems.push(
                    `neither hero focus ring reaches ${BOUNDARY_FLOOR.toFixed(1)} on --${surface} (best ${best.toFixed(2)}), so focus is invisible there`,
                );
            }
        }
    }
    return problems;
}

/**
 * KT2: a state nobody can see is not a state.
 *
 * Every derived state was checked for whether its own text still reads
 * (checkStates below), and nothing ever asked the other question —
 * whether the state differs perceptibly from the colour it came from. It
 * does not: measured 2026-09-04, the pressed state lands 10.0 to 12.1
 * from its base in five themes and 2.6 to 8.4 in cyberpunk and terminal,
 * the two that took DI3's smaller-step opt-out.
 *
 * The floor is the pressed state only. Hover is deliberately subtle in
 * every theme (2.4 to 3.4 here, which is the same order as Material's 8%
 * state layer), and a floor that failed it would be arguing with every
 * design system rather than with this one's own inconsistency.
 *
 * Not wired into the run yet: it fails today, on purpose. Standing rule 8
 * says a live-found fault becomes a failing test before the fix, and the
 * fix is Kenny's to approve (correction KT2).
 *
 * @param {Theme} theme
 */
export function checkStateVisibility(theme) {
    const problems = [];
    const dark = theme.tokens['color-scheme'] === 'dark';
    const stepL = theme.derivation?.stepL ?? config.derivation.stepL;
    const floor = config.stateVisibilityFloor.value;
    for (const surface of INTERACTIVE) {
        const base = theme.tokens[surface];
        const ink = theme.tokens[`${surface}-foreground`];
        if (base === undefined || ink === undefined) continue;
        // The same derivation the generator uses, so this measures what
        // ships rather than what an older version of the maths produced.
        // It therefore fails exactly when the colour space cannot deliver
        // a visible pressed state, which is the case worth knowing about.
        //
        // And an authored state wins here exactly as it wins there [Kenny,
        // 2026-09-12]. Until this line the check re-derived unconditionally,
        // so a theme that wrote its own pressed colour was still measured
        // on the one it had replaced — which is the whole point of writing
        // it, and which would have made this gate report a fault that does
        // not ship.
        const active =
            theme.tokens[`${surface}-active`] ?? deriveVisible(base, config.derivation.active, { towardsLight: dark, stepL }, { floor, ink });
        const seen = distance(hsl(base), hsl(active));
        if (seen < floor) {
            problems.push(
                `--${surface}-active is only ${seen.toFixed(1)} from --${surface} (floor ${floor}); pressing the control changes nothing anyone can see`,
            );
        }
    }
    const heroDark = isDark(theme.tokens['surface-hero-bg'] ?? theme.tokens.background);
    for (const surface of HERO_INTERACTIVE) {
        const base = theme.tokens[surface];
        const ink = theme.tokens[`${surface}-foreground`];
        if (base === undefined || ink === undefined) continue;
        const active =
            theme.tokens[`${surface}-active`] ?? deriveVisible(base, config.derivation.active, { towardsLight: heroDark, stepL }, { floor, ink });
        const seen = distance(hsl(base), hsl(active));
        if (seen < floor) {
            problems.push(
                `--${surface}-active is only ${seen.toFixed(1)} from --${surface} (floor ${floor}) on the hero; pressing changes nothing anyone can see`,
            );
        }
    }
    return problems;
}

/**
 * The other two places the same fault sat [KT2-3].
 *
 * The fault is not "the states were too small". It is: a gate checks one
 * half of a two-halved property and reports green. Stated that way it was
 * found twice more.
 *
 * A · A badge's text is gated against its plate; the plate was never
 * measured against the surface it lies on. Measured in perceptual
 * distance rather than contrast ratio — the first attempt used the ratio
 * and read 1.04 to 1.40, which sounds like an invisible badge and is not:
 * a contrast ratio only compares luminance, and these plates differ in
 * hue. Measured properly they sit 5.6 to 12.6 from their card.
 *
 * The floor is deliberately low. The label carries the meaning (DI4), so
 * the plate only has to read as a plate; this is a floor against a future
 * palette change flattening a badge into its card, not a claim that five
 * is comfortable.
 *
 * B · The visited link is held apart from the link by the generator, and
 * by nothing else. A theme that authors either by hand would slip past.
 *
 * @param {Theme} theme
 */
export function checkSecondHalves(theme) {
    const problems = [];

    const plateFloor = config.badgePlateFloor.value;
    for (const status of STATUS_NAMES) {
        const plate = theme.tokens[`status-${status}`];
        if (plate === undefined) continue;
        for (const surface of ['background', 'card']) {
            const d = distance(hsl(plate), hsl(theme.tokens[surface]));
            if (d < plateFloor) {
                problems.push(`the ${status} badge is ${d.toFixed(1)} from --${surface} (floor ${plateFloor}); it stops reading as a badge`);
            }
        }
    }

    // The visited link used to be checked here and never was: it is a
    // derived token, so `theme.tokens['link-visited']` is always
    // undefined and the branch never ran. Found in the Phase 7 audit and
    // moved to check-contrast.mjs, which reads the generated stylesheet
    // and therefore measures what ships.

    return problems;
}

const INTERACTIVE = ['primary', 'secondary', 'accent', 'destructive'];

/**
 * DI3 + AR12: the derived states are checked at their worst case rather
 * than one by one. "Active" is two steps — the furthest any state moves —
 * so if its text still clears AA, every gentler state does too, provided
 * the derivation is monotone in luminance. That proviso is what OKLCh buys
 * (AR4), and it is why the two themes that take DI3's opt-out are still
 * checked here rather than trusted.
 *
 * Disabled is deliberately exempt: DI8 is Kenny's recorded decision that a
 * disabled control may fall below the floor, with the GOV.UK counter-case
 * kept beside it.
 */
/** @param {Theme} theme */
export function checkStates(theme) {
    const problems = [];
    const dark = theme.tokens['color-scheme'] === 'dark';
    const stepL = theme.derivation?.stepL ?? config.derivation.stepL;
    for (const surface of INTERACTIVE) {
        const base = theme.tokens[surface];
        const ink = theme.tokens[`${surface}-foreground`];
        if (base === undefined || ink === undefined) continue;
        const active = derive(base, config.derivation.active, { towardsLight: dark, stepL });
        const ratio = contrast(hsl(active), hsl(ink));
        if (ratio < 4.5) {
            problems.push(`--${surface}-active (${active}) carries --${surface}-foreground at ${ratio.toFixed(2)}, under 4.5`);
        }
    }
    // The hero's button and alert, derived away from the hero ground's
    // own lightness — the hero may be light in a dark theme [TH116, AR38].
    const heroDark = isDark(theme.tokens['surface-hero-bg'] ?? theme.tokens.background);
    for (const surface of HERO_INTERACTIVE) {
        const base = theme.tokens[surface];
        const ink = theme.tokens[`${surface}-foreground`];
        if (base === undefined || ink === undefined) continue;
        const active = derive(base, config.derivation.active, { towardsLight: heroDark, stepL });
        const ratio = contrast(hsl(active), hsl(ink));
        if (ratio < 4.5) {
            problems.push(
                `--${surface}-active (${active}) carries --${surface}-foreground at ${ratio.toFixed(2)}, under 4.5 (the hero surface, TH116)`,
            );
        }
    }
    return problems;
}
