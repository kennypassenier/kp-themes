// Page descriptor for the "empty-state" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const emptyStateDescriptor = {
        id: 'empty-state',
        title: 'Empty state',
        group: 'Data',
        classes: ['kp-empty', 'kp-art'],
        aliases: ['art'],
        exports: ['EmptyState'],
        intro: 'A bordered box that says a list is empty, and which emptiness it is: nothing yet, or nothing that matched. A blank area says the page is broken instead.',
        whenToUse:
            'Wherever a list, a table or a search can come back with nothing. Not as an error message — a failed request is an alert, because the reader can do something about it. Not for a section that is empty by design, where a sentence in the ordinary prose is enough.',
        examples: [
            {
                title: 'Nothing yet, and nothing found',
                why: '“No applications yet” and “nothing matched your filter” are different messages, and offering “create one” to somebody who just typed a filter is noise.',
                markup: `
<div class="kp-empty">
<p class="kp-empty__title">No applications yet</p>
<p class="kp-empty__body">Applications you send appear here.</p>
<button type="button" class="kp-button kp-button--primary">New application</button>
</div>
<div class="kp-empty">
<p class="kp-empty__title">Nothing matched</p>
<p class="kp-empty__body">No application matches “bakery”.</p>
<button type="button" class="kp-button">Clear the filter</button>
</div>
`,
            },
            {
                title: 'With a drawing of what kind of empty it is',
                why: '`data-kp-art` puts a small line drawing at the top, in the theme’s own hand: none, nomatch, error, offline, done or locked. It is a picture only; the title and the sentence carry the meaning. A theme shows its own set, and a theme without one shows none.',
                markup: `
<div class="kp-empty" data-kp-art="done">
<p class="kp-empty__title">All clear</p>
<p class="kp-empty__body">No follow-up is due this week.</p>
</div>
`,
            },
            {
                title: 'The six drawings, in three sizes',
                why: '`attachArt(root)` in js/art.js draws the picture at the top of every `[data-kp-art]` and returns a detach; `drawArt` makes one drawing and `ART`, `ART_KINDS` and `ART_SETS` are exported. The kind says which emptiness it is; `data-kp-art-size` is `sm`, the default or `lg`. Only formal has a set so far (the ledger: a ruled page, an entry struck through in red ink, the account closed with the double rule); every other theme shows no drawing until its own set is drawn and approved, so the sentence under it has to carry the meaning alone. Switch to formal to see them.',
                markup: `
<div class="kp-stack" id="doc-art">
<div class="kp-empty" data-kp-art="none"><p class="kp-empty__title">None yet</p><p class="kp-empty__body">Nothing has been added.</p></div>
<div class="kp-empty" data-kp-art="nomatch"><p class="kp-empty__title">Nothing matched</p><p class="kp-empty__body">No row fits the filter.</p></div>
<div class="kp-empty" data-kp-art="error"><p class="kp-empty__title">Could not be read</p><p class="kp-empty__body">The list did not load.</p></div>
<div class="kp-empty" data-kp-art="offline"><p class="kp-empty__title">Offline</p><p class="kp-empty__body">The connection is gone.</p></div>
<div class="kp-empty" data-kp-art="done" data-kp-art-size="sm"><p class="kp-empty__title">All clear (sm)</p><p class="kp-empty__body">Nothing is left to do.</p></div>
<div class="kp-empty" data-kp-art="locked" data-kp-art-size="lg"><p class="kp-empty__title">Not for you (lg)</p><p class="kp-empty__body">There is something here, and you may not see it.</p></div>
</div>
`,
                script: `
import { attachArt } from '@kp-soft/themes/js/art';

attachArt(document.getElementById('doc-art'));
`,
            },
        ],
        variants: [
            { name: 'attachArt / drawArt', what: '`attachArt(root)` draws the picture in every `[data-kp-art]` and returns a detach that takes the drawings out again; `drawArt` makes one. `ART` is the selector, `ART_KINDS` the six kinds and `ART_SETS` the sets: one `<g data-kp-art-set>` each, of which the theme’s register shows its own.' },
            { name: '.kp-art__rule / __line / __ink / __red', what: 'The strokes of a drawing: a faint ruled line, an outline, the page’s ink and the destructive ink. Each theme draws its own set with them; a theme that has none shows no drawing.' },
            { name: '.kp-empty', what: 'The box on its own: a dashed boundary and quiet ink, for a one-line emptiness with nothing to offer.' },
            { name: '.kp-empty__title', what: 'The line that names the emptiness, in the page’s full ink so it is not mistaken for help text.' },
            { name: '.kp-empty__body', what: 'One sentence under it, saying what would put something here.' },
            { name: 'filtered', what: 'The same box in its other state, with the action that clears the filter instead of the one that creates a first item.' },
            { name: 'as a heading', what: 'The title can be rendered as a real heading where the empty state stands for a whole section.' },
            { name: 'data-kp-art', what: 'A drawing at the top (`.kp-art`, js/art.js `attachArt`): `none`, `nomatch`, `error`, `offline`, `done` or `locked`, in the theme’s own set (`data-kp-art-set`; formal’s is the ledger), ruled in on arrival where the theme moves. `data-kp-art-kind` on the drawing says which.' },
            { name: 'data-kp-art-size', what: '`sm` (5rem) or `lg` (10rem) instead of 7.5rem.' },
        ],
        accessibility: [
            'Built in — the title is text in the page’s own ink rather than a picture of a shrug, so it is read out like any other message.',
            'Yours — put the empty state where the list was, so a reader who moved focus into the list is not left with nothing.',
            'Yours — announce the change if the list emptied because of something the reader typed; the box appearing is silent on its own.',
            'Yours — offer one action, and only the one that fits the emptiness in front of you.',
        ],
    };
