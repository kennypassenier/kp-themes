// Page descriptor for the "markdown" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const markdownDescriptor = {
        id: 'markdown',
        title: 'Markdown notes',
        group: 'Content',
        classes: ['kp-markdown', 'kp-md-editor'],
        exports: [],
        aliases: ['md-editor', 'md-preview', 'md-headings', 'md-tabbed', 'md-tool', 'md-view', 'md-line', 'md-bold-key', 'md-italic-key', 'md-link-key', 'markdown-task'],
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
            { name: 'tasks', what: 'The reader’s option for task lists [habits-1101]: `markdownFragment(doc, text, { tasks: \'toggle\' })` draws `- [ ] item` and `- [x] item` as a checkbox with the item’s words (`.kp-markdown__task`); a tick fires `kp-markdown-task` `{ line, checked, text }` on the box (`data-kp-md-line`, the source line from 0) and `toggleTaskLine(text, line, checked)` gives the text with it written in. `show` draws the box disabled; `off` (default) leaves them text, as before.' },
            { name: 'data-kp-md-editor', what: 'The Markdown editor [habits-1101] (js/markdown-editor.js, `attachMarkdownEditors`): the page’s text area with a toolbar (bold, italic, heading, bulleted list, checklist, link; one tab stop) above it, Mod+B, Mod+I and Mod+K, Enter that continues a list (and ends it on an empty item), every edit one undo step, and the reader’s preview with ticking boxes. The page saves on the text area’s own `input`.' },
            { name: 'data-kp-md-preview', what: '`side` (default): the preview beside the text when the editor is at least 48rem wide, behind Write / Preview tabs when narrower (`data-kp-md-tabbed`); `tabs`: always tabs; `off`: no preview. `data-kp-md-headings` is the level a `#` takes in it (3). `showMarkdownView(el, view)` and `refreshMarkdownPreview(el)` for the page.' },
            { name: 'data-kp-md-bold-key', what: 'The key that makes the selection bold, a key spec (`Mod+B`, `Alt+U`, a bare letter; several with ` or `), `none` for no key [keys-1103]. Default `Mod+B`; the toolbar button names the key you set.' },
            { name: 'data-kp-md-italic-key', what: 'The key that makes the selection italic, a key spec (`Mod+B`, `Alt+U`, a bare letter; several with ` or `), `none` for no key [keys-1103]. Default `Mod+I`.' },
            { name: 'data-kp-md-link-key', what: 'The key that makes the selection a link, a key spec (`Mod+B`, `Alt+U`, a bare letter; several with ` or `), `none` for no key [keys-1103]. Default `Mod+K`.' },
            { name: 'the script', what: '`markdownFragment(doc, text, { headings, limit })` builds the fragment; `safeHref(href)` says whether an address may be a link (http, https, mailto, or no scheme); `MARKDOWN_LIMIT` (40 000) is the default cut.' },
            { name: 'kp-markdown__cut', what: 'The line after notes that were cut for length.' },
        ],
        accessibility: [
            'Built in — headings, lists and quotes are real elements; a link to another site opens in a new tab with `rel="noopener noreferrer"` and says so to a screen reader; nothing in the text can run script.',
            'Yours — pick `headings` so the notes sit below the heading they belong to.',
        ],
    };
