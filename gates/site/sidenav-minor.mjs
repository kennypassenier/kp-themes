// The side navigation's ten minor options, as the documentation page shows
// them [scope-143, research/sidenav-minor]. The panels are the approved demos'
// own (North site, Line 2): the same rows, the same page beside them, written
// once here so the ten examples cannot drift apart. Every example starts
// still; the reader presses the bars, drags the handle or types.
//
// Each example renders in a window of its own (a fixed launcher needs one),
// and each prints the string it renders.

export { SIDENAV_MINOR_EXAMPLES } from './sidenav-minor-examples.mjs';

/** @type {import('./descriptors.mjs').Variant[]} */
export const SIDENAV_MINOR_VARIANTS = [
    { name: '--kp-sidenav-width-narrow', what: 'The panel’s width while data-kp-sidenav-narrow is on it (below the data-kp-sidenav-over-below step, when it lies over the page); unset it keeps the panel’s ordinary width. Off by default.' },
    { name: 'data-kp-sidenav-variant="floating"', what: 'The panel detached from the edge as a card of its own: a gap all round, the theme’s radius, edge and shadow, each its own token below. In push, over and a reserved gutter; shut it leaves nothing on the screen. React: variant="floating".' },
    { name: 'data-kp-sidenav-variant="inset"', what: 'The panel stays flush with the window and the content becomes a rounded card beside it (the gap, radius and edge are tokens below); the module marks the content data-kp-sidenav-inset. Nothing dims. React: variant="inset".' },
    { name: '--kp-sidenav-peek', what: 'A length, off by default: a shut push or over panel keeps a thin .kp-sidenav__peek strip of that width at its edge, in the muted surface (its own token). A push page keeps that strip’s room; an over panel lies over the page by that width only. The strip is not a control.' },
    { name: 'data-kp-sidenav-density', what: 'compact or comfortable (unset is the middle): sets only the panel’s own link padding, link size, icon size and padding tokens, rows of 29, 37 and 45 px. React: density="compact|default|comfortable".' },
    { name: '.kp-sidenav__row / .kp-sidenav__action', what: 'The list item that holds a link and a .kp-icon-button.kp-sidenav__action as siblings: the button is reached by Tab after its link, has its own focus ring, does not open the link, follows the row’s height and hides in the collapsed rail. Its size and its gap to the link are tokens below. Give it an aria-label that names its row.' },
    { name: 'data-kp-sidenav-cancelable', what: 'kp-sidenav-toggle and kp-sidenav-slim fire before the change, cancelable, with detail.reason (toggler, escape, backdrop, shortcut, api); preventDefault() leaves the state and kp-sidenav-prevented fires (kind, the state asked for, reason, source: listener). A layout’s own breakpoint, mode and init changes are told, never asked. React: cancelable with onSidenavToggle, onSidenavSlim and onSidenavPrevented.' },
    { name: 'data-kp-sidenav-resizable', what: 'A .kp-sidenav__resizer (role separator, aria-valuemin, -max, -now) inside the panel on the edge that faces the content, moved by pointer or arrow keys (16 px a press, Shift five times that), written to the panel’s width token and kept with data-kp-remember; a double press clears it. data-kp-sidenav-min-width (default 12rem) and -max-width (default 32rem) bound it; not in the collapsed rail. React: resizable, minWidth, maxWidth.' },
    { name: 'data-kp-sidenav-backdrop="static"', what: 'The backdrop shows and a click on it does not close: the panel is pulled back and let go (data-kp-sidenav-refused meanwhile; the travel, time and curve are tokens below, which a register may set), and kp-sidenav-prevented fires with source "static". React: backdrop="static".' },
    { name: 'data-kp-sidenav-close-on-backdrop', what: 'false makes a click on the backdrop do nothing, silently; the sibling of data-kp-sidenav-close-on-esc. Only where a backdrop exists. React: closeOnBackdrop={false}.' },
];
