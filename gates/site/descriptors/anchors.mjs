// Page descriptor for the "anchors" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const anchorsDescriptor = {
        id: 'anchors',
        title: 'Link anchors',
        group: 'Structure',
        classes: ['kp-anchors', 'kp-anchor'],
        aliases: ['anchored'],
        exports: [],
        intro: 'A small # beside a heading or a row. A press copies a link to exactly that place and the mark says "Copied"; opening such a link scrolls to the place and marks it for two seconds. A link to something that is gone says so in a notice instead of doing nothing.',
        whenToUse: 'Long pages and lists where one item must be pointed at in a chat: a guide with sections, a list of failed messages.',
        examples: [
            {
                title: 'Headings and a row',
                why: 'The container asks for the marks; a row says its own id so the link survives a re-sort.',
                markup: `
<main data-kp-anchors="both">
<h2>Restore a backup</h2>
<table class="kp-table"><tbody><tr data-kp-anchor="dead-4f2a" data-kp-anchor-label="Dead letter 4f2a"><th scope="row">4f2a</th><td>Consumer timed out</td></tr></tbody></table>
</main>
`,
            },
            {
                title: 'A guide: marks always shown, a fold and the words after a copy',
                why: '`data-kp-anchors="headings"` marks every heading of the levels in `data-kp-anchor-levels` (`2,3` by default; here only level 3). `data-kp-anchor-show="always"` keeps the `#` visible instead of waiting for the pointer, `data-kp-anchor-copy="hash"` copies only `#id`, and a heading’s own `id` is never overwritten. A link that lands inside a folded `details` opens it first (`data-kp-anchor-open`). `kp-anchor-copy` carries `{ id, url, text, markdown, ok }`; Shift with the press copies a Markdown link. `refreshAnchors(box)` draws the marks again after an option changed.',
                markup: `
<main class="kp-stack" id="doc-anchors-guide" data-kp-anchors="headings" data-kp-anchor-levels="3" data-kp-anchor-show="always" data-kp-anchor-copy="hash">
<h2>Restoring a backup</h2>
<h3>Before you start</h3>
<p>Stop the stack, then check that the disk has 40 GB free.</p>
<h3 id="doc-anchors-steps">The steps</h3>
<details>
<summary>Folded: what to do when the copy is damaged</summary>
<h3 id="doc-anchors-damaged">A damaged copy</h3>
<p>Take the copy of the night before and run the check again.</p>
</details>
<p class="kp-text-muted" id="doc-anchors-log" aria-live="polite">Press a # to copy its link.</p>
</main>
`,
                script: `
const guide = document.getElementById('doc-anchors-guide');
const log = document.getElementById('doc-anchors-log');
guide.addEventListener('kp-anchor-copy', (event) => {
    log.textContent = event.detail.ok ? 'Copied ' + event.detail.text + ' for ' + event.detail.id + '.' : 'The browser refused the copy.';
});
guide.addEventListener('kp-anchor-missing', (event) => {
    log.textContent = 'There is nothing called ' + event.detail.id + ' on this page.';
});
`,
            },
            {
                title: 'Rows that keep their link after a re-sort, and a mark that moves',
                why: 'A row says its own id with `data-kp-anchor` (the id of the data, never its place in the list), so a link survives a re-sort; `data-kp-anchor-label` is what the mark’s accessible name says (“Copy link to Dead letter 4f2a”). `data-kp-anchor-position` is `before` for rows and `after` for headings, and `data-kp-anchor-target="none"` stops marking the place a link lands on. A link to a row that is not on the page yet is waited for, and one that has no place to land says so in a notice with a button that clears the address.',
                markup: `
<div class="kp-stack" id="doc-anchors-rows" data-kp-anchors="rows" data-kp-anchor-show="always">
<table class="kp-table">
<thead><tr><th scope="col">Message</th><th scope="col">Why it failed</th></tr></thead>
<tbody>
<tr data-kp-anchor="dead-4f2a" data-kp-anchor-label="Dead letter 4f2a"><th scope="row">4f2a</th><td>Consumer timed out</td></tr>
<tr data-kp-anchor="dead-91bc" data-kp-anchor-label="Dead letter 91bc"><th scope="row">91bc</th><td>Payload too large</td></tr>
<tr data-kp-anchor="dead-c07e" data-kp-anchor-label="Dead letter c07e"><th scope="row">c07e</th><td>Unknown topic</td></tr>
</tbody>
</table>
<button class="kp-button" type="button" id="doc-anchors-move">Put the marks after the row</button>
</div>
`,
                script: `
import { refreshAnchors } from '@kp-soft/themes/js/anchors';

const box = document.getElementById('doc-anchors-rows');
const button = document.getElementById('doc-anchors-move');
button.addEventListener('click', () => {
    const after = box.getAttribute('data-kp-anchor-position') !== 'after';
    box.setAttribute('data-kp-anchor-position', after ? 'after' : 'before');
    refreshAnchors(box);
    button.textContent = after ? 'Put the marks before the row' : 'Put the marks after the row';
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-anchors', what: '`headings`, `rows`, `both` or `off` (default): opt-in per page.' },
            { name: 'data-kp-anchor', what: 'On one element: its id, or empty to make one. An id the page already has is never overwritten.' },
            { name: 'data-kp-anchor-label', what: 'What the target is called in the mark\'s accessible name ("Copy link to Dead letter 4f2a").' },
            { name: 'data-kp-anchor-levels', what: 'Which headings get a mark: `2,3` by default.' },
            { name: 'data-kp-anchor-show', what: '`hover` (default: over the heading or row, or the keyboard on it; always on a touch screen), `always` or `touch`.' },
            { name: 'data-kp-anchor-position', what: '`after` (headings) or `before` (rows).' },
            { name: 'data-kp-anchor-copy', what: '`url` (default) or `hash`.' },
            { name: 'data-kp-anchor-target', what: '`highlight` (default) or `none`: mark the place a link lands on.' },
            { name: 'data-kp-anchor-offset', what: 'A CSS length a sticky bar covers; the page header\'s own height by default.' },
            { name: 'data-kp-anchor-open', what: '`on` (default) opens a folded `details` first and asks the page to reveal a row on another page; `off`.' },
            { name: 'data-kp-flash-ms', what: 'How long "Copied" stays on the mark (1500).' },
            { name: 'data-kp-anchor-wait', what: 'The longest wait, in ms, for a place not drawn yet (10000 by default; 0 says “no longer here” at once). Read from the first container, which says the notice. `attachAnchors` takes `wait`.' },
            { name: 'the notice', what: 'The notice comes after about a second unless something in an anchored container is loading. The shortcut sheet lists `y l` once.' },
            { name: 'in a form grid', what: 'The row mark stands at the end of the label cell (room for it is a knob); the heading mark at the grid’s end edge; `legend` and `.kp-formgrid__heading` count as headings.' },
        ],
        accessibility: [
            'Built in — the mark is a button with the target in its name, a tab stop after the row\'s own controls, always visible to keyboard focus; the copy is announced politely; with the shortcut engine `y` then `l` on a focused row copies its link.',
            'Yours — give rows the id of the data, never their place in the list.',
        ],
    };
