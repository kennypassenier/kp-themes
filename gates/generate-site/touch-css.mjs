// The site's touch room [touch2-1102]: what the example pages need so the package's touch hit areas
// (css/components/touch-hit-area.css, touch-hit-room.css) are measured on the parts and not on the site's frame.

/**
 * Room under a coarse pointer, nothing under a mouse.
 *
 * An example's stage scrolls sideways (DI11), and a scroll box clips everything outside it: a check box at the stage's edge
 * lost half its hit area to the frame of the documentation, not to its own layout. Under a coarse pointer the stage takes
 * the card's side padding back by a padding its negative margin cancels, so nothing moves. Only the sides: above and below,
 * a padding stops an empty stage's margins from collapsing through it, and the example under it moved 4 px. The "Markup"
 * disclosure under each card reaches 0.625rem up into the card's padding and down into the gap for its own area.
 * @returns {string}
 */
export function siteTouchCss() {
    return `
    /* Touch room for the examples [touch2-1102]: the stage gives back the card's padding to the hit areas inside it, and the
       "Markup" disclosure under each example is a fingertip tall. Coarse pointer only; a mouse sees the same page. */
    @media (pointer: coarse) {
        .sc-example__stage {
            padding-inline: 1rem;
            margin-inline: -1rem;
        }

        .sc-example__code > summary {
            position: relative;
        }

        .sc-example__code > summary::after {
            content: '';
            position: absolute;
            inset: -0.625rem 0;
        }
    }
`;
}
