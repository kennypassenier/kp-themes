// Page descriptor for the "diff" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const diffDescriptor = {
        id: 'diff',
        title: 'Diff',
        group: 'Data',
        classes: ['kp-diff', 'kp-diffview'],
        exports: ['Diff'],
        intro: 'Two versions of a text side by side in one column: a line number, a sign, and the line. The sign has a column of its own, so the difference survives printing, high contrast, and a reader who cannot tell green from red.',
        whenToUse:
            'For showing what changed in something textual — a configuration, a record, a theme’s tokens. Not for a review tool with comments and threads, which is an application rather than a component. Not for two long documents: this is a rendering, not a diff algorithm.',
        examples: [
            {
                title: 'One line changed',
                why: 'Colour is the second carrier here, never the only one. Removing the tints leaves a diff that still reads correctly.',
                markup: `
<pre class="kp-diff">
<span class="kp-diff__line" data-kind="same"><span class="kp-diff__number">1</span><span class="kp-diff__sign"> </span><span>--background: 0 0% 100%;</span></span>
<span class="kp-diff__line" data-kind="removed"><span class="kp-diff__number">2</span><span class="kp-diff__sign">-</span><span>--primary: 220 90% 56%;</span></span>
<span class="kp-diff__line" data-kind="added"><span class="kp-diff__number">2</span><span class="kp-diff__sign">+</span><span>--primary: 220 90% 48%;</span></span>
</pre>
`,
            },
            {
                title: 'Two hunks, each with its @@ header',
                why: 'A hunk opens with a row of its own: the range (`@@ -a,b +c,d @@`) and, optionally, the place it sits in, wrapped in `.kp-diff__hunk-context` so the range reads as the quiet part. The header is a band with a rule under it, and a rule over it from the second hunk on.',
                markup: `
<pre class="kp-diff">
<div class="kp-diff__hunk">@@ -4,3 +4,3 @@ <span class="kp-diff__hunk-context">[retention]</span></div>
<span class="kp-diff__line" data-kind="same"><span class="kp-diff__number">4</span><span class="kp-diff__sign"> </span><span>keep_daily = 7</span></span>
<span class="kp-diff__line" data-kind="removed"><span class="kp-diff__number">5</span><span class="kp-diff__sign">-</span><span>keep_weekly = 4</span></span>
<span class="kp-diff__line" data-kind="added"><span class="kp-diff__number">5</span><span class="kp-diff__sign">+</span><span>keep_weekly = 8</span></span>
<div class="kp-diff__hunk">@@ -20,2 +20,2 @@ <span class="kp-diff__hunk-context">[target]</span></div>
<span class="kp-diff__line" data-kind="removed"><span class="kp-diff__number">20</span><span class="kp-diff__sign">-</span><span>path = /mnt/old</span></span>
<span class="kp-diff__line" data-kind="added"><span class="kp-diff__number">20</span><span class="kp-diff__sign">+</span><span>path = /mnt/backup</span></span>
</pre>
`,
            },
            {
                title: 'Several files, folded context, changed words',
                why: '`setDiff(el, { files })` draws a header per file (the status word on a badge, the path, exact counts), folds a long run of unchanged lines into one button row that opens in place, and marks the words that differ inside a replaced line. The app brings the hunks; `diffWords` and `foldContext` are pure functions you can call yourself.',
                markup: `
<div class="kp-diffview" data-kp-diffview data-kp-diff-label="Changes to the media stack" data-kp-diff-state="loading"></div>
`,
                script: `
import { attachDiffs, setDiff } from '@kp-soft/themes/js/diff';

const same = (no, text) => ({ kind: 'same', no, text });
const el = document.querySelector('[data-kp-diffview]');
attachDiffs(el.parentElement);
setDiff(el, {
    files: [
        {
            path: 'stacks/media/compose.yml',
            status: 'modified',
            hunks: [
                {
                    oldStart: 3, oldLen: 12, newStart: 3, newLen: 12, context: 'services:',
                    lines: [
                        same(3, 'services:'),
                        same(4, '  jellyfin:'),
                        { kind: 'removed', no: 5, text: '    image: jellyfin/jellyfin:10.11.11' },
                        { kind: 'added', no: 5, text: '    image: jellyfin/jellyfin:12.1.0' },
                        ...Array.from({ length: 8 }, (_, i) => same(6 + i, '    # kept line ' + (i + 1))),
                        same(14, '  sonarr:'),
                    ],
                },
            ],
        },
        { path: 'stacks/media/backup.sh', status: 'added', hunks: [{ oldStart: 0, oldLen: 0, newStart: 1, newLen: 2, lines: [{ kind: 'added', no: 1, text: '#!/bin/sh' }, { kind: 'added', no: 2, text: 'set -eu' }] }] },
    ],
});
`,
            },
        ],
        variants: [
            { name: 'data-kp-diff-open', what: '`all` (default), `first`, `none` or `changed`: which files start open. A file the reader opened or closed keeps its choice when the data is given again.' },
            { name: 'data-kp-diff-context', what: 'Unchanged lines kept next to each change before the rest folds (3); `0` or `off` folds nothing. A run that would hide fewer than 3 lines is not folded.' },
            { name: 'data-kp-diff-words', what: '`on` (default) or `off`: mark the changed words inside a replaced line (not past 60% of a line changed, nor in a line over 500 characters).' },
            { name: 'data-kp-diff-bar', what: '`on` (default) or `off`: the five blocks that show the share of added and removed lines in a file header.' },
            { name: 'data-kp-diff-copy', what: '`on` (default) or `off`: Copy path in each header.' },
            { name: 'data-kp-diff-max-lines', what: 'Lines drawn per file before “Show the other N lines” (400); `0` or `off` draws all.' },
            { name: 'data-kp-diff-label', what: 'The region’s accessible name.' },
            { name: 'data-kp-diff-state', what: '`loading`, `empty` or `error` before the first `setDiff`, so the first frame is already the waiting one. `setDiff(el, { state })` sets it later; empty, reading and failed keep the height the diff had.' },
            { name: '.kp-diff__fold', what: 'The row “12 unchanged lines”, a button across the diff’s three columns; open it says “Hide 12 unchanged lines”.' },
            { name: '.kp-diff__word', what: 'A changed word inside a line: bold and underlined when added, bold and struck through when removed, with a deeper tint.' },
            { name: '.kp-diff__hunk', what: 'The `@@` header row that opens a block of changes: a muted band with a rule under it, and a rule over it from the second hunk on. It wraps long headers instead of widening the block.' },
            { name: '.kp-diff__hunk-context', what: 'Optional: wraps the text after the range (the function or section the hunk sits in) in the foreground colour. A header may be one text node without it.' },
            { name: 'same', what: 'Context: no tint, a blank sign, the line as it is.' },
            { name: 'added', what: 'A wash of the success colour behind the line, and a plus in the sign column.' },
            { name: 'removed', what: 'A wash of the destructive colour, and a minus.' },
            { name: '.kp-diff__number', what: 'The line number, quiet, right-aligned, in same-width digits.' },
            { name: 'long lines', what: 'The block scrolls sideways inside its own boundary rather than widening the page.' },
            { name: 'long tokens', what: 'The text track is `minmax(0, 1fr)`: a long token wraps instead of running past the plate.' },
        ],
        accessibility: [
            'Built in — the sign is text in its own column, which is the carrier that survives without colour.',
            'Built in — the lines keep their whitespace, so indentation is part of what is compared.',
            'Yours — say what the two sides are above the block. “Added” and “removed” are relative to something.',
            'Yours — keep the numbers if the reader may need to point at a line.',
        ],
    };
