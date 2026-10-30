// Page descriptor for the "shortcut-sheet" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const shortcutSheetDescriptor = {
        id: 'shortcut-sheet',
        title: 'Shortcut sheet',
        group: 'Navigation',
        classes: ['kp-shortcuts', 'kp-shortcuts-pending'],
        exports: ['ShortcutSheet'],
        aliases: ['hotkey', 'shortcut'],
        intro: 'The dialog that lists what the keys do — the page every application with shortcuts owes its readers, and the one that is usually a paragraph in a help centre.',
        whenToUse:
            'As soon as the application has keys worth learning. Not as the only place the keys appear: a shortcut is most useful printed next to the command it repeats, which is what the palette’s key hints are for.',
        examples: [
            {
                title: 'A sheet with two groups, left open',
                why: 'Shown open here; in an application it opens on its own key. The rows are a definition list, so each key is read together with what it does.',
                markup: `
<dialog class="kp-shortcuts" data-kp-shortcuts data-kp-hotkey="none" aria-label="Keyboard shortcuts" open>
<h2 class="kp-dialog__title">Keyboard shortcuts</h2>
<section class="kp-shortcuts__group">
<h3 class="kp-shortcuts__group-label">Anywhere</h3>
<dl class="kp-shortcuts__list">
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">Ctrl K</kbd></dt><dd>Open the commands</dd></div>
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">?</kbd></dt><dd>Show this sheet</dd></div>
</dl>
</section>
<section class="kp-shortcuts__group">
<h3 class="kp-shortcuts__group-label">In a list</h3>
<dl class="kp-shortcuts__list">
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">J</kbd></dt><dd>Next row</dd></div>
<div class="kp-shortcuts__row"><dt><kbd class="kp-palette__keys">K</kbd></dt><dd>Previous row</dd></div>
</dl>
</section>
</dialog>
`,
            },
            {
                title: 'A sheet filled from the keys the page registers',
                why: '`registerShortcuts(scope, list, options)` handles the keys and fills every sheet marked `data-kp-shortcuts-live` from the same list, so the sheet cannot promise a key that does nothing. A `keys` chord is steps separated by spaces (`g s`; `Mod K`, where Mod is Ctrl or ⌘). A letter never fires while someone types in a field. `when` switches a shortcut off and the sheet shows it dimmed with its `reason` (`.kp-shortcuts__row--off`, `__reason`); a scope may be an element, so a table’s `j` and `k` live only while the table is on screen. On the sheet, `data-kp-shortcuts-reserved-group` renames the fixed group, `data-kp-shortcuts-group` orders the groups and `data-kp-shortcuts-scope` lists only some scopes. It returns a function that takes the keys away.',
                markup: `
<div class="kp-row">
<button class="kp-button" type="button" id="doc-keys-open">Show the sheet</button>
<button class="kp-button" type="button" id="doc-keys-lock">Lock the stacks</button>
</div>
<p class="kp-text-muted" id="doc-keys-log" aria-live="polite">Press g then s, or ?.</p>
<dialog class="kp-shortcuts" id="doc-keys-sheet" data-kp-shortcuts data-kp-shortcuts-live data-kp-shortcuts-reserved-group="Everywhere" data-kp-shortcuts-group="Navigation,Stacks" aria-label="Keyboard shortcuts">
<h2 class="kp-dialog__title">Keyboard shortcuts</h2>
</dialog>
`,
                script: `
import { configureShortcuts, listShortcuts, registerShortcuts, renderShortcutSheet } from '@kp-soft/themes/js/shortcuts';

const log = document.getElementById('doc-keys-log');
const sheet = document.getElementById('doc-keys-sheet');
let locked = false;
configureShortcuts({ unknownHint: true, layoutGuard: 'warn', chordMs: 1500 });
registerShortcuts('doc-page', [
    { keys: 'g s', what: 'Go to Stacks', group: 'Navigation', run: () => { log.textContent = 'Went to Stacks.'; } },
    { keys: 'g h', what: 'Go to Host', group: 'Navigation', run: () => { log.textContent = 'Went to Host.'; } },
    {
        keys: 'r',
        what: 'Restart the stack',
        group: 'Stacks',
        when: () => !locked,
        reason: 'The stacks are locked.',
        run: () => { log.textContent = 'Restarting.'; },
    },
]);
document.getElementById('doc-keys-open').addEventListener('click', () => {
    renderShortcutSheet(sheet);
    sheet.showModal();
});
document.getElementById('doc-keys-lock').addEventListener('click', (event) => {
    locked = !locked;
    event.currentTarget.textContent = locked ? 'Unlock the stacks' : 'Lock the stacks';
    log.textContent = listShortcuts().length + ' shortcuts registered; the stacks are ' + (locked ? 'locked' : 'open') + '.';
});
`,
            },
        ],
        variants: [
            { name: '.kp-shortcuts', what: 'The dialog, narrower than the palette because a key and a sentence need less room.' },
            { name: '.kp-shortcuts__list', what: 'The definition list, with room above and below.' },
            { name: '.kp-shortcuts__row', what: 'One pair: the keys in a fixed column, the description beside them in quiet ink.' },
            { name: '.kp-shortcuts__group-label', what: 'A small heading over a group of rows, for a sheet long enough to need sections.' },
            { name: '.kp-shortcuts-pending', what: 'The hint the shortcut engine shows after the first key of a chord: the keys pressed so far and what can follow, until the chord completes or times out.' },
            { name: 'data-kp-shortcuts-hint', what: 'On <html>: where that hint stands, `centre` (the default, the middle of what is in view) or `bottom-centre` (the middle of its foot); `configureShortcuts({ hintPlace })` does the same. Switched at runtime; never the top.' },
            { name: 'data-kp-shortcuts-place', what: 'Written by the engine on the hint itself, `centre` or `bottom-centre`, from the option above; the stylesheet places the hint by it.' },
            { name: 'data-kp-shortcuts-live', what: 'On the sheet: the engine fills it from the shortcuts registered, grouped, with the reserved group first.' },
            { name: 'data-kp-shortcuts-scope / -group', what: 'On the sheet: list only the shortcuts of those scope names (comma separated), or only those groups, in that order.' },
            { name: 'data-kp-shortcuts-reserved-group / -empty', what: 'The name of the group of fixed keys (Anywhere by default); `off` leaves out the line shown when nothing is registered.' },
            { name: 'pastel', what: 'In pastel the sheet opens as pastel’s dialog: its pass on its ::backdrop, the landing onto it; it closes as that opening backwards.' },
        ],
        accessibility: [
            'Built in — the dialog gives the focus trap, Escape and focus return; the sheet adds nothing to them.',
            'Yours — mark the keys as keyboard input so they are read as keys.',
            'Yours — offer a way to open the sheet that is not itself a shortcut, or it can only be found by people who already know.',
            'Yours — keep the list current. A sheet that lies is worse than none.',
        ],
    };
