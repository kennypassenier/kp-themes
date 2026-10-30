// Page descriptor for the "document-preview" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const documentPreviewDescriptor = {
        id: 'document-preview',
        title: 'Document preview',
        group: 'Content',
        classes: ['kp-docpreview', 'kp-docglyph'],
        aliases: ['preview', 'doc', 'size'],
        exports: [],
        intro: 'A PDF, a picture or a text shown in the viewer without downloading it, and the small page with a folded corner that means "a document". The browser\'s own PDF viewer shows a PDF; where it cannot, a plate offers Open in a new tab and Download.',
        whenToUse: 'A dossier\'s files, a CV, an invoice: anything a person should be able to look at before deciding to keep it.',
        examples: [
            {
                title: 'A file with its icon',
                why: 'The opener names its file; the icon is markup only.',
                markup: `
<span class="kp-docglyph" data-kp-doc-kind="pdf" data-kp-size="md"></span>
<button class="kp-button" data-kp-preview="files/cv.pdf" data-kp-preview-title="CV" data-kp-preview-page="2">Preview</button>
`,
            },
            {
                title: 'A dossier: icons for every kind, and openers that step through a group',
                why: '`data-kp-doc-kind` draws the page with a folded corner for `pdf`, `doc`, `sheet`, `image`, `text` or `unknown`; `data-kp-size` is `sm`, `md` or `lg`, `data-kp-doc-lines` sets 3 to 7 text lines, and `data-kp-state="missing"` draws a faint, dashed empty page. Openers that share `data-kp-preview-group` step previous and next in the one viewer with an exact “2 of 3”; `data-kp-preview-name` is the file name a download is saved as and `data-kp-preview-actions` chooses the foot buttons (`open download` by default, also `print` and `copy-link`). An opener with an empty `data-kp-preview` is off, with the reason “No file yet”.',
                markup: `
<div class="kp-stack">
<div class="kp-row">
<span class="kp-docglyph" data-kp-doc-kind="pdf" data-kp-size="sm"></span>
<span class="kp-docglyph" data-kp-doc-kind="doc" data-kp-size="md"></span>
<span class="kp-docglyph" data-kp-doc-kind="sheet" data-kp-size="md" data-kp-doc-lines="6"></span>
<span class="kp-docglyph" data-kp-doc-kind="image" data-kp-size="md"></span>
<span class="kp-docglyph" data-kp-doc-kind="text" data-kp-size="lg"></span>
<span class="kp-docglyph" data-kp-doc-kind="unknown" data-kp-size="md"></span>
<span class="kp-docglyph" data-kp-doc-kind="pdf" data-kp-size="md" data-kp-state="missing"></span>
</div>
<div class="kp-row">
<button class="kp-button" type="button" data-kp-preview="data:text/plain;charset=utf-8,Cover%20letter%0A%0ADear%20team%2C%20I%20would%20like%20to%20apply." data-kp-preview-type="text" data-kp-preview-title="Cover letter" data-kp-preview-name="cover-letter.txt" data-kp-preview-group="dossier" data-kp-preview-actions="open download copy-link">Cover letter</button>
<button class="kp-button" type="button" data-kp-preview="data:text/plain;charset=utf-8,Notes%0A%0AInterview%20on%20Friday%2C%2010%3A00." data-kp-preview-type="text" data-kp-preview-title="Interview notes" data-kp-preview-name="notes.txt" data-kp-preview-group="dossier">Interview notes</button>
<button class="kp-button" type="button" data-kp-preview="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 160 90%27%3E%3Crect width=%27160%27 height=%2790%27 fill=%27%23e6edf9%27/%3E%3Ccircle cx=%2780%27 cy=%2745%27 r=%2725%27 fill=%27%23284b8c%27/%3E%3C/svg%3E" data-kp-preview-type="image" data-kp-preview-title="Photo of the desk" data-kp-preview-name="desk.svg" data-kp-preview-group="dossier">Photo</button>
<button class="kp-button" type="button" data-kp-preview="">Reference letter</button>
</div>
</div>
`,
            },
            {
                title: 'Opening a preview from a script',
                why: '`openDocPreview({ url, type, engine, size, actions, title, page, sandbox, name, group, index })` opens the same viewer without an opener element. `data-kp-preview-engine="none"` (`engine: "none"`) draws no frame, only the plate with Open in a new tab and Download, for a browser or a page that cannot show the file. `data-kp-preview-sandbox` is `strict` by default for text, which removes scripts, and `data-kp-preview-page` opens a PDF on a page. `docKindOf(name)`, `previewTypeOf(url)` and `plainFileName(url)` are the pure helpers it uses.',
                markup: `
<div class="kp-row">
<button class="kp-button" type="button" id="doc-preview-script">Open the notes in full size</button>
<button class="kp-button" type="button" id="doc-preview-plate">Open with no frame</button>
</div>
<p class="kp-text-muted" id="doc-preview-log" aria-live="polite">Kinds: -</p>
`,
                script: `
import { docKindOf, openDocPreview, plainFileName, previewTypeOf } from '@kp-soft/themes/js/docpreview';

const url = 'data:text/plain;charset=utf-8,Notes%0A%0AAll%20tasks%20done.';
document.getElementById('doc-preview-script').addEventListener('click', (event) => {
    openDocPreview({ url, type: 'text', size: 'full', title: 'Notes', name: 'notes.txt', opener: event.currentTarget });
});
document.getElementById('doc-preview-plate').addEventListener('click', (event) => {
    openDocPreview({ url, engine: 'none', title: 'Notes', name: 'notes.txt', opener: event.currentTarget });
});
document.getElementById('doc-preview-log').textContent =
    'Kinds: ' + ['cv.pdf', 'budget.xlsx', 'photo.jpg', 'readme.md'].map((name) => name + ' is ' + docKindOf(name)).join(', ') +
    '; ' + plainFileName('https://example.com/files/Annual%20report.pdf') + ' is shown as ' + previewTypeOf('https://example.com/files/Annual%20report.pdf') + '.';
`,
            },
        ],
        variants: [
            { name: 'data-kp-preview', what: 'The file\'s address; empty: the opener is off with the reason "No file yet".' },
            { name: 'data-kp-preview-type', what: '`auto` (default: by extension, then Content-Type), `pdf`, `image` or `text`.' },
            { name: 'data-kp-preview-engine', what: '`native` (default) or `none`: no frame, only the plate with Open and Download.' },
            { name: 'data-kp-preview-size', what: '`wide` (default) or `full`.' },
            { name: 'data-kp-preview-actions', what: 'Foot buttons: `open download` by default, also `print` and `copy-link`.' },
            { name: 'data-kp-preview-title', what: 'The dialog\'s title; the file\'s plain name by default.' },
            { name: 'data-kp-preview-page', what: 'Open a PDF on this page (1).' },
            { name: 'data-kp-preview-sandbox', what: '`strict` (default for text: scripts removed) or `off`.' },
            { name: 'data-kp-preview-group', what: 'A name: openers that share it step previous and next in the same shell, with an exact "2 of 5".' },
            { name: 'data-kp-preview-name', what: 'The file name a download is saved as.' },
            { name: 'data-kp-doc-kind', what: 'On the icon: `pdf`, `doc`, `sheet`, `image`, `text` or `unknown`.' },
            { name: 'data-kp-doc-lines', what: 'On the icon: 3 to 7 text lines (4; 7 for the large one).' },
            { name: 'data-kp-state', what: 'On the icon: `missing` draws a faint, dashed empty page.' },
        ],
        accessibility: [
            'Built in — the viewer is a native modal dialog; the icon is named ("PDF document"); keys o, d and p (and the arrows in a group) are listed in the shortcut sheet.',
            'Yours — pass the file\'s real name as the title.',
        ],
    };
