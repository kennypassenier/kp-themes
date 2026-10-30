// Page descriptor for the "markdown" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const markdownDescriptor = {
        id: 'markdown',
        title: 'Markdown notes',
        group: 'Content',
        classes: ['kp-markdown'],
        exports: [],
        aliases: [],
        intro: 'Release notes or a changelog written in markdown, drawn safely: the page builds the headings, lists, links, code and quotes as DOM, node by node, so nothing in the text is ever parsed as HTML. It is what the acknowledge gate shows its notes with.',
        whenToUse: 'Text that comes from somebody else’s repository. For prose you write yourself use the page’s own markup.',
        examples: [
            {
                title: 'Notes of a release',
                why: '`markdownFragment(document, text, { headings })` returns a fragment: `#` headings are written at the level `headings` says (4 by default), `-` and `1.` lists nest by indent, `` `code` `` and fenced blocks keep their text, `[words](https://…)` is a link that opens in a new tab and says so, an unsafe address (`javascript:`) is only its words, and raw HTML is text. A text longer than `limit` characters is cut at a line with a sentence saying so.',
                markup: `
<div class="kp-markdown" id="doc-markdown"></div>
`,
                script: `
import { markdownFragment } from '@kp-soft/themes/js/markdown';

const text = '## 12.1\\n\\n- **Faster** library scans\\n- Fixed [the login loop](https://example.com/issue/1)\\n\\n\`\`\`\\njellyfin --version\\n\`\`\`';
document.getElementById('doc-markdown').replaceChildren(markdownFragment(document, text, { headings: 3 }));
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`markdownFragment(doc, text, { headings, limit })` builds the fragment; `safeHref(href)` says whether an address may be a link (http, https, mailto, or no scheme); `MARKDOWN_LIMIT` (40 000) is the default cut.' },
            { name: 'kp-markdown__cut', what: 'The line after notes that were cut for length.' },
        ],
        accessibility: [
            'Built in — headings, lists and quotes are real elements; a link to another site opens in a new tab with `rel="noopener noreferrer"` and says so to a screen reader; nothing in the text can run script.',
            'Yours — pick `headings` so the notes sit below the heading they belong to.',
        ],
    };
