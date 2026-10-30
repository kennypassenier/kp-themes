// The headline routines that rewrite the text: the word routines, the typed headline and the decipher.

import { GLYPHS, STATE, TIMINGS } from '../effects.js';
import { END_GRACE_MS } from './headline-special.js';

/** @typedef {import('./headline-run.js').HeadlineRun} HeadlineRun */

/** The routines that put every word in its own span, the register animating them one after another by `--kp-i`. */
export const WORD_ROUTINES = ['shout', 'slam', 'focus', 'resolve', 'blur'];

/** A random glyph of the decipher's alphabet. */
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/** The keyframe that times one word of a routine; Shade (light)'s `blur` runs `kp-word-in`, the name its own approved demo used [SL2, S49]. @param {string} routine */
const wordKeyframe = (routine) => (routine === 'blur' ? 'kp-word-in' : routine === 'shout' ? 'kp-sig-phantom-fly' : `kp-${routine}`);

/**
 * A word routine [PH2, BR2, S48 Shade (dark) and dark]: every word in its own span with its index, the register animates
 * them one after another by `--kp-i`; the element ends as its own text. The keyframe is `kp-<routine>` and its row in TIMINGS
 * says how long one word takes; the stagger is the theme's knob.
 * @param {HeadlineRun} run
 */
export function words(run) {
    const { ctx, el, text, routine } = run;
    const { doc, cfg } = ctx;
    ctx.state.pending++;
    const parts = text.split(/(\s+)/);
    let index = 0;
    const nodes = parts.map((part) => {
        if (part === '') return null;
        if (/^\s+$/.test(part)) return doc.createTextNode(part);
        const span = doc.createElement('span');
        span.setAttribute('data-word', '');
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--kp-i', String(index++));
        span.textContent = part;
        return span;
    });
    el.replaceChildren(...nodes.filter((n) => n !== null));
    el.classList.add(STATE.words);
    const finish = run.once(() => el.classList.remove(STATE.words));
    ctx.later(finish, TIMINGS[wordKeyframe(routine)].durationMs + index * cfg.wordStagger + END_GRACE_MS);
}

/**
 * The terminal headline [TM2]: typed one glyph at a time at the decipher rate, a block caret riding the last one; the caret
 * leaves with the last glyph and the element rests as its text.
 * @param {HeadlineRun} run
 */
export function typeOut(run) {
    const { ctx, el, text } = run;
    const { doc, cfg } = ctx;
    ctx.state.pending++;
    const chars = [...text];
    const caret = doc.createElement('span');
    caret.setAttribute('data-caret', '');
    caret.setAttribute('aria-hidden', 'true');
    el.classList.add(STATE.typing);
    el.textContent = '';
    el.append(caret);
    let typed = 0;
    let ended = false;
    const finish = run.once(() => {
        ended = true;
        el.classList.remove(STATE.typing);
    });
    const perChar = 1000 / Math.max(1, cfg.cps);
    const step = () => {
        if (ended) return;
        typed++;
        el.textContent = chars.slice(0, typed).join('');
        if (typed < chars.length) {
            el.append(caret);
            ctx.later(step, perChar);
        } else finish();
    };
    ctx.later(step, cfg.lead);
}

/** One glyph span of the decipher: the letter's noise, or a space as it is. @param {Document} doc @param {string} ch */
function glyphSpan(doc, ch) {
    const span = doc.createElement('span');
    span.setAttribute('data-glyph', '');
    span.setAttribute('aria-hidden', 'true');
    if (/\s/.test(ch)) span.textContent = ch;
    else {
        span.textContent = randomGlyph();
        span.classList.add(STATE.noise);
    }
    return span;
}

/**
 * The default headline: every glyph starts as noise and settles into its letter at the decipher rate, then one slice burst.
 * @param {HeadlineRun} run
 */
export function decipher(run) {
    const { ctx, el, text } = run;
    const { doc, view, cfg, state, frames, finishers } = ctx;
    state.pending++;
    const chars = [...text];
    const spans = chars.map((ch) => glyphSpan(doc, ch));
    el.replaceChildren(...spans);
    const perChar = 1000 / Math.max(1, cfg.cps);
    let start = 0;
    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        run.rest(false);
        el.classList.add(STATE.glitching);
        const off = () => el.classList.remove(STATE.glitching);
        el.addEventListener('animationend', off, { once: true });
        // No animation (a quiet register, or reduced motion switched on
        // mid-run): the class comes off on its own.
        ctx.later(off, TIMINGS['kp-slice-1'].durationMs + END_GRACE_MS);
        state.pending--;
        ctx.done();
    };
    finishers.push(finish);
    let id = 0;
    const schedule = () => {
        const next = view ? view.requestAnimationFrame(tick) : 0;
        frames.add(next);
        return next;
    };
    /** @param {number} now */
    const tick = (now) => {
        frames.delete(id);
        if (state.detached || finished) return;
        if (start === 0) start = now;
        if (settleGlyphs(spans, chars, now - start, cfg, perChar)) finish();
        else id = schedule();
    };
    id = schedule();
}

/**
 * Settle the glyphs whose turn has come, and shuffle the noise of the rest.
 * @param {HTMLElement[]} spans @param {string[]} chars @param {number} t ms since the start
 * @param {{ lead: number, swap: number }} cfg @param {number} perChar
 * @returns {boolean} true when every glyph has settled
 */
function settleGlyphs(spans, chars, t, cfg, perChar) {
    let all = true;
    spans.forEach((span, i) => {
        const ch = chars[i] ?? '';
        if (/\s/.test(ch)) return;
        if (t > cfg.lead + i * perChar) {
            if (span.classList.contains(STATE.noise)) {
                span.textContent = ch;
                span.classList.remove(STATE.noise);
            }
        } else {
            all = false;
            if (Math.random() < cfg.swap) span.textContent = randomGlyph();
        }
    });
    return all;
}
