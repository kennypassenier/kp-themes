// Page descriptor for the "breadcrumb" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const breadcrumbDescriptor = {
        id: 'breadcrumb',
        title: 'Breadcrumb',
        group: 'Navigation',
        classes: ['kp-breadcrumb'],
        exports: ['Breadcrumb'],
        intro: 'The trail from the top of the hierarchy to where the reader is now, with a separator drawn by the stylesheet rather than written into the markup.',
        whenToUse:
            'On a page that sits inside a hierarchy deeper than one level, where “up” is a useful move. Not as a history of where somebody has been — that is the back button — and not on a flat application, where every crumb but the last would say the same thing.',
        examples: [
            {
                title: 'Three levels, the last one where you are',
                why: 'The separator is a stylesheet glyph, so it is never selected or read out as text; the last entry is not a link, because it is the page you are on.',
                markup: `
<nav class="kp-breadcrumb" aria-label="Breadcrumb">
<ol>
<li><a href="#breadcrumb">Home</a></li>
<li><a href="#example">Applications</a></li>
<li><span aria-current="page">Example Inc</span></li>
</ol>
</nav>
`,
            },
        ],
        variants: [
            { name: 'separator', what: 'Drawn before every entry but the first, from a glyph the theme can change.' },
            { name: 'current page', what: 'The last entry is text rather than a link, and says it is the current page.' },
            { name: 'wrapping', what: 'A long trail wraps to a second line instead of scrolling sideways.' },
        ],
        accessibility: [
            'Built in — the separator is a stylesheet glyph, so a screen reader does not read a slash between every crumb.',
            'Yours — use an ordered list; the order is the information.',
            'Yours — name the nav element and mark the last entry as the current page.',
            'Yours — shorten long names in the middle of the trail rather than dropping levels out of it.',
        ],
    };
