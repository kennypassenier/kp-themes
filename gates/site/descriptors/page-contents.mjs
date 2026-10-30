// Page descriptor for the "page-contents" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const pageContentsDescriptor = {
        id: 'page-contents',
        title: 'On this page',
        group: 'Navigation',
        classes: ['kp-contents'],
        exports: [],
        aliases: ['contents', 'contents-for', 'contents-headings', 'contents-offset', 'contents-min', 'contents-title', 'contents-hash', 'contents-sig', 'level'],
        intro: 'A contents list that follows the reader: built from the page’s own headings (or from items the page gives), with the section the reader is in marked as they scroll, and a press that scrolls there, writes the address and moves the focus to the heading.',
        whenToUse: 'A long page of sections (settings, a reference, an article). For moving between pages use the side navigation; for a handful of in-page links write them by hand.',
        examples: [
            {
                title: 'From the headings',
                why: '`data-kp-contents-for` names where the headings are (the nearest `main` by default), `data-kp-contents-headings` which ones count (`h2`; `h2, h3` nests the second under the first), `data-kp-contents-offset` the height of a sticky header in px (80), `data-kp-contents-min` the fewest entries that earn a list (2). A heading without an `id` gets one from its words. `kp-contents--sticky` keeps the list in view.',
                markup: `
<nav class="kp-contents" id="doc-contents" data-kp-contents data-kp-contents-for="#doc-contents-page" data-kp-contents-headings="h2, h3"></nav>
<div id="doc-contents-page">
<h2>Sign-in</h2>
<p>Who may open the dashboard.</p>
<h3>Passkeys</h3>
<p>The devices that can sign in.</p>
<h2>This browser</h2>
<p>What this browser remembers.</p>
</div>
`,
                script: `
import { attachContents } from '@kp-soft/themes/js/page-contents';

attachContents(document.getElementById('doc-contents').parentElement);
`,
            },
            {
                title: 'From items, with a count',
                why: 'Sections that are cards with no heading of their own, or that want a number beside the name: `setContents(nav, [{ id, label, level?, count? }])`. `setContents(nav, null)` goes back to the headings; `data-kp-state="loading"` shows three bars until the items arrive.',
                markup: `
<nav class="kp-contents" id="doc-contents-items" data-kp-contents data-kp-contents-min="1"></nav>
<section id="doc-card-a"><p>Working copy</p></section>
<section id="doc-card-b"><p>Keys</p></section>
`,
                script: `
import { attachContents, setContents } from '@kp-soft/themes/js/page-contents';

const nav = document.getElementById('doc-contents-items');
attachContents(nav.parentElement);
setContents(nav, [{ id: 'doc-card-a', label: 'Working copy' }, { id: 'doc-card-b', label: 'Keys', count: 3 }]);
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachContents(root)` builds every `[data-kp-contents]` and returns a detach; `setContents(nav, items)` gives it entries; `contents(nav)` is the handle (`current()`, `refresh()`, `setItems()`); `contentsSlug(text)` and `currentSection(boxes, offset, atEnd)` are the two calculations. `CONTENTS` is the selector.' },
            { name: 'kp-contents-change', what: 'Fired on the list, bubbling, when the current entry changes: `{ id, label, previous }` (`CONTENTS_EVENT`).' },
            { name: 'data-kp-contents-title', what: 'The heading over the list (“On this page”); `none` leaves it out.' },
            { name: 'data-kp-contents-hash', what: '`off`: a press does not write `#id` into the address.' },
            { name: 'kp-contents--sticky', what: 'Keeps the list in view beside a long page, a little under the top of the window.' },
            { name: 'states', what: 'Ready (the entries), loading (three bars in the list’s own place), and hidden when fewer than `data-kp-contents-min` entries exist.' },
        ],
        accessibility: [
            'Built in — a `nav` with a name and real links; the current entry has `aria-current="location"`; a press moves the focus to the heading; smooth scrolling is off under reduced motion.',
            'Yours — give the sections real headings (or ids), and an offset equal to a sticky header’s height.',
        ],
    };
