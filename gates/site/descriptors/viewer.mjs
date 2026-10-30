// Page descriptor for the "viewer" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const viewerDescriptor = {
        id: 'viewer',
        title: 'Viewer',
        group: 'Content',
        classes: ['kp-viewer'],
        exports: [],
        intro: 'One thing opened large in a modal dialog: a title, how it is shown, its facts, an exact position, a stage and a foot with the way out. The gallery lightbox and the document preview are both this shell. A loading stage is the theme\'s busy card over the whole stage; a file that fails or cannot be shown is a plate that fills it.',
        whenToUse: 'You rarely write it yourself: call `openViewer()` when a picture, a file or a long text should be looked at without leaving the page.',
        examples: [
            {
                title: 'Open a viewer',
                why: 'A script call; the foot always keeps Open in a new tab and Download, so there is a way out.',
                markup: `
<button class="kp-button" data-kp-preview="files/report.pdf">Preview the report</button>
`,
            },
            {
                title: 'Opening a viewer from a script, in each state',
                why: '`openViewer({ title, desc, facts, size, actions })` returns a handle: `setContent(node)` fills the stage, `setPosition({ index, total })` writes an exact, announced “2 of 5”, and `setState` is `ready`, `loading` (the busy card over the whole stage), `error` (a plate with the message and a Retry) or `unsupported` (a plate that says the browser cannot show it). The foot always keeps its actions (`open`, `download`, `print`, `copy-link`, or your own with `run`), so a file that cannot be shown can still be opened or saved. Escape, the close button or a press on the dim closes it and the focus goes back to the opener; `kp-viewer-close` fires on the document with `{ dialog }`.',
                markup: `
<div class="kp-row">
<button class="kp-button" type="button" data-doc-viewer="ready">A text, ready</button>
<button class="kp-button" type="button" data-doc-viewer="loading">Loading, then ready</button>
<button class="kp-button" type="button" data-doc-viewer="error">A file that fails</button>
<button class="kp-button" type="button" data-doc-viewer="unsupported">A file this browser cannot show</button>
<button class="kp-button" type="button" data-doc-viewer="full">Full size</button>
</div>
<p class="kp-text-muted" id="doc-viewer-log" aria-live="polite">Open one, then press Escape.</p>
`,
                script: `
import { openViewer } from '@kp-soft/themes/js/viewer';

const log = document.getElementById('doc-viewer-log');
const href = 'data:text/plain;charset=utf-8,Packing%20list%0A-%20passport%0A-%20charger';
const actions = [
    { kind: 'open', href },
    { kind: 'download', href, name: 'packing-list.txt' },
    { kind: 'copy-link', href },
    { kind: 'print', run: () => log.textContent = 'The page prints it here.' },
];
const show = (kind, opener) => {
    const viewer = openViewer({
        title: 'Packing list',
        desc: kind === 'unsupported' ? 'Shown by the browser' : 'Shown as text',
        facts: 'Text · 61 bytes · 18/10/2026 09:12',
        size: kind === 'full' ? 'full' : 'wide',
        actions,
        opener,
    });
    const text = document.createElement('pre');
    text.textContent = 'Packing list\\n- passport\\n- charger';
    viewer.setContent(text);
    viewer.setPosition({ index: 2, total: 5 });
    if (kind === 'loading') {
        viewer.setState('loading');
        setTimeout(() => viewer.setState('ready'), 1800);
    } else if (kind === 'error') {
        viewer.setState('error', { message: 'The server says the file is gone.', retry: () => viewer.setState('ready') });
    } else if (kind === 'unsupported') {
        viewer.setState('unsupported', { message: 'This browser cannot show this kind of file here.' });
    }
};
for (const button of document.querySelectorAll('[data-doc-viewer]')) {
    button.addEventListener('click', () => show(button.dataset.docViewer, button));
}
document.addEventListener('kp-viewer-close', () => { log.textContent = 'The viewer closed and the focus went back to its button.'; });
`,
            },
        ],
        variants: [
            { name: 'data-kp-viewer', what: 'Marks the dialog the shell builds.' },
            { name: 'data-kp-viewer-size', what: '`wide` (about 70 % of the window, 90 % high) or `full`; a phone always gets the whole screen.' },
            { name: 'data-kp-viewer-action', what: 'Marks a foot button: `open`, `download`, `print`, `copy-link`.' },
        ],
        accessibility: [
            'Built in — a native modal dialog (focus trapped, Escape closes, focus returns to the opener), the title is its name, the position is announced politely.',
            'Yours — pass a real title; the facts line is for the kind, size and date.',
        ],
    };
