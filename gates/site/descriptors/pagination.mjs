// Page descriptor for the "pagination" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const paginationDescriptor = {
        id: 'pagination',
        title: 'Pagination',
        group: 'Navigation',
        classes: ['kp-pagination'],
        exports: ['Pagination'],
        intro: 'Numbered pages with previous and next, gaps where the range is cut, and the current page marked by weight as well as by the attribute that announces it.',
        whenToUse:
            'For a list a reader may want to come back to, where a page number is a place they can return to and link to. Not for a feed, where endless scrolling suits the reading; and not inside the data table, which builds its own pager.',
        examples: [
            {
                title: 'Five pages with a gap',
                why: 'The gap is decorative and hidden from a screen reader — “…” read out between page numbers is noise. Real links, so a page can be opened in a new tab.',
                markup: `
<nav class="kp-pagination" aria-label="Pagination">
<ul>
<li><a href="#pagination">Previous</a></li>
<li><a href="#pagination">1</a></li>
<li><a href="#pagination" aria-current="page">2</a></li>
<li><a href="#pagination">3</a></li>
<li class="kp-pagination__gap" aria-hidden="true">…</li>
<li><a href="#pagination">9</a></li>
<li><a href="#pagination">Next</a></li>
</ul>
</nav>
`,
            },
        ],
        variants: [
            { name: 'current page', what: 'Bold with a thicker underline, and the attribute that says so, because weight alone is a fine distinction.' },
            { name: '.kp-pagination__gap', what: 'The cut in the range: quiet, decorative and not a link.' },
            { name: 'previous / next', what: 'Words rather than arrows by default, and left out at the ends rather than rendered as links to a page that is not there.' },
            { name: 'first / last', what: 'Optional jumps to either end for a long list.' },
        ],
        accessibility: [
            'Built in — the gap is hidden from a screen reader and the current page is announced rather than only drawn.',
            'Built in — a link that would point outside the range is not rendered, so nobody tabs onto a page that does not exist.',
            'Yours — name the nav element, and give each number a label if the number alone is not clear (“page 3”).',
            'Yours — use real links with real URLs. A page number that only works with script cannot be shared.',
            'Yours — say how many pages there are; a reader cannot guess from a cut range.',
        ],
    };
