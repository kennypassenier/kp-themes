// The headline hook of js/effects.js, in a module of its own [scope-117].
//
// Cut out of attachEffects() line for line, so a page that never asks for it
// never downloads it: js/effects.js fetches this the first time an element or
// a theme knob needs it. What it shared with the rest of the closure arrives
// through `ctx`; the four variables every part writes are `ctx.state`. One reveal is one HeadlineRun
// (headline-run.js); its routines are in headline-special.js and headline-text.js beside this file.

import { HeadlineRun } from './headline-run.js';

/** @param {import('../effects.js').EffectsContext} ctx */
export function install(ctx) {
    // ── The headline: decipher, then one slice burst [TH119] ───────────
    /** @param {Element} el @param {boolean} [atRest] straight to rest, as a detach does for a reveal it never started */
    const headline = (el, atRest = false) => new HeadlineRun(ctx, el, atRest).play();
    return { headline };
}
