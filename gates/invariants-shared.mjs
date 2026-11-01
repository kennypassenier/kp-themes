// The constants the design-invariant checks share (gates/check-invariants.mjs): the floors, the surfaces a boundary can be drawn against, the hero's surfaces, the statuses.
import { readFileSync } from 'node:fs';


/** @typedef {{name: string, tokens: Record<string,string>, derivation?: {stepL: number}}} Theme */

export const dir = new URL('../themes/', import.meta.url);
export const config = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf8'));

/** WCAG 2.2 SC 1.4.11 Non-text Contrast, Level AA. A standards constant. */
export const BOUNDARY_FLOOR = 3.0;
/** DI4's floor is a house number, not a standard — see gates/config.json. */
export const DISTANCE_FLOOR = config.perceptualDistanceFloor.value;

/** Surfaces a boundary can be drawn against. */
export const SURFACES = ['background', 'card', 'popover'];

/** The hero's own surfaces [TH116]: its ground and its card. */
export const HERO_SURFACES = ['surface-hero-bg', 'surface-hero-card'];

/** Where the hero's focus ring can land: its ground, card, button and alert. */
export const HERO_FOCUS_SURFACES = ['surface-hero-bg', 'surface-hero-card', 'surface-hero-primary', 'surface-hero-danger'];

/** The hero's interactive sources [TH116]. */
export const HERO_INTERACTIVE = ['surface-hero-primary', 'surface-hero-danger'];

/** @param {string} value an hsl() literal */
export function isDark(value) {
    const m = value.match(/hsl\([^,]+,[^,]+,\s*([\d.]+)%/);
    return m !== null && Number(m[1]) < 50;
}

/** The application-pipeline statuses, the same seven the contrast gate names. */
export const STATUS_NAMES = ['draft', 'sent', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'];
