// A dialog that leaves the way it came, and boxes that ease to a new size
// instead of jumping, growing and shrinking alike [scope-142].
//
// Kenny, 2026-10-04, approving the formal demo (research/size-motion): "het
// openen van een dialog heeft al bepaalde snelheden per thema, baseer je op
// die snelheden om te weten hoe snel je kan sluiten/uitbreiden/krimpen. Maak
// direct alle componenten voor elk thema". So nothing here carries a speed
// of its own: every duration and curve is read from the theme's dialog
// entrance, the one motion every register already decided.
//
//   - Close: the dialog plays its own entrance backwards, in two thirds of
//     the entrance's time (formal: 300 ms in, 200 ms out). The curve is the
//     entrance's own, run in reverse, so an entrance that eases out leaves
//     easing in, and a stepped one leaves in steps.
//   - Size: a box eases from its old height to its new one in four fifths of
//     the entrance's time on the entrance's curve (formal: 240 ms).
//   - Both are capped (`--kp-close-max`, 600 ms; `--kp-size-max`, 480 ms),
//     because light's and dark's entrances run over two seconds and a close
//     or a row that takes that long is in the reader's way. `--kp-motion-scale`
//     on the root plays all of it slower or faster at once.
//   - A theme with no entrance (or a reader who asked for reduced motion)
//     gets none: the dialog closes and the box takes its size at once.
//   - A register that declares `--kp-open: reverse-close` (formal,
//     cyberpunk, titanium; Kenny's pick on research/open-reverse,
//     2026-10-05) opens as it closes, turned around: the dialog plays its
//     entrance forwards in the close's time, and what arrives in an eased
//     box plays the theme's leave backwards, so frame t of the opening is
//     frame (T - t) of the close.
//
// What moves: every `.kp-dialog` (closing, and growing or shrinking while
// open), the accordion's items, tabs, the data table, the toast stack, the
// upload list, the combobox list, the tree, the wizard, a field whose error
// comes and goes, and any element marked `data-kp-size-motion`. Boxes that
// appear later (a framework's render) are picked up as they arrive.

/** Any box a consumer wants eased, beside the components below. */
export const SIZE_ATTRIBUTE = 'data-kp-size-motion';

/** The boxes that ease to a new size. */
export const SIZE_SELECTOR = [
    '.kp-dialog',
    '.kp-tabs',
    '.kp-datatable',
    '.kp-toasts',
    '.kp-upload__list',
    '.kp-combobox__list',
    '.kp-tree',
    '.kp-wizard',
    '.kp-field',
    `[${SIZE_ATTRIBUTE}]`,
].join(', ');

/** The disclosures that unfold and fold back. */
export const FOLD_SELECTOR = '.kp-accordion__item';

/**
 * The attributes that give a row its stable id, in the order they are read,
 * for `data-kp-arrive="new"` [port spec G]: a row added back under the key
 * of a row that just left is the same row, repainted.
 */
export const ARRIVE_KEYS = /** @type {readonly string[]} */ (Object.freeze(['data-kp-key', 'data-kp-row-key', 'id']));

/** A loading placeholder: what replaces one is the data it waited for, not news. */
const SKELETON = '.kp-skeleton, [data-kp-skeleton]';

/** How many dialogs, boxes and folds motion watches now, for a test to read. */
let watching = 0;

/**
 * How many dialogs, boxes and disclosures motion is watching right now. A
 * diagnostic: after a page removes its boxes it returns to where it was,
 * because a box that leaves the page is let go.
 * @returns {number}
 */
export function motionWatchCount() {
    return watching;
}

const CLOSE_SHARE = 2 / 3;
const SIZE_SHARE = 4 / 5;

/** @param {Element} el @param {string} name @param {number} fallback */
const msOf = (el, name, fallback) => {
    const raw = getComputedStyle(el).getPropertyValue(name).trim();
    const n = parseFloat(raw);
    if (Number.isNaN(n)) return fallback;
    return raw.endsWith('ms') ? n : n * 1000;
};

/** @param {string} raw a CSS duration list @returns {number} the first, in ms */
const firstMs = (raw) => {
    const first = raw.split(',')[0].trim();
    const n = parseFloat(first);
    if (Number.isNaN(n)) return 0;
    return first.endsWith('ms') ? n : n * 1000;
};

/** @returns {boolean} */
const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The theme's motion, read from its dialog entrance: a dialog drawn for an
 * instant out of sight, in the theme `scope` wears.
 *
 * @param {Element} [scope] where the theme is read (its closest `[data-theme]` applies)
 * @returns {{ open: number, ease: string, close: number, size: number }} milliseconds, and the entrance's curve
 */
export function themeMotion(scope = document.documentElement) {
    if (reduced()) return { open: 0, ease: 'linear', close: 0, size: 0 };
    const host = scope.ownerDocument?.body ?? document.body;
    const probe = document.createElement('div');
    probe.className = 'kp-dialog';
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;inset:auto;left:-9999px;top:0;visibility:hidden;pointer-events:none;';
    const themed = scope.closest('[data-theme]');
    // The register's dialog rules name `.kp-dialog` under the theme's root,
    // so the probe stands where the scope stands.
    (themed && themed !== document.documentElement && themed instanceof HTMLElement ? themed : host).append(probe);
    let open = 0;
    let ease = 'ease';
    try {
        const style = getComputedStyle(probe);
        if (style.animationName && style.animationName !== 'none') {
            open = firstMs(style.animationDuration);
            ease = style.animationTimingFunction.split(/,(?![^(]*\))/)[0].trim() || 'ease';
        }
    } finally {
        probe.remove();
    }
    const root = scope.ownerDocument?.documentElement ?? document.documentElement;
    // A page may play every motion slower or faster at once (a demo's slow
    // motion, a reader's own preference): `--kp-motion-scale`, default 1.
    const scale = parseFloat(getComputedStyle(root).getPropertyValue('--kp-motion-scale')) || 1;
    return {
        open,
        ease,
        close: Math.min(open * CLOSE_SHARE, msOf(root, '--kp-close-max', 600)) * scale,
        size: Math.min(open * SIZE_SHARE, msOf(root, '--kp-size-max', 480)) * scale,
    };
}

/* ------------------------------------------------------------- closing */

/** @type {WeakMap<HTMLDialogElement, { keyframes: Keyframe[], easing: string, pseudoElement: string | null }[]>} */
const entrances = new WeakMap();
/** @type {WeakSet<HTMLDialogElement>} */
const closing = new WeakSet();
const nativeClose = typeof HTMLDialogElement === 'undefined' ? null : HTMLDialogElement.prototype.close;

/**
 * Keep the entrance the dialog just started, so its close can play it
 * backwards: a finished entrance with `fill: backwards` is gone from the
 * element by the time the dialog closes.
 * @param {HTMLDialogElement} dialog
 */
function rememberEntrance(dialog) {
    getComputedStyle(dialog).animationName;
    const kept = dialog
        .getAnimations({ subtree: true })
        .filter((a) => a instanceof CSSAnimation && a.effect instanceof KeyframeEffect)
        .map((a) => {
            const effect = /** @type {KeyframeEffect} */ (a.effect);
            return { keyframes: effect.getKeyframes(), easing: String(effect.getTiming().easing ?? 'linear'), pseudoElement: effect.pseudoElement };
        });
    entrances.set(dialog, kept);
}

/**
 * Close a dialog the way it opened, backwards, then close it for real. With
 * no entrance to reverse (reduced motion, a theme without one) it closes at
 * once.
 *
 * @param {HTMLDialogElement} dialog
 * @param {string} [returnValue]
 * @returns {Promise<void>} settled once the dialog is closed
 */
export async function closeDialog(dialog, returnValue) {
    const close = () => nativeClose?.call(dialog, returnValue);
    if (!dialog.open || closing.has(dialog)) return;
    const { close: duration } = themeMotion(dialog);
    const kept = entrances.get(dialog) ?? [];
    if (duration <= 0) return void close();
    closing.add(dialog);
    /** @type {Animation[]} */
    const out = [];
    for (const { keyframes, easing, pseudoElement } of kept) {
        try {
            out.push(
                dialog.animate(keyframes, {
                    duration,
                    easing,
                    direction: 'reverse',
                    fill: 'forwards',
                    ...(pseudoElement ? { pseudoElement } : {}),
                }),
            );
        } catch {
            /* an engine that cannot animate that pseudo-element skips it */
        }
    }
    // The backdrop leaves with the dialog when the theme gave it no motion of its own.
    if (!kept.some((one) => one.pseudoElement === '::backdrop')) {
        try {
            out.push(
                dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-in', fill: 'forwards', pseudoElement: '::backdrop' }),
            );
        } catch {
            /* as above */
        }
    }
    if (kept.length === 0) out.push(dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-in', fill: 'forwards' }));
    await Promise.all(out.map((a) => a.finished.catch(() => undefined)));
    closing.delete(dialog);
    close();
    for (const a of out) a.cancel();
}

/**
 * Whether the theme `el` wears opens what closes as that close played
 * backwards: its register says `--kp-open: reverse-close` (formal, cyberpunk
 * and titanium; Kenny's pick on research/open-reverse, 2026-10-05).
 * @param {Element} el
 */
const opensAsReversedClose = (el) => getComputedStyle(el).getPropertyValue('--kp-open').trim() === 'reverse-close';

/**
 * Open `dialog` as its close played backwards [research/open-reverse]:
 * closeDialog() plays each kept entrance with `direction: 'reverse'` in
 * themeMotion().close; this replaces the register's entrance with the same
 * keyframes on the same curve, forwards, in that same time, and the
 * backdrop's fade turned around, so frame t of the opening is frame
 * (close - t) of the close. Only in a theme that asks for it.
 * @param {HTMLDialogElement} dialog
 */
function openAsReversedClose(dialog) {
    if (!dialog.open || !opensAsReversedClose(dialog)) return;
    const { close: duration } = themeMotion(dialog);
    const kept = entrances.get(dialog) ?? [];
    if (duration <= 0) return;
    for (const a of dialog.getAnimations({ subtree: true })) if (a instanceof CSSAnimation) a.cancel();
    for (const { keyframes, easing, pseudoElement } of kept) {
        try {
            dialog.animate(keyframes, { duration, easing, fill: 'backwards', ...(pseudoElement ? { pseudoElement } : {}) });
        } catch {
            /* an engine that cannot animate that pseudo-element skips it, as the close does */
        }
    }
    const fade = /** @type {Keyframe[]} */ ([{ opacity: 1 }, { opacity: 0 }]);
    if (!kept.some((one) => one.pseudoElement === '::backdrop')) {
        try {
            dialog.animate(fade, { duration, easing: 'ease-in', direction: 'reverse', fill: 'backwards', pseudoElement: '::backdrop' });
        } catch {
            /* as above */
        }
    }
    if (kept.length === 0) dialog.animate(fade, { duration, easing: 'ease-in', direction: 'reverse', fill: 'backwards' });
}

/**
 * Give one dialog its leaving motion: its own `close()`, Escape and the
 * backdrop all play it. `dialog.open` stays true while it plays, and the
 * `close` event comes at its end, as it does for any closed dialog.
 * @param {HTMLDialogElement} dialog
 * @returns {() => void}
 */
function attachClose(dialog) {
    const own = /** @type {any} */ (dialog);
    if (own.__kpMotion) return () => {};
    own.__kpMotion = true;
    watching += 1;
    const showModal = dialog.showModal;
    const show = dialog.show;
    own.showModal = function () {
        showModal.call(dialog);
        rememberEntrance(dialog);
        openAsReversedClose(dialog);
    };
    own.show = function () {
        show.call(dialog);
        rememberEntrance(dialog);
        openAsReversedClose(dialog);
    };
    own.close = (/** @type {string | undefined} */ value) => void closeDialog(dialog, value);
    if (dialog.open) rememberEntrance(dialog);
    // Escape: unless a listener before this one already decided (a page that
    // keeps the dialog open, or the React channel, which closes through its
    // own state and so through `close()` above).
    const onCancel = (/** @type {Event} */ event) => {
        if (event.defaultPrevented) return;
        event.preventDefault();
        void closeDialog(dialog);
    };
    dialog.addEventListener('cancel', onCancel);
    return () => {
        if (!own.__kpMotion) return;
        watching -= 1;
        dialog.removeEventListener('cancel', onCancel);
        delete own.showModal;
        delete own.show;
        delete own.close;
        delete own.__kpMotion;
    };
}

/* -------------------------------------------------------------- sizing */

/**
 * A theme switch changes many sizes at once (a field's gap, a face's
 * metrics); none of that is content arriving, so nothing glides for it. The
 * box takes its new size, as the rest of the page does. Set for two frames
 * after the root's theme changes, and while the new register's faces load.
 */
let switching = 0;
if (typeof document !== 'undefined' && typeof MutationObserver === 'function') {
    new MutationObserver(() => {
        const mine = ++switching;
        const release = () => {
            if (switching === mine) switching = 0;
        };
        requestAnimationFrame(() => requestAnimationFrame(() => void document.fonts?.ready.then(release, release)));
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

/**
 * The entrance's curve without its overshoot: a size goes to its new value
 * and stops there (Kenny, 2026-10-04: pastel's and synthwave's cards "grow
 * too much and shrink again at the end, it should just grow to the correct
 * size"). A cubic-bezier's y values are held between 0 and 1.
 * @param {string} ease
 */
export function withoutOvershoot(ease) {
    const m = /^cubic-bezier\(\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)$/.exec(ease.trim());
    if (!m) return ease;
    const [x1, y1, x2, y2] = m.slice(1).map(Number);
    const hold = (/** @type {number} */ y) => Math.min(1, Math.max(0, y));
    return `cubic-bezier(${x1}, ${hold(y1)}, ${x2}, ${hold(y2)})`;
}

/**
 * The curve a size change runs on: the entrance's, without overshoot, or,
 * where the theme asks for it (`--kp-size-steps: line`, terminal), one step
 * per line of text the box gains or loses.
 * @param {HTMLElement} box @param {string} ease @param {number} change in px
 * @param {boolean} [plain] the entrance's curve alone, without the theme's size character (the accordion, approved as it is)
 */
function sizeEase(box, ease, change, plain = false) {
    const style = getComputedStyle(box);
    if (plain) return withoutOvershoot(ease);
    // A theme may give its sizes a curve of their own (`--kp-size-ease`),
    // still held from overshooting.
    const own = style.getPropertyValue('--kp-size-ease').trim();
    if (own) ease = own;
    if (style.getPropertyValue('--kp-size-steps').trim() === 'line') {
        const line = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.3 || 20;
        return `steps(${Math.max(1, Math.round(Math.abs(change) / line))}, jump-end)`;
    }
    return withoutOvershoot(ease);
}

/**
 * A box's layout height to the fraction: its border box as drawn when that
 * is the layout height rounded (a fold of 75.5 px glided to 76 and then
 * clicked half a pixel back, in formal), and `offsetHeight` when a
 * transform scales what is drawn (an entrance that zooms the box).
 * @param {HTMLElement} el
 */
function layoutHeight(el) {
    const whole = el.offsetHeight;
    const drawn = el.getBoundingClientRect().height;
    return Math.abs(drawn - whole) < 1 ? drawn : whole;
}

/**
 * The size motion of the theme `box` wears, for a box this module does not
 * glide itself (the tiles of a set, js/tiles.js): the duration and the curve
 * a change of `change` px runs on, with the theme's own size character
 * (`--kp-size-ease`, `--kp-size-steps`). A duration of 0 means: take the
 * new size at once (reduced motion, a theme without an entrance, or a theme
 * switch in progress).
 * @param {HTMLElement} box @param {number} change in px
 * @returns {{ duration: number, easing: string }}
 */
export function sizeMotion(box, change) {
    const { size, ease } = themeMotion(box);
    if (size <= 0 || switching) return { duration: 0, easing: 'linear' };
    return { duration: size, easing: sizeEase(box, ease, change) };
}

/**
 * Glide `box` from one height to another. During the glide the box clips
 * what overflows it and measures its border box, so the last frame is the
 * size it keeps (a card with padding read its padding twice and then
 * clicked smaller, in forest and high-contrast).
 * @param {HTMLElement} box @param {number} from @param {number} to @param {number} duration @param {string} easing
 * @param {boolean} [plain] no `[data-kp-resizing]` character
 */
function glide(box, from, to, duration, easing, plain = false) {
    box.style.setProperty('overflow', 'clip');
    box.style.setProperty('box-sizing', 'border-box');
    // While it glides the box says so, which way and for how long: a
    // register draws its own character on `[data-kp-resizing]` (an edge
    // that glows, a rule that draws, a shadow that lengthens) [scope-142].
    box.style.setProperty('--kp-resize-dur', `${Math.round(duration)}ms`);
    if (!plain) box.setAttribute('data-kp-resizing', to > from ? 'grow' : 'shrink');
    // A column of flex items would be squeezed by the gliding height rather
    // than clipped by it: the data table's scroll box shrank every frame,
    // which read as new content and restarted the glide from where it
    // stood, so a group of rows took five seconds to open and the squeezed
    // box scrolled on its own (Kenny, 2026-10-05). Meanwhile the items keep
    // their own size (`[data-kp-gliding='column'] > *`, css/components.css).
    const flow = getComputedStyle(box);
    if (/flex/.test(flow.display) && flow.flexDirection.startsWith('column')) box.setAttribute('data-kp-gliding', 'column');
    const mine = box.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration, easing });
    const own = /** @type {any} */ (box);
    own.__kpGlide = mine;
    const done = () => {
        // A glide cancelled for a newer one leaves the box to the newer one.
        if (own.__kpGlide !== mine) return;
        own.__kpGlide = null;
        box.style.removeProperty('overflow');
        box.style.removeProperty('box-sizing');
        box.style.removeProperty('--kp-resize-dur');
        box.removeAttribute('data-kp-resizing');
        box.removeAttribute('data-kp-gliding');
    };
    mine.addEventListener('cancel', done);
    return { animation: mine, done };
}

/**
 * The theme's own way of letting a small thing arrive: its toast entrance,
 * already decided per register, read from a toast drawn out of sight.
 * @param {Element} scope
 * @returns {string | null} an `animation` value, or null for none
 */
function arrival(scope) {
    if (reduced()) return null;
    const probe = document.createElement('div');
    probe.className = 'kp-toast';
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;left:-9999px;top:0;visibility:hidden;pointer-events:none;';
    const themed = scope.closest('[data-theme]');
    (themed && themed !== document.documentElement && themed instanceof HTMLElement ? themed : document.body).append(probe);
    try {
        const style = getComputedStyle(probe);
        if (!style.animationName || style.animationName === 'none') return null;
        const name = style.animationName.split(',')[0].trim();
        const cap = msOf(scope.ownerDocument?.documentElement ?? document.documentElement, '--kp-size-max', 480);
        const duration = Math.min(firstMs(style.animationDuration), cap);
        if (duration <= 0) return null;
        const ease = style.animationTimingFunction.split(/,(?![^(]*\))/)[0].trim();
        return `${name} ${duration}ms ${ease} backwards`;
    } finally {
        probe.remove();
    }
}

/**
 * Let `el` arrive the theme's way, once.
 * @param {HTMLElement} el @param {string | null} motion
 */
function arrive(el, motion) {
    if (!motion || el.style.animation || el.hasAttribute('data-kp-arriving') || el.hasAttribute('data-kp-leaving')) return;
    // A theme that opens as its close turned around lets it arrive as its
    // leave played backwards [research/open-reverse].
    if (opensAsReversedClose(el) && arriveAsReversedLeave(el)) return;
    // A register that has its own arrival draws it on `[data-kp-arriving]`;
    // one that has not lends its toast's.
    el.setAttribute('data-kp-arriving', '');
    const own = getComputedStyle(el).animationName;
    if (!own || own === 'none') el.style.animation = motion;
    const end = () => {
        el.style.removeProperty('animation');
        el.removeAttribute('data-kp-arriving');
    };
    void playedOut(el, 1500).then(end);
}

/**
 * Settles once the CSS animations on `el` are `share` of the way through,
 * or when `done` settles, whichever is first.
 * @param {HTMLElement} el @param {number} share @param {Promise<unknown>} done
 * @returns {Promise<unknown>}
 */
function partway(el, share, done) {
    const css = el
        .getAnimations({ subtree: true })
        .filter((a) => typeof CSSAnimation !== 'undefined' && a instanceof CSSAnimation && /** @type {KeyframeEffect} */ (a.effect)?.target === el);
    const reached = new Promise((resolve) => {
        const tick = () => {
            const through = css.every((a) => {
                const timing = a.effect?.getComputedTiming();
                return a.playState === 'finished' || (timing?.progress ?? 0) >= share || (timing?.currentIteration ?? 0) > 0;
            });
            if (through) resolve(undefined);
            else requestAnimationFrame(tick);
        };
        tick();
    });
    return Promise.race([reached, done]);
}

/**
 * Settles when the CSS animations running on `el` have played out, at
 * whatever rate they play (a slowed-down review plays them at a quarter);
 * with none running, after `fallback` ms.
 * @param {HTMLElement} el @param {number} fallback
 * @returns {Promise<unknown>}
 */
function playedOut(el, fallback) {
    // Its pseudo-elements count too: a theme may draw its exit on ::after.
    const css = el
        .getAnimations({ subtree: true })
        .filter((a) => typeof CSSAnimation !== 'undefined' && a instanceof CSSAnimation && /** @type {KeyframeEffect} */ (a.effect)?.target === el);
    if (css.length === 0) return new Promise((resolve) => setTimeout(resolve, fallback));
    return Promise.all(css.map((a) => a.finished.catch(() => undefined)));
}

/**
 * The arrival `el` would play, as an animation name, duration and curve:
 * the register's own `[data-kp-arriving]`, else the theme's toast entrance.
 * @param {HTMLElement} el
 * @returns {{ name: string, duration: number, ease: string } | null}
 */
function arrivalOf(el) {
    if (reduced()) return null;
    const had = el.hasAttribute('data-kp-arriving');
    el.setAttribute('data-kp-arriving', '');
    const style = getComputedStyle(el);
    const own = style.animationName && style.animationName !== 'none';
    const read = own
        ? {
              name: style.animationName.split(',')[0].trim(),
              duration: firstMs(style.animationDuration),
              ease: style.animationTimingFunction.split(/,(?![^(]*\))/)[0].trim(),
          }
        : null;
    if (!had) el.removeAttribute('data-kp-arriving');
    if (read && read.duration > 0) return read;
    const toast = arrival(el);
    if (!toast) return null;
    const [name, duration, ...ease] = toast.split(' ');
    return { name, duration: parseFloat(duration), ease: ease.slice(0, -1).join(' ') };
}

/**
 * The space `el` takes, and nothing, as a leave folds it: in a row (a flex
 * row, an inline chip) its width, sideways; anywhere else its height, from
 * below; margins and paddings to 0, and the flex gap towards a neighbour
 * swallowed by a negative margin.
 * @param {HTMLElement} el @param {CSSStyleDeclaration} style its style while it carries `data-kp-leaving`
 * @returns {[Record<string, string>, Record<string, string>]}
 */
function foldFrames(el, style) {
    const parent = el.parentElement ? getComputedStyle(el.parentElement) : null;
    const sideways =
        style.display.startsWith('inline') || (parent !== null && /flex/.test(parent.display) && !parent.flexDirection.startsWith('column'));
    /** @type {Record<string, string>} */
    const from = sideways
        ? {
              width: `${el.offsetWidth}px`,
              marginLeft: style.marginLeft,
              marginRight: style.marginRight,
              paddingLeft: style.paddingLeft,
              paddingRight: style.paddingRight,
          }
        : {
              height: `${el.offsetHeight}px`,
              marginTop: style.marginTop,
              marginBottom: style.marginBottom,
              paddingTop: style.paddingTop,
              paddingBottom: style.paddingBottom,
          };
    /** @type {Record<string, string>} */
    const to = Object.fromEntries(Object.keys(from).map((k) => [k, '0px']));
    // The gap a flex box keeps between its items stays until the item is
    // taken out, so a column of rows folded every row to nothing and then
    // jumped by a gap at each removal (15 px, measured in the leave
    // options' cards, 2026-10-05). A negative margin towards the
    // neighbour swallows the gap as the space closes.
    const gapOf = parent && /flex/.test(parent.display) ? parseFloat(sideways ? parent.columnGap : parent.rowGap) || 0 : 0;
    if (gapOf > 0) {
        const inFlow = (/** @type {Element | null} */ n) => {
            if (!n) return false;
            const s = getComputedStyle(n);
            return s.display !== 'none' && s.position !== 'absolute' && s.position !== 'fixed';
        };
        const near = (/** @type {'previousElementSibling' | 'nextElementSibling'} */ way) => {
            let n = el[way];
            while (n && !inFlow(n)) n = n[way];
            return n;
        };
        const rtl = sideways && style.direction === 'rtl';
        const start = sideways ? (rtl ? 'marginRight' : 'marginLeft') : 'marginTop';
        const end = sideways ? (rtl ? 'marginLeft' : 'marginRight') : 'marginBottom';
        if (near('previousElementSibling')) to[start] = `${-gapOf}px`;
        else if (near('nextElementSibling')) to[end] = `${-gapOf}px`;
    }
    return [from, to];
}

/**
 * The reverse arrivals playing now, each with the way to stop it, so a
 * leave that comes during one starts from the element as it stands.
 * @type {WeakMap<HTMLElement, () => void>}
 */
const entering = new WeakMap();

/**
 * Let `el` arrive as its leave played backwards [research/open-reverse;
 * Kenny's pick for formal, cyberpunk and titanium, 2026-10-05]: the
 * timeline leaveOne() would play for it in its theme (the register's exit
 * on `[data-kp-leaving]`, pseudo-elements included, and the fold of its
 * space a third of the way in, or after it, or under a stand-in), turned
 * around, so frame t of the arrival is frame (T - t) of the leave. Every
 * duration, delay and curve is the theme's, read as leaveOne() reads it.
 *
 * @param {HTMLElement} el
 * @returns {boolean} false when it has no leave to turn around (a table row,
 *   which a leave does not fold; a register with no exit of its own): the
 *   caller plays the theme's arrival instead
 */
function arriveAsReversedLeave(el) {
    if (el instanceof HTMLTableRowElement || !el.isConnected) return false;
    const { size, ease } = themeMotion(el);
    const before = getComputedStyle(el).animationName;
    el.setAttribute('data-kp-leaving', '');
    const style = getComputedStyle(el);
    const ownName = style.animationName;
    if (!ownName || ownName === 'none' || ownName === before) {
        el.removeAttribute('data-kp-leaving');
        return false;
    }
    el.setAttribute('data-kp-arriving', '');
    const lasts = firstMs(style.animationDuration);
    const fold = style.getPropertyValue('--kp-leave-fold').trim();
    // `ghost`: as in the leave, a stand-in of the same shape plays the exit
    // on top while the element itself, hidden, unfolds its space underneath.
    /** @type {HTMLElement} */
    let actor = el;
    if (fold === 'ghost' && lasts > 0) {
        actor = /** @type {HTMLElement} */ (el.cloneNode(true));
        actor.setAttribute('aria-hidden', 'true');
        actor.inert = true;
        Object.assign(actor.style, {
            position: 'absolute',
            top: `${el.offsetTop}px`,
            left: `${el.offsetLeft}px`,
            width: `${el.offsetWidth}px`,
            height: `${el.offsetHeight}px`,
            margin: '0',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            zIndex: '1',
        });
        el.after(actor);
        const want = el.getBoundingClientRect();
        const got = actor.getBoundingClientRect();
        actor.style.top = `${el.offsetTop + want.top - got.top}px`;
        actor.style.left = `${el.offsetLeft + want.left - got.left}px`;
        el.style.setProperty('visibility', 'hidden');
    }
    // The exit, read off the actor and taken over: its keyframes and timing.
    getComputedStyle(actor).animationName;
    const css = actor
        .getAnimations({ subtree: true })
        .filter((a) => a instanceof CSSAnimation && /** @type {KeyframeEffect} */ (a.effect)?.target === actor)
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
    if (actor !== el) for (const a of el.getAnimations()) if (a instanceof CSSAnimation) a.cancel();
    const after = fold === 'after';
    const pause = parseFloat(style.getPropertyValue('--kp-leave-pause')) || 0;
    const foldFor = size > 0 ? Math.max(size, lasts) * 1.25 : 0;
    const foldAt = after ? lasts + pause : lasts / 3;
    const total = Math.max(lasts, foldFor ? foldAt + foldFor : 0);
    /** @type {Animation[]} */
    const plays = [];
    for (const exit of exits) {
        // In the leave this exit ran from its delay to its delay + duration;
        // turned around it ends at the timeline's end.
        try {
            plays.push(
                actor.animate(exit.keyframes, {
                    duration: exit.duration,
                    delay: total - exit.delay - exit.duration,
                    easing: exit.easing,
                    direction: 'reverse',
                    fill: 'both',
                    ...(exit.pseudoElement ? { pseudoElement: exit.pseudoElement } : {}),
                }),
            );
        } catch {
            /* an engine that cannot animate that pseudo-element skips it, as the leave does */
        }
    }
    if (foldFor > 0) {
        el.style.setProperty('overflow', 'clip');
        el.style.setProperty('box-sizing', 'border-box');
        plays.push(
            el.animate(foldFrames(el, style), {
                duration: foldFor,
                delay: total - foldAt - foldFor,
                easing: withoutOvershoot(ease),
                direction: 'reverse',
                fill: 'backwards',
            }),
        );
    }
    let stopped = false;
    const stop = () => {
        if (stopped) return;
        stopped = true;
        entering.delete(el);
        for (const a of plays) a.cancel();
        if (actor !== el) actor.remove();
        el.removeAttribute('data-kp-leaving');
        el.removeAttribute('data-kp-arriving');
        el.style.removeProperty('overflow');
        el.style.removeProperty('box-sizing');
        el.style.removeProperty('visibility');
    };
    entering.set(el, stop);
    void Promise.all(plays.map((a) => a.finished.catch(() => undefined))).then(stop);
    return true;
}

/**
 * Let `el` leave the theme's way, then take it out [scope-142; Kenny,
 * 2026-10-04: "die grow/shrink bewegingen moeten ook zijn als er opeens
 * nieuwe elementen bijkomen of weggaan"]: it plays its arrival backwards
 * while it folds shut, so what is under it closes up instead of jumping,
 * and the box around it shrinks with it. Under reduced motion, or in a theme
 * with no arrival, it goes at once.
 *
 * Elements told to leave in the same task leave one by one, bottom first.
 *
 * @param {HTMLElement} el
 * @param {{ hide?: boolean }} [options] `hide: true` sets `hidden` instead of removing it
 * @returns {Promise<void>} settled once it is gone
 */
export function leave(el, { hide = false } = {}) {
    return new Promise((resolve) => {
        if (!batch) {
            batch = [];
            queueMicrotask(() => {
                const items = /** @type {Leaving[]} */ (batch);
                batch = null;
                void leaveInTurn(items);
            });
        }
        batch.push({ el, hide, resolve });
    });
}

/** @typedef {{ el: HTMLElement, hide: boolean, resolve: () => void }} Leaving */
/** @type {Leaving[] | null} */
let batch = null;

/**
 * Several elements told to leave at once go one by one, the lowest first,
 * each starting as the one before has played its exit (Kenny, 2026-10-04:
 * "als er twee of meerdere elementen zijn, dan moeten die één voor één in
 * logische volgorde (pak van beneden naar boven) verwijderd worden").
 * @param {Leaving[]} items
 */
async function leaveInTurn(items) {
    items.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1));
    for (const item of items) {
        /** @type {Promise<void>} */
        const exited = new Promise((resolve) => {
            void leaveOne(item.el, item.hide, resolve).then(item.resolve);
        });
        await exited;
    }
}

/**
 * @param {HTMLElement} el @param {boolean} hide
 * @param {() => void} exited called once its exit has played, or at once when it has none
 * @returns {Promise<void>}
 */
async function leaveOne(el, hide, exited) {
    const gone = () => {
        if (hide) el.hidden = true;
        else el.remove();
    };
    // Told to leave while it still arrives as a leave turned around: it
    // leaves from where it stands.
    entering.get(el)?.();
    if (!el.isConnected || el.hasAttribute('data-kp-leaving')) return exited();
    const before = getComputedStyle(el).animationName;
    const arrival = arrivalOf(el);
    const { size, ease } = themeMotion(el);
    if (!arrival && size <= 0) {
        exited();
        return gone();
    }
    el.setAttribute('data-kp-leaving', '');
    // A register with a leave of its own draws it on `[data-kp-leaving]`
    // (Kenny, 2026-10-04: "kan je die ook meer on-theme maken met distincte
    // animaties per thema?"); one without plays its arrival backwards.
    const style = getComputedStyle(el);
    const ownName = style.animationName;
    const own = ownName && ownName !== 'none' && ownName !== before ? { duration: firstMs(style.animationDuration) } : null;
    /** @type {Promise<unknown>[]} */
    const running = [];
    const lasts = own ? own.duration : (arrival?.duration ?? 0);
    // `--kp-leave-fold: ghost` lets a stand-in of the same shape play the
    // exit on top while the element itself, hidden, folds its space shut
    // underneath, so neither squeezes the other (Kenny, 2026-10-04: "maak
    // een div die de vorm van het te verdwijnen element overneemt en pas
    // daar een animatie op toe").
    const fold = style.getPropertyValue('--kp-leave-fold').trim();
    /** @type {HTMLElement} */
    let actor = el;
    if (fold === 'ghost' && lasts > 0) {
        actor = /** @type {HTMLElement} */ (el.cloneNode(true));
        actor.setAttribute('aria-hidden', 'true');
        actor.inert = true;
        Object.assign(actor.style, {
            position: 'absolute',
            top: `${el.offsetTop}px`,
            left: `${el.offsetLeft}px`,
            width: `${el.offsetWidth}px`,
            height: `${el.offsetHeight}px`,
            margin: '0',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            zIndex: '1',
        });
        el.after(actor);
        // Offsets round to whole pixels and skip some borders; correct by
        // what the two boxes measure.
        const want = el.getBoundingClientRect();
        const got = actor.getBoundingClientRect();
        actor.style.top = `${el.offsetTop + want.top - got.top}px`;
        actor.style.left = `${el.offsetLeft + want.left - got.left}px`;
        el.style.setProperty('visibility', 'hidden');
        el.style.setProperty('animation', 'none');
    }
    if (!own && arrival) actor.style.animation = `${arrival.name} ${arrival.duration}ms ${arrival.ease} reverse forwards`;
    const exit = lasts > 0 ? playedOut(actor, lasts + 100) : Promise.resolve();
    // The next in a row of leaves starts once this one's exit is
    // `--kp-leave-stagger` of the way through (0.5 by default; 1 waits for
    // all of it), read off the animation itself so any playback rate holds.
    // Halfway unless the page says otherwise (Kenny's pick, 2026-10-04).
    const set = parseFloat(style.getPropertyValue('--kp-leave-stagger'));
    const stagger = Number.isNaN(set) ? 0.5 : set;
    if (lasts > 0 && stagger > 0 && stagger < 1) void partway(actor, stagger, exit).then(exited);
    else void exit.then(exited);
    running.push(exit);
    // A table row cannot be folded below its cells' content: it plays its
    // leave, and the table glides shut once it is out.
    if (size > 0 && !(el instanceof HTMLTableRowElement)) {
        el.style.setProperty('overflow', 'clip');
        el.style.setProperty('box-sizing', 'border-box');
        const [from, to] = foldFrames(el, style);
        // The space closes slower than a plain resize, so the eye can follow
        // what closes up (Kenny, 2026-10-04: "ik zou het graag iets trager
        // zien gaan, zodat de animatie zichtbaar is"). `--kp-leave-fold`
        // says when: `together` starts it a third of the way into the
        // theme's exit, `after` once the exit is over, plus
        // `--kp-leave-pause` ms, so the exit is never hidden by the fold
        // (Kenny, 2026-10-04: "misschien moet je eerst de elementen laten
        // faden en dan pas die accordion").
        const after = fold === 'after';
        const pause = parseFloat(style.getPropertyValue('--kp-leave-pause')) || 0;
        const folding = el.animate([from, to], {
            duration: Math.max(size, lasts) * 1.25,
            delay: after ? lasts + pause : lasts / 3,
            easing: withoutOvershoot(ease),
            fill: 'forwards',
        });
        running.push(folding.finished.catch(() => undefined));
    }
    await Promise.all(running);
    if (actor !== el) actor.remove();
    gone();
    el.removeAttribute('data-kp-leaving');
    el.style.removeProperty('animation');
    el.style.removeProperty('overflow');
    el.style.removeProperty('box-sizing');
    el.style.removeProperty('visibility');
    for (const a of el.getAnimations()) a.cancel();
}

/**
 * @typedef {{ getAttribute: (name: string) => string | null, tagName: string, className: string, id?: string, nodeType: number, matches?: (selector: string) => boolean, querySelector?: (selector: string) => unknown }} RepaintNode
 */

/**
 * The added elements of one batch of changes that only repaint what was
 * there [port spec G; the homelab dashboard's `repaints()`, moved here]:
 * an element is a repaint when its parent lost, in the same batch, an
 * element with its key (the first of `keys` it carries) or, with no key,
 * one more element of its tag and class than it already took back. An
 * element added where a loading skeleton left (`.kp-skeleton`,
 * `[data-kp-skeleton]`) is not news either: it is the data the skeleton
 * waited for. Everything else is new content.
 *
 * Measured by the dashboard (8 quiet seconds per page): without this, a
 * live refresh that redrew its rows replayed the arrival on 158 cells of
 * one page, 112 on another and 72 on a third, though nothing new had come.
 *
 * @param {Iterable<{ type: string, target: unknown, addedNodes: ArrayLike<any>, removedNodes: ArrayLike<any> }>} records
 * @param {{ keys?: readonly string[] }} [options]
 * @returns {Set<any>} the added elements that are repaints
 */
export function repaintedIn(records, { keys = ARRIVE_KEYS } = {}) {
    const list = [...records].filter((r) => r.type === 'childList');
    /** @type {Map<unknown, { keys: Set<string>, sigs: Map<string, number>, skeleton: boolean }>} */
    const gone = new Map();
    const keyOf = (/** @type {RepaintNode} */ e) => {
        for (const name of keys) {
            const value = name === 'id' ? e.getAttribute('id') || e.id || null : e.getAttribute(name);
            if (value) return `${name}=${value}`;
        }
        return null;
    };
    const sigOf = (/** @type {RepaintNode} */ e) => `${e.tagName}.${e.className}`;
    const skeletal = (/** @type {RepaintNode} */ e) =>
        (typeof e.matches === 'function' && e.matches(SKELETON)) || (typeof e.querySelector === 'function' && e.querySelector(SKELETON) !== null);
    for (const r of list)
        for (const n of Array.from(r.removedNodes)) {
            if (n?.nodeType !== 1) continue;
            const g = gone.get(r.target) ?? { keys: new Set(), sigs: new Map(), skeleton: false };
            gone.set(r.target, g);
            const k = keyOf(n);
            if (k) g.keys.add(k);
            g.sigs.set(sigOf(n), (g.sigs.get(sigOf(n)) ?? 0) + 1);
            if (skeletal(n)) g.skeleton = true;
        }
    /** @type {Set<any>} */
    const out = new Set();
    for (const r of list)
        for (const n of Array.from(r.addedNodes)) {
            if (n?.nodeType !== 1) continue;
            const g = gone.get(r.target);
            if (!g) continue;
            if (g.skeleton) {
                out.add(n);
                continue;
            }
            const k = keyOf(n);
            const left = g.sigs.get(sigOf(n)) ?? 0;
            if (k ? g.keys.has(k) : left > 0) {
                out.add(n);
                if (!k) g.sigs.set(sigOf(n), left - 1);
            }
        }
    return out;
}

/**
 * Which arrivals play under `el`: its closest `data-kp-arrive` (`all`,
 * `new` or `none`), else the attach's own default.
 * @param {Element} el @param {string} fallback
 * @returns {string}
 */
const arriveMode = (el, fallback) => el.closest('[data-kp-arrive]')?.getAttribute('data-kp-arrive') || fallback;

/**
 * @typedef {object} SizeOptions
 * @property {'all' | 'new' | 'none'} [arrive] which added elements arrive the theme's way when no `data-kp-arrive` says otherwise: every one (`all`, the default), only those that are not a repaint of a row that just left under the same key (`new`), or none
 * @property {readonly string[]} [arriveKeys] more attributes that carry a row's stable id, read before `data-kp-key`, `data-kp-row-key` and `id`
 */

/**
 * Ease `box` to its new height whenever what is in it changes size, in both
 * directions; a change during a glide continues from where the box is.
 * @param {HTMLElement} box
 * @param {SizeOptions} [options]
 * @returns {() => void}
 */
export function easeSize(box, { arrive: fallback = 'all', arriveKeys = [] } = {}) {
    const own = /** @type {any} */ (box);
    if (own.__kpSize) return () => {};
    own.__kpSize = true;
    watching += 1;
    const keys = [...arriveKeys, ...ARRIVE_KEYS];
    let last = box.offsetHeight;
    /** @type {Animation | null} */
    let running = null;
    const settle = () => {
        if (!box.isConnected) return;
        // During a glide a child may change size only because the box's
        // height moves (a stretched or squeezed item): the size the content
        // asks for is the same, so the glide goes on. Restarting it there
        // started it again from where it stood on every frame, and the box
        // crept towards its size for seconds. The effect is lifted off the
        // box for one read, which leaves its timing alone.
        const effect = /** @type {KeyframeEffect | null} */ (running?.effect ?? null);
        if (running && effect) {
            effect.target = null;
            const natural = box.offsetHeight;
            effect.target = box;
            if (Math.abs(natural - last) < 1) return;
        }
        const from = running ? box.offsetHeight : last;
        // Finished rather than cancelled: a page that awaits every
        // animation's `finished` must not see an AbortError for a glide a
        // newer one replaced (tests/register-dark-faults awaited one).
        running?.finish();
        running = null;
        const to = box.offsetHeight;
        last = to;
        if (switching || Math.abs(to - from) < 1 || from === 0 || to === 0) return;
        // Something in it is leaving and folds itself shut; the box follows
        // that fold frame by frame instead of gliding after it.
        if (box.querySelector('[data-kp-leaving]')) return;
        const { size, ease } = themeMotion(box);
        if (size <= 0) return;
        const { animation: mine, done } = glide(box, from, to, size, sizeEase(box, ease, to - from));
        running = mine;
        mine.finished
            .then(() => {
                // done() leaves the box alone when a newer glide owns it.
                done();
                if (running === mine) running = null;
            })
            .catch(() => undefined);
    };
    // The children are watched, not the box: the box's own height is what
    // moves during a glide. Heights are layout heights (offsetHeight), not
    // painted ones: a theme's entrance that scales the box would otherwise
    // be read as its size (retro's zoom read 57px for a 227px dialog).
    //
    // The box itself is watched too, but only to keep `last` true: a box
    // stretched by its neighbours (cards in one grid row) or emptied by
    // rows that folded themselves shut changes size with no child of its
    // own changing, and a `last` left behind made the next change glide
    // from a height the reader never saw, or not glide at all (the leave
    // options' "Bring them back": one card jumped, one glided from 83 px
    // while it stood at 34; Kenny, 2026-10-05). A child's change in the
    // same callback goes first, so it still glides from what was painted.
    const sizes = new ResizeObserver((entries) => {
        if (entries.some((entry) => entry.target !== box)) settle();
        else if (!running) last = box.offsetHeight;
    });
    const watch = () => {
        sizes.disconnect();
        sizes.observe(box);
        for (const child of box.children) sizes.observe(child);
    };
    watch();
    // A child that leaves changes no child's size; the list itself is watched.
    // What arrives (a row added, a panel or a message shown) arrives the
    // theme's way.
    const list = new MutationObserver((records) => {
        // A live view that redraws its rows marks the box
        // `data-kp-arrive="none"`, or every refresh replays every arrival
        // (the homelab dashboard's live repaint, 2026-10-04); with
        // `data-kp-arrive="new"` a redrawn row stays still and only a row
        // with a key not seen a moment ago arrives [port spec G].
        const modeOf = (/** @type {Node} */ target) => arriveMode(target instanceof Element ? target : box, fallback);
        const any = records.some((record) => modeOf(record.target) !== 'none');
        const motion = records.length && any ? arrival(box) : null;
        /** @type {Set<any> | null} */
        let repainted = null;
        for (const record of records) {
            const mode = modeOf(record.target);
            if (mode === 'none') continue;
            if (record.type === 'attributes' && record.target instanceof HTMLElement && !record.target.hidden) arrive(record.target, motion);
            // Added to the box, or to a list inside it (rows in a <ul>).
            if (record.type === 'childList')
                for (const node of record.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    if (mode === 'new' && (repainted ??= repaintedIn(records, { keys })).has(node)) continue;
                    arrive(node, motion);
                }
        }
        watch();
        settle();
    });
    list.observe(box, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
    return () => {
        if (!own.__kpSize) return;
        watching -= 1;
        sizes.disconnect();
        list.disconnect();
        running?.cancel();
        box.style.removeProperty('overflow');
        box.style.removeProperty('box-sizing');
        delete own.__kpSize;
    };
}

/**
 * Unfold a `<details>` from its summary's height to its open height, and
 * fold it back before `open` goes away.
 * @param {HTMLDetailsElement} details
 * @returns {() => void}
 */
function attachFold(details) {
    const own = /** @type {any} */ (details);
    if (own.__kpFold) return () => {};
    const summary = details.querySelector(':scope > summary');
    if (!summary) return () => {};
    own.__kpFold = true;
    watching += 1;
    /** @type {Animation | null} */
    let running = null;
    let folding = false;
    // A fold drawn for the first time takes the state it is given at once: a
    // page that rebuilds its groups paints each one's remembered state before
    // the first frame (port spec J3), and that is not a change to glide.
    let shown = false;
    requestAnimationFrame(() => (shown = true));
    const shutHeight = () => {
        const style = getComputedStyle(details);
        return (
            layoutHeight(/** @type {HTMLElement} */ (summary)) +
            parseFloat(style.borderBlockStartWidth || '0') +
            parseFloat(style.borderBlockEndWidth || '0')
        );
    };
    /** `open` set by the fold itself, which the watcher below does not answer. @param {boolean} value */
    const setOpen = (value) => {
        details.open = value;
        watcher.takeRecords();
    };
    /**
     * Glide open or shut from the height the fold stands at now. While it
     * folds shut it carries `data-kp-folding`, so what counts only what is
     * shown (a tile set, js/tiles.js) lets it go at the start of the fold
     * rather than at its end.
     * @param {boolean} opening @param {number} from @param {number} size @param {string} ease
     */
    const move = (opening, from, size, ease) => {
        running?.finish();
        folding = !opening;
        setOpen(true);
        const to = opening ? layoutHeight(details) : shutHeight();
        details.toggleAttribute('data-kp-folding', folding);
        // The accordion keeps the motion Kenny approved in every theme: the
        // entrance's curve, without a theme's size character.
        const { animation: mine, done } = glide(details, from, to, size, sizeEase(details, ease, to - from, true), true);
        running = mine;
        mine.finished
            .then(() => {
                done();
                if (running !== mine) return;
                running = null;
                if (folding) {
                    folding = false;
                    setOpen(false);
                }
                details.removeAttribute('data-kp-folding');
            })
            .catch(() => undefined);
    };
    const onClick = (/** @type {Event} */ event) => {
        const { size, ease } = themeMotion(details);
        if (size <= 0) return;
        event.preventDefault();
        move(!details.open || folding, layoutHeight(details), size, ease);
    };
    // `open` set from outside (a page that opens every group while a search
    // runs, a memory painted back when the search ends) glides too: it
    // jumped, the one jump left on the remembered board (Kenny, 2026-10-05:
    // "animation is too chunky, should be smooth").
    const watcher = new MutationObserver((records) => {
        const was = records[0].oldValue !== null;
        const now = details.open;
        if (!shown || was === now || !details.isConnected) return;
        const { size, ease } = themeMotion(details);
        if (size <= 0) return;
        let from;
        if (running) from = layoutHeight(details);
        else if (now) from = shutHeight();
        else {
            setOpen(true);
            from = layoutHeight(details);
        }
        move(now, from, size, ease);
    });
    watcher.observe(details, { attributes: true, attributeFilter: ['open'], attributeOldValue: true });
    summary.addEventListener('click', onClick);
    return () => {
        if (!own.__kpFold) return;
        watching -= 1;
        watcher.disconnect();
        summary.removeEventListener('click', onClick);
        running?.cancel();
        details.style.removeProperty('overflow');
        details.removeAttribute('data-kp-folding');
        delete own.__kpFold;
    };
}

/* -------------------------------------------------------------- attach */

/**
 * Give every dialog its leaving motion and every box above its easing, under
 * `root` and in whatever is added to it later. A box, dialog or disclosure
 * that leaves the page is let go (its observers disconnected) a microtask
 * after it left, so a page that rebuilds itself on every navigation does not
 * keep the old boxes' watchers alive; one moved within the page stays.
 *
 * @param {ParentNode} [root]
 * @param {SizeOptions & { size?: string }} [options] `size`: more boxes to ease, as a selector, beside the package's own and `[data-kp-size-motion]` (a consumer's cards and panels, without marking each one); `arrive` and `arriveKeys` as for easeSize()
 * @returns {() => void} detach
 */
export function attachMotion(root = document, { size = '', arrive = 'all', arriveKeys = [] } = {}) {
    /** @type {Map<Element, () => void>} */
    const detaches = new Map();
    const sizeSelector = size.trim() ? `${SIZE_SELECTOR}, ${size}` : SIZE_SELECTOR;
    /** @param {Element} el @param {() => void} detach */
    const keep = (el, detach) => {
        const before = detaches.get(el);
        detaches.set(el, before ? () => (before(), detach()) : detach);
    };
    /** @param {ParentNode} scope */
    const scan = (scope) => {
        const all = (/** @type {string} */ selector) => [
            ...(scope instanceof Element && scope.matches(selector) ? [scope] : []),
            ...scope.querySelectorAll(selector),
        ];
        for (const el of all('dialog.kp-dialog')) keep(el, attachClose(/** @type {HTMLDialogElement} */ (el)));
        for (const el of all(sizeSelector)) keep(el, easeSize(/** @type {HTMLElement} */ (el), { arrive, arriveKeys }));
        for (const el of all(FOLD_SELECTOR)) if (el instanceof HTMLDetailsElement) keep(el, attachFold(el));
    };
    scan(root);
    let sweeping = false;
    const sweep = () => {
        sweeping = false;
        for (const [el, detach] of detaches)
            if (!el.isConnected) {
                detach();
                detaches.delete(el);
            }
    };
    const later = new MutationObserver((records) => {
        for (const record of records) {
            for (const node of record.addedNodes) if (node instanceof Element) scan(node);
            if (record.removedNodes.length && !sweeping) {
                sweeping = true;
                queueMicrotask(sweep);
            }
        }
    });
    later.observe(root instanceof Document ? root.documentElement : /** @type {Node} */ (root), { childList: true, subtree: true });
    return () => {
        later.disconnect();
        for (const one of detaches.values()) one();
        detaches.clear();
    };
}
