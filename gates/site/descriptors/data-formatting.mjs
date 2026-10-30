// Page descriptor for the "data-formatting" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const dataFormattingDescriptor = {
        id: 'data-formatting',
        title: 'Showing data',
        group: 'Data',
        classes: ['kp-url', 'kp-id', 'kp-numeric', 'kp-timestamp', 'kp-masked', 'kp-truncate'],
        exports: [],
        intro: 'Six classes that are not components — nobody imports a URL — but that every data-heavy page rewrites badly. Each fixes one specific failure: a page that scrolls sideways because of one long link, or a column of numbers that jitters between rows.',
        whenToUse:
            'On the values themselves, wherever they appear: in a table, in a card, in a definition list. Do not reach for the truncation where the value must stay readable — a cut identifier with no way back is data hidden rather than shortened — and do not use the masked class to hide anything a viewer could not already see.',
        examples: [
            {
                title: 'All six at rest',
                why: 'The URL and the identifier wrap anywhere rather than pushing the page sideways; the amount and the moment use same-width digits; the masked value keeps its shape without claiming to be the real one; the last line is cut with an ellipsis.',
                markup: `
<p class="kp-url">https://example.test/a/very/long/path/that-would-otherwise-widen-the-page?with=query&amp;and=more</p>
<p class="kp-id">a3f9-2b71-0c4d-8e15</p>
<p class="kp-numeric">1,284.50 · 998.00 · 12.75</p>
<p class="kp-timestamp">2026-09-06 14:07</p>
<p class="kp-masked">•••• •••• •••• 4417</p>
<p class="kp-truncate">This sentence is cut off with an ellipsis as soon as its column is narrower than the text itself, instead of making the row taller.</p>
`,
            },
        ],
        variants: [
            { name: '.kp-url', what: 'Wraps anywhere, so one long link cannot widen the page.' },
            { name: '.kp-id', what: 'The same wrapping, in the mono face and slightly smaller, for keys and identifiers.' },
            { name: '.kp-numeric', what: 'Same-width digits, so a column of amounts lines up and does not shimmer as values change.' },
            { name: '.kp-timestamp', what: 'The same digits, in the quiet ink, because a moment is rarely the point of the row.' },
            { name: '.kp-masked', what: 'Mono, letter-spaced and quiet: a value with its shape kept and its content gone.' },
            { name: '.kp-truncate', what: 'One line with an ellipsis. Put the whole value in the title, or use the cell class that keeps it.' },
        ],
        accessibility: [
            'Built in — none of these hides anything from a screen reader: they change how a value is drawn, not what it is.',
            'Built in — the wrapping classes are what keep a page from needing sideways scrolling at 320 pixels.',
            'Yours — put the full text within reach of anyone who meets a truncated one.',
            'Yours — mask on the server. A masked class over a real number is a value in the page source.',
        ],
    };
