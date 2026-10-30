// Page descriptor for the "tooltip" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const tooltipDescriptor = {
        id: 'tooltip',
        title: 'Tooltip',
        group: 'Feedback',
        classes: ['kp-tooltip'],
        exports: ['Tooltip'],
        aliases: ['tooltip-owner', 'open-delay', 'close-delay', 'close-on-escape', 'touch', 'hovercard'],
        intro: 'A short label on the popover surface, anchored to the thing it describes. Both channels open it on hover and on focus, with a delay at both ends, and close it on Escape: the React component, and `attachTooltips` in js/overlays.js for a `.kp-tooltip-anchor` a server wrote.',
        whenToUse:
            'For naming a control whose glyph is not obvious, in a few words. Never for anything the reader needs — a tooltip cannot be reached on a touch screen, cannot be selected, and is gone the moment the pointer moves. Instructions, errors and help text belong in the page.',
        examples: [
            {
                title: 'The surface, on a popover',
                why: 'Shown here as the browser’s own popover so it can be opened and looked at; the React component adds the hover and focus timing on top of the same two classes.',
                markup: `
<button type="button" class="kp-button" popovertarget="doc-tooltip" style="anchor-name: --doc-tooltip">What is a register?</button>
<span popover="auto" id="doc-tooltip" role="tooltip" class="kp-popover kp-tooltip" style="position-anchor: --doc-tooltip">An optional stylesheet that changes the texture of a theme without changing its colours.</span>
`,
            },
            {
                title: 'The hover card: one card for the whole page',
                why: '`attachHoverCards(root, options)` listens on the root, not on the anchors, so an anchor made later works at once. The first cell’s words are in `data-kp-hovercard`; the second has none, so `fill(anchor, card)` supplies them as the card opens (return a string, nodes or null). The third opens after 800 ms (`data-kp-open-delay`) and ignores Escape (`data-kp-close-on-escape="false"`). Rest the pointer on a cell, or Tab to it: the card stays while the pointer is on it and goes on Escape. `kp-hovercard` is fired on the anchor with `{ open, card, anchor }`.',
                markup: `
<table class="kp-table" id="doc-hovercards"><thead><tr><th scope="col">Stack</th><th scope="col">State</th></tr></thead>
<tbody>
<tr><td>media</td><td tabindex="0" data-kp-hovercard="Last backup 02:14, 3 hours ago">healthy</td></tr>
<tr><td>network</td><td tabindex="0" data-kp-hovercard data-doc-fill="network">warning</td></tr>
<tr><td>vault</td><td tabindex="0" data-kp-hovercard="Slow to answer. The card opens late and Escape does not close it." data-kp-open-delay="800" data-kp-close-on-escape="false">slow</td></tr>
</tbody></table>
<p class="kp-text-muted" id="doc-hovercard-out">No card has opened yet.</p>
`,
                script: `
import { attachHoverCards } from '@kp-soft/themes/js/hovercard';

const table = document.getElementById('doc-hovercards');
attachHoverCards(table.parentElement, {
    fill: (anchor) => (anchor.dataset.docFill ? 'Two hosts did not answer in the last ten minutes.' : null),
});
table.addEventListener('kp-hovercard', (event) => {
    document.getElementById('doc-hovercard-out').textContent = event.detail.open ? 'Open for ' + event.detail.anchor.textContent + '.' : 'Closed.';
});
`,
            },
        ],
        variants: [
            { name: '.kp-tooltip', what: 'The popover surface at tooltip size: smaller text and a maximum width, so it wraps instead of running across the page.' },
            { name: 'hover and focus', what: 'Both open it in the React channel, with a delay before and after, so a pointer crossing the control does not flash it.' },
            { name: 'interactive', what: 'A tooltip can be made to take the pointer, for one that contains a link; by default it does not, so it cannot get in the way.' },
            { name: 'Escape', what: 'Closes it, like every other layer in the package.' },
            { name: 'data-kp-hovercard', what: 'The hover card: one tooltip for a whole page, filled when it opens (`attachHoverCards`), for anchors a page rebuilds or whose words are only known when the pointer arrives. The attribute holds the words, or a `fill(anchor, card)` callback supplies them; it is hoverable, dismissible, and a tap opens it on a touch screen (a tap outside closes it, a tap inside keeps it).' },
            { name: 'attachHoverCards options', what: '`{ selector, fill, openDelayMs, closeDelayMs, closeOnEscape, touch, cardClass }` (300 ms and 100 ms, Escape on, touch on). `touch: false` turns taps off for the root. Per anchor: `data-kp-open-delay`, `data-kp-close-delay`, `data-kp-close-on-escape="false"` and `data-kp-touch` (`off` leaves the anchor to touch alone; `tap` makes a link or button anchor open the card on the first tap and act on the second; a plain anchor opens on a tap by default). The attribute’s own text wins over `fill`.' },
            { name: 'hover card handle', what: '`attachHoverCards` returns the detach function with `{ card, open(anchor), hide(), refresh(), anchor() }` on it: `refresh()` fills the open card again when its data changed under the pointer. The card is `.kp-popover.kp-tooltip[data-kp-hovercard-card]` in the body, in the top layer, and its widest is a knob.' },
            { name: 'pastel', what: 'In pastel a tooltip hangs in its holder, whose ::after draws its pass by anchor positioning; it lands small on the pass and leaves as that backwards.' },
            { name: 'the hover card on touch', what: 'On touch the hover card opens on a press, as text only; `data-kp-touch` on the host says it is used with touch.' },
        ],
        accessibility: [
            'Built in — focus opens it as well as hover, so it is reachable from the keyboard.',
            'Built in — the described element points at the tooltip, so its text is read as part of the control rather than as a stray paragraph.',
            'Yours — never put anything essential in one. It is unreachable on touch and invisible in print.',
            'Yours — keep it to a few words; a tooltip that wraps to four lines is help text in the wrong place.',
            'Yours — do not put a control inside a tooltip that closes when the pointer leaves it.',
        ],
    };
