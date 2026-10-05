// Information that updates in place, the theme's way [picked by Kenny on
// research/update-motion, 2026-10-05: formal a checked stamp, cyberpunk a
// glitch that settles, titanium a heat tint].
//
// Kenny, 2026-10-05 11:29: "think about an 'update' or 'refresh' type of
// animation that updates info the 'theme way'". update(el, next) writes the
// new value at once, then marks the element `data-kp-updating="<idea>"` for
// as long as the register's update keyframes play
// (`kp-sig-<theme>-update-*`, in the register's kp.signature layer), and
// takes the mark off again. The idea is the register's `--kp-update`; the
// time and the curve are the theme's own, from themeMotion():
// `--kp-update-duration` is max(size, close) × 1.25 (the stretch leave()
// gives the fold of a space), `--kp-update-ease` the entrance's curve
// without its overshoot. Reduced motion, a theme without motion or a
// register without an idea: the value changes and nothing plays.
//
// The rules every idea keeps: the new value is in the DOM at the first frame
// and readable throughout (overlays on `::before`, effects of colour,
// drop-shadow, opacity and a bounded transform); the box keeps its space
// (a width the new value itself needs is taken at the first frame, with the
// value); every keyframe runs once, and a second update during the first
// restarts it. Nothing plays on first paint: only a change is an update.
//
//   import { update } from '@kp-soft/themes/js/update';
//
//   await update(document.querySelector('#pressure'), '3.41');            // a text value
//   await update(row.querySelector('.kp-state-word'), 'Restarting');      // a state word
//   await update(tile.querySelector('svg[data-kp-spark]'), [...last24h, 3.41]); // a spark
//
// A spark is an svg, which has no pseudo-elements: its parent carries the
// mark, and a register draws its overlay over the parent's last part when
// the parent's child is the svg. Give the spark a box of its own (a `div`
// round the svg) so the overlay sits on the chart, not on the whole tile.

import { themeMotion, withoutOvershoot } from './motion.js';
import { SPARK, drawSparkline, sparkPaths } from './kpi.js';
import { setStateWord } from './components.js';

/** The attribute written on an element while its update plays. */
export const UPDATING_ATTRIBUTE = 'data-kp-updating';

/** The custom property a register names its update idea in. */
export const UPDATE_PROPERTY = '--kp-update';

/** The inline properties update() sets while it plays, and takes off after. */
export const UPDATE_STYLE = /** @type {readonly string[]} */ (Object.freeze(['display', '--kp-update-duration', '--kp-update-ease']));

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * The idea a register's `--kp-update` names, or '' for none.
 * @param {string | null | undefined} value the computed custom property
 * @returns {string}
 */
export function updateIdea(value) {
    const idea = String(value ?? '').trim();
    return idea === 'none' ? '' : idea;
}

/**
 * How long an update plays and on which curve, from the theme's motion: the
 * box's resize time or the dialog's close time, whichever is longer, times
 * 1.25; the entrance's curve without its overshoot. 0 without motion.
 * @param {{ size: number, close: number, ease: string }} motion what themeMotion() returns
 * @returns {{ duration: number, ease: string }}
 */
export function updateTimingOf({ size, close, ease }) {
    return { duration: Math.max(size, close) * 1.25, ease: withoutOvershoot(ease) };
}

/**
 * The update timing of the theme at `scope`.
 * @param {Element} [scope]
 * @returns {{ duration: number, ease: string }}
 */
export function updateTiming(scope = document.documentElement) {
    return updateTimingOf(themeMotion(scope));
}

/**
 * Whether an update with this idea and timing plays anything.
 * @param {string} idea @param {{ duration: number }} timing
 */
export const updatePlays = (idea, timing) => idea !== '' && timing.duration > 0;

/**
 * Put the mark on: the theme's timing as inline custom properties, an
 * inline host as an inline-block (a transform and an overlay need a box),
 * the attribute last. The mark is taken off first, and a reflow forced
 * between, so the same idea twice in a row starts again.
 * @param {HTMLElement} host
 * @param {string} idea
 * @param {{ duration: number, ease: string }} timing
 * @param {{ inline?: boolean }} [options] whether the host is laid out inline now
 * @returns {Record<string, string>} the inline values update() replaced, to put back
 */
export function markUpdating(host, idea, timing, { inline = false } = {}) {
    /** @type {Record<string, string>} */
    const before = {};
    for (const name of UPDATE_STYLE) before[name] = host.style.getPropertyValue(name);
    if (inline) host.style.setProperty('display', 'inline-block');
    host.style.setProperty('--kp-update-duration', `${timing.duration}ms`);
    host.style.setProperty('--kp-update-ease', timing.ease);
    host.removeAttribute(UPDATING_ATTRIBUTE);
    void host.offsetWidth;
    host.setAttribute(UPDATING_ATTRIBUTE, idea);
    return before;
}

/**
 * Take the mark off and put back what markUpdating() replaced.
 * @param {HTMLElement} host
 * @param {Record<string, string>} before
 */
export function unmarkUpdating(host, before) {
    host.removeAttribute(UPDATING_ATTRIBUTE);
    for (const name of UPDATE_STYLE) {
        if (before[name]) host.style.setProperty(name, before[name]);
        else host.style.removeProperty(name);
    }
}

/** @type {WeakMap<Element, () => void>} */
const running = new WeakMap();

/** @param {Element} el */
const isSvg = (el) => el.namespaceURI === SVG_NS && el.localName === 'svg';

/**
 * Write a spark's numbers. A spark that `attachSparklines()` watches is
 * redrawn from its `data-kp-spark`, so the attribute takes the numbers and
 * its own redraw runs first; one nobody watches is drawn here. With a
 * timing, the last point glides to its new place on the theme's curve: the
 * two paths morph (the same commands, so they interpolate).
 * @param {SVGSVGElement} svg
 * @param {readonly number[]} values
 * @param {{ duration: number, ease: string } | null} timing
 * @returns {Promise<Animation[]>}
 */
async function writeSpark(svg, values, timing) {
    const oldLine = svg.querySelector('[class$="-line"]');
    const parts = /(\S+)-line\b/.exec(oldLine?.getAttribute('class') ?? '')?.[1] ?? 'kp-kpi__spark';
    const from = { line: oldLine?.getAttribute('d') ?? '', area: svg.querySelector('[class$="-area"]')?.getAttribute('d') ?? '' };
    if (svg.matches(SPARK)) {
        svg.setAttribute('data-kp-spark', values.join(' '));
        // A mutation observer's callback was queued with the change: it runs before this.
        await Promise.resolve();
    }
    const to = sparkPaths(values);
    if (svg.querySelector(`.${CSS.escape(parts)}-line`)?.getAttribute('d') !== to.line) drawSparkline(svg, values, { parts });
    if (!timing || !from.line || !from.area) return [];
    const line = svg.querySelector(`.${CSS.escape(parts)}-line`);
    const area = svg.querySelector(`.${CSS.escape(parts)}-area`);
    const options = { duration: timing.duration, easing: timing.ease };
    /** @type {Animation[]} */
    const out = [];
    try {
        if (line) out.push(line.animate({ d: [`path("${from.line}")`, `path("${to.line}")`] }, options));
        if (area) out.push(area.animate({ d: [`path("${from.area}")`, `path("${to.area}")`] }, options));
    } catch {
        // An engine that cannot animate `d` shows the new line at once.
    }
    return out;
}

/**
 * Show `next` in `el` the theme's way. The value is written at the first
 * frame and stays readable throughout; any width the new value itself needs
 * is taken then, with the value, so nothing moves while the idea plays and
 * nothing moves when it ends.
 * @param {Element} el a text element, a `.kp-state-word`, or a spark's svg
 * @param {string | number | readonly number[]} next
 * @returns {Promise<number>} how long it played, in ms; 0 when nothing played
 */
export async function update(el, next) {
    // A spark is an svg, which has no pseudo-elements: its box carries the mark.
    const host = /** @type {HTMLElement} */ (isSvg(el) ? (el.parentElement ?? el) : el);
    running.get(host)?.();
    const idea = updateIdea(getComputedStyle(host).getPropertyValue(UPDATE_PROPERTY));
    const timing = idea ? updateTiming(host) : { duration: 0, ease: 'linear' };
    const plays = updatePlays(idea, timing);
    /** @type {Animation[]} */
    let glide = [];
    if (isSvg(el) && Array.isArray(next)) glide = await writeSpark(/** @type {SVGSVGElement} */ (el), next, plays ? timing : null);
    else if (el.classList.contains('kp-state-word')) setStateWord(/** @type {HTMLElement} */ (el), String(next));
    else el.textContent = String(next);
    if (!plays) return 0;
    const started = performance.now();
    const before = markUpdating(host, idea, timing, { inline: getComputedStyle(host).display === 'inline' });
    const css = host.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation && a.animationName.includes('-update-'));
    let done = false;
    const end = () => {
        if (done) return;
        done = true;
        unmarkUpdating(host, before);
        for (const a of glide) a.cancel();
        if (running.get(host) === end) running.delete(host);
    };
    running.set(host, end);
    await Promise.all([...css, ...glide].map((a) => a.finished.catch(() => undefined)));
    const took = performance.now() - started;
    end();
    return took;
}
