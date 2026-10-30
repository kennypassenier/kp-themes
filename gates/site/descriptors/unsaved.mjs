// Page descriptor for the "unsaved" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const unsavedDescriptor = {
        id: 'unsaved',
        title: 'Unsaved changes bar',
        group: 'Forms',
        classes: ['kp-unsaved'],
        exports: [],
        aliases: ['changed', 'compact', 'dock', 'docked', 'keep', 'keep-exclude', 'now', 'placement', 'save-label', 'scroll-root', 'track', 'untracked', 'warn-leave', 'was'],
        intro: 'A bar that counts the rows you changed (“2 changes”), lists what was and what is, offers Save and Discard with Undo, and warns when you leave. It stands in the page header and, once the header is scrolled out of view, at the foot of the screen.',
        whenToUse: 'A settings or edit page whose changes are written together. For a single field that saves itself, use the field’s own state.',
        examples: [
            {
                title: 'In a page header',
                why: 'The bar watches the form and marks the changed rows; the page answers Save.',
                markup: `
<div class="kp-unsaved" data-kp-unsaved data-kp-unsaved-for="#settings" data-kp-name="settings"></div>
`,
            },
            {
                title: 'A settings form with a bar that counts',
                why: 'The bar watches the form named by `data-kp-unsaved-for` and marks each row you edit with `data-kp-changed`; it lists `Retention  30 → 90` with a Revert on each line and a link to the row. Save fires the cancelable `kp-unsaved-save` with `{ changes }` and puts the spinner in Save; the page answers with `unsavedSaved(el, { refused: { Label: why } })`: what went through stops counting, what was refused stays marked and the bar says why. Discard puts every value back and offers Undo for `data-kp-undo-ms`. Ctrl or Cmd+S saves.',
                markup: `
<div class="kp-card">
<div class="kp-unsaved" id="doc-unsaved-bar" data-kp-unsaved data-kp-unsaved-for="#doc-unsaved-form" data-kp-name="doc-unsaved" data-kp-keep="off" data-kp-warn-leave="off" data-kp-placement="header"></div>
<div id="doc-unsaved-form" class="kp-formrows kp-formrows--lines" role="group" aria-label="Backup settings">
<div class="kp-formrow"><label class="kp-formrow__label" for="doc-un-ret">Retention</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-un-ret" name="retention" value="30" /><p class="kp-field__help">Days of nightly copies to keep (at most 60).</p></div></div>
<div class="kp-formrow"><label class="kp-formrow__label" for="doc-un-time">Backup time</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-un-time" name="time" value="03:00" /></div></div>
<div class="kp-formrow"><label class="kp-formrow__label" for="doc-un-mail">Report to</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-un-mail" name="mail" value="ops@example.com" /></div></div>
</div>
</div>
`,
                script: `
import { unsavedSaved } from '@kp-soft/themes/js/unsaved';

const bar = document.getElementById('doc-unsaved-bar');
// Two edits already made, so the bar starts out with something to say.
for (const [id, value] of [['doc-un-ret', '90'], ['doc-un-time', '04:30']]) {
    const input = document.getElementById(id);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
}
bar.addEventListener('kp-unsaved-save', (event) => {
    const refused = {};
    for (const change of event.detail.changes) {
        if (change.key === 'Retention' && Number(change.now) > 60) refused.Retention = 'At most 60 days.';
    }
    setTimeout(() => unsavedSaved(bar, { refused }), 600);
});
`,
            },
            {
                title: 'At the foot of a scrolling area',
                why: '`data-kp-placement="sticky-bottom"` (or `header+sticky`, the default, which moves to the foot once the header is out of view) puts the bar at the foot of the screen. `data-kp-dock="container"` docks it inside the nearest positioned ancestor instead of the viewport, and `data-kp-scroll-root` names the box that scrolls, here a panel of its own. `data-kp-track="app"` leaves marking the rows to the page; `data-kp-save-label` changes the words of Save.',
                markup: `
<div class="kp-card" id="doc-unsaved-scroller" style="position: relative; block-size: 18rem; overflow: auto">
<div class="kp-unsaved" id="doc-unsaved-foot" data-kp-unsaved data-kp-unsaved-for="#doc-unsaved-long" data-kp-name="doc-unsaved-foot" data-kp-keep="off" data-kp-warn-leave="off" data-kp-placement="sticky-bottom" data-kp-dock="container" data-kp-scroll-root="#doc-unsaved-scroller" data-kp-save-label="Apply {n} changes"></div>
<div id="doc-unsaved-long" class="kp-formrows kp-formrows--lines" role="group" aria-label="Host settings">
<div class="kp-formrow"><label class="kp-formrow__label" for="doc-ul-1">Host name</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-ul-1" name="host" value="media-01" /></div></div>
<div class="kp-formrow"><label class="kp-formrow__label" for="doc-ul-2">Domain</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-ul-2" name="domain" value="home.example.com" /></div></div>
<div class="kp-formrow"><label class="kp-formrow__label" for="doc-ul-3">Timezone</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-ul-3" name="zone" value="Europe/Brussels" /></div></div>
<div class="kp-formrow"><label class="kp-formrow__label" for="doc-ul-4">Log level</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-ul-4" name="level" value="info" /></div></div>
<div class="kp-formrow"><label class="kp-formrow__label" for="doc-ul-5">Retention</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-ul-5" name="keep" value="30" /></div></div>
<div class="kp-formrow"><label class="kp-formrow__label" for="doc-ul-6">Contact</label><div class="kp-formrow__control"><input class="kp-field__input" id="doc-ul-6" name="contact" value="ops@example.com" /></div></div>
</div>
</div>
`,
                script: `
const input = document.getElementById('doc-ul-5');
input.value = '45';
input.dispatchEvent(new Event('input', { bubbles: true }));
`,
            },
        ],
        variants: [
            { name: 'data-kp-placement', what: '`header+sticky` (default), `header` or `sticky-bottom`.' },
            { name: 'data-kp-dock', what: '`viewport` (default) or `container`, with `data-kp-scroll-root`.' },
            { name: 'data-kp-track', what: '`auto` (default) marks the rows as they are edited; `app` leaves it to the page.' },
            { name: 'data-kp-warn-leave', what: '`both` (default), `browser`, `app` or `off`.' },
            { name: 'data-kp-keep', what: '`session` (default) keeps the changes through a reload; `off`.' },
            { name: 'data-kp-undo-ms', what: 'How long Undo is offered after Discard; 6000, 0 for none.' },
            { name: 'data-kp-save-label', what: 'The Save words, `{n}` for the count.' },
            { name: 'configureUnsaved({ storage }) / attachUnsaved(root, { storage })', what: 'Where the changes are kept: any object with `getItem`, `setItem` and `removeItem`, so a page that must not touch the browser’s session storage hands over its own.' },
            { name: 'data-kp-keep="local"', what: '`local` keeps the changes through closing the browser as well as a reload (`session`, the default, keeps them through a reload only).' },
        ],
        accessibility: [
            'Built in — the count is announced politely, Save and Discard say why they are off, the list is a dialog with Esc, a refused save is an alert, Ctrl or Cmd+S saves.',
            'Yours — answer `kp-unsaved-save` with `unsavedSaved`, and name the rows (`.kp-formrow__label`): the list uses them.',
        ],
    };
