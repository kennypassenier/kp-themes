// Page descriptor for the "to-top" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const toTopDescriptor = {
        id: 'to-top',
        title: 'Back to top',
        group: 'Navigation',
        classes: ['kp-to-top'],
        exports: [],
        intro: 'The control that appears once the reader is a way down the page and takes them back — the view and the focus both, which is the half usually left out.',
        whenToUse:
            'On a page long enough that getting back is work: an article, a log, a table of a few hundred rows. Not on a page that fits on a screen, where it is a button that does nothing. Not as a substitute for a navigation — going up is not the same as going somewhere.',
        examples: [
            {
                title: 'A control that knows when it is needed',
                why: 'It is invisible until the reader has scrolled past the threshold, and `visibility: hidden` keeps it out of the tab order while it is. Pressing it scrolls to the top and moves the focus to the top of the document, so the next Tab starts where the eye is.',
                markup: `
<button type="button" class="kp-button kp-to-top" data-kp-to-top data-kp-to-top-after="400"></button>
`,
            },
            {
                title: 'In a box that scrolls on its own',
                why: 'Added 2026-10-13. A dashboard\u2019s main column or a dialog\u2019s stage scrolls instead of the window. The control looks for the nearest scrolling box it sits in, at every use: it appears when that box is past the threshold, and pressing it scrolls that box, not the window. Scroll the text in the window below. It runs in a window of its own because the control is fixed to the window\u2019s corner.',
                frame: { height: '16rem' },
                markup: `
<main id="stage" style="block-size: 100dvh; overflow-y: auto">
<h1>Readings</h1>
<p>Line 2 reports every fifteen minutes. The pressure held at 3.2 bar until 02:10.</p>
<p>At 02:40 it had dropped to 1.1 bar, and pump house 3 was switched to the reserve pump at 02:52.</p>
<p>The day shift checks the seal first, then the valve V-12 that was slow to close.</p>
<p>Nothing else was reported overnight. The backup ran at 03:00 and finished at 03:14.</p>
<p>Flow averaged 412 m\u00b3/h over the last quarter of an hour.</p>
<p>Maintenance has two lock-outs open and one spare part on order.</p>
<p>The rota for the coming week is on the last page.</p>
<button type="button" class="kp-button kp-to-top" data-kp-to-top data-kp-to-top-after="120"></button>
</main>
`,
            },
        ],
        variants: [
            { name: 'with a tab bar', what: 'The control, like the toast stack, rises by the bottom tab bar’s own height while the bar is on the screen, so it never stands behind it on a phone.' },
            { name: 'data-kp-to-top-after', what: 'How far down it appears, in pixels. Default 400.' },
            { name: 'the box it scrolls', what: 'The control scrolls the nearest scrolling box it sits in (a dashboard\u2019s main column, a dialog\u2019s stage), and measures its threshold against that box; with no such box it is the window, as before.' },
            { name: 'data-kp-to-top-target', what: 'A selector for where the focus should land instead of the top of the document. The focus moves without scrolling either way, so naming a landmark cannot undo the journey.' },
            { name: 'data-kp-to-top-shown', what: 'Written by the module while the control is on the screen. Read it, do not set it.' },
            { name: 'kp-to-top', what: 'The event, on the control, whenever it appears or goes away: `{ shown }`.' },
            { name: '--kp-to-top-offset', what: 'How far it sits from the corner, both ways at once. Default 1.5rem.' },
            { name: '--kp-glyph-to-top', what: 'The arrow an empty control draws. The module puts an empty `.kp-to-top__glyph` in a button that has nothing of its own and takes it out again on detach; a button with its own words or icon gets none. Default ↑.' },
        ],
        accessibility: [
            'Built in — the focus goes back with the view, and it moves without scrolling, so the control cannot undo its own journey.',
            'Built in — while it is not on the screen it is not in the tab order either.',
            'Built in — the scroll follows the page’s own scroll-behaviour, so a reader who asked for less motion gets none.',
            'Yours — give it a name. A button with only an arrow in it is announced as “button”.',
        ],
    };
