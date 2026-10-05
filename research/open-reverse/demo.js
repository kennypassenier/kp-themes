// research/open-reverse: an element that opens as the exact reverse of its
// theme's close, beside the package's open today (Kenny, 2026-10-05: "can we
// also see the opposite of close() with the reverse animation of close? So
// when it grows it's the opposite?").
//
// Nothing here has a motion of its own. The close is the package's
// (js/motion.js): a dialog's closeDialog() plays the entrance it kept
// backwards in themeMotion().close; a card's leave() plays the register's
// `[data-kp-leaving]` exit while its space folds shut. The reverse of each is
// built from those same keyframes, durations, delays and curves with the
// direction turned around, so frame t of the opening is frame (T - t) of the
// close. A theme with no motion (or reduced motion) opens at once.

import { attachMotion, leave, themeMotion, withoutOvershoot } from '../../js/motion.js';

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-or-motion]')?.removeAttribute('hidden');

/* ------------------------------------------------------------- speed */

// Slow motion for judging, as on research/size-motion: every animation on
// the page, CSS or scripted, plays at the picked rate; a quarter by default.
// The rate keeps an animation's sign, so one played backwards stays so.
let rate = 0.25;
try {
    const kept = Number(localStorage.getItem('or-speed'));
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
const speedButtons = [...document.querySelectorAll('[data-or-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-or-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-or-speed'));
        try {
            localStorage.setItem('or-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();

/** Milliseconds at full speed, as the page says them. @param {number} ms */
const ms = (ms) => `${Math.round(ms)} ms`;

/* ------------------------------------------------------------ dialog */

/**
 * The entrance animations a dialog has just started, as js/motion.js keeps
 * them for its close (rememberEntrance): every CSS animation under it.
 * @param {HTMLDialogElement} dialog
 */
const entranceOf = (dialog) => {
    getComputedStyle(dialog).animationName;
    return dialog
        .getAnimations({ subtree: true })
        .filter((a) => a instanceof CSSAnimation && a.effect instanceof KeyframeEffect)
        .map((a) => /** @type {CSSAnimation} */ (a));
};

/**
 * Open `dialog` as its close played backwards: closeDialog() plays each kept
 * entrance with `direction: 'reverse'` and `fill: 'forwards'` in
 * themeMotion().close; this plays the same keyframes on the same curve with
 * `direction: 'normal'` and `fill: 'backwards'` in the same time, and the
 * backdrop's fade the same way.
 * @param {HTMLDialogElement} dialog
 * @returns {Animation[]}
 */
function openAsReversedClose(dialog) {
    const { close } = themeMotion(dialog);
    const css = entranceOf(dialog);
    if (close <= 0) return [];
    const kept = css.map((a) => {
        const effect = /** @type {KeyframeEffect} */ (a.effect);
        return { keyframes: effect.getKeyframes(), easing: String(effect.getTiming().easing ?? 'linear'), pseudoElement: effect.pseudoElement };
    });
    for (const a of css) a.cancel();
    /** @type {Animation[]} */
    const out = [];
    for (const { keyframes, easing, pseudoElement } of kept) {
        try {
            out.push(dialog.animate(keyframes, { duration: close, easing, fill: 'backwards', ...(pseudoElement ? { pseudoElement } : {}) }));
        } catch {
            /* an engine that cannot animate that pseudo-element skips it, as the close does */
        }
    }
    const fade = /** @type {Keyframe[]} */ ([{ opacity: 1 }, { opacity: 0 }]);
    if (!kept.some((one) => one.pseudoElement === '::backdrop')) {
        try {
            out.push(
                dialog.animate(fade, { duration: close, easing: 'ease-in', direction: 'reverse', fill: 'backwards', pseudoElement: '::backdrop' }),
            );
        } catch {
            /* as above */
        }
    }
    if (kept.length === 0) out.push(dialog.animate(fade, { duration: close, easing: 'ease-in', direction: 'reverse', fill: 'backwards' }));
    return out;
}

/** @param {'reverse' | 'today'} mode */
function openDialog(mode) {
    const template = /** @type {HTMLTemplateElement} */ (document.querySelector('[data-or-template="dialog"]'));
    const dialog = /** @type {HTMLDialogElement} */ (template.content.firstElementChild?.cloneNode(true));
    dialog.setAttribute('data-or-mode', mode);
    document.body.append(dialog);
    // Both sides close the package's way: the entrance backwards.
    attachMotion(dialog);
    dialog.addEventListener('click', (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.closest('[data-or-close]')) dialog.close();
        else if (target === dialog) {
            // A click on the backdrop lands on the dialog itself, outside its box.
            const box = dialog.getBoundingClientRect();
            const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
            if (!inside) dialog.close();
        }
    });
    dialog.addEventListener('close', () => dialog.remove());
    dialog.showModal();
    if (mode === 'reverse') openAsReversedClose(dialog);
}

document.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.target).closest('[data-or-dialog]');
    if (button) openDialog(/** @type {'reverse' | 'today'} */ (button.getAttribute('data-or-dialog')));
});

/* -------------------------------------------------------------- card */

/** The first duration of a CSS duration list, in ms. @param {string} raw */
const firstMs = (raw) => {
    const first = raw.split(',')[0].trim();
    const n = parseFloat(first);
    if (Number.isNaN(n)) return 0;
    return first.endsWith('ms') ? n : n * 1000;
};

/**
 * The timeline leave(el) plays for `el` in its theme, read the way
 * js/motion.js reads it: the register's own exit on `[data-kp-leaving]`
 * (its keyframes and timing, the pseudo-elements' too), and the fold of its
 * space, which starts a third into the exit (`--kp-leave-fold: together`,
 * the picked default) or after it (`after`, plus `--kp-leave-pause`) and
 * runs max(size, exit) × 1.25 on the entrance's curve without overshoot.
 * Read with `data-kp-leaving` on, and the exit taken over: the caller keeps
 * the attribute for the register's static rules (titanium's `::after`).
 * @param {HTMLElement} el
 */
function leaveTimeline(el) {
    el.setAttribute('data-kp-leaving', '');
    const style = getComputedStyle(el);
    const css = el
        .getAnimations({ subtree: true })
        .filter((a) => a instanceof CSSAnimation && /** @type {KeyframeEffect} */ (a.effect)?.target === el)
        .map((a) => /** @type {CSSAnimation} */ (a));
    const exits = css.map((a) => {
        const effect = /** @type {KeyframeEffect} */ (a.effect);
        const timing = effect.getTiming();
        return {
            keyframes: effect.getKeyframes(),
            duration: Number(timing.duration) || 0,
            delay: Number(timing.delay) || 0,
            easing: String(timing.easing ?? 'linear'),
            pseudoElement: effect.pseudoElement,
        };
    });
    for (const a of css) a.cancel();
    const lasts = exits.length ? firstMs(style.animationDuration) : 0;
    const { size, ease } = themeMotion(el);
    const fold = style.getPropertyValue('--kp-leave-fold').trim();
    const pause = parseFloat(style.getPropertyValue('--kp-leave-pause')) || 0;
    const foldFor = size > 0 ? Math.max(size, lasts) * 1.25 : 0;
    const foldAt = fold === 'after' ? lasts + pause : lasts / 3;
    const total = Math.max(lasts, foldFor ? foldAt + foldFor : 0);
    return { exits, lasts, foldFor, foldAt, total, easing: withoutOvershoot(ease), style };
}

/**
 * The space `el` takes, and nothing, as leave() folds it: height, margins
 * and paddings to 0, and the column's gap swallowed by a negative margin
 * towards the neighbour.
 * @param {HTMLElement} el @param {CSSStyleDeclaration} style
 */
function foldFrames(el, style) {
    const from = {
        height: `${el.offsetHeight}px`,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
    };
    /** @type {Record<string, string>} */
    const to = Object.fromEntries(Object.keys(from).map((k) => [k, '0px']));
    const parent = el.parentElement ? getComputedStyle(el.parentElement) : null;
    const gap = parent && /flex/.test(parent.display) ? parseFloat(parent.rowGap) || 0 : 0;
    if (gap > 0) {
        if (el.previousElementSibling) to.marginTop = `${-gap}px`;
        else if (el.nextElementSibling) to.marginBottom = `${-gap}px`;
    }
    return [from, to];
}

/**
 * Open a card that leave(card, { hide: true }) closed, as that leave played
 * backwards: the exit runs in reverse, ending where it began at the leave's
 * start, and the space unfolds over the fold's span mirrored in the whole
 * timeline. Frame t of this opening is frame (total - t) of the leave.
 * @param {HTMLElement} el
 * @returns {Promise<number>} the length of the opening, in ms at full speed
 */
async function openAsReversedLeave(el) {
    // The room that eases around it must not play today's arrival for it,
    // and follows its fold frame by frame while it carries data-kp-leaving.
    el.setAttribute('data-kp-arrive', 'none');
    el.hidden = false;
    const line = leaveTimeline(el);
    if (line.total <= 0) {
        el.removeAttribute('data-kp-leaving');
        el.removeAttribute('data-kp-arrive');
        return 0;
    }
    /** @type {Animation[]} */
    const plays = [];
    for (const exit of line.exits) {
        // In the leave this exit ran from its delay to its delay + duration;
        // turned around it ends at the timeline's end.
        const at = line.total - exit.delay - exit.duration;
        plays.push(
            el.animate(exit.keyframes, {
                duration: exit.duration,
                delay: at,
                easing: exit.easing,
                direction: 'reverse',
                fill: 'both',
                ...(exit.pseudoElement ? { pseudoElement: exit.pseudoElement } : {}),
            }),
        );
    }
    if (line.foldFor > 0) {
        el.style.setProperty('overflow', 'clip');
        el.style.setProperty('box-sizing', 'border-box');
        plays.push(
            el.animate(foldFrames(el, line.style), {
                duration: line.foldFor,
                delay: line.total - line.foldAt - line.foldFor,
                easing: line.easing,
                direction: 'reverse',
                fill: 'backwards',
            }),
        );
    }
    await Promise.all(plays.map((a) => a.finished.catch(() => undefined)));
    el.removeAttribute('data-kp-leaving');
    el.removeAttribute('data-kp-arrive');
    el.style.removeProperty('overflow');
    el.style.removeProperty('box-sizing');
    for (const a of plays) a.cancel();
    return line.total;
}

document.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement} */ (event.target).closest('[data-or-card-act]');
    const col = button?.closest('[data-or-card]');
    const card = /** @type {HTMLElement | null | undefined} */ (col?.querySelector('[data-or-target]'));
    if (!button || !col || !card || card.hasAttribute('data-kp-leaving')) return;
    const act = button.getAttribute('data-or-card-act');
    if (act === 'close' && !card.hidden) void leave(card, { hide: true });
    if (act === 'open' && card.hidden) {
        if (col.getAttribute('data-or-card') === 'reverse') void openAsReversedLeave(card);
        // Today: shown in a box that eases, it arrives the theme's way.
        else card.hidden = false;
    }
});

/* ------------------------------------------------------- the numbers */

// What this theme's close and open take, at full speed, read from the
// package rather than written down.
const showTiming = () => {
    const name = document.documentElement.getAttribute('data-theme') ?? 'formal';
    const { open, close, size } = themeMotion(document.documentElement);
    const theme = document.querySelector('[data-or-theme-timing]');
    if (theme)
        theme.textContent =
            open > 0 ? `${name}: the dialog opens in ${ms(open)} and closes in ${ms(close)}; a box resizes in ${ms(size)}` : `${name}: no motion`;
    const dialogLine = document.querySelector('[data-or-timing="dialog"]');
    if (dialogLine)
        dialogLine.textContent =
            open > 0
                ? `Close: ${ms(close)}. Reverse of close: ${ms(close)}. Today's open: ${ms(open)}.`
                : 'This theme has no dialog entrance, so both open and close at once.';
    const probe = /** @type {HTMLElement | null} */ (document.querySelector('[data-or-card="reverse"] [data-or-target]'));
    const cardLine = document.querySelector('[data-or-timing="card"]');
    if (probe && cardLine && !probe.hidden && !probe.hasAttribute('data-kp-leaving')) {
        const line = leaveTimeline(probe);
        probe.removeAttribute('data-kp-leaving');
        cardLine.textContent =
            line.total > 0
                ? `Close (leave): ${ms(line.total)}, the exit ${ms(line.lasts)} with the space folding from ${ms(line.foldAt)} for ${ms(line.foldFor)}. Reverse of close: the same ${ms(line.total)}, turned around.`
                : 'This theme has no leave, so the card closes and opens at once.';
    }
};
// The register arrives after the theme attribute changes; read once it has.
new MutationObserver(() => setTimeout(showTiming, 300)).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
addEventListener('load', showTiming);

// What is ticked in the review dialog is what the page marks.
for (const section of document.querySelectorAll('[data-review-item]'))
    section.addEventListener('review:choice', (event) => {
        const { value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
        for (const col of section.querySelectorAll('[data-or-pick]')) col.classList.toggle('or-picked', col.getAttribute('data-or-pick') === value);
    });
new MutationObserver(() => {
    // A pick for one theme says nothing about the next.
    for (const col of document.querySelectorAll('.or-picked')) col.classList.remove('or-picked');
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
