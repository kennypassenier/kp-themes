// Page descriptor for the "skip-link" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const skipLinkDescriptor = {
        id: 'skip-link',
        title: 'Skip link',
        group: 'Navigation',
        classes: ['kp-skip-link'],
        exports: [],
        aliases: ['skip'],
        intro: 'The first thing a keyboard user meets on a page: a link past the header and the navigation, invisible until it is focused and then unmissable.',
        whenToUse:
            'On every page with anything repeated before its content — a bar, a sidebar, a set of filters. There is no case for leaving it out; the only choice is where it lands, and the answer is the main content, not the first heading.',
        examples: [
            {
                title: 'The link and its target',
                why: 'It is out of sight until it takes focus, then it appears at the top corner. Tab into the box below to see it. The target takes focus itself, so the next Tab continues inside the content.',
                markup: `
<a class="kp-skip-link" href="#doc-skip-main">Skip to content</a>
<div id="doc-skip-main" tabindex="-1">The page’s content starts here.</div>
`,
            },
        ],
        variants: [
            { name: 'at rest', what: 'Off the top of the page, taking no space and reachable by nothing but the tab order.' },
            { name: 'focused', what: 'It drops into the top corner on the primary plate, above every other layer, with an underline.' },
        ],
        accessibility: [
            'Built in — it is above every other layer, so nothing sticky draws over it when it appears.',
            'Built in — the module moves focus to the target rather than only jumping the view, which is the half a bare anchor gets wrong.',
            'Yours — put it first in the document, before anything else focusable.',
            'Yours — point it at the main content; the module gives that element a focus target itself if it has none.',
            'Yours — keep the words plain. This one is read out of context by definition.',
        ],
    };
