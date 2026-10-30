// Page descriptor for the "deplist" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const deplistDescriptor = {
        id: 'deplist',
        title: 'Dependency list',
        group: 'Data',
        classes: ['kp-deplist'],
        aliases: ['cols', 'dep'],
        exports: [],
        intro: 'A short list of rows “paperless → postgres” that says what needs what, numbered in the order things must go. Every row is the same columns, each name carries its identity mark, a cycle is one red row, and the list folds past eight rows with an exact “Show all 23”.',
        whenToUse: 'Before a change: who notices if this app stops or updates. Not for a picture of the whole network (a graph) and not for progress (a step list).',
        examples: [
            {
                title: 'Who needs whom',
                why: 'The rows come from the page; the list orders them so a thing stands after what it needs, and numbers them.',
                markup: `
<div class="kp-deplist" data-kp-deplist id="doc-deplist" data-kp-dep-heading="{n} stacks reach these apps"></div>
`,
                script: `
import { setDeplist } from '@kp-soft/themes/js/deplist';
setDeplist(document.getElementById('doc-deplist'), [
    { from: 'paperless', to: 'postgres' },
    { from: 'immich', to: 'paperless' },
    { from: 'immich', to: 'redis' },
]);
`,
            },
            {
                title: 'Grouped, with states, a cycle and a copy button',
                why: 'With `data-kp-dep-order="none"` the rows stand in the order given and `data-kp-dep-group="by-to"` groups them under the app that changes; `data-kp-dep-states` puts a word and a tone beside each needed thing; `data-kp-dep-copy` adds a button that copies the rows as text. A cycle (paperless needs redis needs paperless) is never looped: it is one destructive row, unnumbered, naming each thing in it.',
                markup: `
<div class="kp-deplist" data-kp-deplist id="doc-deplist-more" data-kp-dep-order="none" data-kp-dep-group="by-to" data-kp-dep-states data-kp-dep-copy data-kp-dep-heading="{n} rows" data-kp-dep-arrow="⇒"></div>
`,
                script: `
import { setDeplist } from '@kp-soft/themes/js/deplist';
setDeplist(document.getElementById('doc-deplist-more'), [
    { from: 'paperless', to: 'postgres', state: 'running' },
    { from: 'immich', to: 'postgres', state: 'running' },
    { from: 'immich', to: 'redis', state: 'stopped' },
    { from: 'paperless', to: 'redis', state: 'running' },
    { from: 'redis', to: 'paperless' },
]);
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachDeplists(root)` wires every `[data-kp-deplist]` and returns a detach; `setDeplist(el, items)` hands over the rows (`{ from, to, state }`); `deplist(el)` answers the handle; `orderDependencies(items, { numbers })` and `depText(items)` are the ordering and the copy text on their own. `DEPLIST` is the selector, `DEPLIST_COLLAPSE` (8) the default behind `data-kp-dep-collapse`, and `DEPLIST_RETRY_EVENT` is `kp-deplist-retry`.' },
            { name: 'data-kp-dep-direction / -arrow / -link / -self / -empty / -heading / -copy / -rows', what: 'Whose sentence it is (`from-needs-to` default, or `from-reaches-to`); the arrow glyph; a template for each name’s page (`{name}`); whether a thing lists itself (`hide` default or `show`); the sentence of an empty list; the heading with the exact count (`{n}`); a button that copies the rows as text; and the least rows the list stands as high as in a state (3).' },
            { name: '.kp-deplist__heading / __body / __list / __row / __group', what: 'The heading (a polite live region with the exact count), the body, the ordered list, one row and a group heading.' },
            { name: '.kp-deplist__no / __name / __name--to / __text / __arrow / __state', what: 'The cells of a row, the same columns in every row: the number, the thing that needs, the thing needed (`__name--to`), the words of the row for a screen reader, the arrow and the state (a `.kp-badge`).' },
            { name: '.kp-deplist__cycle / __foot / __more / __copy / __bone / __busy', what: 'The destructive row of a cycle (a `.kp-alert--destructive`), the foot with “Show all 23” (`__more`) and the copy button, the placeholder rows and the busy card of a loading list.' },
            { name: 'data-kp-dep-order', what: '`numbers` (default: one row per step, numbered 1, 2, 3) or `none` (the order given).' },
            { name: 'data-kp-dep-group', what: '`by-to` or `by-from` with `data-kp-dep-order="none"`: rows grouped under the app that changes.' },
            { name: 'data-kp-dep-states', what: 'A word and a tone beside each needed thing: running, stopped or unknown.' },
            { name: 'data-kp-dep-collapse', what: 'How many rows show before “Show all N”; 8 by default.' },
            { name: 'data-kp-state', what: '`loading` (the busy card over placeholder rows), `empty` and `error` (the package’s plates with Retry), each as high as the list was.' },
            { name: 'state badges', what: 'The state badges are one column of one width, with a least width for the narrow layout.' },
        ],
        accessibility: [
            'Built in — an ordered list; each row reads as one sentence (“paperless needs postgres”), the arrow is hidden from a screen reader; the heading is a polite live region with the exact count.',
            'Yours — pass real data (`from`, `to`) and a heading that says what the rows are.',
        ],
    };
