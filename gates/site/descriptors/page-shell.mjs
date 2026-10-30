// Page descriptor for the "page-shell" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const pageShellDescriptor = {
        id: 'page-shell',
        title: 'Page shell',
        group: 'Structure',
        classes: ['kp-footer', 'kp-error'],
        exports: [],
        intro: 'The two pieces every application has and nobody designs: the footer under the content, and the page that says something went wrong.',
        whenToUse:
            'The footer wherever a page needs a quiet closing line — a version, a licence, a link to the source. The error page for the states a server returns rather than for a failed action inside a working page, which is an alert. Do not put navigation a reader needs only in the footer.',
        examples: [
            {
                title: 'An error page',
                why: 'A message, not a wall: the destructive colour names the failure in the heading, and the explanation stays in the ordinary ink at a readable measure.',
                markup: `
<div class="kp-error">
<h1>404</h1>
<p>This page does not exist. It may have been renamed, or the link may be older than the page.</p>
<a class="kp-button" href="#page-shell">Back to the start</a>
</div>
`,
            },
            {
                title: 'A footer',
                why: 'Quiet ink over a rule, with the page’s own outer distance, so it closes the page rather than starting a new region.',
                markup: `
<footer class="kp-footer">kp-themes · twenty-four themes, one set of tokens</footer>
`,
            },
        ],
        variants: [
            { name: '.kp-error', what: 'A centred column at a readable measure, with room above it.' },
            { name: '.kp-error h1', what: 'The heading in the destructive colour: the one place a whole page names a failure.' },
            { name: '.kp-footer', what: 'A rule above, quiet ink, and the same outer distance as the page.' },
        ],
        accessibility: [
            'Built in — the error heading takes a colour measured against the page, so it is not a red that only just reads.',
            'Yours — say what happened and what to do next; a number on its own is a code, not a message.',
            'Yours — send the right status from the server as well. The page is what the reader sees; the status is what everything else reads.',
            'Yours — use the footer element itself, so it is announced as one.',
        ],
    };
