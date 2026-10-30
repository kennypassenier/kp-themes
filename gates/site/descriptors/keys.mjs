// Page descriptor for the "keys" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const keysDescriptor = {
        id: 'keys',
        title: 'Key line and key cap',
        group: 'Content',
        classes: ['kp-keys', 'kp-kbd'],
        exports: [],
        intro: 'A line of keyboard shortcuts on one line under a list or beside a control: key caps (`kbd.kp-kbd`) with what each does. The markup is complete without any script; `setKeys(el, pairs)` writes it from pairs, and `Mod` is the platform’s modifier, ⌘ on a Mac and Ctrl elsewhere, in the set form and in markup (`data-kp-key="mod"` on a cap).',
        whenToUse:
            'To tell a reader which keys work where they are looking. For a full list of every shortcut use the Help sheet (`.kp-shortcuts`), which is a boxed dialog; this is the line that sits in the page.',
        examples: [
            {
                title: 'Three shortcuts',
                why: 'Keys pressed together share a `.kp-keys__caps`. The Ctrl cap is filled with ⌘ on a Mac by `attachKeys`.',
                markup: `
<div class="kp-keys" role="group" aria-label="Keyboard shortcuts">
<span class="kp-keys__item"><kbd class="kp-kbd">/</kbd> search</span>
<span class="kp-keys__item"><span class="kp-keys__caps"><kbd class="kp-kbd">↑</kbd><kbd class="kp-kbd">↓</kbd></span> move</span>
<span class="kp-keys__item"><kbd class="kp-kbd" data-kp-key="mod">Ctrl</kbd><kbd class="kp-kbd">K</kbd> palette</span>
</div>
`,
            },
            {
                title: 'Written from pairs, at the end of its row',
                why: '`setKeys(el, pairs)` takes `[keys, words]` pairs (a key, or an array of keys pressed together) and writes the spans; `Mod` becomes ⌘ on a Mac and Ctrl elsewhere. The group is named by the dictionary’s `keysLabel` when it has no name of its own.',
                markup: `
<div class="kp-keys kp-keys--end" id="doc-keys-set"></div>
`,
                script: `
import { setKeys } from '@kp-soft/themes/js/keys';

setKeys(document.getElementById('doc-keys-set'), [
    ['/', 'search containers'],
    [['↑', '↓'], 'move'],
    [['Mod', 'K'], 'palette'],
]);
`,
            },
        ],
        variants: [
            { name: '.kp-kbd', what: 'One key cap: a small raised plate with the key’s text, in the page’s mono face.' },
            { name: '.kp-keys--end', what: 'The line sits at the end of its row instead of the start.' },
            { name: '.kp-keys__caps', what: 'Keys pressed together, kept side by side and never wrapped apart.' },
        ],
        accessibility: [
            'Built in — the line is a named group, and each cap is real text, so a screen reader reads “slash, search”.',
            'Yours — a cap only describes a shortcut; the page must bind the key, and a key that works only with a modifier must say so.',
        ],
    };
