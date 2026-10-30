// Fold sizing: settled heights and the eased size change.
import { afterPaint, settling } from '../as-of.js';
import { motionState } from './state.js';
import { GROUP_FOLDING_ATTRIBUTE, arrival, arrive, glide } from './arrive.js';
import { ARRIVE_KEYS } from './constants.js';
import { switching } from './close.js';
import { themeMotion } from './timing.js';
import { layoutHeight, sizeEase, steppedDuration } from './size.js';
import { repaintedIn } from './leave.js';

/** The value of `data-kp-folding` on what folds out of a box: it is gone from the box's layout once its fold has played. */
export const FOLDING_OUT = 'out';
/**
 * The height `box` settles at once what folds out of it is gone: the
 * elements marked `[data-kp-folding="out"]` (a data table's rows while
 * they play their arrival backwards) are taken out of the flow for one
 * read. The box then glides shut while they play, the mirror of its glide
 * open while they arrived (Kenny's form v21, 2026-10-05: the table box
 * snapped shut once the rows had gone).
 * @param {HTMLElement} box
 */
function settledHeight(box) {
    const out = /** @type {HTMLElement[]} */ ([...box.querySelectorAll(`[data-kp-folding="${FOLDING_OUT}"]`)]);
    if (out.length === 0) return box.offsetHeight;
    // Not `display: none`, which would cancel the very animations they are
    // playing: a table row collapses (its borders go with it, which taking
    // it out of the flow left a pixel of), anything else leaves the flow.
    const how = out.map((el) => (getComputedStyle(el).display === 'table-row' ? ['visibility', 'collapse'] : ['position', 'absolute']));
    const kept = out.map((el, k) => [el.style.getPropertyValue(how[k][0]), el.style.getPropertyPriority(how[k][0])]);
    out.forEach((el, k) => el.style.setProperty(how[k][0], how[k][1], 'important'));
    const height = box.offsetHeight;
    out.forEach((el, k) => {
        if (kept[k][0]) el.style.setProperty(how[k][0], kept[k][0], kept[k][1]);
        else el.style.removeProperty(how[k][0]);
    });
    return height;
}
/**
 * How long what folds out of `box` still plays, in ms: the box's glide
 * shut ends with it, as its glide open started with their arrival, so
 * frame t of the fold is frame (T - t) of the open.
 * @param {HTMLElement} box
 */
function foldingOutFor(box) {
    let left = 0;
    for (const el of box.querySelectorAll(`[data-kp-folding="${FOLDING_OUT}"]`))
        for (const a of el.getAnimations({ subtree: true })) {
            const timing = a.effect?.getComputedTiming();
            if (!timing || a.playState !== 'running' || timing.iterations === Infinity) continue;
            const rate = Math.abs(a.playbackRate) || 1;
            left = Math.max(left, (Number(timing.endTime) - Number(timing.localTime ?? 0)) / rate);
        }
    return Number.isFinite(left) ? left : 0;
}
/**
 * Elements whose leave (or arrival as a leave turned around) folds their
 * own height: the box around them follows that fold frame by frame.
 * @type {WeakSet<HTMLElement>}
 */
export const heightFolds = new WeakSet();
/**
 * Whether something drawn in `box` folds its own height now, which the box
 * follows instead of gliding. A fold sideways (a button in a cell) or of
 * something not drawn (a hidden list) is not the box's height folding: it
 * held every glide of the box for as long as the page's first arrivals
 * played, ten seconds on the catalogue's tables, and the table snapped open
 * and shut meanwhile.
 * @param {HTMLElement} box
 */
const followsAFold = (box) =>
    [...box.querySelectorAll(`[data-kp-leaving], [${GROUP_FOLDING_ATTRIBUTE}]`)].some(
        (el) => heightFolds.has(/** @type {HTMLElement} */ (el)) && el.getClientRects().length > 0,
    );
/**
 * Which arrivals play under `el`: its closest `data-kp-arrive` (`all`,
 * `new` or `none`), else the attach's own default.
 * @param {Element} el @param {string} fallback
 * @returns {string}
 */
const arriveMode = (el, fallback) => el.closest('[data-kp-arrive]')?.getAttribute('data-kp-arrive') || fallback;
/**
 * Whether what changes in `el` now is still its first render, which is not
 * news [fix-100]: until two frames are painted after motion attached to it,
 * and while it is under a root that is settling (js/as-of.js; js/auto.js
 * holds the page's root so until every module it fetched has drawn). In
 * that time nothing in it arrives and its box takes its size at once, as a
 * fold already took its first state at once. Since every opposite motion
 * became a mirror (fff6fe45) a first render arrived as a leave turned
 * around: 263 elements on the catalogue's index in one queue of about ten
 * seconds, the data table's pager folded to a third of its width and its
 * bar 186 px tall instead of 52 until the first click redrew it.
 * @param {Element} el
 * @returns {() => boolean}
 */
function firstRender(el) {
    let painted = false;
    afterPaint(() => (painted = true));
    return () => !painted || settling(el);
}
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
    motionState.watching += 1;
    const keys = [...arriveKeys, ...ARRIVE_KEYS];
    let last = box.offsetHeight;
    /** @type {Animation | null} */
    let running = null;
    /** When the box last left its size to a fold it follows. */
    let followedAt = -Infinity;
    const fresh = firstRender(box);
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
            const natural = settledHeight(box);
            effect.target = box;
            if (Math.abs(natural - last) < 1) return;
        }
        const from = running ? box.offsetHeight : last;
        // Finished rather than cancelled: a page that awaits every
        // animation's `finished` must not see an AbortError for a glide a
        // newer one replaced (tests/register-dark-faults awaited one).
        running?.finish();
        running = null;
        const to = settledHeight(box);
        last = to;
        if (switching || fresh() || Math.abs(to - from) < 1 || from === 0 || to === 0) {
            // A fold that changes nothing in the box this tick (a panel
            // leaving while another arrives) is still a fold it follows.
            if (Math.abs(to - from) < 1 && followsAFold(box)) followedAt = performance.now();
            return;
        }
        // Something in it is leaving and folds its height shut; the box
        // follows that fold frame by frame instead of gliding after it.
        if (followsAFold(box)) {
            followedAt = performance.now();
            return;
        }
        // A theme that folds in whole ticks (`--kp-leave-fold-ease`) leaves
        // the box at the size the fold ended on: a glide from the size of
        // its last tick would replay that tick's step after the fold.
        if (performance.now() - followedAt < 300 && getComputedStyle(box).getPropertyValue('--kp-leave-fold-ease').trim() !== '') {
            followedAt = -Infinity;
            return;
        }
        const { size, ease } = themeMotion(box);
        if (size <= 0) return;
        // Shutting while rows fold out of it, the box ends as they end: the
        // open started its glide and their arrival together.
        const delay = to < from ? Math.max(0, foldingOutFor(box) - size) : 0;
        const easing = sizeEase(box, ease, to - from);
        const { animation: mine, done } = glide(box, from, to, steppedDuration(box, easing, size), easing, false, delay);
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
        // A first render arrives as nothing: it is the page, not news.
        const modeOf = (/** @type {Node} */ target) => (fresh() ? 'none' : arriveMode(target instanceof Element ? target : box, fallback));
        const any = records.some((record) => modeOf(record.target) !== 'none');
        const motion = records.length && any ? arrival(box) : null;
        /** @type {Set<any> | null} */
        let repainted = null;
        // Only what changed over the whole batch arrives: an element hidden
        // and shown again in one task was never gone (the data table hides
        // every row and shows its page again on each render, and every
        // shown row of every group replayed its arrival when one group
        // folded), and an element taken out and put back is moved, not new
        // (a sort appends its rows again). Kenny, 2026-10-05.
        /** @type {Map<Node, boolean>} */
        const hiddenBefore = new Map();
        /** @type {Set<Node>} */
        const moved = new Set();
        for (const record of records) {
            if (record.type === 'attributes' && !hiddenBefore.has(record.target)) hiddenBefore.set(record.target, record.oldValue !== null);
            if (record.type === 'childList') for (const node of record.removedNodes) moved.add(node);
        }
        for (const record of records) {
            const mode = modeOf(record.target);
            if (mode === 'none') continue;
            if (record.type === 'attributes' && record.target instanceof HTMLElement && !record.target.hidden && hiddenBefore.get(record.target)) {
                hiddenBefore.delete(record.target);
                arrive(record.target, motion);
            }
            // Added to the box, or to a list inside it (rows in a <ul>).
            if (record.type === 'childList')
                for (const node of record.addedNodes) {
                    if (!(node instanceof HTMLElement) || moved.has(node) || node.hasAttribute('data-kp-ghost')) continue;
                    if (mode === 'new' && (repainted ??= repaintedIn(records, { keys })).has(node)) continue;
                    arrive(node, motion);
                }
        }
        watch();
        settle();
    });
    list.observe(box, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'], attributeOldValue: true });
    return () => {
        if (!own.__kpSize) return;
        motionState.watching -= 1;
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
export function attachFold(details) {
    const own = /** @type {any} */ (details);
    if (own.__kpFold) return () => {};
    const summary = details.querySelector(':scope > summary');
    if (!summary) return () => {};
    own.__kpFold = true;
    motionState.watching += 1;
    /** @type {Animation | null} */
    let running = null;
    let folding = false;
    // A fold drawn for the first time takes the state it is given at once: a
    // page that rebuilds its groups paints each one's remembered state before
    // the first frame (port spec J3), and that is not a change to glide.
    const fresh = firstRender(details);
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
        if (fresh() || was === now || !details.isConnected) return;
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
        motionState.watching -= 1;
        watcher.disconnect();
        summary.removeEventListener('click', onClick);
        running?.cancel();
        details.style.removeProperty('overflow');
        details.removeAttribute('data-kp-folding');
        delete own.__kpFold;
    };
}
