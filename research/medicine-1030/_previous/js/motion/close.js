// Closing dialogs and popovers: reversed entrance, ghost and native close.
import { motionState } from './state.js';
import { closing, entranceOf, entrances, keepsLines, nativeClose, rememberEntrance, turnEntrances } from './keyframes.js';
import { reduced, themeMotion } from './timing.js';
import { playedOut } from './fold.js';

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
    // `--kp-lines: keep`: every kept line plays in its own time and with its
    // own wait, the whole turned round (turnLines()); otherwise each takes
    // the close's one time.
    const lines = kept.length > 0 && keepsLines(dialog) ? turnEntrances(kept, duration) : null;
    kept.forEach(({ target, keyframes, easing, pseudoElement }, at) => {
        try {
            out.push(
                target.animate(keyframes, {
                    duration: lines ? lines[at].duration : duration,
                    ...(lines ? { delay: lines[at].closeDelay } : {}),
                    easing,
                    direction: 'reverse',
                    fill: 'forwards',
                    ...(pseudoElement ? { pseudoElement } : {}),
                }),
            );
        } catch {
            /* an engine that cannot animate that pseudo-element skips it */
        }
    });
    // The backdrop leaves with the dialog when the theme gave it no motion of its own.
    if (!kept.some((one) => one.target === dialog && one.pseudoElement === '::backdrop')) {
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
 * backwards: its register says `--kp-open: reverse-close` (every register
 * since 2026-10-05; Kenny's pick on research/open-reverse).
 * @param {Element} el
 */
export const opensAsReversedClose = (el) => getComputedStyle(el).getPropertyValue('--kp-open').trim() === 'reverse-close';
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
    for (const a of entranceOf(dialog)) a.cancel();
    // As the close reads them (closeDialog()): with `--kp-lines: keep` each
    // line plays its own wait and time, so frame t is still frame (close - t).
    const lines = kept.length > 0 && keepsLines(dialog) ? turnEntrances(kept, duration) : null;
    kept.forEach(({ target, keyframes, easing, pseudoElement }, at) => {
        try {
            target.animate(keyframes, {
                duration: lines ? lines[at].duration : duration,
                ...(lines ? { delay: lines[at].openDelay } : {}),
                easing,
                fill: 'backwards',
                ...(pseudoElement ? { pseudoElement } : {}),
            });
        } catch {
            /* an engine that cannot animate that pseudo-element skips it, as the close does */
        }
    });
    const fade = /** @type {Keyframe[]} */ ([{ opacity: 1 }, { opacity: 0 }]);
    if (!kept.some((one) => one.target === dialog && one.pseudoElement === '::backdrop')) {
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
export function attachClose(dialog) {
    const own = /** @type {any} */ (dialog);
    if (own.__kpMotion) return () => {};
    own.__kpMotion = true;
    motionState.watching += 1;
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
    if (dialog.open) {
        rememberEntrance(dialog);
        openAsReversedClose(dialog);
    }
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
        motionState.watching -= 1;
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
export let switching = 0;
if (typeof document !== 'undefined' && typeof MutationObserver === 'function') {
    new MutationObserver(() => {
        const mine = ++switching;
        const release = () => {
            if (switching === mine) switching = 0;
        };
        requestAnimationFrame(() => requestAnimationFrame(() => void document.fonts?.ready.then(release, release)));
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
/** The attribute playEntranceBackwards() sets while it turns an entrance around. */
export const REVERSING_ATTRIBUTE = 'data-kp-reversing';
/**
 * Play the CSS entrance `el` wears now backwards, then settle: a tooltip
 * that slid in slides out, a tour card that faded in fades out, each in its
 * entrance's own time on its curve turned around, so frame t of the going
 * is frame (T - t) of the coming (Kenny, 2026-10-05: "find out where else
 * there is a discrepancy between opening/closing"). The entrance is
 * restarted reversed on the element and its pseudo-elements
 * (`[data-kp-reversing]`, css/components.css), whatever its fill, so one
 * that already played out is turned around too. With no entrance (reduced
 * motion, a theme without one) it settles at once. The caller hides the
 * element when it settles true and then calls stopReversing(), which also
 * stops it early when the element is wanted back meanwhile.
 * @param {HTMLElement} el
 * @returns {Promise<boolean>} true once played out, false when there was nothing to play or it was stopped
 */
export function playEntranceBackwards(el) {
    stopReversing(el);
    if (reduced() || !el.isConnected) return Promise.resolve(false);
    const named = (/** @type {string | null} */ pseudo) => {
        const name = getComputedStyle(el, pseudo).animationName;
        return Boolean(name) && name !== 'none';
    };
    if (![null, '::before', '::after'].some(named)) return Promise.resolve(false);
    el.setAttribute(REVERSING_ATTRIBUTE, 'reset');
    for (const pseudo of [null, '::before', '::after']) getComputedStyle(el, pseudo).animationName;
    el.setAttribute(REVERSING_ATTRIBUTE, 'play');
    for (const pseudo of [null, '::before', '::after']) getComputedStyle(el, pseudo).animationName;
    // A loop on it (a pulse) never plays out; only the entrance is waited for.
    const plays = el
        .getAnimations({ subtree: true })
        .filter(
            (a) =>
                typeof CSSAnimation !== 'undefined' &&
                a instanceof CSSAnimation &&
                /** @type {KeyframeEffect} */ (a.effect)?.target === el &&
                a.effect?.getComputedTiming().iterations !== Infinity,
        );
    if (plays.length === 0) {
        el.removeAttribute(REVERSING_ATTRIBUTE);
        return Promise.resolve(false);
    }
    return new Promise((resolve) => {
        const own = /** @type {any} */ (el);
        own.__kpReversing = () => {
            // Wanted back halfway: the entrance goes on forwards from the
            // frame on screen instead of starting over or jumping.
            for (const a of plays) {
                if (a.playState !== 'running' || a.currentTime === null) continue;
                const end = Number(a.effect?.getComputedTiming().endTime) || 0;
                a.currentTime = Math.max(0, end - Number(a.currentTime));
            }
            resolve(false);
        };
        // The close ends when the animations on the element have ended, not when
        // the ones first seen have. A theme switch while it runs swaps the
        // register's animation: the one waited on is cancelled (its `finished`
        // may never settle, hence the `cancel` event) and another takes over, so
        // the element is looked at again each time. Waiting on the first alone
        // left a backdrop (a solid one in brutalism) over the page for good.
        const ended = (/** @type {Animation} */ a) =>
            new Promise((done) => {
                a.addEventListener('cancel', done, { once: true });
                a.addEventListener('remove', done, { once: true });
                a.finished.then(done, done);
            });
        const running = () =>
            el
                .getAnimations()
                .filter(
                    (a) =>
                        typeof CSSAnimation !== 'undefined' &&
                        a instanceof CSSAnimation &&
                        /** @type {KeyframeEffect} */ (a.effect)?.target === el &&
                        a.effect?.getComputedTiming().iterations !== Infinity &&
                        a.playState !== 'finished',
                );
        const settle = (/** @type {Animation[]} */ waited) => {
            if (own.__kpReversing === undefined) return;
            void Promise.all(waited.map(ended)).then(() => {
                if (own.__kpReversing === undefined) return;
                const next = running();
                if (next.length > 0) return settle(next);
                delete own.__kpReversing;
                resolve(true);
            });
        };
        settle(plays);
    });
}
/**
 * Stop a playEntranceBackwards() on `el` (it is wanted back), or tidy up
 * after one that played out: a running one settles false, and the entrance
 * is the element's own again.
 * @param {HTMLElement} el
 */
export function stopReversing(el) {
    const own = /** @type {any} */ (el);
    const stop = own.__kpReversing;
    delete own.__kpReversing;
    stop?.();
    el.removeAttribute(REVERSING_ATTRIBUTE);
}
/* ------------------------------------------------- menus and popovers */

/** The attribute a panel carries while playClose() plays its close. */
export const CLOSING_ATTRIBUTE = 'data-kp-closing';
/** The panels that hang from a trigger and close as their opening reversed. */
export const PANEL_SELECTOR = '.kp-popover:not(.kp-tooltip), .kp-menu, .kp-combobox__list, .kp-datepicker__panel';
/**
 * Play the close of a panel that is about to be hidden (a menu, a popover):
 * its opening played backwards, frame for frame, in the opening's own time
 * (Kenny, 2026-10-06: every close is its open played backwards; menus and
 * popovers hid at once until now, research/PACKAGE_FINDINGS.md). The panel
 * carries `[data-kp-closing]` meanwhile, so a register can draw a close of
 * its own there instead (blueprint: the same trace under a second name, so
 * the browser restarts it) or run its transitions to the closed state
 * (synthwave). The caller hides the panel once this settles true, then calls
 * stopClose(); a stopClose() before that (the panel wanted back) settles it
 * false and leaves the opening where it stands.
 * @param {HTMLElement} el
 * @returns {Promise<boolean>} true once the close played out (or there was nothing to play)
 */
export async function playClose(el) {
    stopClose(el);
    if (reduced() || !el.isConnected) return true;
    const before = getComputedStyle(el).animationName;
    el.setAttribute(CLOSING_ATTRIBUTE, '');
    const now = getComputedStyle(el).animationName;
    const own = Boolean(now) && now !== 'none' && now !== before;
    let stopped = false;
    const me = /** @type {any} */ (el);
    /** @type {Promise<unknown>[]} */
    const waits = [];
    if (own) {
        waits.push(playedOut(el, 0));
    } else {
        waits.push(playEntranceBackwards(el));
    }
    // Transitions to the closed state (a register keying them on
    // `[data-kp-closing]`) are waited for as well.
    for (const a of el.getAnimations({ subtree: true })) {
        if (typeof CSSTransition !== 'undefined' && a instanceof CSSTransition) waits.push(a.finished.catch(() => undefined));
    }
    me.__kpClosing = () => {
        stopped = true;
        stopReversing(el);
        el.removeAttribute(CLOSING_ATTRIBUTE);
    };
    await Promise.all(waits);
    if (me.__kpClosing === undefined) return false;
    delete me.__kpClosing;
    return !stopped;
}
/**
 * Tidy up after playClose() (call it once the panel is hidden), or stop one
 * still playing because the panel is wanted back: it turns round from the
 * frame on screen.
 * @param {HTMLElement} el
 */
export function stopClose(el) {
    const me = /** @type {any} */ (el);
    const stop = me.__kpClosing;
    delete me.__kpClosing;
    stop?.();
    stopReversing(el);
    el.removeAttribute(CLOSING_ATTRIBUTE);
}
/** Panels a ghost is closing now, so a second hide does not start another. */
const ghosted = new WeakSet();
/**
 * A popover the browser hides (light dismiss, Escape, a second press of its
 * trigger, `hidePopover()`) is gone before any script can play its close.
 * So, as it is about to be hidden, a copy of it takes its place in the top
 * layer for exactly as long as its close plays, and plays it. Only a panel
 * that has an opening of its own is copied; one that closes by a transition
 * (synthwave, `display … allow-discrete`) already plays its close itself.
 * @param {Event} event a `beforetoggle`
 */
function closePopoverWithGhost(event) {
    const toggle = /** @type {ToggleEvent} */ (event);
    const el = /** @type {HTMLElement} */ (toggle.target);
    if (toggle.newState !== 'closed' || !(el instanceof HTMLElement) || !el.matches(PANEL_SELECTOR)) return;
    if (reduced() || ghosted.has(el) || !el.matches(':popover-open')) return;
    const animated = [null, '::before', '::after'].some((pseudo) => {
        const name = getComputedStyle(el, pseudo).animationName;
        return Boolean(name) && name !== 'none';
    });
    const before = getComputedStyle(el).animationName;
    el.setAttribute(CLOSING_ATTRIBUTE, '');
    const leaveOwn = getComputedStyle(el).animationName;
    el.removeAttribute(CLOSING_ATTRIBUTE);
    if (!animated && (!leaveOwn || leaveOwn === 'none' || leaveOwn === before)) return;
    const box = el.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) return;
    const sized = getComputedStyle(el);
    // A turned panel (phantom's tilt) draws a bounding box larger than itself: the copy, which turns the
    // same way, goes where the layout box is, centred in the drawn one (at the corner it sat 2 px off).
    // A panel that is not turned keeps the drawn box as it is.
    const matrix = sized.transform === 'none' ? null : new DOMMatrixReadOnly(sized.transform);
    const isTurned =
        (matrix !== null && (Math.abs(matrix.b) > 1e-3 || Math.abs(matrix.c) > 1e-3)) || (sized.rotate !== 'none' && sized.rotate !== '0deg');
    const turned =
        isTurned && el instanceof HTMLElement ? { x: (box.width - el.offsetWidth) / 2, y: (box.height - el.offsetHeight) / 2 } : { x: 0, y: 0 };
    const ghost = /** @type {HTMLElement} */ (el.cloneNode(true));
    for (const one of [ghost, ...ghost.querySelectorAll('[id]')]) one.removeAttribute('id');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.setAttribute('popover', 'manual');
    ghost.setAttribute('data-kp-ghost', '');
    ghost.inert = true;
    Object.assign(ghost.style, {
        position: 'fixed',
        inset: 'auto',
        top: `${box.top + turned.y}px`,
        left: `${box.left + turned.x}px`,
        width: sized.width,
        height: sized.height,
        margin: '0',
        boxSizing: sized.boxSizing,
        pointerEvents: 'none',
        positionAnchor: 'none',
        positionArea: 'none',
    });
    el.after(ghost);
    ghosted.add(el);
    const done = () => {
        ghost.remove();
        ghosted.delete(el);
    };
    // Wanted back meanwhile: the ghost goes at once, the panel opens again.
    const back = (/** @type {Event} */ e) => {
        if (/** @type {ToggleEvent} */ (e).newState !== 'open') return;
        el.removeEventListener('beforetoggle', back);
        stopClose(ghost);
        done();
    };
    const play = () => {
        el.addEventListener('beforetoggle', back);
        void playClose(ghost).then(() => {
            el.removeEventListener('beforetoggle', back);
            done();
        });
    };
    // Firefox refuses to show a popover while another one is being hidden
    // ("Cannot show a popover during the show or hide of another popover"),
    // which is exactly now: it takes the ghost one task later, before the
    // next frame in practice. Chromium takes it at once.
    try {
        ghost.showPopover();
        play();
    } catch {
        setTimeout(() => {
            if (!ghost.isConnected || el.matches(':popover-open')) return done();
            try {
                ghost.showPopover();
            } catch {
                return done();
            }
            play();
        }, 0);
    }
}
if (typeof document !== 'undefined') document.addEventListener('beforetoggle', closePopoverWithGhost, true);
