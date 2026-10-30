// Page descriptor for the "help-tour" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const helpTourDescriptor = {
        id: 'help-tour',
        title: 'Help and the tour',
        group: 'Navigation',
        classes: ['kp-help', 'kp-tour'],
        exports: [],
        intro: 'Help cards (`.kp-help`), each a list of words beside their meanings, and a short guided tour over the page: `startTour(steps)` in js/tour.js shows one card (`.kp-tour`) per step beside the part it is about, with that part ringed and the rest of the page dimmed. The count is exact, because a step whose part is not on the page is left out before counting, and a tour that ended is remembered.',
        whenToUse:
            'Help for the words and keys a site uses, and a tour for a first visit to a page whose parts are not obvious. Not for instructions a reader needs every time, which belong on the page, and not for more than a handful of steps.',
        examples: [
            {
                title: 'A help card',
                why: 'A heading, a sentence and a `dl`: the words in one column, their meanings beside them, starting at one edge across every card; in a card of 22rem or less the word goes over its meaning.',
                markup: `
<section class="kp-help kp-card">
<h3>Keys</h3>
<p>Pressed anywhere outside a field.</p>
<dl class="kp-help__list">
<dt><kbd>?</kbd></dt><dd>Open this Help.</dd>
<dt><kbd>Ctrl</kbd> <kbd>K</kbd></dt><dd>Jump to a page or a pump house by its name.</dd>
<dt><kbd>Esc</kbd></dt><dd>Close what is open, or show all again.</dd>
</dl>
</section>
`,
            },
            {
                title: 'The tour’s card, as startTour() builds it',
                why: 'Shown in place here; the tour places it 12 px under or over its target, 16 px inside the window, and moves it with the page. Back is hidden on the first step, and Next reads Done on the last.',
                markup: `
<div class="kp-tour" role="dialog" aria-labelledby="doc-tour-title" style="position: relative">
<h3 class="kp-tour__title" id="doc-tour-title">The areas</h3>
<p class="kp-tour__text">Five areas, always in the same place: the overview, the pump houses, their readings, incidents and backups.</p>
<footer class="kp-tour__foot">
<span class="kp-tour__count">1 of 5</span>
<span class="kp-tour__buttons">
<button type="button" class="kp-button kp-button--sm kp-button--ghost">Skip</button>
<button type="button" class="kp-button kp-button--sm kp-button--primary">Next</button>
</span>
</footer>
</div>
`,
            },
        ],
        variants: [
            { name: '.kp-help', what: 'A help card: a heading, a sentence, and its lists.' },
            { name: '.kp-help__list', what: 'A `dl`: the words beside their meanings in two columns; in a card of 22rem or less, the word over its meaning.' },
            { name: '.kp-help kbd', what: 'A key, drawn as a key.' },
            { name: '.kp-tour', what: 'The tour’s card, a non-modal dialog: its title, its text, and a foot with the count and Back, Skip and Next.' },
            { name: 'the dim', what: 'The page is dimmed around the target by a shadow the target casts, set by a knob (listed below) that a theme replaces to draw its own dim; the theme does not paint a box-shadow on the target itself, which a cut corner would clip. While the tour points at a part, the part is uncut.' },
            { name: 'closing the dim', what: 'When the card closes, the dim leaves as it was drawn: the knobs listed below name the shadow it fades to, how long it takes, its curve and its delay (forest withers it, cyberpunk steps it). Unset, it fades over the theme\u2019s fold time.' },
            { name: 'data-kp-tour-target', what: 'Written by the tour on the part it talks about: a ring in the focus colour, and the rest of the page dimmed around it.' },
            { name: 'startTour(steps, options)', what: 'Starts it: each step a `target` (a selector or a function), a `title` and a `text`; `remember`, `returnFocus`, `onEnd`, `decorate`, `strings`. Returns `{ end, goto }`, or null when no step’s part is on the page.' },
            { name: 'shouldStartTour()', what: 'Whether a page starts the tour by itself: `?tour` (or `?tour=3`) always; otherwise a first visit by a person, not a remembered one and not a browser driven by a script.' },
            { name: 'in a dialog', what: 'When the part a step is about is inside an open modal dialog, the card goes into that dialog, where it can be used.' },
            { name: 'pastel', what: 'In pastel the tour’s card draws its own plate and pass and lands on it, a ring is drawn round the target (`kp-sig-pastel-tour-ring`), and the card and the dim close as they came, backwards.' },
        ],
        accessibility: [
            'Built in — the card is named by its title and described by its text; Next takes the focus on every step, ← and → move, and Esc ends the tour from anywhere and returns the focus where it was.',
            'Built in — the page stays usable during the tour: the card is not modal.',
            'Built in — every word the card says is in the dictionary (`tour…`); `startTour(steps, { strings })` overrides them.',
            'Yours — keep the tour short and let Help start it again; never start it on every visit (`shouldStartTour` with the remembered state does that).',
            'Yours — a help list’s words are the site’s own: write them as the pages use them.',
        ],
    };
