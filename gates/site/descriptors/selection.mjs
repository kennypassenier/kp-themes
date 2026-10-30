// Page descriptor for the "selection" documentation page [AR19]; the shape is pinned in ./types.mjs.

/** @type {import('./types.mjs').Descriptor} */
export const selectionDescriptor = {
        id: 'selection',
        title: 'Selection bar',
        group: 'Data',
        classes: ['kp-selection'],
        exports: [],
        aliases: ['cursor-scroll', 'cursor-visible', 'placement', 'refused', 'roving', 'selecting'],
        intro: 'A bar that is there as soon as rows are ticked: how many (exact), which ones, the page’s actions for them and a way to untick everything. It serves a data table, a list of cards or a board. Together with the row keys, rows are ticked without the mouse: j and k walk a cursor, x ticks, Shift+x ticks a range, Esc unticks all.',
        whenToUse: 'A list where several rows can be acted on together. For the actions of one row use the row actions.',
        examples: [
            {
                title: 'Requeue or delete the ticked rows',
                why: 'The bar keeps its place whether or not anything is ticked, so the list under it never jumps. A press on a marked button fires `kp-selection-action` with what is ticked.',
                markup: `
<div class="kp-selection" data-kp-selection data-kp-selection-for="orders" data-kp-placement="inline">
<div class="kp-selection__actions">
<button class="kp-button" type="button" data-kp-selection-action="requeue">Requeue</button>
<button class="kp-button kp-button--destructive" type="button" data-kp-selection-action="delete">Delete</button>
</div>
</div>
<ul id="orders" data-kp-select-keys>
<li data-kp-row-key="a"><label><input type="checkbox" data-kp-select-row> Order 1041</label></li>
<li data-kp-row-key="b"><label><input type="checkbox" data-kp-select-row> Order 1042</label></li>
<li data-kp-row-key="c"><label><input type="checkbox" data-kp-select-row> Order 1043</label></li>
</ul>
`,
            },
            {
                title: 'A result, a rule and a busy bar',
                why: '`setSelectionRules(bar, rules)` turns an action off, with the reason, for a selection it does not fit (tick order 1043 and Delete gives its reason). A press on a marked button fires `kp-selection-action` with `{ action, keys, items, matching, undoMs }`; the page calls `setSelectionBusy(bar, words)` while it works and `setSelectionResult(bar, { done, refused })` when some rows refused: the bar says “1 done, 1 refused: why” and each refused row carries its reason as a `.kp-selection__refusal` line. The keys line under the list is written by `data-kp-select-hint` (on the element that holds it, naming the list). Tick two rows, one of them order 1043, and press Requeue.',
                markup: `
<div id="doc-sel-live">
<div class="kp-selection" data-kp-selection id="doc-sel-bar" data-kp-selection-for="doc-sel-list" data-kp-placement="inline">
<div class="kp-selection__actions">
<button class="kp-button" type="button" data-kp-selection-action="requeue">Requeue</button>
<button class="kp-button kp-button--destructive" type="button" data-kp-selection-action="delete">Delete</button>
</div>
</div>
<ul id="doc-sel-list" data-kp-select-keys>
<li data-kp-row-key="a"><label><input type="checkbox" data-kp-select-row> Order 1041</label></li>
<li data-kp-row-key="b"><label><input type="checkbox" data-kp-select-row> Order 1042</label></li>
<li data-kp-row-key="c"><label><input type="checkbox" data-kp-select-row> Order 1043 (shipped)</label></li>
</ul>
<p data-kp-select-hint="doc-sel-list"></p>
</div>
`,
                script: `
import { attachSelectionBars, setSelectionBusy, setSelectionResult, setSelectionRules } from '@kp-soft/themes/js/selection-bar';

const live = document.getElementById('doc-sel-live');
attachSelectionBars(live);
const bar = document.getElementById('doc-sel-bar');
setSelectionRules(bar, {
    delete: (items) => (items.some((item) => item.key === 'c') ? 'Order 1043 is shipped and cannot be deleted' : null),
});
bar.addEventListener('kp-selection-action', (event) => {
    if (event.detail.action !== 'requeue') return;
    setSelectionBusy(bar, 'Requeuing ' + event.detail.keys.length + '…');
    setTimeout(() => {
        setSelectionBusy(bar, null);
        const refused = event.detail.keys.filter((key) => key === 'c').map((key) => ({ key, reason: 'Already shipped' }));
        setSelectionResult(bar, { done: event.detail.keys.length - refused.length, refused });
    }, 800);
});
`,
            },
        ],
        variants: [
            { name: 'row keys', what: 'The keys of the rows are `rowSelect(el)` (the handle of an element that has them: `keys()`, `clear()`) and `rowSelectKeys(el)` (the keys of the ticked rows, handle or not); `attachRowSelect(root, options)` gives every `[data-kp-select-keys]` and every data table with a select column the keys and returns a detach. The same options are its second argument (`range`, `arrows`, `allKey`, `scroll`). Enter on a row fires `kp-row-open`; `data-kp-select-keys="false"` turns the keys off for one element.' },
            { name: 'kp-rows-select', what: 'Fired on the element after the keys changed the ticks: `{ keys, count, source, skipped }`. Boxes that are disabled are walked over by a range and counted in “2 skipped: cannot be selected”.' },
            { name: '.is-cursor', what: 'The row the cursor stands on: a ring, not a fill, so a ticked row and the cursor row read apart. It survives a refresh by the row’s key.' },
            { name: 'data-kp-selecting', what: 'On a phone a long press on a row (half a second) starts selection mode: every tap on a row then ticks it, until the last tick goes.' },
            { name: '.kp-selection__panel / __count / __names / __more', what: 'The parts the script adds: the panel that holds the rest, the exact count in the width of the next digit, the names (wrapping, never cut with an ellipsis) and the exact “+4 more”.' },
            { name: '.kp-selection__offer / __result / __refusal', what: 'The offer “Select all 312 that match”, the line after an action that some rows refused (`setSelectionResult`), and the reason written under each refused row (the row carries `data-kp-refused`).' },
            { name: '.kp-selection__toggle / __clear', what: 'The Actions button that holds the page’s buttons on a narrow bar, and the button that unticks everything (Esc does the same).' },
            { name: 'setSelection / getSelection', what: '`setSelection(bar, items, { matching })` feeds the bar by hand for a list with no boxes (a board, a selection held by the server), after which the bar ignores the boxes; `getSelection(bar)` answers `{ keys, items, count, matching }`.' },
            { name: 'setSelectionBusy / setSelectionResult / setSelectionRules', what: 'While an action runs the buttons stop answering and the count gives way to the words; a result names how many were done and how many refused, and why; a rule is a function by the action’s id that answers the reason or nothing.' },
            { name: 'data-kp-selection-for', what: 'The ids of the tables or lists it serves, space separated; the nearest by default.' },
            { name: 'data-kp-placement', what: '`sticky-top` (default), `inline` or `floating-bottom`.' },
            { name: 'data-kp-selection-names', what: '`names` (default) or `count`.' },
            { name: 'data-kp-selection-max', what: 'How many names show before “+N more”; 6.' },
            { name: 'setSelectionProgress', what: '`setSelectionProgress(bar, { done, total })` between `setSelectionBusy` and the end: the busy words are followed by “3 of 7 done”; the end (`setSelectionBusy(bar, \'\')` or `setSelectionResult`) takes it away. A screen reader hears every quarter, not every row.' },
            { name: 'data-kp-select-matching', what: 'How many rows match in all: the bar offers “Select all 312 that match”.' },
            { name: 'data-kp-select-range', what: '`shift` (default) or `off`: Shift-click ticks a range.' },
            { name: 'data-kp-select-arrows', what: 'The arrow keys walk the cursor too (on by default, `false` turns it off), never inside a grid.' },
            { name: 'data-kp-select-all-key', what: 'Ctrl+A ticks every row shown, Ctrl+Shift+A unticks them (on by default, `false` turns it off).' },
            { name: 'data-kp-cursor-scroll', what: '`nearest` (default) or `center`.' },
            { name: 'data-kp-select-hint', what: 'An element in the page where the keys are written as a keys line.' },
        ],
        accessibility: [
            'Built in — the count is said once after a burst of ticks; the cursor is a ring on the row, not a fill, so a ticked row and the cursor row read apart; on a phone a long press starts selection mode. Rows hidden by a filter are not walked, and skipped rows are counted in what is said.',
            'Yours — mark each box `data-kp-select-row`, give rows a key, and use `setSelectionRules` to turn an action off, with its reason, for a selection it does not fit.',
        ],
    };
