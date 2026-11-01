// Chips on whole tracks [ux-1101]: `data-kp-segmented-fit="tracks"` lays a chip group on a grid of equal tracks, as wide as its
// widest chip, with the rows balanced so no chip stands alone on a line; under `data-kp-segmented-fold-at` (default 30rem), a group
// that needs more than one row folds into a "Show: All ▾" menu (js/segmented/fold.js). `flow` (the default) is the approved wrap.

import { isTri, itemsOf } from './read.js';
import { syncFold } from './fold.js';

/** The look: `flow` (default, the chips wrap as they come) or `tracks`. */
export const FIT_ATTRIBUTE = 'data-kp-segmented-fit';
/** The width under which a group on tracks that needs more than one row folds into a menu; a CSS length in px, rem or em, or `none`. */
export const FOLD_AT_ATTRIBUTE = 'data-kp-segmented-fold-at';
/** Written on a group while it is folded into its menu. */
export const FOLDED_ATTRIBUTE = 'data-kp-segmented-folded';
/** Written for one synchronous read: the chips lie in one row at their own width, so each can be measured. */
const MEASURE_ATTRIBUTE = 'data-kp-segmented-measure';
/** The fold width when the attribute names none: a phone or a narrow column. */
export const FOLD_AT_DEFAULT = '30rem';
/** The number of tracks, and the width of one, written on the group for the stylesheet. */
const COLS_PROPERTY = '--kp-seg-cols';
const TRACK_PROPERTY = '--kp-seg-track';
/** Written once the tracks are measured, so the stylesheet lays the grid only then (the approved flow until then). */
const COLS_ATTRIBUTE = 'data-kp-segmented-cols';
/** Rounding slack, so a width that fits to the sub-pixel is not called too narrow [px]. */
const SLACK_PX = 0.5;
/** The px of one rem when the root's font size cannot be read. */
const REM_FALLBACK_PX = 16;

/** @param {Element} group */
export const fitsTracks = (group) => group.classList.contains('kp-segmented--chips') && group.getAttribute(FIT_ATTRIBUTE) === 'tracks';

/**
 * A CSS length as px: `px`, `rem` and `em` are read; `none` (or anything else) is 0, never fold.
 * @param {HTMLElement} group @param {string} text
 */
export function lengthPx(group, text) {
    const match = /^\s*([\d.]+)\s*(px|rem|em)\s*$/.exec(text);
    if (!match) return 0;
    const n = Number(match[1]);
    if (match[2] === 'px') return n;
    const of = match[2] === 'rem' ? group.ownerDocument.documentElement : group;
    return n * (parseFloat(getComputedStyle(of).fontSize) || REM_FALLBACK_PX);
}

/**
 * Balanced tracks: as many as fit, then evened out over the rows they make, so the last row is never one chip under a full one
 * (7 chips that fit 6 across lie as 4 + 3). Pure.
 * @param {number} count chips @param {number} track one chip's width @param {number} room the group's width @param {number} gap
 * @returns {{ cols: number, rows: number }}
 */
export function balanceTracks(count, track, room, gap) {
    if (count <= 0) return { cols: 1, rows: 0 };
    const across = Math.max(1, Math.floor((room + gap + SLACK_PX) / (track + gap)));
    const rows = Math.ceil(count / across);
    return { cols: Math.ceil(count / rows), rows };
}

/** The widest chip at its own width, read in one forced layout. @param {HTMLElement} group @param {HTMLElement[]} items */
function widest(group, items) {
    group.setAttribute(MEASURE_ATTRIBUTE, '');
    const widths = items.map((item) => item.getBoundingClientRect().width);
    group.removeAttribute(MEASURE_ATTRIBUTE);
    return Math.ceil(Math.max(0, ...widths));
}

/** Put a group back in the flow look: nothing of the tracks or the fold left on it. @param {HTMLElement} group */
function clearFit(group) {
    group.style.removeProperty(COLS_PROPERTY);
    group.style.removeProperty(TRACK_PROPERTY);
    group.removeAttribute(COLS_ATTRIBUTE);
    group.removeAttribute(FOLDED_ATTRIBUTE);
    syncFold(group, false);
}

/**
 * Lay a chip group on its tracks, and fold or unfold it, for the width it has now. Called when the group's size, its items or
 * its fit attributes change. A group that is not on tracks is put back in the flow look.
 * @param {HTMLElement} group
 */
export function fitGroup(group) {
    if (!fitsTracks(group)) return clearFit(group);
    const items = itemsOf(group).filter((item) => !item.hidden);
    const room = group.clientWidth;
    if (room <= 0 || !items.length) return;
    const gap = parseFloat(getComputedStyle(group).columnGap) || 0;
    const track = Math.min(widest(group, items), room);
    const { cols, rows } = balanceTracks(items.length, track, room, gap);
    group.style.setProperty(COLS_PROPERTY, String(cols));
    group.style.setProperty(TRACK_PROPERTY, `${track}px`);
    group.setAttribute(COLS_ATTRIBUTE, String(cols));
    const foldAt = lengthPx(group, group.getAttribute(FOLD_AT_ATTRIBUTE) ?? FOLD_AT_DEFAULT);
    const folds = !isTri(group) && foldAt > 0 && room < foldAt && rows > 1;
    group.toggleAttribute(FOLDED_ATTRIBUTE, folds);
    syncFold(group, folds);
}
