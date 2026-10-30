// Page descriptor for the "visually-hidden" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const visuallyHiddenDescriptor = {
        id: 'visually-hidden',
        title: 'Visually hidden',
        group: 'Structure',
        classes: ['kp-sr-only'],
        exports: [],
        intro: 'Text that is not drawn and is still announced. It is for the things a page says by looking, which are silent to anyone who is not looking.',
        whenToUse:
            'For a name a control needs but the layout cannot show, and for a change that is obvious on screen and silent otherwise. Not to hide anything a sighted reader also needs, and never to bury text for a search engine: this class is a promise that the words are true.',
        examples: [
            {
                title: 'A name for a control that shows a glyph',
                why: 'The word is read out and takes no room; the glyph is marked decorative so it is not announced beside it.',
                markup: `
<button type="button" class="kp-button kp-button--ghost"><span aria-hidden="true">⌫</span><span class="kp-sr-only">Remove this filter</span></button>
<label class="kp-sr-only" for="doc-hidden-search">Search applications</label>
<input class="kp-field__input" id="doc-hidden-search" type="search" placeholder="Search…" />
`,
            },
        ],
        variants: [
            { name: '.kp-sr-only', what: 'The only state. It keeps the text in the document and out of the picture: one pixel, clipped, and never with display taken away, which would take it out of the reading too.' },
        ],
        accessibility: [
            'Built in — the text stays in the accessibility tree; nothing here is hidden from a screen reader.',
            'Built in — the file input under an upload zone uses this rather than being hidden away, which is what keeps it in the tab order.',
            'Yours — prefer visible words. Hidden text is unread by everyone who is looking at the screen.',
            'Yours — do not put a focusable control inside it unless it becomes visible when focused, as the skip link does.',
        ],
    };
