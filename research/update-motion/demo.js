// research/update-motion: information that updates in place, the theme's way
// (Kenny, 2026-10-05 11:29: "think about an 'update' or 'refresh' type of
// animation that updates info the 'theme way'").
//
// update(el, next) below is written as the package would ship it in
// js/motion.js: it writes the new value at once, then marks the element
// `data-kp-updating="<idea>"` for as long as the register's update keyframes
// play (demo.css, named `kp-sig-<theme>-update-*` like the registers'
// signature keyframes), and takes the mark off again. The idea is read from
// the register's `--kp-update` (here set per column, so three ideas of one
// theme stand side by side); the time and the curve are the theme's own,
// from themeMotion(). Reduced motion, a theme without motion or no idea:
// the value changes and nothing plays.

import { themeMotion, withoutOvershoot } from '../../js/motion.js';
import { drawSparkline, sparkPaths } from '../../js/kpi.js';
import { setStateWord } from '../../js/components.js';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-uu-motion]')?.removeAttribute('hidden');

/* ------------------------------------------------------------- speed */

// Slow motion for judging, as on research/open-reverse: every animation on
// the page, CSS or scripted, plays at the picked rate; a quarter by default.
let rate = 0.25;
try {
    const kept = Number(localStorage.getItem('uu-speed'));
    if (kept > 0) rate = kept;
} catch {
    // No storage: start at a quarter.
}
const animate = Element.prototype.animate;
Element.prototype.animate = function (...args) {
    const a = animate.apply(this, /** @type {any} */ (args));
    a.playbackRate = rate;
    return a;
};
const slowNow = () => {
    for (const a of document.getAnimations()) if (Math.abs(a.playbackRate) !== rate) a.playbackRate = Math.sign(a.playbackRate || 1) * rate;
};
const slowEachFrame = () => {
    slowNow();
    requestAnimationFrame(slowEachFrame);
};
document.addEventListener('animationstart', slowNow, { capture: true });
requestAnimationFrame(slowEachFrame);
const speedButtons = [...document.querySelectorAll('[data-uu-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-uu-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-uu-speed'));
        try {
            localStorage.setItem('uu-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();

/* ---------------------------------------------------- update(el, next) */

/**
 * How long an update plays in the theme at `el`, in ms: the box's resize
 * time or the dialog's close time, whichever is longer, times 1.25 (the
 * stretch leave() gives the fold of a space). 0 without motion.
 * @param {Element} el
 */
export function updateTiming(el) {
    const { size, close, ease } = themeMotion(el);
    return { duration: Math.max(size, close) * 1.25, ease: withoutOvershoot(ease) };
}

/** @type {WeakMap<Element, () => void>} */
const running = new WeakMap();

/** @param {string | null} d @returns {number} the last point's y, 0..28 */
const lastY = (d) => {
    const m = /,(-?[\d.]+)\s*$/.exec(d ?? '');
    return m ? Number(m[1]) : 14;
};

/**
 * Write `next` into `el` without motion: a state word through
 * setStateWord() (it keeps room for every word), a spark through its
 * numbers, anything else as its text.
 * @param {Element} el @param {string | number[]} next
 * @returns {Animation[]} the chart's own glide of its last point, if any
 */
function write(el, next, timing) {
    if (el instanceof SVGSVGElement && Array.isArray(next)) {
        const line = el.querySelector('[class$="-line"]')?.getAttribute('d') ?? null;
        const area = el.querySelector('[class$="-area"]')?.getAttribute('d') ?? null;
        drawSparkline(el, next);
        const head = /** @type {HTMLElement | null} */ (el.parentElement?.querySelector('.uu-head') ?? null);
        const toY = lastY(sparkPaths(next).line);
        const fromY = lastY(line);
        if (head) head.style.setProperty('--uu-y', `${(toY / 28) * 100}%`);
        if (!timing || !line || !area) return [];
        // The last point glides to its new place on the theme's curve: the
        // two paths morph (same commands, so they interpolate), the head
        // follows.
        const options = { duration: timing.duration, easing: timing.ease };
        /** @type {Animation[]} */
        const out = [];
        try {
            const [newLine, newArea] = [el.querySelector('[class$="-line"]'), el.querySelector('[class$="-area"]')];
            out.push(newLine.animate({ d: [`path("${line}")`, `path("${newLine.getAttribute('d')}")`] }, options));
            out.push(newArea.animate({ d: [`path("${area}")`, `path("${newArea.getAttribute('d')}")`] }, options));
        } catch {
            /* an engine that cannot animate `d` shows the new line at once */
        }
        if (head) out.push(head.animate({ top: [`${(fromY / 28) * 100}%`, `${(toY / 28) * 100}%`] }, options));
        return out;
    }
    if (el.classList.contains('kp-state-word')) setStateWord(/** @type {HTMLElement} */ (el), String(next));
    else el.textContent = String(next);
    return [];
}

/**
 * Show `next` in `el` the theme's way. The value is written at the first
 * frame and stays readable throughout. Any width the new value itself needs
 * is taken at that first frame, with the value, so nothing moves while the
 * idea plays and nothing moves when it ends.
 * @param {Element} el a text element, a `.kp-state-word`, or a spark's svg
 * @param {string | number[]} next
 * @returns {Promise<number>} how long it played, in ms at the page's speed
 */
export async function update(el, next) {
    // A spark is an svg, which has no pseudo-elements: its box carries the mark.
    const host = /** @type {HTMLElement} */ (el instanceof SVGSVGElement ? el.parentElement : el);
    running.get(host)?.();
    const idea = getComputedStyle(host).getPropertyValue('--kp-update').trim();
    const timing = updateTiming(host);
    const plays = !reduced() && idea !== '' && idea !== 'none' && timing.duration > 0;
    const glide = write(el, next, plays ? timing : null);
    if (!plays) return 0;
    const started = performance.now();
    const inline = getComputedStyle(host).display === 'inline';
    if (inline) host.style.setProperty('display', 'inline-block');
    host.style.setProperty('--kp-update-duration', `${timing.duration}ms`);
    host.style.setProperty('--kp-update-ease', timing.ease);
    host.removeAttribute('data-kp-updating');
    void host.offsetWidth; // the same idea twice in a row starts again
    host.setAttribute('data-kp-updating', idea);
    const css = host.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation && a.animationName.includes('-update-'));
    let done = false;
    const end = () => {
        if (done) return;
        done = true;
        host.removeAttribute('data-kp-updating');
        for (const name of ['display', '--kp-update-duration', '--kp-update-ease']) host.style.removeProperty(name);
        for (const a of glide) a.cancel();
        running.delete(host);
    };
    running.set(host, end);
    await Promise.all([...css, ...glide].map((a) => a.finished.catch(() => undefined)));
    const took = performance.now() - started;
    end();
    return took;
}

/* ------------------------------------------------------------- board */

/** The ideas per theme, in column order: the value of `--kp-update` and a name. */
const IDEAS = {
    formal: [
        ['ink', 'Idea 1: fresh ink'],
        ['turn', 'Idea 2: ledger turn'],
        ['stamp', 'Idea 3: checked stamp'],
    ],
    cyberpunk: [
        ['scan', 'Idea 1: scanline rewrite'],
        ['glitch', 'Idea 2: glitch and settle'],
        ['neon', 'Idea 3: neon re-ignite'],
    ],
    titanium: [
        ['recut', 'Idea 1: re-cut'],
        ['brushed', 'Idea 2: brushed sweep'],
        ['anodise', 'Idea 3: heat tint'],
    ],
};

const SERIES = [
    3.3, 3.31, 3.29, 3.27, 3.24, 3.22, 3.25, 3.31, 3.36, 3.38, 3.35, 3.33, 3.3, 3.28, 3.3, 3.32, 3.34, 3.37, 3.39, 3.35, 3.31, 3.28, 3.27,
];
const STATES = [
    { figure: '3.26', chart: [...SERIES, 3.26], state: 'Running', time: '08:12' },
    { figure: '3.41', chart: [...SERIES, 3.41], state: 'Restarting', time: '08:27' },
];

const template = /** @type {HTMLTemplateElement} */ (document.querySelector('[data-uu-template="board"]'));
for (const col of document.querySelectorAll('[data-uu-idea]')) {
    col.append(template.content.cloneNode(true));
    const svg = /** @type {SVGSVGElement} */ (col.querySelector('[data-uu-part="chart"]'));
    write(svg, STATES[0].chart, null);
}

const name = () => /** @type {keyof typeof IDEAS} */ (document.documentElement.getAttribute('data-theme') ?? 'formal');
const showNames = () => {
    const ideas = IDEAS[name()];
    for (const col of document.querySelectorAll('[data-uu-idea]')) {
        const at = Number(col.getAttribute('data-uu-idea')) - 1;
        const label = col.querySelector('[data-uu-name]');
        if (label) label.textContent = ideas ? ideas[at][1] : `Idea ${at + 1}: this theme has none`;
    }
};
showNames();

/** Every update this page played, for the measurement script. */
const log = /** @type {{ idea: string, part: string, ms: number }[]} */ ([]);
Object.assign(window, { uuLog: log, uuUpdate: update });

/** @param {Element} col */
async function updateBoard(col) {
    const now = Number(col.getAttribute('data-uu-state') ?? '0');
    const next = STATES[1 - now];
    col.setAttribute('data-uu-state', String(1 - now));
    const parts = /** @type {const} */ (['figure', 'chart', 'state', 'time']);
    await Promise.all(
        parts.map(async (part) => {
            const el = /** @type {Element} */ (col.querySelector(`[data-uu-part="${part}"]`));
            const idea = getComputedStyle(el instanceof SVGSVGElement ? /** @type {Element} */ (el.parentElement) : el)
                .getPropertyValue('--kp-update')
                .trim();
            const ms = await update(el, next[part]);
            log.push({ idea, part, ms });
        }),
    );
}

document.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.target).closest('[data-uu-update]');
    if (!button) return;
    if (button.getAttribute('data-uu-update') === 'all') for (const col of document.querySelectorAll('[data-uu-idea]')) void updateBoard(col);
    else {
        const col = button.closest('[data-uu-idea]');
        if (col) void updateBoard(col);
    }
});

/* ------------------------------------------------------- the numbers */

const ms = (/** @type {number} */ n) => `${Math.round(n)} ms`;
const showTiming = () => {
    showNames();
    const { duration, ease } = updateTiming(document.documentElement);
    const { size, close } = themeMotion(document.documentElement);
    const theme = document.querySelector('[data-uu-theme-timing]');
    if (theme)
        theme.textContent =
            duration > 0
                ? `${name()}: an update plays in ${ms(duration)} (resize ${ms(size)}, close ${ms(close)}), on ${ease}`
                : `${name()}: no motion, the value changes at once`;
    const line = document.querySelector('[data-uu-timing]');
    if (line) line.textContent = duration > 0 ? `Each idea: ${ms(duration)} at full speed, once per update.` : 'No motion in this theme.';
};
// The register arrives after the theme attribute changes; read once it has.
new MutationObserver(() => setTimeout(showTiming, 300)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
addEventListener('load', showTiming);

// What is ticked in the review dialog is what the page marks.
for (const section of document.querySelectorAll('[data-review-item]'))
    section.addEventListener('review:choice', (event) => {
        const { value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
        for (const col of section.querySelectorAll('[data-uu-pick]')) col.classList.toggle('uu-picked', col.getAttribute('data-uu-pick') === value);
    });
new MutationObserver(() => {
    // A pick for one theme says nothing about the next.
    for (const col of document.querySelectorAll('.uu-picked')) col.classList.remove('uu-picked');
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
