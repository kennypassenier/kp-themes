// Page descriptor for the "lede" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const ledeDescriptor = {
        id: 'lede',
        title: 'Lede',
        group: 'Content',
        classes: ['kp-lede'],
        exports: [],
        intro: 'The short paragraph under a heading that says what the section does. The markup works without the script; the script ties the lede to its heading for a screen reader, folds a long one behind “More”, adds a “Learn more” link and lists headings that have no lede.',
        whenToUse: 'Under every card title and page section, in plain words. For a note about one field use the field’s help text; for a warning use the alert.',
        examples: [
            {
                title: 'A lede under a card title',
                why: 'One sentence of what it does and what pausing means.',
                markup: `
<h2 id="schedules">Schedules</h2>
<p class="kp-lede">Each schedule starts a job at fixed times. Pause one to stop it without deleting it.</p>
`,
            },
            {
                title: 'Measure, tone, a long text folded and a Learn more link',
                why: '`data-kp-lede-measure` is `narrow` (48ch), `normal` (70ch, the default) or `full`; `data-kp-lede-tone="plain"` uses the body ink instead of the quiet one. A lede longer than about N characters (`data-kp-lede-collapsible="140"`, or the bare attribute) shows its first sentences and folds the rest behind More and Less, and `data-kp-lede-link` adds a Learn more link at the end (on a lede of its own: a folded lede takes no link). Both need the module attached; the heading is described by its lede, so a screen reader reads them together. The knobs are `--kp-lede-measure` and `--kp-lede-size`.',
                markup: `
<div class="kp-stack">
<div><h3 class="kp-fw-semibold" id="doc-lede-narrow">A narrow lede</h3><p class="kp-lede" data-kp-lede-measure="narrow">Each schedule starts a job at fixed times. Pause one to stop it without deleting it.</p></div>
<div><h3 class="kp-fw-semibold" id="doc-lede-plain">A plain full-width lede</h3><p class="kp-lede" data-kp-lede-measure="full" data-kp-lede-tone="plain">This one runs the full width of its place and uses the body ink, for a page whose first sentence is the point.</p></div>
<div><h3 class="kp-fw-semibold" id="doc-lede-long">A long lede that folds</h3><p class="kp-lede" data-kp-lede-collapsible="100">Backups are made every night at 03:00 and kept for thirty days. A backup that fails is tried again an hour later, and a second failure sends a message to the person on duty. Restoring is always done from the newest backup that passed its check, never from one that was only copied.</p></div>
<div><h3 class="kp-fw-semibold" id="doc-lede-link">A lede with a link</h3><p class="kp-lede" data-kp-lede-link="https://example.com/help/restore">Restoring puts a backup back on the disk it came from.</p></div>
</div>
`,
            },
            {
                title: 'The reason under a field, and headings with no lede',
                why: '`.kp-field__why` is the reason line under a field, in the field help’s size; `data-kp-blocking` turns it into the destructive ink for a reason that stops the form. `missingLedes(root)` lists the headings of `.kp-card__title`, and of every heading inside a container marked `data-kp-lede-required`, that have no lede after them; `attachLedes()` warns about them in the console.',
                markup: `
<div class="kp-stack">
<div class="kp-field">
<label class="kp-field__label" for="doc-lede-key">API key</label>
<input class="kp-field__input" id="doc-lede-key" value="" aria-describedby="doc-lede-why" />
<p class="kp-field__why" id="doc-lede-why">Needed to read the backups; ask the person on duty.</p>
</div>
<div class="kp-field">
<label class="kp-field__label" for="doc-lede-days">Retention</label>
<input class="kp-field__input" id="doc-lede-days" value="400" aria-describedby="doc-lede-days-why" />
<p class="kp-field__why" id="doc-lede-days-why" data-kp-blocking>At most 365 days; the disk cannot hold more.</p>
</div>
<section id="doc-lede-audit" data-kp-lede-required>
<h3 class="kp-fw-semibold">Has a lede</h3>
<p class="kp-lede">This section says what it is for.</p>
<h3 class="kp-fw-semibold">Has none</h3>
</section>
<p class="kp-text-muted" id="doc-lede-log" aria-live="polite"></p>
</div>
`,
                script: `
import { missingLedes } from '@kp-soft/themes/js/lede';

const missing = missingLedes(document.getElementById('doc-lede-audit'));
document.getElementById('doc-lede-log').textContent =
    missing.length + ' heading without a lede: ' + missing.map((heading) => heading.textContent).join(', ') + '.';
`,
            },
        ],
        variants: [
            { name: 'data-kp-lede-measure', what: '`narrow` (48ch), `normal` (70ch, default) or `full`.' },
            { name: 'data-kp-lede-tone', what: '`muted` (default) or `plain`.' },
            { name: 'data-kp-lede-collapsible', what: 'A lede longer than about N characters (140 by default) shows its first sentences and folds the rest behind More and Less.' },
            { name: 'data-kp-lede-link', what: 'A URL: a “Learn more” link at the end.' },
            { name: 'data-kp-lede-required', what: 'On a container: every heading inside it must have a lede, and `missingLedes` lists the ones that do not. Card titles are always checked.' },
            { name: 'data-kp-blocking', what: 'On a `.kp-field__why` line: the reason stops the form, so it is written in the destructive ink instead of the quiet one.' },
            { name: 'collapsible with a link', what: 'A lede with `data-kp-lede-collapsible` and `data-kp-lede-link` folds, and Learn more stands at the end after the folded part.' },
            { name: 'switchable at runtime', what: 'Switchable at runtime: changing `data-kp-lede-collapsible` or `data-kp-lede-link` redraws the lede.' },
        ],
        accessibility: [
            'Built in — the heading is described by its lede (`aria-describedby`), so it is read with the heading; a folded lede’s button says what it will do.',
            'Yours — write the lede in the user’s words and keep it to one or two sentences.',
        ],
    };
