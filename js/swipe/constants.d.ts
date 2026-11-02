/** A list whose rows swipe: `data-kp-swipe` (`off` switches it off). */
export declare const SWIPE = "[data-kp-swipe]";
/** The action revealed at the row's start edge, swiping toward its end (right in a left-to-right page): `key:Words:tone`. */
export declare const START_ATTRIBUTE = "data-kp-swipe-start";
/** The action revealed at the row's end edge, swiping toward its start: `key:Words:tone`. */
export declare const END_ATTRIBUTE = "data-kp-swipe-end";
/** Which pointers swipe: `touch` (default) or `any` (a mouse and a pen too). */
export declare const POINTERS_ATTRIBUTE = "data-kp-swipe-pointers";
/** On a row: this row does not swipe (a done row, say). */
export declare const ROW_OFF_ATTRIBUTE = "data-kp-swipe-off";
/** Fired on the row, bubbling, when a swipe let go past the threshold: `{ key, action, row }`. */
export declare const SWIPE_EVENT = "kp-swipe";
/** The parts of a row that keep their own press and drag. */
export declare const OWN_CONTROLS = "input, select, textarea, [contenteditable], [data-kp-handle], .kp-menu-button, .kp-icon-button, [data-kp-swipe-ignore]";
/** Sideways travel before a move is a swipe [px]. */
export declare const LOCK_PX = 12;
/** How much more sideways than up or down a move must run to lock as a swipe. */
export declare const LOCK_RATIO = 1.5;
/** The action runs past this share of the row's width, capped at THRESHOLD_MAX_PX. */
export declare const THRESHOLD_SHARE = 0.35;
/** The largest threshold [px]. */
export declare const THRESHOLD_MAX_PX = 140;
/** The tick a phone gives when the threshold is crossed [ms]. */
export declare const HAPTIC_MS = 10;
/** How long a lifted swipe swallows the click the browser sends after it [ms]. */
export declare const CLICK_GUARD_MS = 400;
/** The tones an action's plate may take. */
export declare const TONES: string[];
export type SwipeAction = {
    key: string;
    label: string;
    tone: string;
};
/** @typedef {{ key: string, label: string, tone: string }} SwipeAction */
