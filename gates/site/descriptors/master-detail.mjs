// Page descriptor for the "master-detail" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const masterDetailDescriptor = {
        id: 'master-detail',
        title: 'Master and detail panes',
        group: 'Structure',
        classes: ['kp-pane'],
        exports: [],
        aliases: ['master-detail', 'aside', 'narrow', 'fold-at', 'resizable', 'selected'],
        intro: 'A list and its detail side by side, folding to one pane on a phone. It extends the split with fixed columns: the list, the detail and an optional aside. The detail has four states, and an empty or failed area is drawn with the shared state plate: centred, at the heading size, filling the whole pane.',
        whenToUse: 'A page with a list of things and the thing itself: secrets, dossiers, messages. For a draggable divider alone use the split; for a table use the data table.',
        examples: [
            {
                title: 'A list and its detail',
                why: 'The panes are marked by `data-kp-pane`. Choosing an item fires `kp-pane-select`; the page draws the detail itself and reports its state with `setPaneState`.',
                markup: `
<div class="kp-split kp-split--panes" data-kp-master-detail data-kp-pane-widths="14rem 1fr">
<section class="kp-split__pane" data-kp-pane="list" aria-label="Secrets">
<ul class="kp-pane__list" role="listbox" aria-label="Secrets">
<li role="option" data-kp-pane-key="db">Database</li>
<li role="option" data-kp-pane-key="smtp">Mail server</li>
</ul>
</section>
<section class="kp-split__pane" data-kp-pane="detail" aria-label="Secret">
<h2 data-kp-pane-heading tabindex="-1">Database</h2>
<div class="kp-pane__body"><p>Rotated on 12/10/2026.</p></div>
</section>
</div>
`,
            },
            {
                title: 'The detail in each state',
                why: '`setPaneState(root, state, options)` puts the detail in `empty`, `loading`, `error` or `ready` (`selectPane`, `openPane` and `closePane` move the selection by key). Three layouts below, one state each: the empty plate asks to pick an item, the busy card lies over the detail only while the list stays usable, and the failed plate fills the pane with a normal-size Retry that fires `kp-pane-retry`.',
                markup: `
<div class="kp-stack kp-gap-md" id="doc-panes-states">
<div class="kp-split kp-split--panes" data-kp-master-detail data-kp-pane-widths="12rem 1fr" data-kp-pane-history="off" id="doc-panes-empty" style="min-block-size: 11rem">
<section class="kp-split__pane" data-kp-pane="list" aria-label="Secrets"><ul class="kp-pane__list" role="listbox" aria-label="Secrets"><li role="option" data-kp-pane-key="db">Database</li><li role="option" data-kp-pane-key="smtp">Mail server</li></ul></section>
<section class="kp-split__pane" data-kp-pane="detail" aria-label="Secret"><h2 data-kp-pane-heading tabindex="-1"></h2><div class="kp-pane__body"></div></section>
</div>
<div class="kp-split kp-split--panes" data-kp-master-detail data-kp-pane-widths="12rem 1fr" data-kp-pane-history="off" id="doc-panes-loading" style="min-block-size: 11rem">
<section class="kp-split__pane" data-kp-pane="list" aria-label="Secrets"><ul class="kp-pane__list" role="listbox" aria-label="Secrets"><li role="option" data-kp-pane-key="db">Database</li><li role="option" data-kp-pane-key="smtp">Mail server</li></ul></section>
<section class="kp-split__pane" data-kp-pane="detail" aria-label="Secret"><h2 data-kp-pane-heading tabindex="-1">Database</h2><div class="kp-pane__body"></div></section>
</div>
<div class="kp-split kp-split--panes" data-kp-master-detail data-kp-pane-widths="12rem 1fr" data-kp-pane-history="off" id="doc-panes-error" style="min-block-size: 11rem">
<section class="kp-split__pane" data-kp-pane="list" aria-label="Secrets"><ul class="kp-pane__list" role="listbox" aria-label="Secrets"><li role="option" data-kp-pane-key="db">Database</li><li role="option" data-kp-pane-key="smtp">Mail server</li></ul></section>
<section class="kp-split__pane" data-kp-pane="detail" aria-label="Secret"><h2 data-kp-pane-heading tabindex="-1">Database</h2><div class="kp-pane__body"></div></section>
</div>
</div>
`,
                script: `
import { attachMasterDetails, setPaneState } from '@kp-soft/themes/js/master-detail';

attachMasterDetails(document.getElementById('doc-panes-states'));
setPaneState(document.getElementById('doc-panes-empty'), 'empty');
setPaneState(document.getElementById('doc-panes-loading'), 'loading', { words: 'Reading the secret…' });
setPaneState(document.getElementById('doc-panes-error'), 'error', { title: 'Could not read the secret', text: 'The vault did not answer.' });
`,
            },
            {
                title: 'A failure the detail already shows itself',
                why: 'Which plate wins: the innermost component\'s own. A data component in the detail (here a code block) draws its own failed plate with its own Retry for its own failure, and `setPaneState(root, \'error\')` then draws nothing over it: the master-detail stays usable and the component\'s Retry stays reachable. The master-detail\'s own plate, over the whole master-detail with `kp-pane-retry`, is only for a failure no component in the detail owns, as in the example above.',
                markup: `
<div class="kp-split kp-split--panes" data-kp-master-detail data-kp-pane-widths="12rem 1fr" data-kp-pane-history="off" id="doc-panes-own" style="min-block-size: 14rem">
<section class="kp-split__pane" data-kp-pane="list" aria-label="Messages"><ul class="kp-pane__list" role="listbox" aria-label="Messages"><li role="option" data-kp-pane-key="m1">Message 1</li><li role="option" data-kp-pane-key="m2">Message 2</li></ul></section>
<section class="kp-split__pane" data-kp-pane="detail" aria-label="Message"><h2 data-kp-pane-heading tabindex="-1">Message 1</h2><div class="kp-pane__body"><figure id="doc-panes-own-code" data-kp-code data-kp-code-title="Payload"></figure></div></section>
</div>
`,
                script: `
import { attachMasterDetails, setPaneState } from '@kp-soft/themes/js/master-detail';
import { setCode } from '@kp-soft/themes/js/code';

setCode(document.getElementById('doc-panes-own-code'), { state: 'error', message: 'The payload could not be read' });
attachMasterDetails(document.getElementById('doc-panes-own'));
setPaneState(document.getElementById('doc-panes-own'), 'error');
`,
            },
            {
                title: 'The state plate on its own',
                why: 'An empty or failed area anywhere is drawn with `statePlate(doc, { kind, title, text, actionLabel, onAction })` (js/state-plate.js): `kind: \'empty\'` is the package’s empty plate, `kind: \'error\'` the destructive alert; both carry `.kp-stateplate`, which centres the words in the whole box it is given and sets the title at the heading size. The action is a normal-size button, `.kp-stateplate__action` at the control size, never a strip.',
                markup: `
<div class="kp-stack kp-gap-md">
<div id="doc-plate-empty" style="display: grid; min-block-size: 9rem"></div>
<div id="doc-plate-error" style="display: grid; min-block-size: 9rem"></div>
</div>
`,
                script: `
import { statePlate } from '@kp-soft/themes/js/state-plate';

document.getElementById('doc-plate-empty').append(
    statePlate(document, { kind: 'empty', title: 'No secrets yet', text: 'Add the first one and it appears here.', actionLabel: 'Add a secret' }),
);
document.getElementById('doc-plate-error').append(
    statePlate(document, { kind: 'error', title: 'Could not read the secrets', text: 'The vault did not answer.', actionLabel: 'Retry', onAction: () => {} }),
);
`,
            },
        ],
        variants: [
            { name: 'the script', what: '`attachMasterDetails(root, { history })` wires every `[data-kp-master-detail]` and returns a detach; `masterDetail(el)` answers the handle (`key()`, `select(key)`, `open(key)`, `close()`, `narrow()`, `setState()`); `selectPane`, `openPane` and `closePane` are the same moves by element. `MASTER_DETAIL` is the selector; `PANE_WIDTHS`, `PANE_ASIDE_WIDTH`, `PANE_FOLD_AT` and `PANE_ASIDE_FOLD_AT` are the defaults behind the attributes.' },
            { name: 'events', what: '`kp-pane-select` when the selection moves (arrow keys, a click), `kp-pane-open` when the detail is opened (the page loads it and its router writes the address), `kp-pane-close` when the detail or the aside goes away, `kp-pane-retry` for Retry in a failed detail; the names are `PANE_SELECT_EVENT`, `PANE_OPEN_EVENT`, `PANE_CLOSE_EVENT` and `PANE_RETRY_EVENT`.' },
            { name: '.kp-pane__list / __head / __back / __body / __state / __detail / __busy', what: 'The parts: the listbox, the head of a pane, the Back button of the folded layout, the detail’s body, the plate that fills it in a state, the detail itself and the busy card laid over it. The panes are marked by `data-kp-pane="list|detail|aside"`, not by a class.' },
            { name: 'statePlate(doc, options)', what: 'The shared plate (js/state-plate.js) for any empty or failed area; `actionAttribute` writes a data attribute on the action so a container can listen for it by delegation. The action sits at the control size, not the plate’s heading size.' },
            { name: 'data-kp-pane-widths', what: 'The columns: `17rem 1fr`, and a third such as `24rem` when there is an aside.' },
            { name: 'data-kp-fold-at', what: 'The layout width below which the panes fold; 48rem.' },
            { name: 'data-kp-aside-fold-at', what: 'The width below which the aside moves under the other panes; 90rem.' },
            { name: 'data-kp-narrow', what: 'What a phone shows: `one-pane` (default, with a Back button), `sheet` or `stack`.' },
            { name: 'data-kp-resizable', what: 'Present: a separator between the list and the detail drags like the split’s; add `data-kp-remember` to keep the width.' },
            { name: 'data-kp-pane-history', what: '`off` leaves the browser’s history alone.' },
            { name: 'data-kp-aside-closable', what: 'Esc in the aside closes it.' },
            { name: 'states of the detail', what: '`empty` (“Pick an item on the left”), `loading` (the busy card over the detail only; the list stays usable), `error` (the destructive plate with Retry, over the whole master-detail, unless a component in the detail already shows its own failed plate: the innermost plate wins, the root then reads `data-kp-error-own` and nothing is drawn over it) and `ready`.' },
            { name: '.kp-stateplate', what: 'The plate an empty or failed area is drawn with: the title at the heading size and a normal-size action, centred in the whole box it is given.' },
            { name: '.kp-stateplate', what: 'Has a page of its own: the state plate.' },
        ],
        accessibility: [
            'Built in — the list is a listbox: arrows move the selection without the focus leaving, Home and End jump, Enter and Space open the detail when folded. Focus moves to the detail’s heading on open and back to the row on Back; Esc in the detail returns.',
            'Yours — load the detail on `kp-pane-open`, write the router’s item into the address, and name every pane.',
        ],
    };
